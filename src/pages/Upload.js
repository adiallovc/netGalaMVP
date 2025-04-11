import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { uploadVideo } from '../services/videoService';

function Upload() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Upload functionality is coming in the next development phase. The MVP is focused on AI-generated videos. Please use the Create page to generate videos from your audio.');
    // Redirect to home for now
    navigate('/');
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
