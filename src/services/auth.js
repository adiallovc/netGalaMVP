import api from './api';

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Registration failed. Please try again.');
    }
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Save token to localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Login failed. Please check your credentials and try again.');
    }
  }
};

export const logout = async () => {
  try {
    // Call logout endpoint if available
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Remove token regardless of API call result
    localStorage.removeItem('token');
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return null;
    }
    
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get current user error:', error);
    // If unauthorized, clear the token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return null;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Failed to update profile. Please try again.');
    }
  }
};
