import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { generateVideo, uploadGeneratedVideo } from '../services/videoService';

function Create() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Video generation functionality will be implemented in the next phase');
    // Redirect to home for now
    navigate('/');
  };

  // Create the page structure using React.createElement
  return React.createElement(
    "div",
    { className: "create-page py-4" },
    React.createElement(
      "div",
      { className: "container" },
      React.createElement(
        "div",
        { className: "row justify-content-center" },
        React.createElement(
          "div",
          { className: "col-md-8" },
          // Main card
          React.createElement(
            "div",
            { className: "card shadow-sm" },
            // Card header
            React.createElement(
              "div",
              { className: "card-header bg-white py-3" },
              React.createElement("h4", { className: "mb-0" }, "Create AI-Generated Video"),
              React.createElement("p", { className: "text-muted mb-0" }, "Turn your audio into video with AI")
            ),
            // Card body
            React.createElement(
              "div",
              { className: "card-body p-4" },
              // Error message
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
                    "Video Title"
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
                // Prompt field
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "prompt", className: "form-label fw-bold" },
                    "Video Description"
                  ),
                  React.createElement(
                    "textarea",
                    {
                      className: "form-control",
                      id: "prompt",
                      rows: "4",
                      placeholder: "Describe what you want the video to show, e.g., 'A peaceful mountain landscape with flowing river and sunset'",
                      value: prompt,
                      onChange: (e) => setPrompt(e.target.value),
                      required: true
                    }
                  ),
                  React.createElement(
                    "small",
                    { className: "text-muted" },
                    "Be descriptive for better results. The AI will generate visuals based on your description."
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
                    loading ? "Generating..." : "Generate Video"
                  )
                )
              )
            )
          ),
          // How it works card
          React.createElement(
            "div",
            { className: "card mt-4 shadow-sm" },
            React.createElement(
              "div",
              { className: "card-body p-4" },
              React.createElement("h5", { className: "mb-3" }, "How It Works"),
              React.createElement(
                "ol",
                { className: "mb-0" },
                React.createElement("li", { className: "mb-2" }, "Upload your audio file (music, voice, or sounds)"),
                React.createElement("li", { className: "mb-2" }, "Describe what you want the video to look like"),
                React.createElement("li", { className: "mb-2" }, "Our AI generates a video matching your description"),
                React.createElement("li", null, "Save the result to your profile")
              )
            )
          )
        )
      )
    )
  );
}

export default Create;
