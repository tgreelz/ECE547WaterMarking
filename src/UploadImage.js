import React, { useState } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import './App.css';

const baseURL = "http://localhost:8000";

export const UploadImage = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [link, setLink] = useState(null);
  const [Encode, setEncode] = useState(null);

  const handleSubmit = async(event) => {
    const config = {
        headers: { 'content-type': 'multipart/form-data' }, responseType: 'blob'
    }

    const formData = new FormData();
    formData.append("encode", Encode)
    formData.append("file", selectedImage);
    axios.post(baseURL+'/image', formData , config)
    .then(response => {
        var url = window.URL.createObjectURL(response.data);
        setResponseImage(url);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Example.jpg';
        document.body.appendChild(a); // append the element to the dom
        setLink(a);
     })
     .catch(err => console.log(err));
  }

  return (
    <div className="Upload">
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="contained-button-file"
        onChange={(event) => {
            setSelectedImage(event.target.files[0]);
            // handleSubmit(event);
        }}
      />
      <label htmlFor="contained-button-file">
        <Button style ={{marginBottom:'15px'}}variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
      <table className="ImageTable">
        <tbody>
        <tr>
          <th>
      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          
        </div>
      )}
        </th>
        <th className="EncodeInput">
        {selectedImage && <TextField id="outlined-basic" label="Encode" variant="outlined" onChange={(event) => {
          setEncode(event.target.value);
        }}/>}
        </th>
        <th>
      {responseImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={responseImage}
          />
        </div>
      )}
          </th>
        </tr>
        <tr>
          <th>
            {selectedImage &&
            <Button variant="contained" color="secondary" onClick={() => setSelectedImage(null)} startIcon={<DeleteIcon />}>Delete </Button>}          </th>
          <th>
          {selectedImage &&
            <Button variant="contained" onClick={() => handleSubmit()}>Encode</Button>}
          </th>
          <th>
            {responseImage &&
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button variant="contained" startIcon={<DownloadIcon />} onClick={() => {
                link.click();
                link.remove();
              }}>Download</Button>
              <Button variant="contained" color="secondary" onClick={() => setResponseImage(null)} startIcon={<DeleteIcon />}>Delete </Button>
              </ButtonGroup>}
            </th>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UploadImage;