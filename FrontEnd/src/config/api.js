// API Configuration
// Change this to switch between development and production
const isDevelopment = false;

export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000' 
  : 'https://offcampusrooms.onrender.com';

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
  DELETE_FAQ: `${API_BASE_URL}/api/rooms/del-faq`,
  
  // Comments
  GET_COMMENTS: `${API_BASE_URL}/api/comments`,
  ADD_COMMENT: `${API_BASE_URL}/api/comments/add`,
  
  // Distance
  CALCULATE_DISTANCE: `${API_BASE_URL}/api/distance/calculate`,
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
