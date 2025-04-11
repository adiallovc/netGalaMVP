import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import mockUsers from '../data/mockUsers';

function Channel({ currentUser, followedUsers = [], handleFollowUser }) {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Modal close handlers
  const closeModal = () => {
    setShowFollowingModal(false);
    setShowVideoModal(false);
  };
  
  // Modal close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showFollowingModal || showVideoModal) {
        // Check if click is outside modal content
        if (e.target.className && typeof e.target.className === 'string' && 
            e.target.className.includes('modal fade show')) {
          closeModal();
        }
      }
    };
    
    // Add event listener
    document.addEventListener('click', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showFollowingModal, showVideoModal]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    // Add event listener
    document.addEventListener('keydown', handleEscape);
    
    // Clean up
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  
  // Load user data
  useEffect(() => {
    setLoading(true);
    console.log("Loading channel with userId:", userId);
    
    // Short timeout to simulate API call
    setTimeout(() => {
      try {
        let userToDisplay = null;
        let userVideos = [];
        let userFollowerCount = 0;
        let currentlyFollowing = false;
        
        // Determine if viewing own profile
        const isCurrentUserProfile = currentUser && 
          (currentUser.id === userId || userId === 'me');
        
        if (isCurrentUserProfile && currentUser) {
          // Show current user's profile
          console.log("Showing current user's own profile");
          userToDisplay = { ...currentUser };
          userVideos = currentUser.videos || [];
          userFollowerCount = currentUser.followers || 0;
          // User can't follow themselves
          currentlyFollowing = false;
        } else {
          // Show another user's profile from mock data
          const profileUser = mockUsers[userId] || mockUsers['1'];
          console.log("Showing profile for user:", profileUser.id, profileUser.username);
          
          userToDisplay = { ...profileUser };
          userVideos = profileUser.videos || [];
          userFollowerCount = profileUser.followers || 0;
          
          // Check if the current user is following this profile
          if (currentUser && followedUsers && followedUsers.length > 0) {
            console.log("Checking if following user:", profileUser.id);
            console.log("Current followed users:", followedUsers);
            currentlyFollowing = followedUsers.includes(profileUser.id);
            console.log("Is following:", currentlyFollowing);
          }
        }
        
        // Update state with user data
        setUser(userToDisplay);
        setVideos(userVideos);
        setFollowersCount(userFollowerCount);
        setIsFollowing(currentlyFollowing);
        
        // Set following count - how many users the current user follows
        setFollowingCount(followedUsers ? followedUsers.length : 0);
      } catch (error) {
        console.error("Error loading channel data:", error);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, [userId, currentUser, followedUsers]);

  // Handle follow/unfollow action
  const handleFollow = () => {
    if (!user || !currentUser) return;
    
    // Don't allow following yourself
    if (currentUser.id === user.id) return;
    
    // Toggle follow status
    const newFollowingState = !isFollowing;
    console.log(`Toggling follow for user ${user.id} to ${newFollowingState}`);
    
    // Update UI immediately for responsive feel
    setIsFollowing(newFollowingState);
    setFollowersCount(prevCount => newFollowingState ? prevCount + 1 : prevCount - 1);
    
    // Use global follow handler from App.js
    if (handleFollowUser) {
      console.log(`Calling handleFollowUser for user ${user.id}: ${newFollowingState}`);
      const success = handleFollowUser(user.id, newFollowingState);
      
      // If failed, revert UI changes
      if (!success) {
        setIsFollowing(!newFollowingState);
        setFollowersCount(prevCount => !newFollowingState ? prevCount + 1 : prevCount - 1);
      }
    }
  };

  // Following Modal Component
  const createFollowingModal = () => {
    if (!showFollowingModal) return null;
    
    // Get list of users who are being followed
    const followedUserIds = followedUsers || [];
    console.log("Creating following modal with users:", followedUserIds);
    
    // Create a list of followed users
    const followingList = Object.values(mockUsers)
      .filter(u => followedUserIds.includes(u.id))
      .map(followedUser => {
        return React.createElement(
          "div",
          { 
            className: "d-flex align-items-center p-3 border-bottom",
            key: followedUser.id,
            style: { cursor: 'pointer' },
            onClick: () => {
              setShowFollowingModal(false);
              window.location = `/channel/${followedUser.id}`;
            }
          },
          // User avatar
          React.createElement(
            "img",
            {
              src: followedUser.avatar,
              alt: followedUser.username,
              className: "rounded-circle me-3",
              style: { width: '50px', height: '50px', objectFit: 'cover' }
            }
          ),
          // User details
          React.createElement(
            "div",
            { className: "flex-grow-1" },
            React.createElement(
              "h6",
              { className: "mb-0" },
              followedUser.username
            ),
            React.createElement(
              "p",
              { className: "mb-0 text-muted small" },
              `${followedUser.followers} followers`
            )
          )
        );
      });
    
    return React.createElement(
      "div",
      {
        className: "modal fade show",
        tabIndex: "-1",
        style: { display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }
      },
      React.createElement(
        "div",
        { className: "modal-dialog modal-dialog-centered" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "div",
            { className: "modal-header" },
            React.createElement(
              "h5",
              { className: "modal-title" },
              "Following"
            ),
            React.createElement(
              "button",
              {
                type: "button",
                className: "btn-close",
                onClick: () => setShowFollowingModal(false)
              }
            )
          ),
          React.createElement(
            "div",
            { 
              className: "modal-body p-0",
              style: { maxHeight: '400px', overflowY: 'auto' }
            },
            followingList.length > 0 ? followingList : React.createElement(
              "p",
              { className: "text-center p-3 text-muted" },
              "No following yet"
            )
          )
        )
      )
    );
  };
  
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

  // Loading state
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

  // User not found state
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

  // Main channel page render
  return React.createElement(
    "div",
    { className: "channel-page py-4" },
    // Modal components
    createVideoModal(),
    createFollowingModal(),
    
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
                  { 
                    className: "me-3 cursor-pointer",
                    style: { cursor: 'pointer', textDecoration: 'underline' },
                    onClick: () => setShowFollowingModal(true)
                  },
                  `${followingCount} following`
                ),
                React.createElement(
                  "span",
                  null,
                  `${videos.length} videos`
                )
              ),
              // Either Edit Profile or Follow button
              // Show Edit Profile for own profile, Follow/Following for others
              currentUser && currentUser.id === user.id 
              ? React.createElement(
                  Link,
                  { 
                    to: `/edit-profile/${user.id}`,
                    className: "btn btn-outline-primary",
                    style: { 
                      backgroundColor: 'transparent',
                      borderColor: '#6f42c1',
                      color: '#6f42c1'
                    }
                  },
                  "Edit Profile"
                )
              : React.createElement(
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
          // Only show bio if it exists
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
        videos && videos.length > 0 ? 
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
                      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      username: user.username,
                      userAvatar: user.avatar,
                      userId: user.id
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
                  // Play button overlay
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
                    { className: "card-text text-muted small mt-1" },
                    new Date(video.createdAt).toLocaleDateString()
                  )
                )
              )
            )
          )
        : React.createElement(
            "div",
            { className: "col-12 text-center py-5" },
            React.createElement(
              "p",
              { className: "text-muted" },
              "No videos yet"
            )
          )
      )
    )
  );
}

export default Channel;