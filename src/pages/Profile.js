import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import ProfileSection from '../components/ProfileSection';
// import { getUserProfile, getUserVideos } from '../services/api';

function Profile({ currentUser }) {
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Sample data for a profile
  const profile = {
    id: userId || 'user1',
    username: 'DemoUser',
    bio: 'A demo user profile for our video streaming app',
    followers: 123,
    following: 45,
    joinedDate: '2023-01-15',
    avatarUrl: 'https://i.pravatar.cc/150?img=7'
  };
  
  const isCurrentUser = currentUser && currentUser.id === profile.id;
  
  // Render helper functions using React.createElement
  const renderLoading = () => {
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
  };
  
  const renderError = () => {
    return React.createElement(
      "div",
      { className: "alert alert-danger", role: "alert" },
      error
    );
  };
  
  const renderProfileHeader = () => {
    return React.createElement(
      "div",
      { className: "profile-header p-4 bg-light rounded mb-4" },
      React.createElement(
        "div",
        { className: "row align-items-center" },
        // Avatar column
        React.createElement(
          "div",
          { className: "col-md-2 text-center" },
          React.createElement(
            "img",
            {
              src: profile.avatarUrl,
              alt: profile.username,
              className: "rounded-circle",
              style: { width: '100px', height: '100px', objectFit: 'cover', border: '3px solid #6f42c1' }
            }
          )
        ),
        // Info column
        React.createElement(
          "div",
          { className: "col-md-7" },
          React.createElement("h3", { className: "mb-1" }, profile.username),
          React.createElement("p", { className: "text-muted mb-2" }, profile.bio),
          React.createElement(
            "div",
            { className: "d-flex" },
            React.createElement("div", { className: "me-3" }, 
              React.createElement("b", null, profile.followers), " Followers"
            ),
            React.createElement("div", null, 
              React.createElement("b", null, profile.following), " Following"
            )
          )
        ),
        // Action column
        React.createElement(
          "div",
          { className: "col-md-3 text-end" },
          isCurrentUser
            ? React.createElement(
                "button",
                { className: "btn btn-outline-primary", style: { borderColor: '#6f42c1', color: '#6f42c1' } },
                "Edit Profile"
              )
            : React.createElement(
                "button",
                { className: "btn btn-primary", style: { backgroundColor: '#6f42c1', borderColor: '#6f42c1' } },
                "Follow"
              )
        )
      )
    );
  };
  
  const renderEmptyVideos = () => {
    return React.createElement(
      "div",
      { className: "text-center py-5 bg-light rounded" },
      React.createElement(
        "div",
        { className: "mb-3" },
        React.createElement(
          "i",
          { 
            className: "bi bi-film",
            style: { fontSize: '48px', color: '#6f42c1' }
          }
        )
      ),
      React.createElement(
        "h5",
        null,
        isCurrentUser 
          ? "You haven't uploaded any videos yet" 
          : `${profile.username} hasn't uploaded any videos yet`
      )
    );
  };

  if (loading) {
    return renderLoading();
  }
  
  if (error) {
    return renderError();
  }

  return React.createElement(
    "div",
    { className: "profile-page" },
    React.createElement(
      "div",
      { className: "container" },
      // Profile Header
      renderProfileHeader(),
      
      // Videos Section
      React.createElement(
        "div",
        { className: "videos-section" },
        React.createElement(
          "h4",
          { className: "mb-4" },
          isCurrentUser ? "My Videos" : `${profile.username}'s Videos`
        ),
        renderEmptyVideos()
      )
    )
  );
}

export default Profile;
