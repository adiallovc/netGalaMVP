// AI Video Generation Service
// This service integrates different AI video generation APIs (Runway, Pika, etc.)

const runway = require('./runway');
const pika = require('./pika');
const { getApiKeyStatus } = require('../../config/api-keys');

// Get the available AI video generation APIs
function getAvailableProviders() {
  const keyStatus = getApiKeyStatus();
  return keyStatus.providers;
}

// Generate video from audio using the selected AI provider
async function generateVideo(audioFilePath, options) {
  try {
    // Validate input
    if (!audioFilePath) {
      throw new Error('Audio file path is required');
    }
    
    if (!options || !options.prompt) {
      throw new Error('Prompt is required');
    }
    
    // Check which provider to use
    let provider = options.model || 'runway';
    const prompt = options.prompt;
    
    // Get the available providers
    const providers = getAvailableProviders();
    
    // Check if the selected provider is available
    if (!providers[provider]) {
      // Try to use any available provider
      const availableProvider = Object.keys(providers).find(key => providers[key]);
      
      if (!availableProvider) {
        throw new Error('No AI video generation provider available');
      }
      
      console.log(`Selected provider ${provider} not available. Using ${availableProvider} instead.`);
      
      // Update the provider
      provider = availableProvider;
    }
    
    // Generate video with the selected provider
    let result;
    
    switch (provider) {
      case 'runway':
        result = await runway.generateVideoFromAudio(audioFilePath, prompt, options);
        break;
      case 'fastpix':
        result = await pika.generateVideoFromAudio(audioFilePath, prompt, options);
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
    
    return {
      ...result,
      provider
    };
    
  } catch (error) {
    console.error('Video generation error:', error);
    throw new Error(`Failed to generate video: ${error.message}`);
  }
}

// Check the API key status
function checkApiKeyStatus() {
  return getApiKeyStatus();
}

module.exports = {
  generateVideo,
  getAvailableProviders,
  checkApiKeyStatus
};