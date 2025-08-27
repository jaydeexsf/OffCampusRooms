const express = require('express');
const { 
  getRoomComments, 
  addComment, 
  updateComment, 
  deleteComment,
  getMyComments
} = require('../controllers/commentController');
const router = express.Router();

// Get comments for a specific room
router.get('/room/:roomId', getRoomComments);

// Get comments created by the current user
router.get('/my-comments', getMyComments);

// Add a comment to a room
router.post('/', addComment);

// Update a comment
router.put('/:id', updateComment);

// Delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
