const Feedback = require('../models/FeedbackModel');

// Create new feedback
const createFeedback = async (req, res) => {
  try {
    console.log('[API] POST /api/feedback body:', req.body);
    console.log('[API] Auth user:', req.user);
    const {
      websiteRating,
      review,
      location,
      monthlyRent,
      studyYear,
      course,
      roomType
    } = req.body;

    // Check if user already submitted feedback
    const existingFeedback = await Feedback.findOne({ userId: req.user.userId });
    console.log('[API] Existing feedback found:', Boolean(existingFeedback));
    if (existingFeedback) {
      return res.status(400).json({ 
        message: 'You have already submitted feedback. You can update your existing feedback instead.' 
      });
    }

    const feedback = new Feedback({
      userId: req.user.userId,
      userName: req.user.userName.trim(),
      userImage: req.user.userImage || '',
      websiteRating,
      review,
      location,
      monthlyRent,
      studyYear,
      course,
      roomType,
    });

    const savedFeedback = await feedback.save();
    console.log('[API] Feedback saved with id:', savedFeedback?._id?.toString());
    res.status(201).json({
      message: 'Feedback submitted successfully!',
      feedback: savedFeedback
    });
  } catch (error) {
    console.error('[API] Error creating feedback:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'You have already submitted feedback.' 
      });
    }
    res.status(500).json({ 
      message: 'Error submitting feedback', 
      error: error.message 
    });
  }
};

// Update existing feedback
const updateFeedback = async (req, res) => {
  try {
    console.log('[API] PUT /api/feedback body:', req.body);
    console.log('[API] Auth user:', req.user);
    const {
      websiteRating,
      review,
      location,
      monthlyRent,
      studyYear,
      course,
      roomType
    } = req.body;

    const feedback = await Feedback.findOneAndUpdate(
      { userId: req.user.userId },
      {
        websiteRating,
        review,
        location,
        monthlyRent,
        studyYear,
        course,
        roomType,
        userName: req.user.userName.trim(),
        userImage: req.user.userImage || '',
      },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found to update' });
    }

    res.json({
      message: 'Feedback updated successfully!',
      feedback
    });
  } catch (error) {
    console.error('[API] Error updating feedback:', error);
    res.status(500).json({ 
      message: 'Error updating feedback', 
      error: error.message 
    });
  }
};

// Get user's own feedback
const getUserFeedback = async (req, res) => {
  try {
    console.log('[API] GET /api/feedback/my-feedback for user:', req.user);
    const feedback = await Feedback.findOne({ userId: req.user.userId });
    console.log('[API] User feedback found:', Boolean(feedback));
    res.json({ feedback });
  } catch (error) {
    console.error('[API] Error getting user feedback:', error);
    res.status(500).json({ 
      message: 'Error retrieving feedback', 
      error: error.message 
    });
  }
};

// Get all approved public feedback (for testimonials)
const getPublicFeedback = async (req, res) => {
  try {
    console.log('[API] GET /api/feedback/public query:', req.query);
    const { limit = 10, skip = 0 } = req.query;
    
    const feedback = await Feedback.find({ 
      isApproved: true, 
      isPublic: true 
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .select('-userId'); // Don't expose user IDs publicly

    const total = await Feedback.countDocuments({ 
      isApproved: true, 
      isPublic: true 
    });

    // Calculate average rating
    const avgRatingResult = await Feedback.aggregate([
      { $match: { isApproved: true, isPublic: true } },
      { $group: { _id: null, avgRating: { $avg: '$websiteRating' } } }
    ]);

    const averageRating = avgRatingResult.length > 0 
      ? Math.round(avgRatingResult[0].avgRating * 10) / 10 
      : 0;

    console.log('[API] Public feedback count:', feedback.length, 'total:', total, 'avg:', averageRating);
    res.json({
      feedback,
      total,
      averageRating,
      hasMore: skip + feedback.length < total
    });
  } catch (error) {
    console.error('[API] Error getting public feedback:', error);
    res.status(500).json({ 
      message: 'Error retrieving feedback', 
      error: error.message 
    });
  }
};

// Get all feedback (admin only - for future admin panel)
const getAllFeedback = async (req, res) => {
  try {
    const { limit = 20, skip = 0, approved } = req.query;
    
    const filter = {};
    if (approved !== undefined) {
      filter.isApproved = approved === 'true';
    }

    const feedback = await Feedback.find(filter)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

    const total = await Feedback.countDocuments(filter);

    res.json({
      feedback,
      total,
      hasMore: skip + feedback.length < total
    });
  } catch (error) {
    console.error('Error getting all feedback:', error);
    res.status(500).json({ 
      message: 'Error retrieving feedback', 
      error: error.message 
    });
  }
};

// Approve/disapprove feedback (admin only)
const moderateFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const { isApproved, isPublic } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      feedbackId,
      { isApproved, isPublic },
      { new: true }
    );

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }

    res.json({
      message: 'Feedback moderated successfully',
      feedback
    });
  } catch (error) {
    console.error('Error moderating feedback:', error);
    res.status(500).json({ 
      message: 'Error moderating feedback', 
      error: error.message 
    });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  try {
    console.log('[API] DELETE /api/feedback for user:', req.user);
    const feedback = await Feedback.findOneAndDelete({ userId: req.user.userId });
    
    if (!feedback) {
      return res.status(404).json({ message: 'No feedback found to delete' });
    }

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('[API] Error deleting feedback:', error);
    res.status(500).json({ 
      message: 'Error deleting feedback', 
      error: error.message 
    });
  }
};

module.exports = {
  createFeedback,
  updateFeedback,
  getUserFeedback,
  getPublicFeedback,
  getAllFeedback,
  moderateFeedback,
  deleteFeedback
};
