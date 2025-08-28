const Driver = require('../models/DriverModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get all drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ status: { $ne: 'suspended' } })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching drivers',
      error: error.message
    });
  }
};

// Get available drivers
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ 
      isAvailable: true, 
      status: 'active' 
    }).sort({ rating: -1 });
    
    res.status(200).json({
      success: true,
      count: drivers.length,
      drivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching available drivers',
      error: error.message
    });
  }
};

// Get drivers count for public statistics (no authentication required)
const getDriversCount = async (req, res) => {
  try {
    const totalDrivers = await Driver.countDocuments({ status: { $ne: 'suspended' } });
    const availableDrivers = await Driver.countDocuments({ 
      isAvailable: true, 
      status: 'active' 
    });
    
    res.status(200).json({
      success: true,
      totalDrivers,
      availableDrivers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching driver statistics',
      error: error.message
    });
  }
};

// Add new driver (Admin only)
const addDriver = async (req, res) => {
  try {
    const {
      fullName,
      contactNumber,
      email,
      carMake,
      carModel,
      carYear,
      carColor,
      licensePlate,
      pricePerKm
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licensePlate }] 
    });
    
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this email or license plate already exists'
      });
    }

    const driverData = {
      fullName,
      contactNumber,
      email,
      carDetails: {
        make: carMake,
        model: carModel,
        year: parseInt(carYear),
        color: carColor,
        licensePlate
      },
      pricePerKm: parseFloat(pricePerKm) || 15
    };

    // Handle file uploads
    if (req.files) {
      if (req.files.profileImage) {
        driverData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      }
      if (req.files.carImage) {
        driverData.carImage = `/uploads/${req.files.carImage[0].filename}`;
      }
    }

    const driver = new Driver(driverData);
    await driver.save();

    res.status(201).json({
      success: true,
      message: 'Driver added successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding driver',
      error: error.message
    });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Handle car details
    if (req.body.carMake || req.body.carModel || req.body.carYear || req.body.carColor || req.body.licensePlate) {
      updateData.carDetails = {
        make: req.body.carMake,
        model: req.body.carModel,
        year: parseInt(req.body.carYear),
        color: req.body.carColor,
        licensePlate: req.body.licensePlate
      };
    }

    // Handle file uploads
    if (req.files) {
      if (req.files.profileImage) {
        updateData.profileImage = `/uploads/${req.files.profileImage[0].filename}`;
      }
      if (req.files.carImage) {
        updateData.carImage = `/uploads/${req.files.carImage[0].filename}`;
      }
    }

    const driver = await Driver.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver',
      error: error.message
    });
  }
};

// Delete driver
const deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findByIdAndDelete(id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Driver deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting driver',
      error: error.message
    });
  }
};

// Toggle driver availability
const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    
    const driver = await Driver.findById(id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    driver.isAvailable = !driver.isAvailable;
    await driver.save();

    res.status(200).json({
      success: true,
      message: `Driver ${driver.isAvailable ? 'activated' : 'deactivated'} successfully`,
      driver
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating driver availability',
      error: error.message
    });
  }
};

module.exports = {
  getAllDrivers,
  getAvailableDrivers,
  getDriversCount,
  addDriver,
  updateDriver,
  deleteDriver,
  toggleAvailability,
  upload
};
