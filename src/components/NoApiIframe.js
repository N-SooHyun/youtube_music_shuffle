import React, { useState, useEffect, useRef } from "react";
import youtubeMusicData from "../youtube_music.json";

const createWorker = () => new Worker(new URL('../worker.js', import.meta.url));

function NoApiIframe() {
  const [playlist, setPlaylist] = useState(youtubeMusicData);
  const [currentVideo, setCurrentVideo] = useState(playlist[0]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [worker, setWorker] = useState(null);
  const isFirstRender = useRef(true);
  
  const handleVideoClick = (video)=>{
    const workerInstance = worker;
    const i = 0; 
    workerInstance.postMessage({type: 'cancel', i}); //전에 있던 비동기 작업 종료 요청
    workerInstance.onmessage = (event) => {
      const {type, currentTime} = event.data;

      console.log("1번 비동기 작업 종료 완료",type, currentTime);
    };
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsVideoEnded(false);
  }

  useEffect(() => {
    if(isFirstRender.current){
      return;
    }

    const workerInstance = createWorker();
    setWorker(workerInstance);

    console.log("currentVideo 감지");

    const duration = currentVideo.Duration;
    //const duration = 5000;

    workerInstance.postMessage({type: 'start', duration}); //타이머 시작 메시지 보냄

    workerInstance.onmessage = (event) => {
      const {type, currentTime} = event.data;
      
      if(type === 'timerEnd'){
        setIsVideoEnded(true);
        setCurrentTime(currentTime);
      }
    };

  },[currentVideo]);


  useEffect(() => {
    if(isFirstRender.current){
      isFirstRender.current = false;
      return;
    }

    if(isVideoEnded){
      console.log("VideoEnded -> next Video");
      const nextIndex = (playlist.indexOf(currentVideo) + 1) % playlist.length;
      setCurrentVideo(playlist[nextIndex]);
      setCurrentTime(0);
      setIsVideoEnded(false);
    }
  },[isVideoEnded]);

  return (
    <div style={{ display: "flex" }}>
      {/* 왼쪽: 비디오 플레이어 */}
      <div style={{ flex: 3 }}>
        <iframe
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${currentVideo.URL.split("v=")[1]}?autoplay=1&enablejsapi=1`}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
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

export default NoApiIframe;