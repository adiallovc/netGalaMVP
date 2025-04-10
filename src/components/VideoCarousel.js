import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import VideoPlayer from './VideoPlayer';
// import { getVideos } from '../services/videoService';

function VideoCarousel({ categoryId, filter }) {
  // Sample data for videos
  const sampleVideos = {
    trending: [
      {
        id: 1,
        title: 'Time Capsule - AI Generated Music Video',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        userId: 'user1',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/150?img=1',
        likes: 423,
        comments: 58
      },
      {
        id: 2,
        title: 'Dreamy Landscapes - Visualizer',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        userId: 'user2',
        username: 'Visual_Dreams',
        userAvatar: 'https://i.pravatar.cc/150?img=2',
        likes: 258,
        comments: 32
      }
    ],
    music: [
      {
        id: 3,
        title: 'Audio Visualizer - Electronic Beats',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        userId: 'user3',
        username: 'ElectroBeats',
        userAvatar: 'https://i.pravatar.cc/150?img=3',
        likes: 312,
        comments: 41
      }
    ],
    tutorials: [
      {
        id: 4,
        title: 'How to Create AI Music Videos - Tutorial',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
        userId: 'user4',
        username: 'TechTutor',
        userAvatar: 'https://i.pravatar.cc/150?img=4',
        likes: 178,
        comments: 27
      }
    ]
  };

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Simulate API call with sample data
    setTimeout(() => {
      if (sampleVideos[categoryId]) {
        setVideos(sampleVideos[categoryId]);
        setLoading(false);
      } else {
        setVideos(sampleVideos.trending);
        setLoading(false);
      }
    }, 500);
  }, [categoryId, filter]);

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
          ),
          React.createElement(
            "div",
            { 
              className: "position-absolute bottom-0 start-50 translate-middle-x mb-3",
              style: { zIndex: 10 }
            },
            React.createElement(
              "button",
              {
                className: "btn btn-sm",
                onClick: handleNext,
                style: {
                  backgroundColor: '#6f42c1',
                  color: 'white',
                  padding: '8px 20px',
                  borderRadius: '4px',
                  fontWeight: 500
                }
              },
              "next"
            )
          )
        ),
        React.createElement(
          "div",
          { className: "mt-3" },
          React.createElement("h5", { className: "mb-2" }, currentVideo.title),
          React.createElement(
            "div",
            { className: "d-flex align-items-center" },
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
            React.createElement(
              "div",
              { className: "ms-auto" },
              React.createElement(
                "button",
                { className: "btn btn-sm btn-outline-secondary me-2" },
                React.createElement(
                  "i",
                  { 
                    className: "bi bi-heart", 
                    style: { fontSize: '16px' }
                  }
                ),
                " ",
                currentVideo.likes || 0
              ),
              React.createElement(
                "button",
                { className: "btn btn-sm btn-outline-secondary" },
                React.createElement(
                  "i",
                  { 
                    className: "bi bi-chat", 
                    style: { fontSize: '16px' }
                  }
                ),
                " ",
                currentVideo.comments || 0
              )
            )
          )
        )
      )
    )
  );
}

export default VideoCarousel;
