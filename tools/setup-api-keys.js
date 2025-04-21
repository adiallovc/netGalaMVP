/**
 * API Key Setup Tool
 * 
 * This is an admin-only tool to configure API keys for the video generation services.
 * Run this tool from the command line to set up your API keys securely.
 * 
 * Usage:
 *   node tools/setup-api-keys.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Path to the .env file
const envPath = path.resolve(__dirname, '..', '.env');

// Check if .env file exists
const envExists = fs.existsSync(envPath);

// Read existing .env file if it exists
let existingEnv = '';
if (envExists) {
  existingEnv = fs.readFileSync(envPath, 'utf8');
}

// Helper to get existing value
function getExistingValue(key) {
  const regex = new RegExp(`^${key}=(.*)$`, 'm');
  const match = existingEnv.match(regex);
  return match ? match[1] : '';
}

// Welcome message
console.log('🎬 netGala API Key Setup Tool 🎬');
console.log('==============================');
console.log('This tool will help you configure API keys for video generation services.');
console.log('These keys are required for the AI video generation feature to work.');
console.log('\nImportant: Keep your API keys confidential and never share them with users.\n');

// Get Runway API Key
const runwayKey = getExistingValue('RUNWAY_API_KEY');
rl.question(`Runway API Key ${runwayKey ? `(current: ${runwayKey.slice(0, 4)}...)` : ''}: `, (runwayApiKey) => {
  // Get FastPix API Key
  const fastpixKey = getExistingValue('FASTPIX_API_KEY');
  rl.question(`FastPix API Key ${fastpixKey ? `(current: ${fastpixKey.slice(0, 4)}...)` : ''}: `, (fastpixApiKey) => {
    rl.close();
    
    // Use existing values if none provided
    const finalRunwayKey = runwayApiKey || runwayKey;
    const finalFastpixKey = fastpixApiKey || fastpixKey;
    
    // Build the .env content
    let envContent = '';
    
    // Keep existing env content but remove the keys we're setting
    if (existingEnv) {
      envContent = existingEnv
        .replace(/^RUNWAY_API_KEY=.*$/m, '')
        .replace(/^FASTPIX_API_KEY=.*$/m, '')
        .replace(/^PIKA_API_KEY=.*$/m, '') // Also remove legacy Pika keys if they exist
        .replace(/\n\n+/g, '\n'); // Remove extra newlines
    }
    
    // Add the API keys
    envContent += `\n# Added by API key setup tool\n`;
    
    if (finalRunwayKey) {
      envContent += `RUNWAY_API_KEY=${finalRunwayKey}\n`;
    }
    
    if (finalFastpixKey) {
      envContent += `FASTPIX_API_KEY=${finalFastpixKey}\n`;
    }
    
    // Clean up content
    envContent = envContent.replace(/\n\n+/g, '\n\n').trim() + '\n';
    
    // Write the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ API keys configured successfully!');
    console.log(`The API keys have been saved to ${envPath}`);
    console.log('\nRestart your server to apply the changes.');
  });
});