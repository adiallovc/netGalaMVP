/**
 * API Key configuration for video generation services
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Obtain API keys from:
 *    - Runway: https://runwayml.com/api
 *    - FastPix: [Obtain FastPix API key instructions here]
 * 
 * 2. Set the API keys as environment variables in a .env file:
 *    RUNWAY_API_KEY=your_runway_api_key
 *    FASTPIX_API_KEY=your_fastpix_api_key
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
  const hasFastPixKey = hasApiKey('FASTPIX_API_KEY');

  if (hasRunwayKey || hasFastPixKey) {
    return {
      status: 'available',
      providers: {
        runway: hasRunwayKey,
        fastpix: hasFastPixKey
      }
    };
  } else {
    return {
      status: 'missing',
      providers: {
        runway: false,
        fastpix: false
      }
    };
  }
};

// Get a specific API key
const getApiKey = (provider) => {
  switch (provider.toLowerCase()) {
    case 'runway':
      return process.env.RUNWAY_API_KEY;
    case 'fastpix':
      return process.env.FASTPIX_API_KEY;
    default:
      return null;
  }
};

module.exports = {
  hasApiKey,
  getApiKeyStatus,
  getApiKey
};