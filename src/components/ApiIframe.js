import React, { useState, useEffect, useRef } from "react";
import youtubeMusicData from "../youtube_music.json";

function ApiIframe() {
  const [playlist, setPlaylist] = useState(youtubeMusicData);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(playlist[currentVideoIndex]);
  const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("player", {
        height: "700",
        width: "640",
        videoId: playlist[currentVideoIndex].URL.split("v=")[1],
        playersVars: {
          autoplay: 1,
        },
        events:{
          onStateChange: onPlayerStateChange,
          onReady: onPlayerReady,
          onError: onPlayerError,
        },
      });
    };

    return () => {
      console.log("playerRef.current", playerRef.current);
      if(playerRef.current){
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
      // Load the new video when currentVideoIndex changes
    if (playerRef.current) {
      playerRef.current.loadVideoById(playlist[currentVideoIndex].URL.split("v=")[1]);
      setCurrentVideo(playlist[currentVideoIndex]);
    }
  }, [currentVideoIndex]);

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      // Move to the next video when the current video ends
      setCurrentVideoIndex((prevIndex) =>
        prevIndex + 1 < playlist.length ? prevIndex + 1 : 0 // Loop back to the first video
      );
    }
  };

  const onPlayerReady = (event) => {
    event.target.playVideo();
  }

  const onPlayerError = (event) => {
    setCurrentVideoIndex((prevIndex) =>
      prevIndex + 1 < playlist.length ? prevIndex + 1 : 0 // Loop back to the first video
    );
  }
  
  const handleVideoClick = (video, index)=>{
    setCurrentVideoIndex(index);
  }

  const handleVideoShuffle = () => {
    let videoList = playlist;
    if(currentVideoIndex == 0){
      videoList = playlist.slice(1);
    }

    for(let i = videoList.length - 1; i>0; i--){
      const j = Math.floor(Math.random() * (i+1));
      [videoList[i], videoList[j]] = [videoList[j], videoList[i]];
    }

    if(currentVideoIndex == 0){
      videoList.unshift(playlist[0]);
    }
    console.log("videoList: ",videoList);
    setPlaylist(videoList);
    console.log("playList: ",playlist);
    setCurrentVideo(playlist[setCurrentVideoIndex]);
    setCurrentVideoIndex(0);
  }
  

  return (
    <div style={{ display: "flex" }}>
      {/* 왼쪽: 비디오 플레이어 */}
      <div id="player" style={{ flex: 3 }}>      
      </div>
      

        {/* 오른쪽: 리스트 */}
      <div style={{ flex: 1, padding: "10px" }}>
        <div><h3>Playlist</h3>
        <button onClick={() => handleVideoShuffle()}>셔플</button>
        </div>
        
        <div>
          {playlist.map((video, index) => (
            <button
              key={index}
              onClick={() => handleVideoClick(video, index)}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: currentVideoIndex === index ? "#d3d3d3" : "#fff",
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