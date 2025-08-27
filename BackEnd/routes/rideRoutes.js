const express = require('express');
const router = express.Router();
const { 
  calculateRideDetails, 
  bookRide, 
  getStudentRides, 
  getDriverRides, 
  getAllRides,
  getAdvancedBookings,
  updateRideStatus, 
  confirmAdvancedBooking,
  rateRide 
} = require('../controllers/rideController');

// Public routes
router.post('/calculate', calculateRideDetails);

// Protected routes (require authentication)
router.post('/book', bookRide);
router.get('/student/:studentId', getStudentRides);
router.get('/driver/:driverId', getDriverRides);
router.patch('/status/:id', updateRideStatus);
router.post('/rate/:id', rateRide);

// Admin routes (require admin authentication)
router.get('/all', getAllRides);
router.get('/advanced-bookings', getAdvancedBookings);
router.patch('/confirm/:id', confirmAdvancedBooking);

module.exports = router;
