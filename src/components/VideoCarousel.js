import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
import { getVideos } from '../services/video';

function VideoCarousel({ categoryId, timeFilter, targetVideoId, currentUser, followedUsers = [], handleFollowUser }) {
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
          
          // If a target video ID is provided, find its index
          if (targetVideoId) {
            const targetIndex = data.findIndex(video => video.id.toString() === targetVideoId.toString());
            if (targetIndex !== -1) {
              setCurrentIndex(targetIndex);
            } else {
              setCurrentIndex(0);
            }
          } else {
            setCurrentIndex(0); // Reset to first video when changing filters
          }
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
  }, [timeFilter, targetVideoId]);

  const handleNext = () => {
    // Generate a random index different from the current one
    const getRandomIndex = () => {
      // If there's only one video, we have no choice but to repeat
      if (videos.length <= 1) return 0;
      
      // Generate a random index that's different from the current one
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * videos.length);
      } while (randomIndex === currentIndex);
      
      return randomIndex;
    };
    
    // Set the current index to a random one
    setCurrentIndex(getRandomIndex());
    console.log("Showing random video for discovery");
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? videos.length - 1 : prevIndex - 1
    );
  };
  
  const handleFollow = () => {
    if (!currentUser || !currentVideo) return;
    
    // Don't allow following yourself
    if (currentUser.id === currentVideo.userId) {
      console.log("Cannot follow yourself");
      return;
    }
    
    // Determine current following state
    const isCurrentlyFollowing = followedUsers.includes(currentVideo.userId);
    console.log(`Currently following ${currentVideo.userId}: ${isCurrentlyFollowing}`);
    
    // Toggle follow state using the global handler
    if (handleFollowUser) {
      // Call global handler with opposite of current state
      handleFollowUser(currentVideo.userId, !isCurrentlyFollowing);
    }
  };
  
  // Removed like functionality

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
            // User info with link to channel
            React.createElement(
              "a",
              { 
                href: `/channel/${currentVideo.userId}`, 
                className: "text-decoration-none",
                onClick: (e) => {
                  e.preventDefault();
                  // Navigate to the user's channel page
                  window.location.href = `/channel/${currentVideo.userId}`;
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
            currentUser && currentUser.id !== currentVideo.userId ?
              React.createElement(
                "button",
                { 
                  className: followedUsers.includes(currentVideo.userId)
                    ? "btn btn-sm btn-primary ms-3" 
                    : "btn btn-sm btn-outline-primary ms-3",
                  onClick: handleFollow,
                  style: { 
                    backgroundColor: followedUsers.includes(currentVideo.userId) ? '#6f42c1' : 'transparent',
                    borderColor: '#6f42c1', 
                    color: followedUsers.includes(currentVideo.userId) ? 'white' : '#6f42c1'
                  }
                },
                followedUsers.includes(currentVideo.userId) ? "Following" : "Follow"
              ) : null,
            // Empty div for spacing with flex-grow
            React.createElement(
              "div",
              { className: "ms-auto" }
            ),
            // View count
            React.createElement(
              "div",
              { className: "d-flex align-items-center" },
              React.createElement(
                "i",
                { 
                  className: "bi bi-eye me-1", 
                  style: { fontSize: '22px', color: "#6c757d" } 
                }
              ),
              React.createElement(
                "span",
                { 
                  style: { fontSize: '14px', color: "#6c757d" },
                  className: "me-3" // Added right margin for spacing
                },
                currentVideo.views || 0
              )
            )
          )
        )
      )
    )
  );
}

export default VideoCarousel;
