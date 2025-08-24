const express = require('express');
const { getStatistics, getRoomStatistics } = require('../controllers/statisticsController');
const router = express.Router();

// Get overall statistics
router.get('/', getStatistics);

// Get room-specific statistics
router.get('/room/:roomId', getRoomStatistics);

module.exports = router;
