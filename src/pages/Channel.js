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
    // Toggle follow status
    setIsFollowing(!isFollowing);
    
    // Update follower count based on the new status
    setFollowersCount(prevCount => isFollowing ? prevCount - 1 : prevCount + 1);
    
    // In a real app, this would make an API call to follow/unfollow
    // We're storing the follow state in localStorage for persistence across page reloads
    try {
      const userId = user?.id || 'user1';
      const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
      
      if (!isFollowing) {
        // If we're now following, add to list
        if (!followedUsers.includes(userId)) {
          followedUsers.push(userId);
        }
      } else {
        // If we're now unfollowing, remove from list
        const index = followedUsers.indexOf(userId);
        if (index > -1) {
          followedUsers.splice(index, 1);
        }
      }
      
      localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
      console.log(`User is now ${!isFollowing ? 'following' : 'not following'} ${userId}`);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
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

  // Simplified functionality without likes
  const handleVideoAction = () => {
    console.log('Video action performed');
  };
  
  // Video Modal Component
  const createVideoModal = () => {
    if (!showVideoModal || !selectedVideo) return null;
    
    // Removed likes functionality
    
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