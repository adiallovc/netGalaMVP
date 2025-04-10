import axios from 'axios';

// Base API URL
const API_URL = '/api';

// Register a new user
export async function register(userData) {
  try {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw new Error('Network error during registration');
  }
}

// Login a user
export async function login(credentials) {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.error || 'Login failed');
    }
    throw new Error('Network error during login');
  }
}

// Get current user
export async function getCurrentUser(userId) {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw new Error('Failed to get user profile');
  }
}

// Logout (client-side only)
export function logout() {
  // In a real app, this might call an API endpoint, invalidate tokens, etc.
  // For now, we're just doing client-side logout
  return Promise.resolve();
}