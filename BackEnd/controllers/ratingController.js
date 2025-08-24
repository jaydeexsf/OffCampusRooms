const Rating = require('../models/RatingModel');
const Room = require('../models/roomModel');

// Add or update a rating
const addRating = async (req, res) => {
  try {
    const { roomId, rating, review } = req.body;
    const { userId, userName, userImage } = req.user; // From Clerk auth

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
      existingRating.review = review;
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
        userName,
        userImage,
        rating,
        review
      });
      
      await newRating.save();
      
      return res.status(201).json({
        message: 'Rating added successfully',
        rating: newRating
      });
    }
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get ratings for a specific room
const getRoomRatings = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const ratings = await Rating.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Calculate average rating
    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? totalRating / ratings.length : 0;
    
    res.status(200).json({
      ratings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: ratings.length
    });
  } catch (error) {
    console.error('Error getting room ratings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's rating for a specific room
const getUserRating = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    
    const rating = await Rating.findOne({ roomId, userId });
    
    res.status(200).json({ rating });
  } catch (error) {
    console.error('Error getting user rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete user's rating
const deleteRating = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { userId } = req.user;
    
    const rating = await Rating.findOneAndDelete({ roomId, userId });
    
    if (!rating) {
      return res.status(404).json({ message: 'Rating not found' });
    }
    
    res.status(200).json({ message: 'Rating deleted successfully' });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addRating,
  getRoomRatings,
  getUserRating,
  deleteRating
};
