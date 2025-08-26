const express = require('express');
const router = express.Router();
const {
  saveRoom,
  unsaveRoom,
  getSavedRooms,
  checkRoomSaved,
  getSavedRoomIds,
} = require('../controllers/savedRoomController');

// All routes require authentication
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
});

// Save a room
router.post('/save', saveRoom);

// Remove a saved room
router.delete('/unsave/:roomId', unsaveRoom);

// Get all saved rooms for user
router.get('/my-saved', getSavedRooms);

// Check if specific room is saved
router.get('/check/:roomId', checkRoomSaved);

// Get all saved room IDs for user
router.get('/saved-ids', getSavedRoomIds);

module.exports = router;
