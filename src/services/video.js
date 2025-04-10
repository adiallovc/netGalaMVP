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
export async function uploadVideo(videoData, onProgress) {
  try {
    // In a real app, this would handle file uploads with FormData
    // For now, just simulate an API call
    const response = await axios.post(`${API_URL}/videos`, videoData, {
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
    throw new Error('Failed to upload video');
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