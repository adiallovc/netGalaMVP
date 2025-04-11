import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function EditProfile({ currentUser, setCurrentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    avatar: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  
  useEffect(() => {
    // In a real app, fetch the user's current data
    setLoading(true);
    
    // Use passed currentUser first, fall back to localStorage only if needed
    if (currentUser && currentUser.id) {
      setUser(currentUser);
      setFormData({
        username: currentUser.username || '',
        bio: currentUser.bio || '',
        avatar: currentUser.avatar || ''
      });
      setPreviewImage(currentUser.avatar || '');
      setLoading(false);
    } else {
      // Try to get user from localStorage as fallback
      try {
        const storedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        if (storedUser && storedUser.id) {
          setUser(storedUser);
          setFormData({
            username: storedUser.username || '',
            bio: storedUser.bio || '',
            avatar: storedUser.avatar || ''
          });
          setPreviewImage(storedUser.avatar || '');
        } else {
          console.error('No user found in local storage');
          // Redirect to login if no user found
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error retrieving user from localStorage:', error);
      }
      
      setLoading(false);
    }
  }, [userId, currentUser, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);
    
    // Create a preview of the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
      // Also update the avatar in formData
      setFormData(prev => ({
        ...prev,
        avatar: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would upload the file to a server
    // and then update the user profile with the URL
    try {
      // If we have a file selected, use the preview image data URL
      // Otherwise use the existing avatar URL
      const avatarUrl = selectedFile ? previewImage : formData.avatar;
      
      const updatedUser = {
        ...user,
        username: formData.username,
        bio: formData.bio,
        avatar: avatarUrl
      };
      
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update component state
      setUser(updatedUser);
      
      // Update parent component state if setCurrentUser is passed
      if (setCurrentUser) {
        setCurrentUser(updatedUser);
      }
      
      // Show success message
      alert('Profile updated successfully!');
      
      // Navigate back to the user's channel page
      navigate(`/channel/${user.id}`);
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
                  src: previewImage || formData.avatar,
                  alt: formData.username,
                  className: "rounded-circle mb-3",
                  style: { width: '120px', height: '120px', objectFit: 'cover' }
                }
              ),
              React.createElement(
                "div",
                { className: "d-flex justify-content-center" },
                React.createElement(
                  "label",
                  { 
                    htmlFor: "photo-upload",
                    className: "btn btn-outline-primary",
                    style: { 
                      backgroundColor: "transparent",
                      color: "#6f42c1",
                      borderColor: "#6f42c1",
                      cursor: "pointer"
                    }
                  },
                  "Upload New Photo"
                ),
                React.createElement(
                  "input",
                  {
                    type: "file",
                    id: "photo-upload",
                    accept: "image/*",
                    onChange: handleFileChange,
                    style: { display: "none" }
                  }
                )
              )
            ),
            // Avatar URL field (as fallback option)
            React.createElement(
              "div",
              { className: "mb-3" },
              React.createElement(
                "label",
                { htmlFor: "avatar", className: "form-label" },
                "Or use Profile Picture URL"
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
                "Enter a URL to an image (https://...) if you prefer to use a URL instead of uploading."
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