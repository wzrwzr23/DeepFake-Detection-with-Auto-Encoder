import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid, Typography } from '@mui/material';


import React, { useState } from "react"
import FileUpload from "react-mui-fileuploader"
import Button from '@mui/material/Button';


function MuiFileUploader() {
  const [filesToUpload, setFilesToUpload] = useState([])
  const [selectedModels, setSelectedModels] = useState([]);
  const [results, setResults] = useState(null);

  const handleFilesChange = (files) => {
    // Update chosen files
    setFilesToUpload([...files])
  };

  const handleModelCheckboxChange = (index) => {
    if (selectedModels.includes(index)) {
      setSelectedModels(selectedModels.filter(item => item !== index));
    } else {
      setSelectedModels([...selectedModels, index]);
    }
  };

  const uploadFiles = () => {
    if (!filesToUpload[0]) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', filesToUpload[0]); // Append the first file in the array
    formData.append('selectedModels', selectedModels.join(',')); // Join selected models as a string

    console.log('FormData:', formData);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log('Upload success:', data);
        setResults(data.results); // Set the results in state
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  };


  return (
    <>
      <Grid item xs={6} marginLeft={0.5} marginTop={1}>
        <Typography>Model Selection: </Typography>
      </Grid>
      <Grid item xs={6} marginLeft={0.5}>
        <FormControlLabel
          control={<Checkbox checked={selectedModels.includes(0)} onChange={() => handleModelCheckboxChange(0)} />}
          label="XceptionNet with Augmentation"
        />
        <FormControlLabel
          control={<Checkbox checked={selectedModels.includes(1)} onChange={() => handleModelCheckboxChange(1)} />}
          label="XceptionNet without Augmentation"
        />
      </Grid>
      <FileUpload
        multiFile={true}
        onFilesChange={handleFilesChange}
        onContextReady={(context) => { }}
      />
      <Button variant="contained" onClick={uploadFiles} startIcon={<CloudUploadIcon />}>Upload</Button>
      {results && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </>
  )
}
export default MuiFileUploader;