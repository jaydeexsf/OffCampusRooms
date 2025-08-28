// Environment Configuration
// This file provides environment variables for the application

// Google Maps API Key - Set this to your actual API key
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// API Base URL - Set this to your backend URL
export const API_BASE_URL = 'https://offcampusrooms.onrender.com';

// Environment
export const NODE_ENV = 'production';

// Debug mode
export const DEBUG = true;

// Console log the configuration for debugging
if (DEBUG) {
  console.log('Environment Configuration:', {
    GOOGLE_MAPS_API_KEY: GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL,
    NODE_ENV
  });
}

// Enhanced debugging for Google Maps API key
export const getGoogleMapsApiKey = () => {
  // Priority 1: Environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    console.log('✅ Using VITE_GOOGLE_MAPS_API_KEY from environment');
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  }
  
  // Priority 2: Config file
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    console.log('✅ Using GOOGLE_MAPS_API_KEY from config file');
    return GOOGLE_MAPS_API_KEY;
  }
  
  // Priority 3: Fallback
  console.warn('⚠️ No valid Google Maps API key found!');
  console.warn('Please set VITE_GOOGLE_MAPS_API_KEY in your .env file or update env.js');
  return null;
};
