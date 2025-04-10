import api from './api';

export const getVideos = async (categoryId, filter = 'recent') => {
  try {
    let endpoint = '/videos';
    
    if (categoryId) {
      endpoint += `?category=${categoryId}`;
      if (filter) {
        endpoint += `&filter=${filter}`;
      }
    } else if (filter) {
      endpoint += `?filter=${filter}`;
    }
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    
    // Return mock data for development
    return [
      {
        id: '1',
        title: 'Mountain Sunrise Time Lapse',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360.png?text=Mountain+Sunrise',
        userId: '101',
        username: 'naturelover',
        userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        views: 1245,
        likes: 89,
        comments: 12,
        createdAt: '2023-06-15T10:30:45Z',
        duration: '0:30'
      },
      {
        id: '2',
        title: 'Urban Street Life',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360.png?text=Urban+Street',
        userId: '102',
        username: 'cityexplorer',
        userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        views: 892,
        likes: 56,
        comments: 8,
        createdAt: '2023-06-14T15:22:18Z',
        duration: '1:15'
      },
      {
        id: '3',
        title: 'Digital Art Creation Process',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360.png?text=Digital+Art',
        userId: '103',
        username: 'artcreator',
        userAvatar: 'https://randomuser.me/api/portraits/women/22.jpg',
        views: 3422,
        likes: 212,
        comments: 45,
        createdAt: '2023-06-10T09:15:30Z',
        duration: '5:30'
      }
    ];
  }
};

export const getUserVideos = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user videos:', error);
    
    // Return mock data for development
    return [
      {
        id: '5',
        title: 'My First Vlog',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360.png?text=My+First+Vlog',
        views: 342,
        likes: 28,
        comments: 5,
        createdAt: '2023-05-22T14:30:00Z',
        duration: '3:45'
      },
      {
        id: '6',
        title: 'Weekend Adventure',
        videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        thumbnailUrl: 'https://via.placeholder.com/640x360.png?text=Weekend+Adventure',
        views: 185,
        likes: 15,
        comments: 3,
        createdAt: '2023-05-15T10:12:30Z',
        duration: '2:18'
      }
    ];
  }
};

export const getVideoById = async (videoId) => {
  try {
    const response = await api.get(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error;
  }
};

export const uploadVideo = async (formData) => {
  try {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

export const deleteVideo = async (videoId) => {
  try {
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};

export const generateVideo = async (formData) => {
  try {
    const response = await api.post('/videos/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating video:', error);
    throw error;
  }
};

export const uploadGeneratedVideo = async (videoData) => {
  try {
    const response = await api.post('/videos/save-generated', videoData);
    return response.data;
  } catch (error) {
    console.error('Error saving generated video:', error);
    throw error;
  }
};
