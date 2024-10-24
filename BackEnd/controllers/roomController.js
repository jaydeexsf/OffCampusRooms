const Room = require("../models/roomModel");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().limit();
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

    res.status(200).json({bestRooms}); // Send best rooms
  } catch (error) {
    console.error("Error fetching best rooms:", error);
    res.status(500).json({ message: "Error fetching best rooms", error: error.message });
  }
};


const addRoom = async (req, res) => {
  try {
    // Destructure the room data from req.body
    const {
      title,
      description,
      price,
      minutesAway,
      location,
      amenities, 
      contact,  
      availableRooms,
      images,   
      coordinates,
    } = req.body;

    // Create a new Room instance
    const newRoom = new Room({
      title,
      description,
      price,
      minutesAway,
      location,
      amenities,        
      contact,           
      images: images, 
      availableRooms,
      coordinates,
    });

    await newRoom.save();
    
    res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error adding room:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to add room' });
  }
};

// const addRoom = async (req, res) => {
//   const {
//       title,
//       img,
//       description,
//       price,
//       minutesAway,
//       location,
//       amenities,
//       contact,
//       images,
//       availableRooms,
//       bestRoom
//   } = req.body;

//   if (!title || !price || !location) {
//       return res.status(400).json({ message: 'Title, price, and location are required.' });
//   }

//   try {
//       const room = new Room({
//           title,
//           img,
//           description,
//           price,
//           minutesAway,
//           location,
//           amenities,
//           contact,
//           images,
//           availableRooms,
//           bestRoom
//       });
      
//       await room.save();

//       res.status(201).json({ message: 'Room added successfully', room });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: 'Error adding room' });
//   }
// };

const updateRoom = async (req, res) => {
  const {
      title,
      img, 
      description,
      price,
      minutesAway,
      location,
      amenities,
      contact, 
      images,
      availableRooms,
      bestRoom,
      coordinates
  } = req.body; 

  const roomId = req.params.id

  try {
      const room = await Room.findByIdAndUpdate(
          roomId,
          { 
              title,
              img,
              description,
              price,
              minutesAway,
              location,
              amenities,
              contact,
              images,
              availableRooms,
              bestRoom,
              coordinates,
          },
          { new: true, runValidators: true }
      );

      if (!room) {
          return res.status(404).json({ message: "Room not found" });
      }

      res.status(200).json({ message: "Room updated successfully", room });
  } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: "Error updating room" });
  }
};

// deleting rpoom
const deleteRoom = async (req, res)=> {
  const roomId = req.params.id
  try {
    const droom = await Room.findByIdAndDelete(roomId)
    res.status(200).json({message: "room updated succesfully", droom})
  } catch (err) {
    console.log( 'there was an error deleting room' + err)
    res.status(400).json({message: "there was a problem deleting room"})
  }
}

const searchRooms = async (req, res) => {
  try {
      const { location, maxPrice, limitBy } = req.query; 

      let query = {};
      if (location !== "All") query.location = location.toLowerCase();
      if (maxPrice) query.price = { $lte: maxPrice };

      const rooms = await Room.find(query).limit(limitBy); 
      const roomCount = await Room.countDocuments(query);

      res.json({rooms, roomCount});
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = { getAllRooms, getAllBestRooms, updateRoom, addRoom, deleteRoom, searchRooms };

