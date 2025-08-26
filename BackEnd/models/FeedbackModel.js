const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: '',
  },
  websiteRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  review: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  location: {
    type: String,
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
    min: 0,
  },
  studyYear: {
    type: String,
    required: true,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Postgraduate', 'Other'],
  },
  course: {
    type: String,
    required: true,
  },
  roomType: {
    type: String,
    required: true,
    enum: ['Single Room', 'Shared Room', 'Studio', 'Bachelor Flat', 'Other'],
  },
  isApproved: {
    type: Boolean,
    default: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Ensure one feedback per user
feedbackSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
