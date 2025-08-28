// API Configuration
import { API_BASE_URL as ENV_API_BASE_URL } from './env.js';
import axios from 'axios';

// Force production API for Vercel deployment, with fallback
let baseUrl = ENV_API_BASE_URL || 'https://offcampusrooms.onrender.com';

// Check if we're on Vercel and force production API
if (typeof window !== 'undefined' && window.location.hostname === 'off-campus-rooms.vercel.app') {
  baseUrl = 'https://offcampusrooms.onrender.com';
  console.log('Running on Vercel, using production API');
}

// Allow environment override for development
if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
  baseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log('Using environment API base URL:', baseUrl);
}

export const API_BASE_URL = baseUrl;

// Validate API_BASE_URL
if (!API_BASE_URL) {
  console.error('API_BASE_URL is not set! This will cause API calls to fail.');
}

// Enhanced debug logging to help troubleshoot API issues
console.log('🚀 API Configuration Loaded:', {
  API_BASE_URL,
  ENV_API_BASE_URL: ENV_API_BASE_URL,
  VITE_API_BASE_URL: typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  isVercel: typeof window !== 'undefined' && window.location.hostname === 'off-campus-rooms.vercel.app'
});

// Validate the configuration
if (!API_BASE_URL) {
  console.error('❌ CRITICAL ERROR: API_BASE_URL is not set! This will cause API calls to fail.');
} else {
  console.log('✅ API_BASE_URL is properly configured:', API_BASE_URL);
}

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth headers
apiClient.interceptors.request.use(
  async (config) => {
    // Check if we're in a browser environment and Clerk is available
    if (typeof window !== 'undefined' && window.Clerk) {
      try {
        const token = await window.Clerk.session?.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response.data);
      // You can redirect to login or show a message here
    }
    return Promise.reject(error);
  }
);

export { apiClient };

export const API_ENDPOINTS = {
  // Rooms
  ALL_ROOMS: `${API_BASE_URL}/api/rooms/all`,
  BEST_ROOMS: `${API_BASE_URL}/api/rooms/best-rooms`,
  SEARCH_ROOMS: `${API_BASE_URL}/api/rooms/search`,
  ADD_ROOM: `${API_BASE_URL}/api/rooms/add-room`,
  UPDATE_ROOM: `${API_BASE_URL}/api/rooms/update-room`,
  DELETE_ROOM: `${API_BASE_URL}/api/rooms/delete-room`,

  // FAQ
  GET_FAQS: `${API_BASE_URL}/api/faq/questions`,
  ADD_FAQ: `${API_BASE_URL}/api/faq/add-qanda`,
  DELETE_FAQ: `${API_BASE_URL}/api/faq`,

  // Comments
  GET_COMMENTS: `${API_BASE_URL}/api/comments`,
  ADD_COMMENT: `${API_BASE_URL}/api/comments/add`,
  GET_ROOM_COMMENTS: `${API_BASE_URL}/api/comments/room`,
  UPDATE_COMMENT: `${API_BASE_URL}/api/comments`,
  DELETE_COMMENT: `${API_BASE_URL}/api/comments`,
  GET_MY_COMMENTS: `${API_BASE_URL}/api/comments/my-comments`,

  // Ratings
  GET_ROOM_RATINGS: `${API_BASE_URL}/api/ratings/room`,
  GET_USER_RATING: `${API_BASE_URL}/api/ratings/user`,
  GET_MY_RATINGS: `${API_BASE_URL}/api/ratings/my-ratings`,
  ADD_RATING: `${API_BASE_URL}/api/ratings`,
  DELETE_RATING: `${API_BASE_URL}/api/ratings`,

  // Statistics
  GET_STATISTICS: `${API_BASE_URL}/api/statistics`,
  GET_ROOM_STATISTICS: `${API_BASE_URL}/api/statistics/room`,

  // Distance/Google
  CALCULATE_DISTANCE: `${API_BASE_URL}/api/google/distance`,

  // Feedback
  GET_PUBLIC_FEEDBACK: `${API_BASE_URL}/api/feedback/public`,
  GET_USER_FEEDBACK: `${API_BASE_URL}/api/feedback/my-feedback`,
  FEEDBACK: `${API_BASE_URL}/api/feedback`,

  // Saved Rooms
  GET_SAVED_ROOMS: `${API_BASE_URL}/api/saved-rooms/my-saved`,
  SAVE_ROOM: `${API_BASE_URL}/api/saved-rooms/save`,
  UNSAVE_ROOM: `${API_BASE_URL}/api/saved-rooms/unsave`,
  CHECK_SAVED_ROOM: `${API_BASE_URL}/api/saved-rooms/check`,

  // Drivers
  GET_ALL_DRIVERS: `${API_BASE_URL}/api/drivers/all`,
  GET_AVAILABLE_DRIVERS: `${API_BASE_URL}/api/drivers/available`,
  GET_DRIVERS_COUNT: `${API_BASE_URL}/api/drivers/count`,
  ADD_DRIVER: `${API_BASE_URL}/api/drivers/add`,
  UPDATE_DRIVER: `${API_BASE_URL}/api/drivers/update`,
  DELETE_DRIVER: `${API_BASE_URL}/api/drivers/delete`,
  TOGGLE_DRIVER_AVAILABILITY: `${API_BASE_URL}/api/drivers/toggle-availability`,

  // Rides
  CALCULATE_RIDE: `${API_BASE_URL}/api/rides/calculate`,
  BOOK_RIDE: `${API_BASE_URL}/api/rides/book`,
  GET_STUDENT_RIDES: `${API_BASE_URL}/api/rides/student`,
  GET_DRIVER_RIDES: `${API_BASE_URL}/api/rides/driver`,
  UPDATE_RIDE_STATUS: `${API_BASE_URL}/api/rides/status`,
  RATE_RIDE: `${API_BASE_URL}/api/rides/rate`,
  GET_ALL_RIDES: `${API_BASE_URL}/api/rides/all`,
  GET_ADVANCED_BOOKINGS: `${API_BASE_URL}/api/rides/advanced-bookings`,
  CONFIRM_ADVANCED_BOOKING: `${API_BASE_URL}/api/rides/confirm`,
};

// Helper function to get full URL for room operations
export const getRoomUrl = (roomId, operation = '') => {
  switch(operation) {
    case 'update':
      return `${API_BASE_URL}/api/rooms/update-room/${roomId}`;
    case 'delete':
      return `${API_BASE_URL}/api/rooms/delete-room/${roomId}`;
    default:
      return `${API_BASE_URL}/api/rooms/${roomId}`;
  }
};

// Helper function to get full URL for FAQ operations
export const getFaqUrl = (faqId, operation = '') => {
  switch(operation) {
    case 'delete':
      return `${API_BASE_URL}/api/rooms/del-faq/${faqId}`;
    default:
      return `${API_BASE_URL}/api/faq/${faqId}`;
  }
};
