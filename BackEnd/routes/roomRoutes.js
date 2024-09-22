const express = require("express");
const { getAllBestRooms } = require("../controllers/roomController");
const { getAllRooms } = require("../controllers/roomController")
const router = express.Router();

// GET /api/rooms - get all rooms
router.get("/all", getAllRooms);

// GET /api/best-rooms - get all best rooms
router.get("/best-rooms", getAllBestRooms);

module.exports = router;
