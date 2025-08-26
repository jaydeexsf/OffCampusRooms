const mongoose = require('mongoose');

const savedRoomSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  savedDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create unique index to prevent duplicate saves
savedRoomSchema.index({ userId: 1, roomId: 1 }, { unique: true });

module.exports = mongoose.model('SavedRoom', savedRoomSchema);
