import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { getUserById } from '../services/auth';
// import { getVideosByUserId } from '../services/video';

function Channel() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

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

  return React.createElement(
    "div",
    { className: "channel-page py-4" },
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
                  // Navigate to home page with this video selected
                  window.location.href = '/?timeFilter=allTime&videoId=' + video.id;
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