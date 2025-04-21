# API Setup Guide for netGala

This guide explains how to set up the external API keys needed for the AI video generation features of netGala.

## Required API Keys

The netGala platform uses the following external APIs for AI video generation:

1. **Runway ML API** - For generating videos from audio and text prompts
   - Sign up and get API keys at: https://runwayml.com/api

2. **FastPix API** - Alternative video generation service for audio-to-video conversion
   - Use your FastPix API key for enhanced video generation capabilities

## Setup Methods

There are two ways to set up your API keys:

### Method 1: Using the Setup Tool (Recommended)

We provide a command-line tool to easily set up your API keys:

1. Open your terminal and navigate to the project directory
2. Run the setup tool:
   ```
   node tools/setup-api-keys.js
   ```
3. Follow the prompts to enter your API keys
4. Restart the server to apply the changes

### Method 2: Manual Setup

1. Create a `.env` file in the root directory (use `.env.example` as a template)
2. Add your API keys:
   ```
   RUNWAY_API_KEY=your_runway_api_key_here
   FASTPIX_API_KEY=your_fastpix_api_key_here
   ```
3. Restart the server to apply the changes

## Security Considerations

- Never expose your API keys to users or include them in client-side code
- For production deployments, set these as environment variables in your hosting provider's dashboard
- Regularly rotate your API keys following security best practices
- Review the API providers' terms of service for usage limits and billing information

## Verification

To verify that your API keys are properly configured:

1. Start the server
2. Navigate to the "Create" page in the app
3. If the API keys are properly configured, you should be able to use the AI video generation features

## Troubleshooting

If you're having issues with the API keys:

- Make sure you've entered the keys correctly
- Check that the `.env` file is in the correct location
- Verify that the server has been restarted after adding the keys
- Check the server logs for any API-related errors