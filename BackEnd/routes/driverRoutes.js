const express = require('express');
const router = express.Router();
const { 
  getAllDrivers, 
  getAvailableDrivers, 
  getDriversCount,
  addDriver, 
  updateDriver, 
  deleteDriver, 
  toggleAvailability,
  upload 
} = require('../controllers/driverController');

// Public routes
router.get('/available', getAvailableDrivers);
router.get('/count', getDriversCount);

// Admin routes (should be protected with admin middleware)
router.get('/all', getAllDrivers);
router.post('/add', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'carImage', maxCount: 1 }
]), addDriver);
router.put('/update/:id', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'carImage', maxCount: 1 }
]), updateDriver);
router.delete('/delete/:id', deleteDriver);
router.patch('/toggle-availability/:id', toggleAvailability);

module.exports = router;
