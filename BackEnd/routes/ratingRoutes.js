const express = require('express');
const { 
  addRating, 
  getRoomRatings, 
  getUserRating, 
  deleteRating 
} = require('../controllers/ratingController');
const router = express.Router();

// Get ratings for a specific room
router.get('/room/:roomId', getRoomRatings);

// Get user's rating for a specific room
router.get('/user/:roomId', getUserRating);

// Add or update a rating
router.post('/', addRating);

// Delete user's rating
router.delete('/:roomId', deleteRating);

module.exports = router;
