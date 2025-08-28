const express = require('express');
const { 
  addRating, 
  getRoomRatings, 
  getUserRating, 
  getUserRatings,
  deleteRating 
} = require('../controllers/ratingController');
const router = express.Router();

// PUBLIC ROUTES (no auth required)
// Get ratings for a specific room - anyone can view ratings
router.get('/room/:roomId', getRoomRatings);

// PROTECTED ROUTES (auth required)
// Get user's rating for a specific room
router.get('/user/:roomId', getUserRating);

// Get all ratings by the current user
router.get('/my-ratings', getUserRatings);

// Add or update a rating
router.post('/', addRating);

// Delete user's rating
router.delete('/:roomId', deleteRating);

module.exports = router;
