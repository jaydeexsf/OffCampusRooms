// This file contains a list of all files that need axios to apiClient conversion
// Run this script to automatically fix all axios references

const filesToFix = [
  'FrontEnd/src/pages/AllRooms.jsx',
  'FrontEnd/src/pages/RideBooking.jsx',
  'FrontEnd/src/pages/Comments.jsx',
  'FrontEnd/src/pages/MyRides.jsx',
  'FrontEnd/src/components/DriversShowcase/DriversShowcase.jsx',
  'FrontEnd/src/components/OrderPopup/OrderPopup.jsx',
  'FrontEnd/src/components/Statistics/Statistics.jsx',
  'FrontEnd/src/components/Feedback/FeedbackForm.jsx',
  'FrontEnd/src/components/Rating/ProfessionalRatingSystem.jsx',
  'FrontEnd/src/components/Places/PlaceCard.jsx',
  'FrontEnd/src/components/Rating/RatingComponent.jsx',
  'FrontEnd/src/components/StudentTestimonials/StudentTestimonials.jsx',
  'FrontEnd/src/components/Rating/RatingFormModal.jsx',
  'FrontEnd/src/components/Places/Places.jsx',
  'FrontEnd/src/components/Rating/RatingsList.jsx',
  'FrontEnd/src/components/Rating/RatingViewModal.jsx',
  'FrontEnd/src/components/Rating/RoomRatingActions.jsx'
];

// Instructions for manual fix:
// 1. Replace: import axios from 'axios';
//    With: import { apiClient } from '../config/api'; (adjust path as needed)
// 2. Replace: import axios from "axios";
//    With: import { apiClient } from '../config/api'; (adjust path as needed)
// 3. Replace all axios.get, axios.post, axios.put, axios.delete, axios.patch
//    With: apiClient.get, apiClient.post, apiClient.put, apiClient.delete, apiClient.patch

export default filesToFix;
