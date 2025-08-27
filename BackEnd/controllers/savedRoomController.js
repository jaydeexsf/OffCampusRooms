const SavedRoom = require('../models/SavedRoomModel');
const Room = require('../models/roomModel');

// Save a room for a user
const saveRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if already saved
    const existingSave = await SavedRoom.findOne({ userId, roomId });
    if (existingSave) {
      return res.status(400).json({ message: 'Room already saved' });
    }

    // Create new saved room
    const savedRoom = new SavedRoom({
      userId,
      roomId,
    });

    await savedRoom.save();
    res.status(201).json({ message: 'Room saved successfully', savedRoom });
  } catch (error) {
    console.error('Error saving room:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove a saved room
const unsaveRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const savedRoom = await SavedRoom.findOneAndDelete({ userId, roomId });
    if (!savedRoom) {
      return res.status(404).json({ message: 'Saved room not found' });
    }

    res.json({ message: 'Room removed from saved list' });
  } catch (error) {
    console.error('Error removing saved room:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all saved rooms for a user
const getSavedRooms = async (req, res) => {
  try {
    const userId = req.user.userId;

    const savedRooms = await SavedRoom.find({ userId })
      .populate('roomId')
      .sort({ createdAt: -1 });

    const roomsData = savedRooms.map(saved => ({
      id: saved.roomId._id,
      title: saved.roomId.title,
      price: saved.roomId.price,
      location: saved.roomId.location,
      images: saved.roomId.images,
      savedDate: saved.createdAt,
    }));

    res.json(roomsData);
  } catch (error) {
    console.error('Error fetching saved rooms:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Check if a room is saved by user
const checkRoomSaved = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const savedRoom = await SavedRoom.findOne({ userId, roomId });
    res.json({ isSaved: !!savedRoom });
  } catch (error) {
    console.error('Error checking saved room:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get saved room IDs for a user (for bulk checking)
const getSavedRoomIds = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedRooms = await SavedRoom.find({ userId }).select('roomId');
    const roomIds = savedRooms.map(saved => saved.roomId.toString());

    res.json({ savedRoomIds: roomIds });
  } catch (error) {
    console.error('Error fetching saved room IDs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  saveRoom,
  unsaveRoom,
  getSavedRooms,
  checkRoomSaved,
  getSavedRoomIds,
};
