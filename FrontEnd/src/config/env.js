// Environment Configuration
// This file provides environment variables for the application

// Google Maps API Key - Set this to your actual API key
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// API Base URL - Set this to your backend URL
export const API_BASE_URL = 'https://offcampusrooms.onrender.com';

// Environment
export const NODE_ENV = 'production';

// Debug mode
export const DEBUG = false;

// Console log the configuration for debugging
if (DEBUG) {
  console.log('Environment Configuration:', {
    GOOGLE_MAPS_API_KEY: GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL,
    NODE_ENV
  });
}
