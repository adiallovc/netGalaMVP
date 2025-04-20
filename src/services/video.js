import axios from 'axios';

// Get all videos (with optional time filter)
export const getVideos = async (timeFilter = 'all') => {
  try {
    const response = await axios.get(`/api/videos?timeFilter=${timeFilter}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Get a specific video by ID
export const getVideoById = async (videoId) => {
  try {
    const response = await axios.get(`/api/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video ${videoId}:`, error);
    throw error;
  }
};

// Get videos by user ID
export const getVideosByUserId = async (userId) => {
  try {
    const response = await axios.get(`/api/users/${userId}/videos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for user ${userId}:`, error);
    throw error;
  }
};

// Upload a video file
export const uploadVideo = async (videoFile, metadata, onProgress) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('title', metadata.title);
    
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    
    // Add any additional metadata
    if (metadata.tags) {
      formData.append('tags', JSON.stringify(metadata.tags));
    }
    
    // Configuration for progress tracking
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress && typeof onProgress === 'function') {
          onProgress(percentCompleted);
        }
      }
    };
    
    // Make the API request
    const response = await axios.post('/api/videos/upload', formData, config);
    return response.data;
    
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Generate AI video from audio and text prompt
export const generateAIVideo = async (audioFile, promptData, onProgress) => {
  try {
    // Create form data
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('title', promptData.title);
    formData.append('prompt', promptData.prompt);
    formData.append('model', promptData.model || 'runway');
    
    if (promptData.style) {
      formData.append('style', promptData.style);
    }
    
    // Add any additional metadata
    if (promptData.userId) {
      formData.append('userId', promptData.userId);
    }
    
    if (promptData.username) {
      formData.append('username', promptData.username);
    }
    
    // Configuration for progress tracking
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // For the upload phase, we'll track progress from 0-50%
        const percentCompleted = Math.round((progressEvent.loaded * 50) / progressEvent.total);
        if (onProgress && typeof onProgress === 'function') {
          onProgress(percentCompleted);
        }
      }
    };
    
    // Make the API request to start generation
    const response = await axios.post('/api/videos/generate', formData, config);
    
    // For the processing phase, we could poll for status or use WebSockets for real-time updates
    // For now, we'll simulate progress from 50-100%
    if (onProgress && typeof onProgress === 'function') {
      // Start at 50% (upload complete)
      let progress = 50;
      
      // Simulate progress updates during processing
      const interval = setInterval(() => {
        progress += 5;
        onProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 1000);
    }
    
    return response.data;
    
  } catch (error) {
    console.error('Error generating AI video:', error);
    throw error;
  }
};

// Check if API keys are available for AI video generation
export const checkAPIKeyStatus = async () => {
  try {
    const response = await axios.get('/api/api-status');
    return response.data;
  } catch (error) {
    console.error('Error checking API status:', error);
    return { status: 'error', message: error.message };
  }
};

// Set up API keys for video generation
export const setupAPIKeys = async (keys) => {
  try {
    const response = await axios.post('/api/setup-api-keys', keys);
    return response.data;
  } catch (error) {
    console.error('Error setting up API keys:', error);
    throw error;
  }
};