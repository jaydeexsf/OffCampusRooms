const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    maxlength: 500,
  },
}, {
  timestamps: true,
});

// Ensure one rating per user per room
ratingSchema.index({ roomId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
