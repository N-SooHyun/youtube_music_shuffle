import React, { useState, useEffect, useRef } from "react";

const YouTubePlayer = ({ playlist }) => {
  const playerRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    // Load the YouTube IFrame API
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the player once API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: getVideoIdFromUrl(playlist[currentVideoIndex]),
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    return () => {
      // Clean up the player
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // Load the new video when currentVideoIndex changes
    if (playerRef.current) {
      playerRef.current.loadVideoById(getVideoIdFromUrl(playlist[currentVideoIndex]));
    }
  }, [currentVideoIndex]);

  const getVideoIdFromUrl = (url) => {
    const urlParams = new URL(url).searchParams;
    return urlParams.get("v");
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.ENDED) {
      // Move to the next video when the current video ends
      setCurrentVideoIndex((prevIndex) =>
        prevIndex + 1 < playlist.length ? prevIndex + 1 : 0 // Loop back to the first video
      );
    }
  };

  return (
    <div>
      <div id="youtube-player" style={{ width: "100%", height: "400px" }}></div>
      <div>
        <h3>Playlist</h3>
        <ul>
          {playlist.map((url, index) => (
            <li key={index} style={{ fontWeight: index === currentVideoIndex ? "bold" : "normal" }}>
              {url}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default YouTubePlayer;
