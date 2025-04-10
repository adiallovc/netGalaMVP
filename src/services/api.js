import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Categories
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return mock data for development purposes
    return [
      { id: 'time-capsule', name: 'Time Capsule [All Time Uploads]' },
      { id: 'trending', name: 'Trending' },
      { id: 'music', name: 'Music' },
      { id: 'gaming', name: 'Gaming' },
      { id: 'education', name: 'Education' }
    ];
  }
};

// User profile
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Follow/unfollow
export const followUser = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const response = await api.delete(`/users/${userId}/follow`);
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

// Search
export const searchVideos = async (query) => {
  try {
    const response = await api.get(`/videos/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error('Error searching videos:', error);
    throw error;
  }
};

// Likes/Comments
export const likeVideo = async (videoId) => {
  try {
    const response = await api.post(`/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error liking video:', error);
    throw error;
  }
};

export const unlikeVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}/like`);
    return response.data;
  } catch (error) {
    console.error('Error unliking video:', error);
    throw error;
  }
};

export const getComments = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (videoId, content) => {
  try {
    const response = await api.post(`/videos/${videoId}/comments`, { content });
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export default api;
