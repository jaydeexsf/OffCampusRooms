const DriverRating = require('../models/DriverRatingModel');
const Driver = require('../models/DriverModel');

// Add or update a driver rating
const addDriverRating = async (req, res) => {
  try {
    console.log('Driver Rating request body:', req.body);
    console.log('User from auth:', req.user);
    
    const { driverId, rating, review } = req.body;
    const { userId, userName, userImage } = req.user;

    // Validate required fields
    if (!driverId || !rating || !userId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { driverId, rating, userId }
      });
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate driver exists
    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Check if user already rated this driver
    const existingRating = await DriverRating.findOne({ driverId, userId });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      await existingRating.save();
      
      // Update driver's average rating
      await updateDriverAverageRating(driverId);
      
      return res.status(200).json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = new DriverRating({
        driverId,
        userId,
        userName: userName || 'Anonymous User',
        userImage: userImage || '',
        rating,
        review: review || ''
      });
      
      await newRating.save();
      
      // Update driver's average rating
      await updateDriverAverageRating(driverId);
      
      return res.status(201).json({
        message: 'Rating added successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Error adding driver rating:', error);
    res.status(500).json({ 
      message: 'Error adding rating',
      error: error.message 
    });
  }
};

// Get ratings for a specific driver
const getDriverRatings = async (req, res) => {
  try {
    const { driverId } = req.params;
    
    const ratings = await DriverRating.find({ driverId })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Calculate average rating
    const averageRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    
    res.status(200).json({
      success: true,
      ratings,
      averageRating: averageRating.toFixed(1),
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error('Error fetching driver ratings:', error);
    res.status(500).json({ 
      message: 'Error fetching ratings',
      error: error.message 
    });
  }
};

// Get user's rating for a specific driver
const getUserDriverRating = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { userId } = req.user;
    
    const rating = await DriverRating.findOne({ driverId, userId });
    
    if (!rating) {
      return res.status(404).json({ 
        success: false,
        message: 'Rating not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      rating
    });
  } catch (error) {
    console.error('Error fetching user driver rating:', error);
    res.status(500).json({ 
      message: 'Error fetching rating',
      error: error.message 
    });
  }
};

// Delete user's driver rating
const deleteDriverRating = async (req, res) => {
  try {
    const { driverId } = req.params;
    const { userId } = req.user;
    
    const rating = await DriverRating.findOneAndDelete({ driverId, userId });
    
    if (!rating) {
      return res.status(404).json({ 
        success: false,
        message: 'Rating not found' 
      });
    }
    
    // Update driver's average rating
    await updateDriverAverageRating(driverId);
    
    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting driver rating:', error);
    res.status(500).json({ 
      message: 'Error deleting rating',
      error: error.message 
    });
  }
};

// Helper function to update driver's average rating
const updateDriverAverageRating = async (driverId) => {
  try {
    const ratings = await DriverRating.find({ driverId });
    
    if (ratings.length === 0) {
      await Driver.findByIdAndUpdate(driverId, { rating: 5.0 });
      return;
    }
    
    const averageRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    await Driver.findByIdAndUpdate(driverId, { rating: averageRating });
  } catch (error) {
    console.error('Error updating driver average rating:', error);
  }
};

module.exports = {
  addDriverRating,
  getDriverRatings,
  getUserDriverRating,
  deleteDriverRating
};

