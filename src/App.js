import logo from './logo.svg';
import React, { useState, useEffect, useRef } from "react";
import NoApiIframe from './components/NoApiIframe';
import ApiIframe from './components/ApiIframe';
import YouTubePlayer from './components/YouTubePlayer';
import TestPlayer from './components/TestPlayer';
import './App.css';

function App() {
  const playlist = [
    "https://www.youtube.com/watch?v=-BIs3pv8kCY",
    "https://www.youtube.com/watch?v=935RgNLNuno",
    "https://www.youtube.com/watch?v=FgwIcJDnQOk",
  ];
  return(
   <div>
    <ApiIframe/>
    
    
   </div> 
  );
}

export default App;