const express = require('express');
const { 
  getRoomComments, 
  addComment, 
  updateComment, 
  deleteComment 
} = require('../controllers/commentController');
const router = express.Router();

// Get comments for a specific room
router.get('/room/:roomId', getRoomComments);

// Add a comment to a room
router.post('/', addComment);

// Update a comment
router.put('/:id', updateComment);

// Delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
