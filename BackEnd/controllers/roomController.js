const Room = require("../models/roomModel");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    // console.log("Rooms data:", rooms); 
    // if (rooms) {
    //   return res.status(200).json({ message: "No rooms found", });
    // }
    res.status(200).json({rooms});
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};


// Get all best rooms where bestRoom is true
const getAllBestRooms = async (req, res) => {
  try {
    const bestRooms = await Room.find({ bestRoom: true });

    res.status(200).json(bestRooms); // Send best rooms
  } catch (error) {
    console.error("Error fetching best rooms:", error);
    res.status(500).json({ message: "Error fetching best rooms", error: error.message });
  }
};

module.exports = { getAllRooms, getAllBestRooms };


// const Room = require("../models/roomModel");

// // Get rooms where bestRoom is true
// const getAllBestRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find({ bestRoom: true }); // Fetch rooms where bestRoom is true
//     res.status(200).json(rooms); // Send the filtered rooms data as JSON
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching rooms in the roomcontroller", error });
//   }
// };

// module.exports = { getAllBestRooms };
