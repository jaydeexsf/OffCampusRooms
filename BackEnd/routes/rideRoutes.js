const express = require('express');
const router = express.Router();
const { 
  calculateRideDetails,
  requestRide,
  assignDriverToRide,
  getStudentRides,
  getDriverRides,
  getAllRides,
  getPublicRides,
  getAdvancedBookings,
  updateRideStatus,
  confirmAdvancedBooking,
  rateRide,
  findSharedRides,
  joinSharedRide,
  joinSplitFare
} = require('../controllers/rideController');

// Public routes
router.post('/calculate', calculateRideDetails);
router.get('/public', getPublicRides);

// Protected routes (require authentication)
router.post('/request', requestRide);
router.post('/assign/:rideId', assignDriverToRide);
router.get('/student', getStudentRides);
router.get('/driver/:driverId', getDriverRides);
router.patch('/status/:id', updateRideStatus);
router.post('/rate/:id', rateRide);

// Ride sharing routes
router.post('/find-shared', findSharedRides);
router.post('/join-shared/:rideId', joinSharedRide);
router.post('/join-split-fare/:rideId', joinSplitFare);

// Admin routes (require admin authentication)
router.get('/all', getAllRides);
router.get('/advanced-bookings', getAdvancedBookings);
router.patch('/confirm/:id', confirmAdvancedBooking);

module.exports = router;
