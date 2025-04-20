import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateAIVideo, checkAPIKeyStatus, setupAPIKeys } from '../services/video';

function Create({ currentUser }) {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [model, setModel] = useState('runway'); // Default model
  const [style, setStyle] = useState('cinematic'); // Default style
  const [loading, setLoading] = useState(false);
  const [checkingApiStatus, setCheckingApiStatus] = useState(true);
  const [apiKeyStatus, setApiKeyStatus] = useState('unknown'); // 'unknown', 'missing', 'available'
  const [availableProviders, setAvailableProviders] = useState({});
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  
  // We'll set up the API keys in the backend as environment variables instead
  
  // Check API key status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setCheckingApiStatus(true);
        const status = await checkAPIKeyStatus();
        
        if (status.status === 'available') {
          setApiKeyStatus('available');
          setAvailableProviders(status.providers || {});
          
          // Set the model to the first available provider
          const availableProvider = Object.keys(status.providers).find(key => status.providers[key]);
          if (availableProvider) {
            setModel(availableProvider);
          }
        } else {
          setApiKeyStatus('missing');
        }
      } catch (err) {
        console.error('Failed to check API status:', err);
        setApiKeyStatus('unknown');
      } finally {
        setCheckingApiStatus(false);
      }
    };
    
    checkApiStatus();
  }, []);

  // Handle API generation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!audioFile) {
      setError('Please upload an audio file first');
      return;
    }
    
    if (!title) {
      setError('Please provide a title for your video');
      return;
    }
    
    if (!prompt || prompt.length < 10) {
      setError('Please provide a detailed description for better results (minimum 10 characters)');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for video generation
      const promptData = {
        title,
        prompt,
        model,
        style,
        userId: currentUser?.id,
        username: currentUser?.username
      };
      
      // For the demo, we'll check if we have API keys before proceeding
      // In production, this check would happen on the server
      // This is to prevent unnecessary file uploads if keys are missing
      
      // Since we're in the early implementation phase, we'll show an informative message
      // about the API integration instead of making the actual API call
      
      if (apiKeyStatus === 'missing') {
        setError('API keys for video generation are missing. Please contact support to enable this feature.');
        setLoading(false);
        return;
      }
      
      // Send the generation request
      // In a real implementation, this would call the actual API
      setTimeout(() => {
        setLoading(false);
        alert('This feature requires integration with an AI video generation API such as Runway or Pika Labs. In the final implementation, your audio will be combined with AI-generated visuals based on your description.');
        
        // For demo purposes, we'll simulate success and redirect
        navigate('/');
      }, 1500);
      
      /* This is the code that would be used in the final implementation:
      const result = await generateAIVideo(
        audioFile, 
        promptData, 
        (progress) => setGenerationProgress(progress)
      );
      
      // Handle successful generation
      alert('Video generated successfully!');
      
      // Navigate to the video page or home
      navigate(`/`);
      */
      
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate video. Please try again.');
      setLoading(false);
    }
  };
  
  const handleAudioUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.includes('audio/')) {
        setError('Please upload an audio file (MP3, WAV, etc.)');
        return;
      }
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Audio file must be less than 10MB');
        return;
      }
      
      setAudioFile(file);
      setAudioFileName(file.name);
      setError('');
    }
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
              // API Key Status Indicator
              apiKeyStatus === 'missing' && React.createElement(
                "div",
                { className: "alert alert-warning mb-4", role: "alert" },
                React.createElement("strong", null, "AI Video Generation Coming Soon: "),
                "This feature will be available once our AI video generation service is fully configured. Please check back later!"
              ),
              
              // Loading API Status Indicator
              checkingApiStatus && React.createElement(
                "div",
                { className: "alert alert-info mb-4", role: "alert" },
                "Checking API availability..."
              ),
              
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
                // Audio upload
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "audio", className: "form-label fw-bold" },
                    "Upload Audio"
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
                          htmlFor: "audio-upload",
                          className: "btn btn-outline-primary",
                          style: { borderColor: '#6f42c1', color: '#6f42c1' }
                        },
                        "Upload Audio"
                      ),
                      React.createElement(
                        "input",
                        {
                          type: "file",
                          id: "audio-upload",
                          accept: "audio/*",
                          onChange: handleAudioUpload,
                          className: "d-none"
                        }
                      )
                    ),
                    audioFileName && React.createElement(
                      "div",
                      { className: "ms-2 text-truncate", style: { maxWidth: "200px" } },
                      audioFileName
                    )
                  ),
                  React.createElement(
                    "small",
                    { className: "text-muted d-block mt-1" },
                    "Supported formats: MP3, WAV, M4A. Maximum size: 10MB"
                  )
                ),
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
                
                // Model selection
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "model", className: "form-label fw-bold" },
                    "AI Model"
                  ),
                  React.createElement(
                    "select",
                    {
                      className: "form-select",
                      id: "model",
                      value: model,
                      onChange: (e) => setModel(e.target.value)
                    },
                    React.createElement("option", { value: "runway" }, "Runway Gen-2"),
                    React.createElement("option", { value: "pika" }, "Pika Labs"),
                    React.createElement("option", { value: "stable" }, "Stable Video Diffusion")
                  ),
                  React.createElement(
                    "small",
                    { className: "text-muted" },
                    "Different models produce different visual styles and results."
                  )
                ),
                
                // Style selection
                React.createElement(
                  "div",
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { htmlFor: "style", className: "form-label fw-bold" },
                    "Visual Style"
                  ),
                  React.createElement(
                    "select",
                    {
                      className: "form-select",
                      id: "style",
                      value: style,
                      onChange: (e) => setStyle(e.target.value)
                    },
                    React.createElement("option", { value: "cinematic" }, "Cinematic"),
                    React.createElement("option", { value: "animation" }, "Animation"),
                    React.createElement("option", { value: "3d" }, "3D Render"),
                    React.createElement("option", { value: "vintage" }, "Vintage Film"),
                    React.createElement("option", { value: "abstract" }, "Abstract Visualization")
                  )
                ),
                
                // Progress indicator (if generation is in progress)
                generationProgress > 0 && React.createElement(
                  "div", 
                  { className: "mb-4" },
                  React.createElement(
                    "label",
                    { className: "form-label fw-bold" },
                    "Generation Progress"
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
                          width: `${generationProgress}%`,
                          backgroundColor: '#6f42c1'
                        },
                        "aria-valuenow": generationProgress,
                        "aria-valuemin": "0",
                        "aria-valuemax": "100"
                      },
                      `${generationProgress}%`
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
                      disabled: loading || apiKeyStatus === 'missing' || checkingApiStatus,
                      style: { backgroundColor: '#6f42c1', borderColor: '#6f42c1' }
                    },
                    loading ? "Generating..." : checkingApiStatus ? "Checking API Status..." : apiKeyStatus === 'missing' ? "API Keys Required" : "Generate Video"
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
