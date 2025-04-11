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
    // For now, let's return mock data based on the time filter
    const last24Hours = new Date(Date.now() - 1000 * 60 * 60 * 24);
    
    // Sample videos data with timestamps
    const allVideos = [
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