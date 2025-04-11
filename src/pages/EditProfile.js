import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EditProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });
  
  useEffect(() => {
    // In a real app, fetch the user's current data
    setLoading(true);
    
    // Try to get user from localStorage
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      
      if (currentUser && currentUser.id) {
        setUser(currentUser);
        setFormData({
          username: currentUser.username || '',
          bio: currentUser.bio || '',
          avatar: currentUser.avatar || ''
        });
      } else {
        console.error('No user found in local storage');
      }
    } catch (error) {
      console.error('Error retrieving user from localStorage:', error);
    }
    
    setLoading(false);
  }, [userId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would send the update to an API
    // For now, just update the user in localStorage
    try {
      const updatedUser = {
        ...user,
        username: formData.username,
        bio: formData.bio,
        avatar: formData.avatar
      };
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
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
        "You need to be logged in to edit your profile.",
        React.createElement(
          Link,
          { to: "/auth", className: "ms-2" },
          "Log in"
        )
      )
    );
  }
  
  return React.createElement(
    "div",
    { className: "edit-profile-page py-4" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row" },
        React.createElement(
          "div",
          { className: "col-md-8 mx-auto" },
          React.createElement(
            "h2",
            { className: "mb-4" },
            "Edit Profile"
          ),
          React.createElement(
            "form",
            { onSubmit: handleSubmit },
            // Current avatar preview
            React.createElement(
              "div",
              { className: "mb-4 text-center" },
              React.createElement(
                "img",
                {
                  src: formData.avatar,
                  alt: formData.username,
                  className: "rounded-circle",
                  style: { width: '120px', height: '120px', objectFit: 'cover' }
                }
              )
            ),
            // Avatar URL field
            React.createElement(
              "div",
              { className: "mb-3" },
              React.createElement(
                "label",
                { htmlFor: "avatar", className: "form-label" },
                "Profile Picture URL"
              ),
              React.createElement(
                "input",
                {
                  type: "text",
                  className: "form-control",
                  id: "avatar",
                  name: "avatar",
                  value: formData.avatar,
                  onChange: handleChange,
                  placeholder: "Enter image URL"
                }
              ),
              React.createElement(
                "div",
                { className: "form-text" },
                "Enter a URL to an image (https://...). For testing, try using ",
                React.createElement(
                  "code",
                  null,
                  "https://i.pravatar.cc/150?img=X"
                ),
                " where X is a number 1-70."
              )
            ),
            // Username field
            React.createElement(
              "div",
              { className: "mb-3" },
              React.createElement(
                "label",
                { htmlFor: "username", className: "form-label" },
                "Username"
              ),
              React.createElement(
                "input",
                {
                  type: "text",
                  className: "form-control",
                  id: "username",
                  name: "username",
                  value: formData.username,
                  onChange: handleChange,
                  required: true
                }
              )
            ),
            // Bio field
            React.createElement(
              "div",
              { className: "mb-3" },
              React.createElement(
                "label",
                { htmlFor: "bio", className: "form-label" },
                "Bio"
              ),
              React.createElement(
                "textarea",
                {
                  className: "form-control",
                  id: "bio",
                  name: "bio",
                  value: formData.bio || '',
                  onChange: handleChange,
                  rows: 3,
                  placeholder: "Tell us about yourself"
                }
              )
            ),
            // Submit button
            React.createElement(
              "div",
              { className: "d-flex justify-content-between mt-4" },
              React.createElement(
                Link,
                { to: `/channel/${user.id}`, className: "btn btn-outline-secondary" },
                "Cancel"
              ),
              React.createElement(
                "button",
                { 
                  type: "submit", 
                  className: "btn btn-primary",
                  style: { backgroundColor: "#6f42c1", borderColor: "#6f42c1" }
                },
                "Save Changes"
              )
            )
          )
        )
      )
    )
  );
}

export default EditProfile;