import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
// import { getUserById } from '../services/auth';
// import { getVideosByUserId } from '../services/video';

function Channel({ currentUser, followedUsers = [], handleFollowUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

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
  
  // No longer needed as currentUser is passed as prop
  
  useEffect(() => {
    // In a real app, fetch the user and their videos
    // For now, use mock data
    setLoading(true);
    console.log("Loading channel with userId:", userId);
    
    setTimeout(() => {
      // Check if this is the current user's profile
      const isOwnProfile = currentUser && (currentUser.id === userId || userId === 'me');
      
      if (isOwnProfile && currentUser) {
        // Use the current user's information for their own profile
        console.log("Showing current user's profile:", currentUser.username);
        
        // Create an empty video array or use existing videos if they have any
        const userVideos = currentUser.videos || [];
        
        setUser({
          id: currentUser.id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          bio: currentUser.bio
        });
        
        setVideos(userVideos);
        setFollowersCount(currentUser.followers || 0);
      } else {
        // Otherwise, show the requested user's profile from mock data
        const foundUser = mockUsers[userId] || mockUsers['1'];
        console.log("Found user:", foundUser.id, foundUser.username);
        
        setUser({
          id: foundUser.id,
          username: foundUser.username,
          avatar: foundUser.avatar,
          bio: foundUser.bio
        });
        
        setVideos(foundUser.videos);
        setFollowersCount(foundUser.followers);
      }
      
      if (isOwnProfile) {
        // User can't follow themselves
        console.log("This is the current user's own profile");
        setIsFollowing(false);
      } else {
        // Check if following this user
        console.log("Current followed users from props:", followedUsers);
        console.log("Checking if user ID is in followed list:", foundUser.id);
        
        // Make sure we're checking for exact string match, as IDs are strings
        const isCurrentlyFollowing = followedUsers.includes(foundUser.id);
        console.log("Is following?", isCurrentlyFollowing);
        
        setIsFollowing(isCurrentlyFollowing);
      }
      
      // Count how many users the CURRENT user is following
      setFollowingCount(followedUsers.length);
      
      setLoading(false);
    }, 500);
  }, [userId, followedUsers, currentUser]);

  const handleFollow = () => {
    // Get the user ID we're operating on
    const userIdToFollow = user?.id;
      
    if (!userIdToFollow) {
      console.error('Cannot follow: User ID is undefined');
      return;
    }
    
    // Toggle follow status
    const newFollowingState = !isFollowing;
    
    // Update the UI immediately
    setIsFollowing(newFollowingState);
    
    // Update follower count based on the new status
    setFollowersCount(prevCount => newFollowingState ? prevCount + 1 : prevCount - 1);
    
    // If the App-level handleFollowUser function is available, use it
    if (handleFollowUser) {
      console.log(`Using global follow handler for user ${userIdToFollow}, follow=${newFollowingState}`);
      const success = handleFollowUser(userIdToFollow, newFollowingState);
      
      if (!success) {
        // If there was an error, revert UI changes
        setIsFollowing(!newFollowingState);
        setFollowersCount(prevCount => !newFollowingState ? prevCount + 1 : prevCount - 1);
      }
    } else {
      // Fallback to local storage handling if global function is not available
      console.log("Using fallback follow handler");
      try {
        // Get current list of followed users from localStorage
        const followedUsers = JSON.parse(localStorage.getItem('followedUsers') || '[]');
        
        if (newFollowingState) {
          // If we're now following, add to list
          if (!followedUsers.includes(userIdToFollow)) {
            followedUsers.push(userIdToFollow);
            console.log(`Added ${userIdToFollow} to followed users`);
          }
        } else {
          // If we're now unfollowing, remove from list
          const index = followedUsers.indexOf(userIdToFollow);
          if (index > -1) {
            followedUsers.splice(index, 1);
            console.log(`Removed ${userIdToFollow} from followed users`);
          }
        }
        
        // Update localStorage immediately
        localStorage.setItem('followedUsers', JSON.stringify(followedUsers));
        console.log(`User is now ${newFollowingState ? 'following' : 'not following'} ${userIdToFollow}`);
        console.log(`New followed users list: ${JSON.stringify(followedUsers)}`);
      } catch (error) {
        console.error('Error updating follow status:', error);
        // Revert UI changes on error
        setIsFollowing(!newFollowingState);
        setFollowersCount(prevCount => !newFollowingState ? prevCount + 1 : prevCount - 1);
      }
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
  
  // Following Modal Component
  const createFollowingModal = () => {
    if (!showFollowingModal) return null;
    
    // Use the followedUsers from props instead of localStorage
    const followedUserIds = followedUsers || [];
    
    // Create a list of users that this user is following
    const followingList = Object.values(mockUsers)
      .filter(u => followedUserIds.includes(u.id)) // Only show users that are being followed
      .map(followedUser => {
        return React.createElement(
          "div",
          { 
            className: "d-flex align-items-center p-3 border-bottom",
            key: followedUser.id,
            style: { cursor: 'pointer' },
            onClick: () => {
              setShowFollowingModal(false);
              // Use React Router's Link equivalent redirect
              window.location = `/channel/${followedUser.id}`;
              // Force a reload if needed to make sure the component remounts
              setTimeout(() => window.location.reload(), 50);
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
            followingList.length ? followingList : React.createElement(
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
    // Add Following Modal
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
              // Only show follow button if this is not the current user's profile
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