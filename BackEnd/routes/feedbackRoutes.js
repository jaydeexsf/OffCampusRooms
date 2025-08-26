const express = require('express');
const router = express.Router();
const {
  createFeedback,
  updateFeedback,
  getUserFeedback,
  getPublicFeedback,
  getAllFeedback,
  moderateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');

// Public routes (no auth required)
router.get('/public', getPublicFeedback);

// Protected routes (auth required)
router.post('/', createFeedback);
router.put('/', updateFeedback);
router.get('/my-feedback', getUserFeedback);
router.delete('/', deleteFeedback);

// Admin routes (for future admin panel)
router.get('/all', getAllFeedback);
router.put('/:feedbackId/moderate', moderateFeedback);

module.exports = router;
