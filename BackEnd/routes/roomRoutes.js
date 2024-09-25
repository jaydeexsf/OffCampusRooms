const express = require("express");
const { getAllBestRooms, updateRoom, deleteRoom, addRoom } = require("../controllers/roomController");
const { getAllRooms } = require("../controllers/roomController")
const path = require('path');
const multer = require('multer');
const router = express.Router();

// endpoints for getting rooms from mogn0 db
router.get("/all", getAllRooms);
router.get("/best-rooms", getAllBestRooms);

//emnpomnt for updating rooms // i will create this later
router.put("/update-room/:id", updateRoom);
// router.put("/update-best-rooms/:id", );

//endpoint for adding rooms
router.post("/add-room", addRoom);
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save images in 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname)); // Save file with a unique name
//     },
// });
// const upload = multer({ storage });
// router.post('/add-room', upload.array('images', 3), addRoom)

//api for deleting a room
router.delete('/delete-room/:id', deleteRoom)

//emnpomnt for updating QandA // i will create this later
// router.put('/update-questions', );
// router.put('/update-answer/:id', );



module.exports = router;