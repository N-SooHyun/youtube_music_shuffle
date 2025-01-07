import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import youtubeMusicData from "../youtube_music.json";

const TestSample = () => {
  const [playlist, setPlaylist] = useState(youtubeMusicData);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setPlaylist(items);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
  <h3>Playlist</h3>
  <DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="playlist">
      {(provided) => (
        <div
          {...provided.droppableProps}
          ref={provided.innerRef}
          style={{
            width: "300px",
            height: "400px", // 고정 높이 설정
            overflow: "auto", // 스크롤 활성화
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            background: "#f9f9f9",
          }}
        >
          {playlist.map((video, index) => (
            <Draggable key={video.ID} draggableId={`${video.ID}`} index={index}>
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
                    cursor: "pointer",
                    ...provided.draggableProps.style,
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
  );
};

export default TestSample;
