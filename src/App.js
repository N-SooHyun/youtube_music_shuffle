import logo from './logo.svg';
import React, { useState , useEffect} from "react";
import youtubeMusicData from "./youtube_music.json"; 
import './App.css';



function App() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0); // 현재 재생 중인 영상의 인덱스
  const [timeoutId, setTimeoutId] = useState(null); // 자동 재생을 위한 타이머 ID

  // 현재 영상이 바뀔 때마다 타이머 설정
  useEffect(() => {
    // 이전 타이머 클리어
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // 현재 영상의 길이를 가져와 타이머 설정
    const currentVideo = youtubeMusicData[currentVideoIndex];
    const duration = currentVideo.Duration * 1000; // 초 단위를 밀리초로 변환
    const newTimeoutId = setTimeout(() => {
      // 다음 영상으로 전환
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % youtubeMusicData.length);
    }, duration);

    setTimeoutId(newTimeoutId);

    return () => {
      clearTimeout(newTimeoutId); // 컴포넌트가 언마운트될 때 타이머 클리어
    };
  }, [currentVideoIndex]);

  return (
    <div style={{ display: "flex" }}>
      {/* 왼쪽: 비디오 플레이어 */}
      <div style={{ flex: 3 }}>
        <iframe
          width="100%"
          height="500"
          src={`${youtubeMusicData[currentVideoIndex].URL.replace(
            "watch?v=",
            "embed/"
          )}?autoplay=1`}
          title={youtubeMusicData[currentVideoIndex].Title}
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>

      
        {/* 오른쪽: 리스트 */}
      <div style={{ flex: 1, padding: "10px" }}>
        <h3>Playlist</h3>
        {youtubeMusicData.map((video, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              marginBottom: "10px",
              backgroundColor: currentVideoIndex === index ? "#f0f0f0" : "white",
              padding: "5px",
            }}
            onClick={() => setCurrentVideoIndex(index)}
          >
            <img
              src={video.Thumbnail}
              alt={video.Title}
              style={{ width: "60px", marginRight: "10px" }}
            />
            <span>{video.Title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;