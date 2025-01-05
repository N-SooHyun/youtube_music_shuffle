import logo from './logo.svg';
import React, { useState, useEffect, useRef } from "react";
import NoApiIframe from './components/NoApiIframe';
import ApiIframe from './components/ApiIframe';
import YouTubePlayer from './components/YouTubePlayer';
import './App.css';

function App() {
  return(
   <div>
    
    <ApiIframe />
   </div> 
  );
}

export default App;