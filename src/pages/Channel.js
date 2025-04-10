import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
// import { getUserById } from '../services/auth';
// import { getVideosByUserId } from '../services/video';

function Channel() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

  useEffect(() => {
    // In a real app, fetch the user and their videos
    // For now, use mock data
    setTimeout(() => {
      setUser({
        id: userId || 'user1',
        username: 'Channel Creator',
        avatar: 'https://i.pravatar.cc/150?img=1',
        bio: 'Creating awesome AI-generated music videos'
      });
      
      setVideos([
        {
          id: 1,
          title: 'AI Music Video - Electronic',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          views: 1254,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Landscape Visualizer Demo',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
          views: 892,
          createdAt: new Date().toISOString()
        }
      ]);
      
      setFollowersCount(124);
      setLoading(false);
    }, 500);
  }, [userId]);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
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

  if (!user) {
    return React.createElement(
      "div",
      { className: "container py-5" },
      React.createElement(
        "div",
        { className: "alert alert-warning" },
        "User not found"
      )
    );
  }

  // Like video function
  const [likedVideos, setLikedVideos] = useState({});
  
  const handleLike = (videoId) => {
    const currentLiked = likedVideos[videoId] || false;
    
    // Toggle like state for this video
    setLikedVideos({
      ...likedVideos,
      [videoId]: !currentLiked
    });
    
    // Update selected video likes count
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo({
        ...selectedVideo,
        likes: currentLiked ? selectedVideo.likes - 1 : selectedVideo.likes + 1
      });
    }
  };
  
  // Video Modal Component
  const createVideoModal = () => {
    if (!showVideoModal || !selectedVideo) return null;
    
    const isLiked = likedVideos[selectedVideo.id] || false;
    
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
              // Like button
              React.createElement(
                "div",
                { className: "d-flex align-items-center" },
                React.createElement(
                  "button",
                  {
                    className: "btn btn-sm p-0 me-1",
                    onClick: () => handleLike(selectedVideo.id),
                    style: { color: isLiked ? "#ff4757" : "#6c757d" }
                  },
                  React.createElement(
                    "i",
                    { 
                      className: isLiked ? "bi bi-hand-thumbs-up-fill" : "bi bi-hand-thumbs-up", 
                      style: { fontSize: '18px' } 
                    }
                  )
                ),
                React.createElement(
                  "span",
                  { style: { fontSize: '14px' } },
                  selectedVideo.likes
                )
              )
            )
          )
        )
      )
    );
  };

  return React.createElement(
    "div",
    { className: "channel-page py-4" },
    // Add Video Modal
    createVideoModal(),
    React.createElement(
      "div",
      { className: "container" },
      // User header section
      React.createElement(
        "div",
        { className: "row mb-5" },
        React.createElement(
          "div",
          { className: "col-md-8 mx-auto" },
          React.createElement(
            "div",
            { className: "d-flex align-items-center mb-4" },
            // User avatar
            React.createElement(
              "img",
              {
                src: user.avatar,
                alt: user.username,
                className: "rounded-circle me-4",
                style: { width: '100px', height: '100px', objectFit: 'cover' }
              }
            ),
            // User info
            React.createElement(
              "div",
              null,
              React.createElement(
                "h2",
                { className: "mb-2" },
                user.username
              ),
              React.createElement(
                "div",
                { className: "d-flex align-items-center mb-2" },
                React.createElement(
                  "span",
                  { className: "me-3" },
                  `${followersCount} followers`
                ),
                React.createElement(
                  "span",
                  null,
                  `${videos.length} videos`
                )
              ),
              React.createElement(
                "button",
                {
                  className: isFollowing 
                    ? "btn btn-primary" 
                    : "btn btn-outline-primary",
                  onClick: handleFollow,
                  style: { 
                    backgroundColor: isFollowing ? '#6f42c1' : 'transparent',
                    borderColor: '#6f42c1',
                    color: isFollowing ? 'white' : '#6f42c1'
                  }
                },
                isFollowing ? "Following" : "Follow"
              )
            )
          ),
          user.bio && React.createElement(
            "p",
            { className: "mt-3" },
            user.bio
          )
        )
      ),
      // Videos section
      React.createElement(
        "h3",
        { className: "mb-4" },
        "Videos"
      ),
      React.createElement(
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
                    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // Default video URL
                    username: user.username,
                    userAvatar: user.avatar,
                    userId: user.id,
                    likes: Math.floor(Math.random() * 100) // Random likes for demo
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
                  "p",
                  { className: "card-text text-muted small" },
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

export default Channel;