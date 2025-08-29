const Driver = require('../models/DriverModel');

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
  console.log('🚗 Creating new driver...');
  console.log('📝 Driver data received:', {
    fullName: req.body.fullName,
    email: req.body.email,
    hasProfileImage: !!req.body.profileImage,
    hasCarImage: !!req.body.carImage
  });

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
      pricePerKm,
      profileImage,
      carImage
    } = req.body;

    // Check if driver already exists
    const existingDriver = await Driver.findOne({ 
      $or: [{ email }, { licensePlate }] 
    });
    
    if (existingDriver) {
      console.log('❌ Driver already exists:', { email, licensePlate });
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

    // Handle Cloudinary image URLs
    if (profileImage) {
      driverData.profileImage = profileImage;
      console.log('✅ Profile image URL added:', profileImage);
    }
    if (carImage) {
      driverData.carImage = carImage;
      console.log('✅ Car image URL added:', carImage);
    }

    const driver = new Driver(driverData);
    const savedDriver = await driver.save();
    console.log('✅ Driver created successfully:', savedDriver._id);

    res.status(201).json({
      success: true,
      message: 'Driver added successfully!',
      driver: savedDriver
    });
  } catch (error) {
    console.error('❌ Error adding driver:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding driver',
      error: error.message
    });
  }
};

// Update driver
const updateDriver = async (req, res) => {
  console.log('🔄 Updating driver:', req.params.id);
  console.log('📝 Update data received:', {
    fullName: req.body.fullName,
    email: req.body.email,
    hasProfileImage: !!req.body.profileImage,
    hasCarImage: !!req.body.carImage
  });

  try {
    const { id } = req.params;
    const {
      fullName,
      contactNumber,
      email,
      carMake,
      carModel,
      carYear,
      carColor,
      licensePlate,
      pricePerKm,
      profileImage,
      carImage
    } = req.body;

    const updateData = {
      fullName,
      contactNumber,
      email,
      pricePerKm: parseFloat(pricePerKm) || 15
    };

    // Handle car details
    if (carMake || carModel || carYear || carColor || licensePlate) {
      updateData.carDetails = {
        make: carMake,
        model: carModel,
        year: parseInt(carYear),
        color: carColor,
        licensePlate
      };
    }

    // Handle Cloudinary image URLs
    if (profileImage) {
      updateData.profileImage = profileImage;
      console.log('✅ Profile image URL updated:', profileImage);
    }
    if (carImage) {
      updateData.carImage = carImage;
      console.log('✅ Car image URL updated:', carImage);
    }

    const driver = await Driver.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!driver) {
      console.log('❌ Driver not found:', id);
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    console.log('✅ Driver updated successfully:', driver._id);
    res.status(200).json({
      success: true,
      message: 'Driver updated successfully!',
      driver
    });
  } catch (error) {
    console.error('❌ Error updating driver:', error);
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
  toggleAvailability
};
