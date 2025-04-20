import axios from 'axios';

// Base API URL
const API_URL = '/api';

// Get videos with time filter
export async function getVideos(timeFilter = 'last24hours') {
  try {
    const response = await axios.get(`${API_URL}/videos`, {
      params: { timeFilter }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error('Failed to load videos');
  }
}

// Upload a new video
export async function uploadVideo(videoData, videoFile, onProgress) {
  try {
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add video file
    formData.append('videoFile', videoFile);
    
    // Add other video metadata as JSON
    Object.keys(videoData).forEach(key => {
      formData.append(key, videoData[key]);
    });
    
    // Send the upload request
    const response = await axios.post(`${API_URL}/videos/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw new Error(error.response?.data?.error || 'Failed to upload video');
  }
}

// Get video by ID
export async function getVideoById(id) {
  try {
    const response = await axios.get(`${API_URL}/videos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching video with ID ${id}:`, error);
    throw new Error('Failed to load video');
  }
}

// Get videos by user ID
export async function getVideosByUserId(userId) {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/videos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching videos for user ${userId}:`, error);
    throw new Error('Failed to load user videos');
  }
}

// Generate AI video from audio and text prompt
export async function generateAIVideo(audioFile, promptData, onProgress) {
  try {
    // Create FormData to handle file uploads
    const formData = new FormData();
    
    // Add audio file
    formData.append('audioFile', audioFile);
    
    // Add other data as JSON
    Object.keys(promptData).forEach(key => {
      formData.append(key, promptData[key]);
    });
    
    // Call the API endpoint to start video generation
    const response = await axios.post(`${API_URL}/videos/generate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          // This only tracks upload progress, not generation
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error generating AI video:', error);
    throw new Error(error.response?.data?.error || 'Failed to generate video');
  }
}