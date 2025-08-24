const Rating = require('../models/RatingModel');
const Room = require('../models/roomModel');

// Add or update a rating
const addRating = async (req, res) => {
  try {
    console.log('Rating request body:', req.body);
    console.log('User from auth:', req.user);
    
    const { roomId, rating, review } = req.body;
    const { userId, userName, userImage } = req.user; // From Clerk auth

    // Validate required fields
    if (!roomId || !rating || !userId) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        received: { roomId, rating, userId }
      });
    }

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if user already rated this room
    const existingRating = await Rating.findOne({ roomId, userId });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      await existingRating.save();
      
      return res.status(200).json({
        message: 'Rating updated successfully',
        rating: existingRating
      });
    } else {
      // Create new rating
      const newRating = new Rating({
        roomId,
        userId,
        userName: userName || 'Anonymous User',
        userImage: userImage || '',
        rating,
        review: review || ''
      });
      
      await newRating.save();
      
      return res.status(201).json({
        message: 'Rating added successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Error adding rating:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get ratings for a specific room with pagination
const getRoomRatings = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Get paginated ratings
    const ratings = await Rating.find({ roomId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const totalRatings = await Rating.countDocuments({ roomId });
    
    // Calculate average rating from all ratings (not just current page)
    const allRatings = await Rating.find({ roomId }, 'rating');
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;
    
    res.status(200).json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings,
      currentPage: page,
      totalPages: Math.ceil(totalRatings / limit),
      hasNextPage: page < Math.ceil(totalRatings / limit),
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error getting room ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's rating for a specific room
const getUserRating = async (req, res) => {
  try {
    console.log('Get user rating - params:', req.params);
    console.log('Get user rating - user:', req.user);
    
    const { roomId } = req.params;
    
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { userId } = req.user;
    
    // Validate roomId
    if (!roomId) {
      return res.status(400).json({ message: 'Room ID is required' });
    }
    
    const rating = await Rating.findOne({ roomId, userId });
    
    res.status(200).json({ rating });
  } catch (error) {
    console.error('Error getting user rating:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Delete user's rating
const deleteRating = async (req, res) => {
  try {
    console.log('Delete rating - params:', req.params);
    console.log('Delete rating - user:', req.user);
    
    const { roomId } = req.params;
    
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { userId } = req.user;
    
    const rating = await Rating.findOneAndDelete({ roomId, userId });
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  addRating,
  getRoomRatings,
  getUserRating,
  deleteRating
};
