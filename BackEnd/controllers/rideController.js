const Ride = require('../models/RideModel');
const Driver = require('../models/DriverModel');
const axios = require('axios');

// Calculate ride price and distance (simplified - no driver selection)
const calculateRideDetails = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, scheduledDate } = req.body;

    const apiKey = process.env.GOOGLE_API_KEY;
    
    // Check if API key is available
    if (!apiKey) {
      console.log('Google Maps API key not configured');
      return res.status(500).json({
        success: false,
        message: 'Google Maps API key not configured. Please set GOOGLE_API_KEY in your environment variables.',
        error: 'API_KEY_MISSING'
      });
    }
    
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

      // Calculate standard price (average of all drivers)
      const drivers = await Driver.find({ isAvailable: true, status: 'active' });
      const averagePricePerKm = drivers.length > 0 
        ? drivers.reduce((sum, driver) => sum + driver.pricePerKm, 0) / drivers.length 
        : 15; // Default R15/km
      
      const estimatedPrice = Math.round(distanceKm * averagePricePerKm);

      // Check for existing rides to similar destinations on the same date
      const radiusKm = 2; // 2km radius for similar destinations
      const radiusDegrees = radiusKm / 111.32;
      
      const dateStart = new Date(scheduledDate);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(scheduledDate);
      dateEnd.setHours(23, 59, 59, 999);

      const similarRides = await Ride.find({
        status: { $in: ['pending', 'accepted'] },
        scheduledTime: { $gte: dateStart, $lte: dateEnd },
        'dropoffLocation.lat': {
          $gte: dropoffLat - radiusDegrees,
          $lte: dropoffLat + radiusDegrees
        },
        'dropoffLocation.lng': {
          $gte: dropoffLng - radiusDegrees,
          $lte: dropoffLng + radiusDegrees
        }
      }).populate('driverId', 'fullName');

      res.status(200).json({
        success: true,
        distance: {
          km: Math.round(distanceKm * 100) / 100,
          text: element.distance.text
        },
        duration,
        estimatedPrice,
        availableDrivers: drivers.length,
        similarRides: similarRides.map(ride => ({
          id: ride._id,
          studentName: ride.studentName,
          dropoffAddress: ride.dropoffLocation.address,
          scheduledTime: ride.scheduledTime,
          estimatedPrice: ride.estimatedPrice,
          assignedDriver: ride.driverId?.fullName || 'Not assigned'
        }))
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

// Request a ride (no driver selection - admin assigns later)
const requestRide = async (req, res) => {
  try {
    // Get authenticated user info from middleware
    const authenticatedUserId = req.user.userId;
    const authenticatedUserName = req.user.userName;
    
    const {
      studentContact,
      pickupLocation,
      dropoffLocation,
      distance,
      estimatedPrice,
      scheduledTime,
      notes,
      // Advanced booking fields
      bookingType = 'regular',
      groupSize = 1,
      luggageCount = 0,
      furnitureItems = [],
      semester,
      academicYear,
      holidayType,
      specialRequirements = '',
      // Split fare and ride sharing
      splitFare,
      isSharedRide = false,
      maxSharedPassengers = 1
    } = req.body;

    const ride = new Ride({
      studentId: authenticatedUserId,
      studentName: authenticatedUserName,
      studentContact,
      driverId: null, // No driver assigned yet
      pickupLocation,
      dropoffLocation,
      distance,
      estimatedPrice,
      scheduledTime: scheduledTime || Date.now(),
      notes: notes || '',
      status: 'pending', // Waiting for admin to assign driver
      // Advanced booking fields
      bookingType,
      groupSize,
      luggageCount,
      furnitureItems,
      semester,
      academicYear,
      holidayType,
      specialRequirements,
      // Split fare and ride sharing
      splitFare: splitFare || {
        enabled: false,
        totalParticipants: 1,
        participants: [],
        isOpen: false
      },
      isSharedRide,
      maxSharedPassengers: isSharedRide ? maxSharedPassengers : 1
    });

    await ride.save();

    res.status(201).json({
      success: true,
      message: 'Ride request submitted successfully! Admin will assign a driver soon.',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting ride request',
      error: error.message
    });
  }
};

// Admin assigns driver to ride request
const assignDriverToRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { driverId } = req.body;

    // Verify driver exists and is available
    const driver = await Driver.findById(driverId);
    if (!driver || !driver.isAvailable || driver.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Selected driver is not available'
      });
    }

    const ride = await Ride.findByIdAndUpdate(
      rideId,
      { 
        driverId,
        status: 'accepted',
        acceptedAt: new Date()
      },
      { new: true }
    ).populate('driverId');

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver assigned successfully',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error assigning driver',
      error: error.message
    });
  }
};

// Get student's rides
const getStudentRides = async (req, res) => {
  try {
    // Get authenticated user ID from middleware
    const authenticatedUserId = req.user.userId;
    const rides = await Ride.find({ studentId: authenticatedUserId })
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

// Find shared rides with similar destinations
const findSharedRides = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropoffLat, dropoffLng, scheduledTime } = req.body;
    const radiusKm = 2; // 2km radius for similar destinations
    
    // Convert radius to degrees (approximate)
    const radiusDegrees = radiusKm / 111.32;
    
    const timeWindow = new Date(scheduledTime);
    const timeStart = new Date(timeWindow.getTime() - 30 * 60000); // 30 minutes before
    const timeEnd = new Date(timeWindow.getTime() + 30 * 60000); // 30 minutes after
    
    const sharedRides = await Ride.find({
      isSharedRide: true,
      status: 'pending',
      scheduledTime: { $gte: timeStart, $lte: timeEnd },
      'sharedPassengers.length': { $lt: '$maxSharedPassengers' },
      $and: [
        {
          'pickupLocation.lat': {
            $gte: pickupLat - radiusDegrees,
            $lte: pickupLat + radiusDegrees
          }
        },
        {
          'pickupLocation.lng': {
            $gte: pickupLng - radiusDegrees,
            $lte: pickupLng + radiusDegrees
          }
        },
        {
          'dropoffLocation.lat': {
            $gte: dropoffLat - radiusDegrees,
            $lte: dropoffLat + radiusDegrees
          }
        },
        {
          'dropoffLocation.lng': {
            $gte: dropoffLng - radiusDegrees,
            $lte: dropoffLng + radiusDegrees
          }
        }
      ]
    }).populate('driverId');

    res.status(200).json({
      success: true,
      sharedRides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding shared rides',
      error: error.message
    });
  }
};

// Join a shared ride
const joinSharedRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { studentId, studentName, studentContact, pickupLocation, dropoffLocation } = req.body;
    
    const ride = await Ride.findById(rideId);
    if (!ride || !ride.isSharedRide) {
      return res.status(404).json({
        success: false,
        message: 'Shared ride not found'
      });
    }
    
    if (ride.sharedPassengers.length >= ride.maxSharedPassengers) {
      return res.status(400).json({
        success: false,
        message: 'Ride is full'
      });
    }
    
    // Calculate share amount (split evenly)
    const shareAmount = Math.round(ride.estimatedPrice / (ride.sharedPassengers.length + 2));
    
    ride.sharedPassengers.push({
      studentId,
      studentName,
      studentContact,
      pickupLocation,
      dropoffLocation,
      shareAmount
    });
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined shared ride',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining shared ride',
      error: error.message
    });
  }
};

// Join split fare
const joinSplitFare = async (req, res) => {
  try {
    const { rideId } = req.params;
    const { studentId, studentName, studentContact } = req.body;
    
    const ride = await Ride.findById(rideId);
    if (!ride || !ride.splitFare.enabled || !ride.splitFare.isOpen) {
      return res.status(404).json({
        success: false,
        message: 'Split fare not available for this ride'
      });
    }
    
    if (ride.splitFare.participants.length >= ride.splitFare.totalParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Split fare is full'
      });
    }
    
    // Check if student already joined
    const alreadyJoined = ride.splitFare.participants.some(p => p.studentId === studentId);
    if (alreadyJoined) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this split fare'
      });
    }
    
    // Calculate share amount
    const shareAmount = Math.round(ride.estimatedPrice / ride.splitFare.totalParticipants);
    
    ride.splitFare.participants.push({
      studentId,
      studentName,
      studentContact,
      shareAmount
    });
    
    // Close split fare if full
    if (ride.splitFare.participants.length >= ride.splitFare.totalParticipants) {
      ride.splitFare.isOpen = false;
    }
    
    await ride.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined split fare',
      ride
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining split fare',
      error: error.message
    });
  }
};

module.exports = {
  calculateRideDetails,
  requestRide,
  assignDriverToRide,
  getStudentRides,
  getDriverRides,
  getAllRides,
  getAdvancedBookings,
  updateRideStatus,
  confirmAdvancedBooking,
  rateRide,
  findSharedRides,
  joinSharedRide,
  joinSplitFare
};
