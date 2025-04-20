// API Key configuration for video generation services

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