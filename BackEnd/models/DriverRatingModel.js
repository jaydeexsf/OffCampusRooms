const mongoose = require('mongoose');

const driverRatingSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
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

// Ensure one rating per user per driver
driverRatingSchema.index({ driverId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('DriverRating', driverRatingSchema);

