import React, { useState, useRef, useEffect } from 'react';

function VideoPlayer({ videoUrl, thumbnail, title, userId, username, userAvatar }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const seekTime = (e.nativeEvent.offsetX / e.target.clientWidth) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Create the play button element when needed
  const createPlayButton = () => {
    if (!isPlaying || !videoUrl) {
      return React.createElement(
        "div",
        {
          className: "position-absolute top-50 start-50 translate-middle",
          style: { cursor: 'pointer', zIndex: 2 },
          onClick: handlePlay
        },
        React.createElement(
          "div",
          {
            className: "d-flex align-items-center justify-content-center bg-white bg-opacity-25 rounded-circle",
            style: { width: '60px', height: '60px' }
          },
          React.createElement(
            "i",
            {
              className: "bi bi-play-fill text-white",
              style: { fontSize: '30px' }
            }
          )
        )
      );
    }
    return null;
  };

  // Create watermark overlay with netGala logo
  const createWatermark = () => {
    return React.createElement(
      "div",
      {
        className: "position-absolute end-0 top-0 m-3",
        style: { zIndex: 3, opacity: 0.7 }
      },
      React.createElement(
        "img",
        {
          src: "/images/netgala-logo.png",
          alt: "netGala",
          className: "rounded-circle",
          style: { width: '40px', height: '40px', objectFit: 'cover' }
        }
      )
    );
  };

  // Create video controls element
  const createVideoControls = () => {
    return React.createElement(
      "div",
      {
        className: `position-absolute bottom-0 start-0 w-100 p-3 video-controls ${showControls ? 'd-block' : 'd-none'}`,
        style: {
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          transition: 'opacity 0.3s ease',
          zIndex: 1
        }
      },
      // Progress bar
      React.createElement(
        "div",
        {
          className: "progress mb-2",
          style: { height: '5px', cursor: 'pointer' },
          onClick: handleSeek
        },
        React.createElement(
          "div",
          {
            className: "progress-bar",
            style: { width: `${(currentTime / duration) * 100}%`, backgroundColor: '#6f42c1' }
          }
        )
      ),
      // Controls row
      React.createElement(
        "div",
        { className: "d-flex justify-content-between align-items-center" },
        // Left side controls
        React.createElement(
          "div",
          { className: "d-flex align-items-center" },
          // Play/pause button
          React.createElement(
            "button",
            {
              className: "btn btn-sm text-white me-2",
              onClick: handlePlay
            },
            React.createElement(
              "i",
              {
                className: isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill",
                style: { fontSize: '24px' }
              }
            )
          ),
          // Time display
          React.createElement(
            "span",
            { className: "text-white small" },
            `${formatTime(currentTime)} / ${formatTime(duration)}`
          )
        ),
        // Volume control
        React.createElement(
          "div",
          { className: "d-flex align-items-center" },
          React.createElement(
            "i",
            {
              className: volume === 0 
                ? "bi bi-volume-mute" 
                : volume < 0.5 
                  ? "bi bi-volume-down" 
                  : "bi bi-volume-up",
              style: { color: 'white', marginRight: '8px' }
            }
          ),
          React.createElement(
            "input",
            {
              type: "range",
              className: "form-range",
              min: "0",
              max: "1",
              step: "0.1",
              value: volume,
              onChange: handleVolumeChange,
              style: { width: '80px' }
            }
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    {
      className: "video-player-container position-relative",
      onMouseMove: handleMouseMove,
      onMouseEnter: () => setShowControls(true),
      onMouseLeave: () => isPlaying && setShowControls(false),
      style: { borderRadius: '10px', overflow: 'hidden', backgroundColor: 'black' }
    },
    // Video element
    React.createElement(
      "video",
      {
        ref: videoRef,
        src: videoUrl,
        poster: thumbnail,
        className: "w-100 h-100",
        onClick: handlePlay, // Add click handler to play/pause
        onTimeUpdate: handleTimeUpdate,
        onLoadedMetadata: handleLoadedMetadata,
        onEnded: () => setIsPlaying(false),
        style: { objectFit: 'contain', width: '100%', height: '100%', borderRadius: '10px', cursor: 'pointer' }
      }
    ),
    // Play button overlay
    createPlayButton(),
    // Play/Pause indicator overlay (always visible on hover)
    React.createElement(
      "div",
      {
        className: "position-absolute top-50 start-50 translate-middle",
        style: { 
          opacity: showControls ? 0.8 : 0, 
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          zIndex: 2
        }
      },
      React.createElement(
        "div",
        {
          className: "d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle",
          style: { width: '70px', height: '70px' }
        },
        React.createElement(
          "i",
          {
            className: isPlaying ? "bi bi-pause-fill text-white" : "bi bi-play-fill text-white",
            style: { fontSize: '36px' }
          }
        )
      )
    ),
    // Video controls
    createVideoControls(),
    // netGala watermark
    createWatermark()
  );
}

export default VideoPlayer;
