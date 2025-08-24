const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
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
  imageUrl: String,
  content: {
    type: String,
    required: true,
    maxlength: 300,
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Comment', commentSchema);
