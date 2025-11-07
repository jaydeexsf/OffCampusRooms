const express = require('express');
const { getStatistics, getRoomStatistics, getAveragePriceByLocation } = require('../controllers/statisticsController');
const router = express.Router();

// Get overall statistics
router.get('/', getStatistics);

// Get room-specific statistics
router.get('/room/:roomId', getRoomStatistics);

// Get average price by popular locations
router.get('/popular-locations/average-price', getAveragePriceByLocation);

module.exports = router;
