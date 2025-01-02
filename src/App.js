import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import youtubeMusicData from "./youtube_music.json"; 
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState(youtubeMusicData);
  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);


  const handleVideoClick = (video)=>{
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsVideoEnded(false);
    setIsVideoPaused(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if(!isVideoPaused){
        if(currentTime >= currentVideo.Duration){
          setIsVideoEnded(true);
        }
        setCurrentTime((prevTime) => prevTime + 5);
      }
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
  }, [currentTime, currentVideo, isVideoEnded, isVideoPaused]);

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
        <ul>
          {youtubeMusicData.map((video, index) => (
            <li
              key={index}
              onClick={() => handleVideoClick(video)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              <img
                src={video.Thumbnail}
                alt={video.Title}
                width="50"
                height="50"
                style={{ marginRight: "10px", borderRadius: "4px" }}
              />
              <span>{video.Title}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;