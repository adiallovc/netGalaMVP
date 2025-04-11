import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';

function Following({ currentUser, followedUsers = [], handleFollowUser }) {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  
  // Simulated user database - using proper IDs that match URL parameters
  const mockUsers = {
    '1': {
      id: '1',
      username: 'Channel Creator',
      avatar: 'https://i.pravatar.cc/150?img=1',
      bio: 'Creating awesome AI-generated music videos',
      videos: [
        {
          id: 1,
          title: 'AI Music Video - Electronic',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          views: 1254,
          createdAt: new Date().toISOString(),
          userId: '1',
          username: 'Channel Creator',
          userAvatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: 2,
          title: 'Landscape Visualizer Demo',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          views: 892,
          createdAt: new Date().toISOString(),
          userId: '1',
          username: 'Channel Creator',
          userAvatar: 'https://i.pravatar.cc/150?img=1'
        }
      ],
      followers: 124
    },
    '2': {
      id: '2',
      username: 'Neon_Artist',
      avatar: 'https://i.pravatar.cc/150?img=2',
      bio: 'Creating stunning neon visualizations',
      videos: [
        {
          id: 3,
          title: 'Neon Dreams',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          views: 2045,
          createdAt: new Date().toISOString(),
          userId: '2',
          username: 'Neon_Artist',
          userAvatar: 'https://i.pravatar.cc/150?img=2'
        }
      ],
      followers: 247
    },
    '3': {
      id: '3',
      username: 'Creative_AI',
      avatar: 'https://i.pravatar.cc/150?img=3',
      bio: 'AI-powered creative content',
      videos: [
        {
          id: 4,
          title: 'AI Art Exhibition',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          views: 1839,
          createdAt: new Date().toISOString(),
          userId: '3',
          username: 'Creative_AI',
          userAvatar: 'https://i.pravatar.cc/150?img=3'
        },
        {
          id: 5,
          title: 'The Future of Creativity',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          views: 1257,
          createdAt: new Date().toISOString(),
          userId: '3',
          username: 'Creative_AI',
          userAvatar: 'https://i.pravatar.cc/150?img=3'
        }
      ],
      followers: 352
    }
  };
  
  // Load videos from followed users
  useEffect(() => {
    setLoading(true);
    
    console.log('Loading videos from followed users:', followedUsers);
    
    // Get videos from users that the current user is following
    if (followedUsers && followedUsers.length > 0) {
      // Collect videos from all followed users
      const followedVideos = [];
      
      // For each followed user ID, get their videos
      followedUsers.forEach(userId => {
        const user = mockUsers[userId];
        if (user && user.videos) {
          followedVideos.push(...user.videos);
        }
      });
      
      // Sort videos by date (newest first)
      followedVideos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setVideos(followedVideos);
    } else {
      // No followed users, show empty state
      setVideos([]);
    }
    
    setLoading(false);
  }, [followedUsers]);
  
  // Video Modal Component
  const createVideoModal = () => {
    if (!showVideoModal || !selectedVideo) return null;
    
    return React.createElement(
      "div",
      {
        className: "modal fade show",
        tabIndex: "-1",
        style: { display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }
      },
      React.createElement(
        "div",
        { className: "modal-dialog modal-lg modal-dialog-centered" },
        React.createElement(
          "div",
          { className: "modal-content", style: { backgroundColor: '#121212', color: 'white' } },
          React.createElement(
            "div",
            { className: "modal-header border-0" },
            React.createElement(
              "h5",
              { className: "modal-title" },
              selectedVideo.title
            ),
            React.createElement(
              "button",
              {
                type: "button",
                className: "btn-close btn-close-white",
                onClick: () => setShowVideoModal(false)
              }
            )
          ),
          React.createElement(
            "div",
            { className: "modal-body" },
            React.createElement(
              "div",
              { className: "position-relative" },
              React.createElement(
                VideoPlayer,
                {
                  videoUrl: selectedVideo.videoUrl,
                  thumbnail: selectedVideo.thumbnailUrl,
                  title: selectedVideo.title,
                  userId: selectedVideo.userId,
                  username: selectedVideo.username,
                  userAvatar: selectedVideo.userAvatar
                }
              )
            ),
            React.createElement(
              "div",
              { className: "d-flex align-items-center mt-3" },
              // User info
              React.createElement(
                "div",
                { className: "d-flex align-items-center" },
                React.createElement(
                  "img",
                  {
                    src: selectedVideo.userAvatar,
                    alt: selectedVideo.username,
                    className: "rounded-circle me-2",
                    style: { width: '40px', height: '40px', objectFit: 'cover' }
                  }
                ),
                React.createElement(
                  "span",
                  null,
                  selectedVideo.username
                )
              ),
              // Empty div for spacing
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
                    style: { fontSize: '18px', color: "#6c757d" } 
                  }
                ),
                React.createElement(
                  "span",
                  { style: { fontSize: '14px', color: "#6c757d" } },
                  selectedVideo.views || 0
                )
              )
            )
          )
        )
      )
    );
  };
  
  // Create empty state if not following anyone or no videos
  const createEmptyState = () => {
    return React.createElement(
      "div",
      { className: "text-center py-5" },
      React.createElement(
        "div",
        { className: "mb-4" },
        React.createElement(
          "i",
          { 
            className: "bi bi-person-plus-fill", 
            style: { fontSize: '48px', color: '#6f42c1' }
          }
        )
      ),
      React.createElement(
        "h4",
        { className: "mb-3" },
        followedUsers.length === 0 
          ? "You're not following anyone yet" 
          : "No videos from people you follow"
      ),
      React.createElement(
        "p",
        { className: "text-muted mb-4" },
        "Follow creators to see their latest videos here"
      ),
      React.createElement(
        Link,
        { 
          to: "/", 
          className: "btn btn-primary",
          style: { backgroundColor: "#6f42c1", borderColor: "#6f42c1" }
        },
        "Discover Creators"
      )
    );
  };
  
  if (loading) {
    return React.createElement(
      "div",
      { className: "text-center py-5" },
      React.createElement(
        "div",
        { className: "spinner-border", role: "status" },
        React.createElement(
          "span",
          { className: "visually-hidden" },
          "Loading..."
        )
      )
    );
  }
  
  return React.createElement(
    "div",
    { className: "following-page py-4" },
    // Add Video Modal
    createVideoModal(),
    React.createElement(
      "div",
      { className: "container" },
      // Page heading
      React.createElement(
        "h2",
        { className: "mb-4" },
        "Following Feed"
      ),
      // Video grid or empty state
      videos.length === 0 
        ? createEmptyState()
        : React.createElement(
            "div",
            { className: "row" },
            videos.map(video => 
              React.createElement(
                "div",
                { className: "col-md-4 col-sm-6 mb-4", key: video.id },
                React.createElement(
                  "div",
                  { 
                    className: "card h-100",
                    style: { cursor: 'pointer' },
                    onClick: () => {
                      // Open video in modal popup
                      setSelectedVideo({
                        ...video,
                        videoUrl: video.videoUrl, 
                        username: video.username,
                        userAvatar: video.userAvatar,
                        userId: video.userId
                      });
                      setShowVideoModal(true);
                    }
                  },
                  React.createElement(
                    "div",
                    { className: "position-relative" },
                    React.createElement(
                      "img",
                      {
                        src: video.thumbnailUrl,
                        alt: video.title,
                        className: "card-img-top",
                        style: { aspectRatio: '16/9', objectFit: 'cover' }
                      }
                    ),
                    // Play button overlay to indicate it's playable
                    React.createElement(
                      "div",
                      {
                        className: "position-absolute top-50 start-50 translate-middle",
                        style: { zIndex: 1 }
                      },
                      React.createElement(
                        "div",
                        {
                          className: "d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle",
                          style: { width: '50px', height: '50px' }
                        },
                        React.createElement(
                          "i",
                          {
                            className: "bi bi-play-fill text-white",
                            style: { fontSize: '24px' }
                          }
                        )
                      )
                    )
                  ),
                  React.createElement(
                    "div",
                    { className: "card-body" },
                    React.createElement(
                      "h5",
                      { className: "card-title" },
                      video.title
                    ),
                    React.createElement(
                      "div",
                      { 
                        className: "d-flex align-items-center justify-content-between mt-2",
                        onClick: (e) => {
                          e.stopPropagation(); // Prevent video modal from opening
                        }
                      },
                      // Left side - user info
                      React.createElement(
                        "div",
                        { 
                          className: "d-flex align-items-center",
                          style: { cursor: 'pointer' },
                          onClick: () => {
                            window.location = `/channel/${video.userId}`;
                          }
                        },
                        React.createElement(
                          "img",
                          {
                            src: video.userAvatar,
                            alt: video.username,
                            className: "rounded-circle me-2",
                            style: { width: '24px', height: '24px', objectFit: 'cover' }
                          }
                        ),
                        React.createElement(
                          "span",
                          { className: "text-muted small" },
                          video.username
                        )
                      ),
                      // Right side - unfollow button
                      React.createElement(
                        "button",
                        {
                          className: "btn btn-sm btn-primary",
                          style: { 
                            backgroundColor: '#6f42c1',
                            borderColor: '#6f42c1',
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.5rem'
                          },
                          onClick: (e) => {
                            e.stopPropagation();
                            if (handleFollowUser) {
                              handleFollowUser(video.userId, false);
                            }
                          }
                        },
                        "Following"
                      )
                    ),
                    React.createElement(
                      "p",
                      { className: "card-text text-muted small mt-1" },
                      new Date(video.createdAt).toLocaleDateString()
                    )
                  )
                )
              )
            )
          )
    )
  );
}

export default Following;