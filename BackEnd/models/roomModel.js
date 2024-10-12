const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  img: String,
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  minutesAway: { type: Number },
  location: { type: String, required: true },
  amenities: {
    wifi: Boolean,
    shower: Boolean,
    bathtub: Boolean,
    table: Boolean,
    bed: Boolean,
    electricity: Boolean,
  },
  contact: {
    phone: String,
    whatsapp: String,
    email: String,
  },
  images: [String],
  availableRooms: Number,
  bestRoom: Boolean, 
  coordinates: {
    lat: Number,
    long: Number,
  },
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
