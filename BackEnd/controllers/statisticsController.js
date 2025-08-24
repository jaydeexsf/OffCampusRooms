const Room = require('../models/roomModel');
const Rating = require('../models/RatingModel');
const Comment = require('../models/CommentModel');

// Get overall statistics
const getStatistics = async (req, res) => {
  try {
    // Get total rooms
    const totalRooms = await Room.countDocuments();
    
    // Get total ratings
    const totalRatings = await Rating.countDocuments();
    
    // Get total comments
    const totalComments = await Comment.countDocuments();
    
    // Calculate average rating across all rooms
    const allRatings = await Rating.find();
    const averageRating = allRatings.length > 0 
      ? Math.round((allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length) * 10) / 10
      : 0;
    
    // Get rooms by location
    const roomsByLocation = await Room.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get average price
    const roomsWithPrice = await Room.find({ price: { $exists: true, $ne: null } });
    const averagePrice = roomsWithPrice.length > 0
      ? Math.round(roomsWithPrice.reduce((sum, r) => sum + r.price, 0) / roomsWithPrice.length)
      : 0;
    
    // Get price range
    const priceStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);
    
    // Get rooms with different amenities
    const wifiRooms = await Room.countDocuments({ 'amenities.wifi': true });
    const showerRooms = await Room.countDocuments({ 'amenities.shower': true });
    const bathtubRooms = await Room.countDocuments({ 'amenities.bathtub': true });
    const tableRooms = await Room.countDocuments({ 'amenities.table': true });
    const bedRooms = await Room.countDocuments({ 'amenities.bed': true });
    const electricityRooms = await Room.countDocuments({ 'amenities.electricity': true });
    
    // Get distance statistics
    const distanceStats = await Room.aggregate([
      {
        $group: {
          _id: null,
          avgDistance: { $avg: '$minutesAway' },
          minDistance: { $min: '$minutesAway' },
          maxDistance: { $max: '$minutesAway' }
        }
      }
    ]);
    
    const stats = {
      totalRooms,
      totalRatings,
      totalComments,
      averageRating,
      averagePrice,
      priceRange: {
        min: priceStats[0]?.minPrice || 0,
        max: priceStats[0]?.maxPrice || 0
      },
      averageDistance: Math.round(distanceStats[0]?.avgDistance || 0),
      distanceRange: {
        min: distanceStats[0]?.minDistance || 0,
        max: distanceStats[0]?.maxDistance || 0
      },
      roomsByLocation,
      amenities: {
        wifi: wifiRooms,
        shower: showerRooms,
        bathtub: bathtubRooms,
        table: tableRooms,
        bed: bedRooms,
        electricity: electricityRooms
      }
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get room-specific statistics
const getRoomStatistics = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Get ratings for this room
    const ratings = await Rating.find({ roomId });
    const averageRating = ratings.length > 0 
      ? Math.round((ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) * 10) / 10
      : 0;
    
    // Get comments for this room
    const comments = await Comment.find({ roomId });
    
    // Get rating distribution
    const ratingDistribution = {
      1: ratings.filter(r => r.rating === 1).length,
      2: ratings.filter(r => r.rating === 2).length,
      3: ratings.filter(r => r.rating === 3).length,
      4: ratings.filter(r => r.rating === 4).length,
      5: ratings.filter(r => r.rating === 5).length
    };
    
    const stats = {
      room,
      totalRatings: ratings.length,
      totalComments: comments.length,
      averageRating,
      ratingDistribution
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting room statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getStatistics,
  getRoomStatistics
};
