import React, { useState } from "react";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { TextField, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import Switch from '@mui/joy/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import axios from "axios";
import './App.css';

// const baseURL = "https://watermarkapi.azurewebsites.net";
const baseURL = "http://localhost:8000";

export const UploadImage = () => {

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [responseMessage, setResponseMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [retreve, setRetreve] = useState(true);
  const [link, setLink] = useState(null);
  const [Encode, setEncode] = useState(null);
  const [Qf, setQf] = useState(85);

  const handleSubmitEncode = async(event) => {
    setLoading(true)
    setResponseImage(false)
    const config = {
        headers: { 'content-type': 'multipart/form-data' }, responseType: 'blob'
    }

    const formData = new FormData();
    formData.append("encode", Encode);
    formData.append("smpQ", Qf);
    formData.append("file", selectedImage);
    axios.post(baseURL+'/image', formData , config)
    .then(async response => {
      console.log(response)
        var res = await response.data.text()
        if(res.substring(1, 4) === "{&)"){
          alert("Cound not embed message. \n Message already detected in image.")
          setLoading(false);
          setResponseMessage("\""+res.substring(4,res.length));
        } else {
          var url = window.URL.createObjectURL(response.data);
          console.log(url)
          setLoading(false);
          setResponseMessage(false);
          setResponseImage(url);
          var a = document.createElement('a');
          a.href = url;
          a.download = `${selectedName}E.jpg`;
          document.body.appendChild(a); // append the element to the dom
          setLink(a);
        }
     })
     .catch(err => console.log(err));
  }

  const handleSubmitRet = async(event) => {
    setLoading(true)
    setResponseImage(false)
    const config = {
        headers: { 'content-type': 'multipart/form-data' }, responseType: 'blob'
    }

    const formData = new FormData();
    formData.append("smpQ", Qf);
    formData.append("file", selectedImage);
    axios.post(baseURL+'/imageRet', formData , config)
    .then(async response => {
        var res = await response.data.text();
        setLoading(false);
        setResponseMessage(res);
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
            var filename = event.target.files[0].name
            setSelectedName(filename.substring(0,filename.length - 4))
            setSelectedImage(event.target.files[0]);
            setResponseImage(false);
            setResponseMessage(false);
            setLoading(false);
            // handleSubmit(event);
        }}
      />
      <table className="ImageTable">
        <tbody>
          <tr><th>
            <label htmlFor="contained-button-file">
              <Button style ={{marginBottom:'15px'}}variant="contained" color="primary" component="span">
                Upload
              </Button>
            </label>
          </th></tr>
          <tr><th>
          <Switch
              color={retreve ? 'primary' : 'info'}
              slotProps={{ input: { 'aria-label': 'dark mode' } }}
              startDecorator={
                <h2 style={{color:'#844cdc'}}>Retreve</h2>
              }
              endDecorator={  
                <h2 style={{color:"#0d6cdc"}}>Embed</h2>
              }
              checked={retreve}
              onChange={(event) =>
                setRetreve(event.target.checked)
              }
            />
          </th></tr>
        </tbody>
      </table>
      <table className="ImageTable">
        <tbody>
        <tr>
          <th>
      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"350px"}
            src={URL.createObjectURL(selectedImage)}
          />
          
        </div>
      )}
        </th>
        <th className="EncodeInput">
        {selectedImage && <table className="InputTable"><tbody>
          <tr>
      <th>
      <FormControl style={{padding:10, alignContent:'center'}}>
      <InputLabel id="demo-simple-select-label" color={retreve? "primary" : "secondary"}>Social Media</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        color={retreve? "primary" : "secondary"}
        style={{width:240}}
        id="demo-simple-select"
        value={Qf}
        label="Social Media"
        onChange={(event) => setQf(event.target.value)}
      >
        <MenuItem value={75}>Facebook</MenuItem>
        <MenuItem value={85}>Twitter</MenuItem>
      </Select>
      </FormControl>
      </th>
      </tr>
      <tr>
        <th>
          {retreve &&
        <TextField id="outlined-basic" label="Owner Id" variant="outlined" style={{width:240}} onChange={(event) => {
          setEncode(event.target.value);
        }}/>}
        
        </th>
        </tr>
        
        </tbody>
        </table>}
        </th>
        <th>
      {loading && <div style={{width:350}}><CircularProgress /></div>}
      {responseMessage && 
      <table className="InputTable"><tbody>
        <tr><th>
        <h1 style={{color:'#0077B6', fontSize:35, fontWeight:'bold'}}>Message detected:</h1>
        </th></tr>
        <tr><th>
          <h1 style={{color:'#0077B6', fontSize:50, fontWeight:'bold',borderStyle:'solid',paddingBottom:7,borderRadius:7,backgroundColor:"#90E0EF"}}>{responseMessage.substring(1,responseMessage.length - 1)}</h1>
        </th></tr>
      </tbody></table>
      }
      {responseImage && (
        <div>
          <img
            alt="not found"
            width={"350px"}
            src={responseImage}
          />
        </div>
      )}
          </th>
        </tr>
        <tr>
          <th>
            {selectedImage &&
            <Button variant="contained" style={{width:170,height:45}} color="error" onClick={() => setSelectedImage(null)} startIcon={<DeleteIcon />}>Delete </Button>}          </th>
          <th>

          {selectedImage ?  retreve? <Button variant="contained" style={{width:170,height:45}} onClick={() => {
            handleSubmitEncode();
            setResponseMessage(null);
            setResponseImage(null);
          }}>Embed</Button>: <Button variant="contained" style={{width:170,height:45}} color="secondary"onClick={() => {
            handleSubmitRet();
            setResponseMessage(null);
            setResponseImage(null);
          }}>Retreve</Button> : <p></p>}
          </th>
          <th>
            {responseImage &&
            <ButtonGroup variant="contained" aria-label="outlined primary button group">
              <Button variant="contained" style={{width:170,height:45}} startIcon={<DownloadIcon />} onClick={() => {
                link.click();
                link.remove();
              }}>Download</Button>
              <Button variant="contained" style={{width:170,height:45}} color="error" onClick={() => setResponseImage(null)} startIcon={<DeleteIcon />}>Delete </Button>
              </ButtonGroup>}
              {responseMessage &&
                <Button variant="contained" style={{width:170,height:45}}color="error" onClick={() => setResponseMessage(null)} startIcon={<DeleteIcon />}>Delete </Button>
              }
            </th>
        </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UploadImage;