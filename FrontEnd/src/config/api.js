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
  GET_ROOM_COMMENTS: `${API_BASE_URL}/api/comments/room`,
  UPDATE_COMMENT: `${API_BASE_URL}/api/comments`,
  DELETE_COMMENT: `${API_BASE_URL}/api/comments`,

  // Ratings
  GET_ROOM_RATINGS: `${API_BASE_URL}/api/ratings/room`,
  GET_USER_RATING: `${API_BASE_URL}/api/ratings/user`,
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
