// FastPix API Client for generating videos from audio

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { getApiKey } = require('../../config/api-keys');

// FastPix API Base URL
const FASTPIX_API_URL = 'https://api.fastpix.io/v1';

// Generate video from audio using FastPix API
async function generateVideoFromAudio(audioFilePath, prompt, options = {}) {
  try {
    const apiKey = getApiKey('fastpix');

    if (!apiKey) {
      throw new Error('FastPix API key is required');
    }

    if (!fs.existsSync(audioFilePath)) {
      throw new Error('Audio file not found');
    }

    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Valid prompt text is required');
    }

    // Read the audio file
    const audioData = fs.readFileSync(audioFilePath);
    const audioBuffer = Buffer.from(audioData);

    // Create form data for FastPix API
    const formData = new FormData();
    formData.append('audio', audioBuffer, {
      filename: path.basename(audioFilePath),
      contentType: 'audio/mpeg'
    });
    formData.append('prompt', prompt);
    formData.append('loop_video', 'true');

    if (options.style) {
      formData.append('style', options.style);
    }

    // Make the API request
    const response = await axios.post(`${FASTPIX_API_URL}/generate`, formData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      status: response.data.status,
      videoUrl: response.data.video_url,
      thumbnailUrl: response.data.thumbnail_url,
      duration: response.data.duration
    };

  } catch (error) {
    console.error('FastPix API error:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

module.exports = {
  generateVideoFromAudio
};