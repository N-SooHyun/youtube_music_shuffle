import logo from './logo.svg';
import React, { useState } from "react";
import './App.css';


// 예제 JSON 데이터
const videoData = [
  {
    id: 1,
    title: "Video 1",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Video 2",
    url: "https://www.youtube.com/embed/3JZ_D3ELwOQ",
  },
  {
    id: 3,
    title: "Video 3",
    url: "https://www.youtube.com/embed/tgbNymZ7vqY",
  },
];

function App() {
  const [currentVideo, setCurrentVideo] = useState(videoData[0]);

  return (
    <div className="App" style={{ display: "flex", height: "100vh" }}>
      {/* 왼쪽: 비디오 화면 */}
      <div style={{ flex: 2, padding: "20px" }}>
        <iframe
          width="100%"
          height="100%"
          src={currentVideo.url}
          title={currentVideo.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      {/* 오른쪽: 영상 리스트 */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #ccc",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h3>다음 영상</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {videoData.map((video) => (
            <li
              key={video.id}
              style={{
                marginBottom: "10px",
                cursor: "pointer",
                padding: "10px",
                backgroundColor:
                  video.id === currentVideo.id ? "#f0f0f0" : "transparent",
                borderRadius: "5px",
              }}
              onClick={() => setCurrentVideo(video)}
            >
              {video.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;