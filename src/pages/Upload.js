import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadVideo } from '../services/video';

function Upload({ currentUser }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [videoFileName, setVideoFileName] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailFileName, setThumbnailFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle video file selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('video/')) {
        setError('Please upload a video file (MP4, MOV, etc.)');
        return;
      }
      
      // Check file size (limit to 500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError('Video file must be less than 500MB');
        return;
      }
      
      setVideoFile(file);
      setVideoFileName(file.name);
      setError('');
    }
  };
  
  // Handle thumbnail image selection
  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('image/')) {
        setError('Please upload an image file for the thumbnail (JPG, PNG, etc.)');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Thumbnail image must be less than 5MB');
        return;
      }
      
      setThumbnailFile(file);
      setThumbnailFileName(file.name);
      setError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!title) {
      setError('Please enter a title for your video');
      return;
    }
    
    if (!videoFile) {
      setError('Please select a video file to upload');
      return;
    }
    
    if (!category) {
      setError('Please select a category for your video');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare video data
      const videoData = {
        title,
        description,
        category,
        userId: currentUser?.id,
        username: currentUser?.username
      };
      
      // Upload the video
      const result = await uploadVideo(
        videoData, 
        videoFile, 
        (progress) => setUploadProgress(progress)
      );
      
      // Show success message
      alert('Video uploaded successfully!');
      
      // Navigate to the video page or home
      navigate(`/`);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Simple upload form with basic fields using React.createElement
  return React.createElement(
    "div",
    { className: "upload-page py-4" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row justify-content-center" },
        React.createElement(
          "div",
          { className: "col-md-8" },
          React.createElement(
            "div",
            { className: "card shadow-sm" },
            // Card header
            React.createElement(
              "div",
              { className: "card-header bg-white py-3" },
              React.createElement(
                "h4",
                { className: "mb-0" },
                "Upload a New Video"
              )
            ),
            // Card body
            React.createElement(
              "div",
              { className: "card-body p-4" },
              // Error alert
              error && React.createElement(
                "div",
                { className: "alert alert-danger", role: "alert" },
                error
              ),
              // Form
              React.createElement(
                "form",
                { onSubmit: handleSubmit },
                // Title field
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "title", className: "form-label fw-bold" },
                    "Title"
                  ),
                  React.createElement(
                    "input",
                    {
                      type: "text",
                      className: "form-control",
                      id: "title",
                      value: title,
                      onChange: (e) => setTitle(e.target.value),
                      required: true
                    }
                  )
                ),
                // Description field
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "description", className: "form-label fw-bold" },
                    "Description (Optional)"
                  ),
                  React.createElement(
                    "textarea",
                    {
                      className: "form-control",
                      id: "description",
                      rows: "3",
                      value: description,
                      onChange: (e) => setDescription(e.target.value)
                    }
                  )
                ),
                // Video file upload
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "video-file", className: "form-label fw-bold" },
                    "Video File"
                  ),
                  React.createElement(
                    "div",
                    { className: "d-flex align-items-center" },
                    React.createElement(
                      "div",
                      { className: "d-grid flex-grow-1 me-2" },
                      React.createElement(
                        "label",
                        { 
                          htmlFor: "video-upload",
                          className: "btn btn-outline-primary",
                          style: { borderColor: '#6f42c1', color: '#6f42c1' }
                        },
                        "Select Video"
                      ),
                      React.createElement(
                        "input",
                        {
                          type: "file",
                          id: "video-upload",
                          accept: "video/*",
                          onChange: handleVideoSelect,
                          className: "d-none"
                        }
                      )
                    ),
                    videoFileName && React.createElement(
                      "div",
                      { className: "ms-2 text-truncate", style: { maxWidth: "300px" } },
                      videoFileName
                    )
                  ),
                  React.createElement(
                    "small",
                    { className: "text-muted d-block mt-1" },
                    "Supported formats: MP4, MOV, AVI. Maximum size: 500MB"
                  )
                ),
                
                // Thumbnail upload (optional)
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "thumbnail", className: "form-label fw-bold" },
                    "Thumbnail Image (Optional)"
                  ),
                  React.createElement(
                    "div",
                    { className: "d-flex align-items-center" },
                    React.createElement(
                      "div",
                      { className: "d-grid flex-grow-1 me-2" },
                      React.createElement(
                        "label",
                        { 
                          htmlFor: "thumbnail-upload",
                          className: "btn btn-outline-primary",
                          style: { borderColor: '#6f42c1', color: '#6f42c1' }
                        },
                        "Select Thumbnail"
                      ),
                      React.createElement(
                        "input",
                        {
                          type: "file",
                          id: "thumbnail-upload",
                          accept: "image/*",
                          onChange: handleThumbnailSelect,
                          className: "d-none"
                        }
                      )
                    ),
                    thumbnailFileName && React.createElement(
                      "div",
                      { className: "ms-2 text-truncate", style: { maxWidth: "300px" } },
                      thumbnailFileName
                    )
                  ),
                  React.createElement(
                    "small",
                    { className: "text-muted d-block mt-1" },
                    "Supported formats: JPG, PNG. Maximum size: 5MB"
                  )
                ),
                
                // Category field
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "category", className: "form-label fw-bold" },
                    "Category"
                  ),
                  React.createElement(
                    "select",
                    {
                      className: "form-select",
                      id: "category",
                      value: category,
                      onChange: (e) => setCategory(e.target.value)
                    },
                    React.createElement("option", { value: "" }, "Select a category"),
                    React.createElement("option", { value: "other" }, "Other"),
                    React.createElement("option", { value: "music" }, "Music"),
                    React.createElement("option", { value: "gaming" }, "Gaming"),
                    React.createElement("option", { value: "education" }, "Education"),
                    React.createElement("option", { value: "entertainment" }, "Entertainment")
                  )
                ),
                
                // Upload progress
                uploadProgress > 0 && React.createElement(
                  "div", 
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { className: "form-label fw-bold" },
                    "Upload Progress"
                  ),
                  React.createElement(
                    "div",
                    { className: "progress" },
                    React.createElement(
                      "div",
                      { 
                        className: "progress-bar",
                        role: "progressbar",
                        style: { 
                          width: `${uploadProgress}%`,
                          backgroundColor: '#6f42c1'
                        },
                        "aria-valuenow": uploadProgress,
                        "aria-valuemin": "0",
                        "aria-valuemax": "100"
                      },
                      `${uploadProgress}%`
                    )
                  )
                ),
                // Submit button
                React.createElement(
                  "div",
                  { className: "d-grid gap-2" },
                  React.createElement(
                    "button",
                    {
                      type: "submit",
                      className: "btn btn-primary py-2",
                      disabled: loading,
                      style: { backgroundColor: '#6f42c1', borderColor: '#6f42c1' }
                    },
                    loading
                      ? "Uploading..."
                      : "Upload Video"
                  )
                )
              )
            )
          )
        )
      )
    )
  );
}

export default Upload;
