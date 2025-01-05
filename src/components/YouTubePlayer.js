import React, { useEffect, useRef } from "react";

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    // YouTube Iframe API 로드
    const loadYouTubeAPI = () => {
      return new Promise((resolve, reject) => {
        // 이미 API가 로드되어 있으면 바로 resolve
        if (window.YT) {
          resolve(window.YT);
        } else {
          // 스크립트 동적으로 로드
          const script = document.createElement("script");
          script.src = "https://www.youtube.com/iframe_api";
          script.async = true;
          script.onload = () => resolve(window.YT);
          script.onerror = (err) => reject(err);
          document.body.appendChild(script);
        }
      });
    };

    // API 로드 후 플레이어 생성
    const initializePlayer = () => {
      window.onYouTubeIframeAPIReady = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          height: "390",
          width: "640",
          videoId: "FgwIcJDnQOk",
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      };
    };

    // API 로드 후 실행
    loadYouTubeAPI()
      .then(() => {
        initializePlayer();
      })
      .catch((error) => {
        console.error("YouTube API 로드 실패:", error);
      });

    // 플레이어가 준비되었을 때
    const onPlayerReady = (event) => {
      console.log("Player is ready!");
      event.target.playVideo();
    };

    // 플레이어 상태 변경
    const onPlayerStateChange = (event) => {
      if (event.data === window.YT.PlayerState.PLAYING) {
        console.log("Video is playing!");
      }
    };

    // 클린업: 컴포넌트 언마운트 시
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  return <div id="youtube-player"></div>;
};

export default YouTubePlayer;
