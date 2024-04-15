import os
from xception import Xception, pretrained_settings
import torch
import torch.nn as nn
import torch.nn.functional as F
from torchvision.transforms import RandomResizedCrop, Compose, Normalize, ToTensor
from datasets import Dataset, Features, Value, ClassLabel
from transformers import DefaultDataCollator
from PIL import Image, ImageFile
import evaluate
import numpy as np
import pandas as pd
import random
from transformers import TrainingArguments, Trainer
from safetensors.torch import load


xception_path = 'checkpoint/xception-b5690688.pth'
def xception(num_classes=1000, pretrained='imagenet'):
    model = Xception(num_classes=num_classes)
    if pretrained:
        settings = pretrained_settings['xception'][pretrained]
        assert num_classes == settings['num_classes'], \
            "num_classes should be {}, but is {}".format(settings['num_classes'], num_classes)

        state_dict = torch.load(xception_path)
        for name, weights in state_dict.items():
            if 'pointwise' in name:
                state_dict[name] = weights.unsqueeze(-1).unsqueeze(-1)
                
        model.load_state_dict(state_dict)

        model.input_space = settings['input_space']
        model.input_size = settings['input_size']
        model.input_range = settings['input_range']
        model.mean = settings['mean']
        model.std = settings['std']

    # TODO: ugly
    model.last_linear = model.fc
    del model.fc
    return model


class TransferModel(nn.Module):
    """
    Simple transfer learning model that takes an imagenet pretrained model with
    a fc layer as base model and retrains a new fc layer for num_out_classes
    """
    def __init__(self, model, num_out_classes=2, dropout=0.0):
        super(TransferModel, self).__init__()
        self.model = model
        # Replace fc
        num_ftrs = self.model.last_linear.in_features
        if not dropout:
            self.model.last_linear = nn.Linear(num_ftrs, num_out_classes)
        else:
            print('Using dropout', dropout)
            self.model.last_linear = nn.Sequential(
                nn.Dropout(p=dropout),
                nn.Linear(num_ftrs, num_out_classes)
            )

         # Initialize the loss function
        self.loss_fn = nn.CrossEntropyLoss()

    def forward(self, pixel_values, labels=None):
        logits = self.model(pixel_values)
        
        loss = None
        if labels is not None:
            loss = self.loss_fn(logits, labels)
        
        # Return loss and other model-specific outputs
        return (loss, logits) if loss is not None else logits


def get_transforms(model):
    normalize = Normalize(mean=model.mean, std=model.std)
    size = model.input_size[1:]
    _transforms = Compose([RandomResizedCrop(size), ToTensor(), normalize])
    
    def transforms(examples):
        images = [Image.open(path).convert("RGB") for path in examples['path']]
        examples["pixel_values"] = [_transforms(img) for img in images]
        del examples["path"]
        return examples

    return transforms

# Allow loading of truncated images
ImageFile.LOAD_TRUNCATED_IMAGES = True
def shuffled_image_paths(folder_true, folder_false):
   # Gather true and false paths
    true_paths = [{'path': os.path.join(folder_true, f), 'label': 'Real'} for f in os.listdir(folder_true) if f.endswith(('jpg', 'png', 'jpeg'))]
    false_paths = [{'path': os.path.join(folder_false, f), 'label': 'Fake'} for f in os.listdir(folder_false) if f.endswith(('jpg', 'png', 'jpeg'))]
    
    all_paths = true_paths + false_paths
    random.shuffle(all_paths)  # Shuffle the combined list
    df = pd.DataFrame(all_paths)
    return df

def create_path_label_dataset(folder_true, folder_false):
    paths_labels = shuffled_image_paths(folder_true, folder_false)
    
    # Define dataset features
    features = Features({
        'path': Value('string'),
        'label': ClassLabel(names=['Real', 'Fake']),
    })
    
    # Create the dataset
    dataset = Dataset.from_pandas(paths_labels, features=features)
    
    return dataset

def xception_from_tensors(path):
    # Load the tensors from a SafeTensor file
    old_model = xception()
    model = TransferModel(model=old_model, num_out_classes=2)
    
    with open(path, "rb") as f:
        state_dict_bytes = f.read()
    state_dict = load(state_dict_bytes)
    model.load_state_dict(state_dict)
    return model


def evaluate_model(model, eval_dataset, compute_metrics):
    training_args = TrainingArguments(
        remove_unused_columns=False,
        output_dir='.'
    )
    trainer = Trainer(model=model, args=training_args, 
                      data_collator=DefaultDataCollator(), 
                      eval_dataset=eval_dataset, compute_metrics=compute_metrics)
    return trainer.evaluate()

class DeepFakeDetector:
    def __init__(self, checkpoint):
        old_model = xception()
        self.transforms = get_transforms(old_model)
        self.model = xception_from_tensors(checkpoint)
        self.features = ['Real', 'Fake']

    def detect(self, path):
        logits = self.model(self.transforms({'path': [path]})['pixel_values'][0].unsqueeze(0))
        prob = F.softmax(logits, 1)[0]
        return {'real': prob[0].item(), 'fake': prob[1].item()}