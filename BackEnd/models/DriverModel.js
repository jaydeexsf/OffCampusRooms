const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  carImage: {
    type: String,
    default: ''
  },
  carDetails: {
    make: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true
    }
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 1,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  pricePerKm: {
    type: Number,
    required: true,
    default: 15 // R15 per km
  },
  currentLocation: {
    lat: {
      type: Number,
      default: -23.8962
    },
    lng: {
      type: Number,
      default: 29.4473
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for location-based queries
driverSchema.index({ 'currentLocation.lat': 1, 'currentLocation.lng': 1 });

module.exports = mongoose.model('Driver', driverSchema);
