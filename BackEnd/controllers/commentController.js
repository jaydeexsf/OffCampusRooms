const Comment = require('../models/CommentModel');
const Room = require('../models/roomModel');

// Get comments for a specific room
const getRoomComments = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const comments = await Comment.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.status(200).json(comments);
  } catch (error) {
    console.error('Error getting room comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get comments created by the authenticated user
const getMyComments = async (req, res) => {
  try {
    const { userId } = req.user;
    const comments = await Comment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error getting user comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a comment to a room
const addComment = async (req, res) => {
  try {
    const { roomId, content } = req.body;
    const { userId, userName, imageUrl } = req.user; // From Clerk auth

    // Validate room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const newComment = new Comment({
      roomId,
      userId,
      userName,
      content,
      imageUrl,
    });

    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const { userId } = req.user;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true }
    );
    
    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const comment = await Comment.findById(id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getRoomComments,
  addComment,
  updateComment,
  deleteComment,
  getMyComments
};
