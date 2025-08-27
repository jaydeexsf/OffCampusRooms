const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentContact: {
    type: String,
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver',
    required: true
  },
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  dropoffLocation: {
    address: {
      type: String,
      required: true
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  distance: {
    type: Number,
    required: true // in kilometers
  },
  estimatedPrice: {
    type: Number,
    required: true
  },
  actualPrice: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  scheduledTime: {
    type: Date,
    default: Date.now
  },
  acceptedAt: {
    type: Date,
    default: null
  },
  completedAt: {
    type: Date,
    default: null
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedback: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  // New fields for advanced booking
  bookingType: {
    type: String,
    enum: ['regular', 'semester_move_in', 'semester_move_out', 'holiday_transport', 'group_booking'],
    default: 'regular'
  },
  groupSize: {
    type: Number,
    default: 1,
    min: 1
  },
  luggageCount: {
    type: Number,
    default: 0
  },
  furnitureItems: [{
    item: String,
    quantity: Number
  }],
  semester: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter'],
    default: null
  },
  academicYear: {
    type: String,
    default: null
  },
  holidayType: {
    type: String,
    enum: ['christmas', 'easter', 'summer_break', 'winter_break', 'other'],
    default: null
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
rideSchema.index({ studentId: 1, createdAt: -1 });
rideSchema.index({ driverId: 1, status: 1 });
rideSchema.index({ bookingType: 1, scheduledTime: 1 });
rideSchema.index({ semester: 1, academicYear: 1 });
rideSchema.index({ holidayType: 1, scheduledTime: 1 });

module.exports = mongoose.model('Ride', rideSchema);
