import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import youtubeMusicData from "./youtube_music.json"; 
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState(youtubeMusicData);
  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);


  const handleVideoClick = (video)=>{
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsVideoEnded(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if(currentTime >= currentVideo.Duration){
        console.log("true");
        setIsVideoEnded(true);
      }
      console.log('currentTime:', currentTime);
      setCurrentTime((prevTime) => {
        console.log('Updating from:',prevTime);
        return prevTime + 5
      });
    }, 5000);

    if(isVideoEnded) {
      const nextIndex = (youtubeMusicData.indexOf(currentVideo) + 1) % youtubeMusicData.length;
      setCurrentVideo(youtubeMusicData[nextIndex]);
      setCurrentTime(0);
      setIsVideoEnded(false);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentTime, currentVideo, isVideoEnded]);

  return (
    <div style={{ display: "flex" }}>
      {/* 왼쪽: 비디오 플레이어 */}
      <div style={{ flex: 3 }}>
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${currentVideo.URL.split("v=")[1]}?autoplay=1&enablejsapi=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
      

      
        {/* 오른쪽: 리스트 */}
      <div style={{ flex: 1, padding: "10px" }}>
        <h3>Playlist</h3>
        <div>
          {youtubeMusicData.map((video, index) => (
            <button
              key={index}
              onClick={() => handleVideoClick(video)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: currentVideo === video ? "#d3d3d3" : "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <img
                src={video.Thumbnail}
                alt={video.Title}
                width="50"
                height="50"
                style={{ marginRight: "10px", borderRadius: "4px" }}
              />
              <span>{video.Title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;