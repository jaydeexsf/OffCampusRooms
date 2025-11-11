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
    console.log('🔍 Fetching best rooms from database...');
    const bestRooms = await Room.find({ bestRoom: true });
    console.log(`✅ Found ${bestRooms.length} best rooms in database`);

    // If no best rooms found, try to get some regular rooms as fallback
    if (bestRooms.length === 0) {
      console.log('⚠️ No best rooms found, fetching regular rooms as fallback...');
      const regularRooms = await Room.find().limit(6);
      console.log(`📊 Using ${regularRooms.length} regular rooms as fallback`);
      return res.status(200).json({ bestRooms: regularRooms });
    }

    res.status(200).json({ bestRooms });
  } catch (error) {
    console.error("❌ Error fetching best rooms:", error);
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
      bestRoom,
      securityStrength,
      problems,
      positive
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
      bestRoom: bestRoom || false,
      securityStrength: securityStrength || null,
      problems: problems || null,
      positive: positive || null
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
      coordinates,
      primaryImageIndex,
      securityStrength,
      problems,
      positive
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
              primaryImageIndex,
              securityStrength: securityStrength || null,
              problems: problems || null,
              positive: positive || null
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

const escapeRegex = (text) => {
  try {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  } catch (e) {
    return text;
  }
};

const searchRooms = async (req, res) => {
  try {
      console.log('Search rooms query params:', req.query);
      const { location, maxPrice, limitBy, amenities, search, maxDistance } = req.query; 

      let query = {};
      
      // Handle location filter
      if (location && location !== "All") {
          // Case-insensitive exact match on location
          const safe = escapeRegex(String(location));
          query.location = { $regex: new RegExp(`^${safe}$`, 'i') };
      }
      
      // Handle price filter
      if (maxPrice) {
          const priceNum = parseInt(maxPrice, 10);
          if (!Number.isNaN(priceNum)) {
              query.price = { $lte: priceNum };
          }
      }
      
      // Handle amenities filter
      if (amenities) {
          // Support comma-separated string, repeated query params, or array
          const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : typeof amenities === 'string'
              ? amenities.split(',').map(a => a.trim()).filter(Boolean)
              : [];
          console.log('Amenities array:', amenitiesArray);

          if (amenitiesArray.length > 0) {
              // Use $and to ensure ALL selected amenities are present
              const amenitiesConditions = amenitiesArray.map(amenity => ({
                  [`amenities.${amenity}`]: true
              }));
              if (amenitiesConditions.length > 0) {
                  query.$and = amenitiesConditions;
              }
          }
      }
      
      // Handle search term
      if (search) {
          const safeSearch = escapeRegex(String(search));
          query.$or = [
              { title: { $regex: safeSearch, $options: 'i' } },
              { description: { $regex: safeSearch, $options: 'i' } },
              { location: { $regex: safeSearch, $options: 'i' } }
          ];
      }
      
      // Handle distance filter
      if (maxDistance) {
          const distNum = parseInt(maxDistance, 10);
          if (!Number.isNaN(distNum)) {
              query.minutesAway = { $lte: distNum };
          }
      }

      console.log('Final query:', JSON.stringify(query, null, 2));
      
      let limit = 50;
      if (typeof limitBy !== 'undefined') {
          const parsed = parseInt(limitBy, 10);
          if (!Number.isNaN(parsed) && parsed > 0 && parsed <= 200) {
              limit = parsed;
          }
      }

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

