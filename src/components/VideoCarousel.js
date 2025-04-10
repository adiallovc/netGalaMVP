import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getVideos } from '../services/video';

function VideoCarousel({ categoryId, timeFilter }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Fetch videos from the API
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await getVideos(timeFilter);
        
        if (data && data.length > 0) {
          setVideos(data);
          setCurrentIndex(0); // Reset to first video when changing filters
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, [timeFilter]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + 1 >= videos.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return React.createElement(
      "div",
      { className: "text-center py-5" },
      React.createElement(
        "div",
        { className: "spinner-border text-primary", role: "status" },
        React.createElement(
          "span",
          { className: "visually-hidden" },
          "Loading..."
        )
      )
    );
  }

  if (error) {
    return React.createElement(
      "div",
      { className: "alert alert-danger", role: "alert" },
      error
    );
  }

  if (videos.length === 0) {
    return React.createElement(
      "div",
      { className: "text-center py-5" },
      React.createElement(
        "div",
        { className: "mb-4" },
        React.createElement(
          "i",
          { 
            className: "bi bi-camera-video-off",
            style: { fontSize: '48px', color: '#6f42c1' }
          }
        )
      ),
      React.createElement("h4", null, "No videos found"),
      React.createElement(
        "p",
        { className: "text-muted" },
        "Try adjusting your filter or upload a new video"
      )
    );
  }

  const currentVideo = videos[currentIndex];

  return React.createElement(
    "div",
    { className: "video-carousel-container" },
    React.createElement(
      "div",
      { className: "row" },
      React.createElement(
        "div",
        { className: "col-md-8 mx-auto" },
        // Video player
        React.createElement(
          "div",
          { className: "position-relative" },
          React.createElement(
            VideoPlayer,
            {
              videoUrl: currentVideo.videoUrl,
              thumbnail: currentVideo.thumbnailUrl,
              title: currentVideo.title,
              userId: currentVideo.userId,
              username: currentVideo.username,
              userAvatar: currentVideo.userAvatar
            }
          )
        ),
        // Next button (not on the video)
        React.createElement(
          "div",
          { className: "d-flex justify-content-center mt-3 mb-2" },
          React.createElement(
            "button",
            {
              className: "btn",
              onClick: handleNext,
              style: {
                backgroundColor: '#6f42c1',
                color: 'white',
                padding: '8px 20px',
                borderRadius: '4px',
                fontWeight: 500
              }
            },
            "Next Video"
          )
        ),
        // Video details
        React.createElement(
          "div",
          { className: "mt-2" },
          React.createElement("h5", { className: "mb-2" }, currentVideo.title),
          React.createElement(
            "div",
            { className: "d-flex align-items-center" },
            // User info
            React.createElement(
              "a",
              { 
                href: '#', 
                className: "text-decoration-none",
                onClick: (e) => {
                  e.preventDefault();
                  console.log(`Navigate to profile: ${currentVideo.userId}`);
                }
              },
              React.createElement(
                "div",
                { className: "d-flex align-items-center" },
                React.createElement(
                  "img",
                  {
                    src: currentVideo.userAvatar,
                    alt: currentVideo.username,
                    className: "rounded-circle me-2",
                    style: { width: '40px', height: '40px', objectFit: 'cover' }
                  }
                ),
                React.createElement(
                  "span",
                  { className: "text-dark" },
                  currentVideo.username
                )
              )
            ),
            // Follow button
            React.createElement(
              "button",
              { 
                className: "btn btn-sm btn-outline-primary ms-3",
                style: { 
                  borderColor: '#6f42c1', 
                  color: '#6f42c1' 
                }
              },
              "Follow"
            ),
            // Empty div for spacing
            React.createElement(
              "div",
              { className: "ms-auto" }
            )
          )
        )
      )
    )
  );
}

export default VideoCarousel;
