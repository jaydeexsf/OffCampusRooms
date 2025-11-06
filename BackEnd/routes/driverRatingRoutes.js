const express = require('express');
const { 
  addDriverRating, 
  getDriverRatings, 
  getUserDriverRating,
  deleteDriverRating 
} = require('../controllers/driverRatingController');
const router = express.Router();

// PUBLIC ROUTES (no auth required)
// Get ratings for a specific driver - anyone can view ratings
router.get('/driver/:driverId', getDriverRatings);

// PROTECTED ROUTES (auth required)
// Get user's rating for a specific driver
router.get('/user/:driverId', getUserDriverRating);

// Add or update a driver rating
router.post('/', addDriverRating);

// Delete user's driver rating
router.delete('/:driverId', deleteDriverRating);

module.exports = router;

