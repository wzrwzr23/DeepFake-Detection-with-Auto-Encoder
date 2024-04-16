import sys
sys.path.append("..")  # Add parent directory to the Python path

from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
from classifier import utils
import cv2
from PIL import Image


app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'png', 'jpg', 'jpeg'}  # Add more if needed
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
FILE_PATH = UPLOAD_FOLDER


def process_file(filepath):
    # Extract the filename without extension
    filename = os.path.splitext(os.path.basename(filepath))[0]

    # Create a directory with the filename to store frames
    frame_dir = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(frame_dir):
        os.makedirs(frame_dir)

    # Read the video file
    cap = cv2.VideoCapture(filepath)

    # Read and save each frame
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        # Check if the frame is valid
        if frame is not None:
            frame_path = os.path.join(frame_dir, f"{filename}_{frame_count}.jpg")
            cv2.imwrite(frame_path, frame)
            frame_count += 1

    cap.release()

    return {'frame_count': frame_count, 'frame_dir': frame_dir}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Receive selected models
    selected_models_input = request.form['selectedModels']
    selected_models = selected_models_input.split(
        ',') if ',' in selected_models_input else [selected_models_input]
    print("Selected Models:", selected_models)

    if file and allowed_file(file.filename):
        # Create directory if it doesn't exist
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])

        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Process the file and get results
        # Selected Models: ['0', '1']
        results = get_model(filepath, selected_models)
        return jsonify({'success': True, 'message': 'File uploaded successfully', 'results': results})
    else:
        return jsonify({'error': 'File type not allowed'})


detector_change = utils.DeepFakeDetector(
    "../classifier/checkpoints/changed-model.safetensors")
detector_unchange = utils.DeepFakeDetector(
    "../classifier/checkpoints/unchanged-model.safetensors")


def get_model(filepath, selected):
    # Example code to use your classifier
    result = {}
    if len(selected) == 2:
        result['change'] = detector_change.detect(filepath)
        result['unchange'] = detector_unchange.detect(filepath)
    elif len(selected) == 1:
        if selected[0] == '0':
            result['change'] = detector_change.detect(filepath)
        if selected[0] == '1':
            result['unchange'] = detector_unchange.detect(filepath)
    print(result)
    return result


if __name__ == '__main__':
    app.run(debug=True)
