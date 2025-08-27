const Ride = require('../models/RideModel');
const Driver = require('../models/DriverModel');
const axios = require('axios');

// Calculate ride price and distance
const calculateRideDetails = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = req.body;

    const apiKey = process.env.GOOGLE_API_KEY;
    const origins = `${pickupLat},${pickupLng}`;
    const destinations = `${dropoffLat},${dropoffLng}`;

    // Get distance from Google Maps API
    const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins,
        destinations,
        mode: 'driving',
        key: apiKey
      }
    });

    if (response.data.status === 'OK' && response.data.rows[0].elements[0].status === 'OK') {
      const element = response.data.rows[0].elements[0];
      const distanceKm = element.distance.value / 1000; // Convert to km
      const duration = element.duration.text;

      // Get available drivers and calculate prices
      const drivers = await Driver.find({ isAvailable: true, status: 'active' });
      const driverPrices = drivers.map(driver => ({
        driverId: driver._id,
        driverName: driver.fullName,
        pricePerKm: driver.pricePerKm,
        estimatedPrice: Math.round(distanceKm * driver.pricePerKm),
        rating: driver.rating,
        totalRides: driver.totalRides
      }));

      res.status(200).json({
        success: true,
        distance: {
          km: Math.round(distanceKm * 100) / 100,
          text: element.distance.text
        },
        duration,
        availableDrivers: driverPrices.sort((a, b) => a.estimatedPrice - b.estimatedPrice)
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Unable to calculate distance'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating ride details',
      error: error.message
    });
  }
};

// Book a ride with advanced booking features
const bookRide = async (req, res) => {
  try {
    const {
      studentId,
      studentName,
      studentContact,
      driverId,
      pickupLocation,
      dropoffLocation,
      distance,
      estimatedPrice,
      scheduledTime,
      notes,
      // New advanced booking fields
      bookingType = 'regular',
      groupSize = 1,
      luggageCount = 0,
      furnitureItems = [],
      semester,
      academicYear,
      holidayType,
      specialRequirements = ''
    } = req.body;

    // Verify driver is available
    const driver = await Driver.findById(driverId);
    if (!driver || !driver.isAvailable || driver.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected driver is not available'
      });
    }

    const ride = new Ride({
      studentId,
      studentName,
      studentContact,
      driverId,
      pickupLocation,
      dropoffLocation,
      distance,
      estimatedPrice,
      scheduledTime: scheduledTime || Date.now(),
      notes: notes || '',
      // Advanced booking fields
      bookingType,
      groupSize,
      luggageCount,
      furnitureItems,
      semester,
      academicYear,
      holidayType,
      specialRequirements
    });

    await ride.save();
    await ride.populate('driverId');

    res.status(201).json({
      success: true,
      message: 'Ride booked successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking ride',
      error: error.message
    });
  }
};

// Get student's rides
const getStudentRides = async (req, res) => {
  try {
    const { studentId } = req.params;
    const rides = await Ride.find({ studentId })
      .populate('driverId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student rides',
      error: error.message
    });
  }
};

// Get driver's rides
const getDriverRides = async (req, res) => {
  try {
    const { driverId } = req.params;
    const rides = await Ride.find({ driverId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver rides',
      error: error.message
    });
  }
};

// Get all rides (admin only)
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find({})
      .populate('driverId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching all rides',
      error: error.message
    });
  }
};

// Get advanced bookings (admin only)
const getAdvancedBookings = async (req, res) => {
  try {
    const { bookingType, semester, holidayType, status } = req.query;
    
    let filter = {};
    
    if (bookingType) filter.bookingType = bookingType;
    if (semester) filter.semester = semester;
    if (holidayType) filter.holidayType = holidayType;
    if (status) filter.status = status;

    const rides = await Ride.find(filter)
      .populate('driverId')
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      rides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching advanced bookings',
      error: error.message
    });
  }
};

// Update ride status
const updateRideStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actualPrice } = req.body;

    const updateData = { status };
    
    if (status === 'accepted') {
      updateData.acceptedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
      if (actualPrice) {
        updateData.actualPrice = actualPrice;
      }
    }

    const ride = await Ride.findByIdAndUpdate(id, updateData, { new: true })
      .populate('driverId');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Update driver's total rides if completed
    if (status === 'completed') {
      await Driver.findByIdAndUpdate(ride.driverId._id, {
        $inc: { totalRides: 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ride status updated successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating ride status',
      error: error.message
    });
  }
};

// Admin: Confirm advanced booking
const confirmAdvancedBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const ride = await Ride.findByIdAndUpdate(id, {
      isConfirmed: true,
      adminNotes: adminNotes || ''
    }, { new: true }).populate('driverId');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Advanced booking confirmed successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error confirming advanced booking',
      error: error.message
    });
  }
};

// Rate ride
const rateRide = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback } = req.body;

    const ride = await Ride.findByIdAndUpdate(id, {
      rating,
      feedback: feedback || ''
    }, { new: true }).populate('driverId');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Update driver's average rating
    const driverRides = await Ride.find({ 
      driverId: ride.driverId._id, 
      rating: { $exists: true, $ne: null } 
    });
    
    const averageRating = driverRides.reduce((sum, r) => sum + r.rating, 0) / driverRides.length;
    
    await Driver.findByIdAndUpdate(ride.driverId._id, {
      rating: Math.round(averageRating * 10) / 10
    });

    res.status(200).json({
      success: true,
      message: 'Ride rated successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error rating ride',
      error: error.message
    });
  }
};

module.exports = {
  calculateRideDetails,
  bookRide,
  getStudentRides,
  getDriverRides,
  getAllRides,
  getAdvancedBookings,
  updateRideStatus,
  confirmAdvancedBooking,
  rateRide
};
