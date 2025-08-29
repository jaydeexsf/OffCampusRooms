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

// Console log the configuration for debugging
if (DEBUG) {
  console.log('🔍 Environment Configuration Debug:', {
    GOOGLE_MAPS_API_KEY: GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET',
    API_BASE_URL,
    NODE_ENV,
    'VITE_GOOGLE_MAPS_API_KEY from env': typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET'
  });
}

// Enhanced debugging for Google Maps API key
export const getGoogleMapsApiKey = () => {
  // Priority 1: Environment variable (VITE_GOOGLE_MAPS_API_KEY)
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (envKey && envKey !== 'YOUR_ACTUAL_API_KEY_HERE' && envKey.length > 20) {
      console.log('✅ Using VITE_GOOGLE_MAPS_API_KEY from environment');
      return envKey;
    } else {
      console.warn('⚠️ VITE_GOOGLE_MAPS_API_KEY is set but appears to be a placeholder');
    }
  }
  
  // Priority 2: Config file
  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
    console.log('✅ Using GOOGLE_MAPS_API_KEY from config file');
    return GOOGLE_MAPS_API_KEY;
  }
  
  // Priority 3: Fallback - Check for any other potential sources
  console.error('❌ No valid Google Maps API key found!');
  console.error('🔧 To fix this issue:');
  console.error('   1. Create a .env file in your FrontEnd directory');
  console.error('   2. Add: VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key');
  console.error('   3. Or update this file with your real API key');
  console.error('   4. Restart your development server');
  console.error('   5. Make sure billing is enabled in Google Cloud Console');
  
  return null;
};
