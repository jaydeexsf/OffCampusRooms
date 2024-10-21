const express = require('express');
const Comment = require('../models/CommentModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  const { userId, userName, content, imageUrl } = req.body;

  const newComment = new Comment({
    userId,
    userName,
    content,
    imageUrl,
  });

  try {
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  const { content } = req.body;
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content },
      { new: true } 
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
