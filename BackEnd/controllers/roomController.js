const Room = require("../models/roomModel");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().limit(100);
    console.log(`Found ${rooms.length} rooms in database`);
    res.status(200).json({rooms});
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Error fetching rooms", error: error.message });
  }
};

// Get single room by ID
const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    res.status(200).json({ room });
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    res.status(500).json({ message: "Error fetching room", error: error.message });
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
  console.log('🏠 Creating new room...');
  console.log('📝 Room data received:', {
    title: req.body.title,
    price: req.body.price,
    location: req.body.location,
    imagesCount: req.body.images?.length || 0,
    coordinates: req.body.coordinates
  });

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
      bestRoom
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
      bestRoom: bestRoom || false
    });

    const savedRoom = await newRoom.save();
    console.log('✅ Room created successfully:', savedRoom._id);
    
    res.status(201).json({
      message: 'Room added successfully!',
      room: savedRoom,
      success: true
    });
  } catch (error) {
    console.error('❌ Error adding room:', error);
    res.status(500).json({ 
      message: 'Failed to add room', 
      error: error.message,
      success: false 
    });
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
      console.log('Search rooms query params:', req.query);
      const { location, maxPrice, limitBy, amenities, search, maxDistance } = req.query; 

      let query = {};
      
      // Handle location filter
      if (location && location !== "All") {
          query.location = location.toLowerCase();
      }
      
      // Handle price filter
      if (maxPrice) {
          query.price = { $lte: parseInt(maxPrice) };
      }
      
      // Handle amenities filter
      if (amenities) {
          const amenitiesArray = amenities.split(',');
          console.log('Amenities array:', amenitiesArray);
          
          // Use $and to ensure ALL selected amenities are present
          const amenitiesConditions = amenitiesArray.map(amenity => ({
              [`amenities.${amenity}`]: true
          }));
          
          if (amenitiesConditions.length > 0) {
              query.$and = amenitiesConditions;
          }
      }
      
      // Handle search term
      if (search) {
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { location: { $regex: search, $options: 'i' } }
          ];
      }
      
      // Handle distance filter
      if (maxDistance) {
          query.minutesAway = { $lte: parseInt(maxDistance) };
      }

      console.log('Final query:', JSON.stringify(query, null, 2));
      
      const limit = limitBy ? parseInt(limitBy) : 50;
      const rooms = await Room.find(query).limit(limit); 
      const roomCount = await Room.countDocuments(query);

      console.log(`Found ${rooms.length} rooms out of ${roomCount} total`);
      
      res.json({rooms, roomCount});
  } catch (err) {
      console.error('Search rooms error:', err);
      res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


module.exports = { getAllRooms, getAllBestRooms, getRoomById, updateRoom, addRoom, deleteRoom, searchRooms };

