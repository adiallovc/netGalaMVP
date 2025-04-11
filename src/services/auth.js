import axios from 'axios';

// Base API URL
const API_URL = '/api';

// Register a new user
export async function register(userData) {
  try {
    // For the demo, simulate a successful registration
    // In a real app, this would be an API call
    const mockUser = {
      id: 'user' + Math.floor(Math.random() * 1000),
      username: userData.username,
      email: userData.email,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    return mockUser;
  } catch (error) {
    throw new Error('Registration failed: ' + (error.message || 'Unknown error'));
  }
}

// Login a user
export async function login(credentials) {
  try {
    // For the demo, simulate a successful login
    // In a real app, this would verify credentials with an API
    const mockUser = {
      id: 'user1', // Fixed ID for demo login
      username: credentials.email.split('@')[0], // Use part of email as username
      email: credentials.email,
      avatar: 'https://i.pravatar.cc/150?img=1'
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    
    return mockUser;
  } catch (error) {
    throw new Error('Login failed: ' + (error.message || 'Invalid credentials'));
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
  // Clear the user from localStorage
  localStorage.removeItem('currentUser');
  
  // In a real app, this would also call an API endpoint to invalidate tokens
  return Promise.resolve();
}