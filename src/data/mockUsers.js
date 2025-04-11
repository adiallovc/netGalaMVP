// Mock user data for development and testing

const mockUsers = {
  '1': {
    id: '1',
    username: 'Channel Creator',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Creating awesome AI-generated music videos',
    videos: [
      {
        id: 1,
        title: 'AI Music Video - Electronic',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        views: 1254,
        createdAt: new Date().toISOString(),
        userId: '1',
        username: 'Channel Creator',
        userAvatar: 'https://i.pravatar.cc/150?img=1'
      },
      {
        id: 2,
        title: 'Landscape Visualizer Demo',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        views: 892,
        createdAt: new Date().toISOString(),
        userId: '1',
        username: 'Channel Creator',
        userAvatar: 'https://i.pravatar.cc/150?img=1'
      }
    ],
    followers: 124
  },
  '2': {
    id: '2',
    username: 'Neon_Artist',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Creating stunning neon visualizations',
    videos: [
      {
        id: 3,
        title: 'Neon Dreams',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        views: 2045,
        createdAt: new Date().toISOString(),
        userId: '2',
        username: 'Neon_Artist',
        userAvatar: 'https://i.pravatar.cc/150?img=2'
      }
    ],
    followers: 247
  },
  '3': {
    id: '3',
    username: 'Creative_AI',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'AI-powered creative content',
    videos: [
      {
        id: 4,
        title: 'AI Art Exhibition',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        views: 1839,
        createdAt: new Date().toISOString(),
        userId: '3',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/150?img=3'
      },
      {
        id: 5,
        title: 'The Future of Creativity',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        views: 1257,
        createdAt: new Date().toISOString(),
        userId: '3',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/150?img=3'
      }
    ],
    followers: 352
  }
};

export default mockUsers;