import { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

const InputFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedModels, setSelectedModels] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleModelCheckboxChange = (index) => {
    if (selectedModels.includes(index)) {
      setSelectedModels(selectedModels.filter(item => item !== index));
    } else {
      setSelectedModels([...selectedModels, index]);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('selectedModels', JSON.stringify(selectedModels)); // Send selected models

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle response here
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };

  // StyledButton with custom CSS to remove the focus outline
  const StyledButton = styled(Button)({
    '&:focus': {
      outline: 'none',
    },
  });

  return (
    <>
      <StyledButton
        onClick={handleUpload}
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ '&:focus': { outline: 'none' } }} // additional inline style to ensure the outline is removed
      >
        Upload file
        <input type="file" style={{ display: 'none' }} onChange={handleFileChange} />
      </StyledButton>

      {/* Model selection checkboxes */}
      <FormControlLabel
        control={<Checkbox checked={selectedModels.includes(0)} onChange={() => handleModelCheckboxChange(0)} />}
        label="Model 1"
      />
      <FormControlLabel
        control={<Checkbox checked={selectedModels.includes(1)} onChange={() => handleModelCheckboxChange(1)} />}
        label="Model 2"
      />
    </>
  );
};

export default InputFileUpload;
