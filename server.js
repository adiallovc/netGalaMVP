// Express server with PostgreSQL database integration
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Import database modules
const { db } = require('./db/index');
const storage = require('./db/storage');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    database: !!process.env.DATABASE_URL ? 'connected' : 'not connected'
  });
});

// === USER ENDPOINTS ===

// Register new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }
    
    const existingUsername = await storage.getUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({ error: 'Username is already taken' });
    }
    
    // Create new user (in a real app, you'd hash the password)
    const newUser = await storage.createUser({
      username,
      email,
      password, // Should be hashed in production
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Remove password before sending response
    const { password: _, ...safeUser } = newUser;
    
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In a real app, you'd compare hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Remove password before sending response
    const { password: _, ...safeUser } = user;
    
    res.json(safeUser);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await storage.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove password before sending response
    const { password: _, ...safeUser } = user;
    
    res.json(safeUser);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// === VIDEO ENDPOINTS ===

// Get recent videos with time filter
app.get('/api/videos', async (req, res) => {
  try {
    const timeFilter = req.query.timeFilter || 'last24hours';
    
    // In a real implementation, we would use the actual database
    // For now, let's combine mock data and uploaded videos
    const last24Hours = new Date(Date.now() - 1000 * 60 * 60 * 24);
    
    // Sample videos data with timestamps
    const sampleVideos = [
      {
        id: '1',
        title: 'Other - AI Generated Music Video',
        description: 'An AI-generated music video based on audio input',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        userId: '1',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/300?img=1',
        views: 1254,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
      },
      {
        id: '2',
        title: 'Dreamy Landscapes - Visual Experience',
        description: 'A visualization of dreamlike landscapes',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        userId: '2',
        username: 'Visual_Dreams',
        userAvatar: 'https://i.pravatar.cc/300?img=2',
        views: 892,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString() // 26 hours ago
      },
      {
        id: '3',
        title: 'Neon City - Electronic Visualization',
        description: 'A futuristic neon cityscape visualization',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
        userId: '3',
        username: 'Neon_Artist',
        userAvatar: 'https://i.pravatar.cc/300?img=3',
        views: 745,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
      },
      {
        id: '4',
        title: 'Abstract Patterns - Meditative Journey',
        description: 'Calming abstract patterns for meditation',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
        userId: '1',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/300?img=1',
        views: 1124,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
      },
      {
        id: '5',
        title: 'Nature Sounds - Visual Interpretation',
        description: 'Visual patterns generated from nature sounds',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
        userId: '2',
        username: 'Visual_Dreams',
        userAvatar: 'https://i.pravatar.cc/300?img=2',
        views: 578,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString() // 22 hours ago
      }
    ];
    
    // Get any user uploaded videos from our in-memory storage
    const uploadedVideos = global.uploadedVideos || [];
    
    // Combine sample and uploaded videos
    const allVideos = [...uploadedVideos, ...sampleVideos];
    
    // Sort videos with newest first
    allVideos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Filter videos by timestamp if using last24hours filter
    const filteredVideos = timeFilter === 'last24hours'
      ? allVideos.filter(video => new Date(video.timestamp) > last24Hours)
      : allVideos;
    
    res.json(filteredVideos);
  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: 'Failed to get videos' });
  }
});

// Get video by ID
app.get('/api/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    
    // For demo purposes, we'll first check for user-uploaded videos
    const uploadedVideos = global.uploadedVideos || [];
    let video = uploadedVideos.find(v => v.id === videoId);
    
    // If not found in uploaded videos, check sample videos
    if (!video) {
      // Sample videos data
      const sampleVideos = [
        {
          id: '1',
          title: 'Other - AI Generated Music Video',
          description: 'An AI-generated music video based on audio input',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
          userId: '1',
          username: 'Creative_AI',
          userAvatar: 'https://i.pravatar.cc/300?img=1',
          views: 1254,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
        },
        {
          id: '2',
          title: 'Dreamy Landscapes - Visual Experience',
          description: 'A visualization of dreamlike landscapes',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
          userId: '2',
          username: 'Visual_Dreams',
          userAvatar: 'https://i.pravatar.cc/300?img=2',
          views: 892,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString()
        },
        {
          id: '3',
          title: 'Neon City - Electronic Visualization',
          description: 'A futuristic neon cityscape visualization',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
          userId: '3',
          username: 'Neon_Artist',
          userAvatar: 'https://i.pravatar.cc/300?img=3',
          views: 745,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
        },
        {
          id: '4',
          title: 'Abstract Patterns - Meditative Journey',
          description: 'Calming abstract patterns for meditation',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
          userId: '1',
          username: 'Creative_AI',
          userAvatar: 'https://i.pravatar.cc/300?img=1',
          views: 1124,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
        },
        {
          id: '5',
          title: 'Nature Sounds - Visual Interpretation',
          description: 'Visual patterns generated from nature sounds',
          videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
          userId: '2',
          username: 'Visual_Dreams',
          userAvatar: 'https://i.pravatar.cc/300?img=2',
          views: 578,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString()
        }
      ];
      
      video = sampleVideos.find(v => v.id === videoId);
    }
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Increment views (in a real app, we'd save this to the database)
    video.views = (video.views || 0) + 1;
    
    res.json(video);
  } catch (error) {
    console.error(`Get video ${req.params.id} error:`, error);
    res.status(500).json({ error: 'Failed to get video' });
  }
});

// Import multer for handling file uploads
const multer = require('multer');
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Upload a new video
app.post('/api/videos/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }
    
    const { title, description } = req.body;
    const userId = req.body.userId || '1';
    const username = req.body.username || 'User_' + userId;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Generate a unique ID for the video
    const videoId = Date.now().toString();
    
    // Prepare the video data
    const videoFilePath = req.file.path;
    const videoUrl = `/api/videos/file/${videoId}`;
    
    // In a production app, we'd generate a proper thumbnail
    // For now, we'll use a placeholder
    const thumbnailUrl = 'https://i.pravatar.cc/300?img=' + (Math.floor(Math.random() * 10) + 1);
    
    // Create a new video record
    // In a production app, we'd save this to a database
    const newVideo = {
      id: videoId,
      title,
      description: description || '',
      videoUrl,
      thumbnailUrl,
      userId,
      username,
      userAvatar: 'https://i.pravatar.cc/300?img=' + userId,
      views: 0,
      timestamp: new Date().toISOString()
    };
    
    // In a production app, we'd save to the database
    // For now, we'll add to our in-memory video list for demo purposes
    global.uploadedVideos = global.uploadedVideos || [];
    global.uploadedVideos.push(newVideo);
    
    // Respond with success
    res.status(201).json({
      id: videoId,
      message: 'Video uploaded successfully',
      status: 'success',
      video: newVideo
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Serve video files
app.get('/api/videos/file/:id', (req, res) => {
  try {
    const videoId = req.params.id;
    
    // Find the video in our in-memory storage
    const uploads = global.uploadedVideos || [];
    const video = uploads.find(v => v.id === videoId);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Extract the file path from the videoUrl (in a real app, we'd look this up in a database)
    // This is a simplified demo-only approach
    
    // For this demo, we'll serve a sample video since we don't have real files
    const sampleVideoPath = path.join(__dirname, 'uploads', video.id);
    
    if (fs.existsSync(sampleVideoPath)) {
      // If we have the actual uploaded file, serve it
      res.sendFile(sampleVideoPath);
    } else {
      // Otherwise redirect to a sample video
      res.redirect('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    }
  } catch (error) {
    console.error('Video serving error:', error);
    res.status(500).json({ error: 'Failed to serve video' });
  }
});

// Generate AI video from audio and text prompt
app.post('/api/videos/generate', async (req, res) => {
  try {
    // In a production implementation, this endpoint would:
    // 1. Accept an audio file and prompt text
    // 2. Check if required API keys are present and valid
    // 3. Call the selected AI video generation API (Runway, PikaLabs, etc.)
    // 4. Process the result and store the generated video
    
    // Check for API keys (simulated for now)
    const hasRunwayKey = process.env.RUNWAY_API_KEY ? true : false;
    const hasPikaKey = process.env.PIKA_API_KEY ? true : false;
    
    if (!hasRunwayKey && !hasPikaKey) {
      return res.status(400).json({
        error: 'Missing API keys for video generation',
        apiKeyStatus: 'missing'
      });
    }
    
    // For the demo, we'll respond with a mock success message
    res.status(202).json({
      id: Math.floor(Math.random() * 10000),
      message: 'Video generation started',
      status: 'processing',
      estimatedTime: '60 seconds'
    });
  } catch (error) {
    console.error('AI video generation error:', error);
    res.status(500).json({ error: 'Failed to generate AI video' });
  }
});

// Get user's videos
app.get('/api/users/:userId/videos', async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Sample videos data
    const sampleVideos = [
      {
        id: '1',
        title: 'Other - AI Generated Music Video',
        description: 'An AI-generated music video based on audio input',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        userId: '1',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/300?img=1',
        views: 1254,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
      },
      {
        id: '4',
        title: 'Abstract Patterns - Meditative Journey',
        description: 'Calming abstract patterns for meditation',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
        userId: '1',
        username: 'Creative_AI',
        userAvatar: 'https://i.pravatar.cc/300?img=1',
        views: 1124,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString()
      }
    ];
    
    // Get the uploaded videos from our in-memory storage
    const uploadedVideos = global.uploadedVideos || [];
    
    // Combine the videos
    const allVideos = [...uploadedVideos, ...sampleVideos];
    
    // Filter videos by user ID
    const userVideos = allVideos.filter(video => video.userId === userId);
    
    // Sort videos with newest first
    userVideos.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(userVideos);
  } catch (error) {
    console.error(`Get user ${req.params.userId} videos error:`, error);
    res.status(500).json({ error: 'Failed to get user videos' });
  }
});

// Check API status for video generation
app.get('/api/api-status', async (req, res) => {
  try {
    // Import the API key utilities
    const { getApiKeyStatus } = require('./config/api-keys');
    
    // Get the API key status
    const apiKeyStatus = getApiKeyStatus();
    
    // Return the status
    res.json({
      status: apiKeyStatus.status,
      providers: apiKeyStatus.providers
    });
  } catch (error) {
    console.error('API status check error:', error);
    res.status(500).json({ error: 'Failed to check API status' });
  }
});

// This endpoint would be protected in a real production environment
// It's for admin use only, not for regular users
app.post('/api/admin/setup-api-keys', async (req, res) => {
  try {
    // In a real application, this endpoint would:
    // 1. Validate admin credentials or require admin authentication middleware
    // 2. Store API keys in a secure environment or database, not just in-memory
    
    const { runwayApiKey, pikaApiKey } = req.body;
    
    // Update the environment variables
    if (runwayApiKey) {
      process.env.RUNWAY_API_KEY = runwayApiKey;
    }
    
    if (pikaApiKey) {
      process.env.PIKA_API_KEY = pikaApiKey;
    }
    
    // Import the API key utilities
    const { getApiKeyStatus } = require('./config/api-keys');
    
    // Get the updated status
    const apiKeyStatus = getApiKeyStatus();
    
    // Return the status
    res.json({
      message: 'API keys updated successfully',
      status: apiKeyStatus.status,
      providers: apiKeyStatus.providers
    });
  } catch (error) {
    console.error('API key setup error:', error);
    res.status(500).json({ error: 'Failed to setup API keys' });
  }
});

// === STATIC FILES ===

// Serve static files from build directory
app.use(express.static('build'));

// Simple catch all route that serves index.html
app.use((req, res) => {
  // Direct path to index.html
  const indexPath = path.resolve(__dirname, 'build', 'index.html');
  
  // Check if file exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build not found. Run npm build first.');
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});