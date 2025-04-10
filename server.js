// Simple Express server to serve the React app
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON requests
app.use(express.json());

// API endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Simple API endpoint for videos
app.get('/api/videos', (req, res) => {
  res.json([
    {
      id: '1',
      title: 'Sample Video 1',
      description: 'A demo video for our platform'
    },
    {
      id: '2',
      title: 'Sample Video 2',
      description: 'Another demo video for testing'
    }
  ]);
});

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