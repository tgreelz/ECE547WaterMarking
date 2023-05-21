import * as React from 'react';
import './App.css';
import Button from '@mui/material/Button';
import { TextField } from '@mui/material';
import axios from "axios";
import UploadImage from './UploadImage';

// const baseURL = "https://watermarkapi.azurewebsites.net";
const baseURL = "http://localhost:8000";

function App() {
  const [post, setPost] = React.useState(null);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      console.log(response);
      setPost(response.data);
    });
  }, []);

  if (!post) return null;

  return (
    <div className="App">
      <Header></Header>
        <UploadImage></UploadImage>
        {/* <img className='Image' src={ require('./Images/Waves.png') } />       */}
    </div>
  );
}
function Header(props){
  return(
  <div className='Header'>
    <h1 className='Text-header'>Water Marking</h1>
  </div>
  );
}

export default App;
