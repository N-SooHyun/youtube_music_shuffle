import React, { useState, useEffect, useRef } from "react";
//import youtubeMusicData from "../youtube_music.json";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function DragNDrop(jsonData) {
  const [playlist, setPlaylist] = useState(jsonData.jsonData);
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
        height: "100%",
        width: "100%",
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

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // 현재 재생 중인 비디오가 있는 인덱스
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // 현재 재생 중인 비디오와 관련된 드래그를 무효화
    if (sourceIndex === currentVideoIndex || destinationIndex === currentVideoIndex) {
        console.log("현재 재생 중인 비디오와 관련된 드래그는 금지됩니다.");
        return;
    }

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    setPlaylist(items);
  };
  
  return (
    <div style={{ display: "flex", height: "50vh"}}>
      {/* 왼쪽: 비디오 플레이어 */}
      <div id="player" style={{ flex: 3, height: "100%" }}>
      </div>
        {/* 오른쪽: 리스트 */}
        <div style={{ flex: 1, padding: "10px", height: "100%" }}>
        <div>
        <h3>Playlist</h3>
        <button onClick={handleVideoShuffle}>셔플</button>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="playlist">
            {(provided) => (
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                    height: "80%", 
                    overflow: "auto", 
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    padding: "10px",
                    background: "#f9f9f9",
                }}
                >
                {playlist.map((video, index) => (
                    <Draggable key={video.ID} draggableId={`${video.ID}`} index={index} isDragDisabled={index === currentVideoIndex}>
                    {(provided) => (
                        <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "10px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            background: "#fff",
                            backgroundColor: currentVideoIndex === index ? "#d3d3d3" : "#fff",
                            cursor: "pointer",
                            ...provided.draggableProps.style,
                        }}
                        onClick={() => handleVideoClick(video, index)}
                        >
                        <img
                            src={video.Thumbnail}
                            alt={video.Title}
                            width="50"
                            height="50"
                            style={{ marginRight: "10px", borderRadius: "4px" }}
                        />
                        <span>{video.Title}</span>
                        </div>
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </div>
            )}
            </Droppable>
        </DragDropContext>
        </div>
    </div>
  );
}

export default DragNDrop;