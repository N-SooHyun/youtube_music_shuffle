import React, { useState, useEffect, useRef } from "react";
import youtubeMusicData from "../youtube_music.json";

const createWorker = () => new Worker(new URL('../worker.js', import.meta.url));

function ApiIframe() {
  const [playlist, setPlaylist] = useState(youtubeMusicData);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [worker, setWorker] = useState(null);

  const isFirstRender = useRef(true);
  const playerRef = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [LoadComplete, setLoadComplete] = useState(false);

  const loadYouTubeAPI = () => {
    return new Promise((resolve, reject) => {
        //이미 api가 로드 되어있으면 바로 reslove
        if(window.YT){
            resolve(window.YT);
        }else{
            //스크립트 동적으로 로드
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            script.onload = () => resolve(window.YT);
            script.onerror = (err) => reject(err);
            document.body.appendChild(script);
        }
    });
  };

  useEffect(() => {
    if(isFirstRender.current){
        return;
    }
    console.log("init useEffect");

    
    
    loadYouTubeAPI()
    
    setCurrentVideo(playlist[0]);

    return () => {
        console.log("구문끝?");
        setCurrentVideo(playlist[0]);
    };
  }, []);

  useEffect(() => {
    if(isFirstRender.current){
      return;
    }
    if(currentVideo == null){
        return;
    }
    
    console.log("currentVideo 감지");

    const initializePlayer = async () => {
        try {
          // YouTube API 로드를 기다린 후 player 초기화
          await loadYouTubeAPI(); // YouTube API가 로드될 때까지 기다림
          console.log("YouTube API 로드 완료");
  
          // YouTube API 로드 후, onYouTubeIframeAPIReady 호출
          window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player("player", {
              height: "390",
              width: "640",
              videoId: currentVideo.URL.split("v=")[1],
            });
            setIsPlayerReady(true); // 플레이어가 준비되면 상태 변경
            console.log("비동기작업?");
          };
        } catch (error) {
          console.error("YouTube API 로드 실패:", error);
        }
    };
    

    console.log("current Video:", currentVideo);
    initializePlayer();

    return() => {
        console.log("끝나냐?");
        setIsPlayerReady(false);
    }    
  },[currentVideo]);

  const handleVideoClick = (video)=>{
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsVideoEnded(false);
  }

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
      <div id="player" style={{ flex: 3 }}>      
        
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

export default ApiIframe;