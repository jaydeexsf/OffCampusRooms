// Environment Configuration
// This file provides environment variables for the application

// Google Maps API Key - Set this to your actual API key
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';

// API Base URL - Set this to your backend URL
export const API_BASE_URL = 'https://offcampusrooms.onrender.com';

// Environment
export const NODE_ENV = 'development';

// Debug mode
export const DEBUG = true;



// Get Google Maps API key
export const getGoogleMapsApiKey = () => {
  // Priority 1: Environment variable (VITE_GOOGLE_MAPS_API_KEY)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey && envKey !== 'YOUR_ACTUAL_API_KEY_HERE' && envKey.length > 20) {
      return envKey;
    }
  }
  
  // Priority 2: Config file
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    return GOOGLE_MAPS_API_KEY;
  }
  
  return null;
};
