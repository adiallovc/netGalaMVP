/**
 * API Key configuration for video generation services
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Obtain API keys from:
 *    - Runway: https://runwayml.com/api
 *    - Pika Labs: https://pika.art/api
 * 
 * 2. Set the API keys as environment variables in a .env file:
 *    RUNWAY_API_KEY=your_runway_api_key
 *    PIKA_API_KEY=your_pika_api_key
 * 
 * 3. For production deployments, set these as secure environment variables
 *    in your hosting provider's dashboard.
 * 
 * NOTE: These keys should be kept confidential and should NEVER be exposed to end users.
 */

// Check if an API key exists in environment variables
const hasApiKey = (keyName) => {
  return process.env[keyName] ? true : false;
};

// Get API key status
const getApiKeyStatus = () => {
  const hasRunwayKey = hasApiKey('RUNWAY_API_KEY');
  const hasPikaKey = hasApiKey('PIKA_API_KEY');
  
  if (hasRunwayKey || hasPikaKey) {
    return {
      status: 'available',
      providers: {
        runway: hasRunwayKey,
        pika: hasPikaKey
      }
    };
  } else {
    return {
      status: 'missing',
      providers: {
        runway: false,
        pika: false
      }
    };
  }
};

// Get a specific API key
const getApiKey = (provider) => {
  switch (provider.toLowerCase()) {
    case 'runway':
      return process.env.RUNWAY_API_KEY;
    case 'pika':
      return process.env.PIKA_API_KEY;
    default:
      return null;
  }
};

module.exports = {
  hasApiKey,
  getApiKeyStatus,
  getApiKey
};