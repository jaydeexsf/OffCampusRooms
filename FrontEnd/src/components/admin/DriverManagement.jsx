import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiUser, FiPhone, FiMail, FiStar, FiTruck, FiCheck, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { apiClient, API_ENDPOINTS } from '../../config/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../ToastContainer';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toasts, success, error: showError, removeToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    carMake: '',
    carModel: '',
    carYear: '',
    carColor: '',
    licensePlate: '',
    pricePerKm: '15',
    profileImage: null,
    carImage: null
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timeout = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message.text]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_ALL_DRIVERS);
      if (response.data.success) {
        setDrivers(response.data.drivers || []);
        console.log('✅ Drivers fetched successfully:', response.data.drivers?.length || 0);
      } else {
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Use dummy data as fallback
      const dummyDrivers = [
        { _id: '1', fullName: 'John Smith', contactNumber: '+27 82 123 4567', email: 'john@example.com', carMake: 'Toyota', carModel: 'Corolla', isAvailable: true, rating: 4.8 },
        { _id: '2', fullName: 'Sarah Johnson', contactNumber: '+27 83 234 5678', email: 'sarah@example.com', carMake: 'Honda', carModel: 'Civic', isAvailable: true, rating: 4.9 },
        { _id: '3', fullName: 'Mike Wilson', contactNumber: '+27 84 345 6789', email: 'mike@example.com', carMake: 'Ford', carModel: 'Focus', isAvailable: false, rating: 4.7 }
      ];
      setDrivers(dummyDrivers);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load drivers from server. Showing demo data.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const cloudinaryUpload = async (file) => {
    console.log('📸 Uploading driver image to Cloudinary:', file.name);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'roomImages');
    formData.append('cloud_name', 'daqzt4zy1');

    try {
      // Use direct fetch instead of apiClient to avoid CORS issues with authorization header
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/daqzt4zy1/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Driver image uploaded successfully:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Error uploading driver image to Cloudinary:', error.message);
      throw error;
    }
  };

  const deleteFromCloudinary = async (imageUrl) => {
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = imageUrl.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = publicIdWithExtension.split('.')[0];
      
      console.log('🗑️ Deleting image from Cloudinary:', publicId);
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/daqzt4zy1/image/destroy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          upload_preset: 'roomImages'
        })
      });
      
      const result = await response.json();
      console.log('✅ Image deleted from Cloudinary:', result);
      return result;
    } catch (error) {
      console.error('❌ Error deleting image from Cloudinary:', error);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      try {
        console.log('📤 Processing driver image upload for:', name);
        const uploadedUrl = await cloudinaryUpload(files[0]);
        setFormData(prev => ({
          ...prev,
          [name]: uploadedUrl
        }));
        console.log('✅ Driver image URL saved:', uploadedUrl);
      } catch (error) {
        console.error('❌ Failed to upload driver image:', error);
        setMessage({ 
          type: 'error', 
          text: 'Failed to upload image. Please try again.' 
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    console.log('🚗 Submitting driver form:', {
      isEditing: !!editingDriver,
      driverId: editingDriver?._id,
      formData: {
        fullName: formData.fullName,
        email: formData.email,
        hasProfileImage: !!formData.profileImage,
        hasCarImage: !!formData.carImage
      }
    });

    try {
      const endpoint = editingDriver 
        ? `${API_ENDPOINTS.UPDATE_DRIVER}/${editingDriver._id}`
        : API_ENDPOINTS.ADD_DRIVER;
      
      const method = editingDriver ? 'put' : 'post';
      
      const response = await apiClient[method](endpoint, formData);
      console.log('✅ Driver operation successful:', response.data);
      
      success(response.data?.message || `Driver ${editingDriver ? 'updated' : 'created'} successfully!`);
      
      await fetchDrivers();
      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error('❌ Error saving driver:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save driver. Please try again.';
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;
    
    setDeleting(true);
    try {
      const response = await apiClient.delete(`${API_ENDPOINTS.DELETE_DRIVER}/${driverToDelete._id}`);
      
      // Delete images from Cloudinary after successful database deletion
      if (driverToDelete?.profileImage) {
        await deleteFromCloudinary(driverToDelete.profileImage);
      }
      if (driverToDelete?.carImage) {
        await deleteFromCloudinary(driverToDelete.carImage);
      }
      
      success(response.data?.message || 'Driver deleted successfully!');
      
      await fetchDrivers();
      setShowDeleteModal(false);
      setDriverToDelete(null);
    } catch (error) {
      console.error('❌ Error deleting driver:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete driver. Please try again.';
      showError(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };

  const toggleAvailability = async (driverId) => {
    try {
      await apiClient.patch(`${API_ENDPOINTS.TOGGLE_DRIVER_AVAILABILITY}/${driverId}`, {});
      success('Driver availability updated successfully!');
      fetchDrivers();
    } catch (error) {
      console.error('Error toggling availability:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update driver availability. Please try again.';
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
      showError(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      contactNumber: '',
      email: '',
      carMake: '',
      carModel: '',
      carYear: '',
      carColor: '',
      licensePlate: '',
      pricePerKm: '15',
      profileImage: '',
      carImage: ''
    });
    setMessage({ type: '', text: '' });
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setFormData({
      fullName: driver.fullName,
      contactNumber: driver.contactNumber,
      email: driver.email,
      carMake: driver.carDetails.make,
      carModel: driver.carDetails.model,
      carYear: driver.carDetails.year.toString(),
      carColor: driver.carDetails.color,
      licensePlate: driver.carDetails.licensePlate,
      pricePerKm: driver.pricePerKm.toString(),
      profileImage: driver.profileImage || '',
      carImage: driver.carImage || ''
    });
    setShowAddModal(true);
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Driver Management</h2>
          <p className="text-gray-400 text-sm sm:text-base">Manage drivers for the ride-sharing service</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingDriver(null);
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base"
        >
          <FiPlus />
          Add Driver
        </button>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-xl border mb-6 ${
          message.type === 'success'
            ? 'bg-green-500/20 border-green-500/30 text-green-400'
            : 'bg-red-500/20 border-red-500/30 text-red-400'
        } flex items-center gap-3`}>
          {message.type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-400">Loading drivers...</span>
        </div>
      ) : (
        <>
          {/* Drivers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {drivers.map((driver) => (
          <div key={driver._id} className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
            {/* Driver Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center flex-shrink-0">
                {driver.profileImage ? (
                  <img 
                    src={driver.profileImage} 
                    alt={driver.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm sm:text-base truncate">{driver.fullName}</h3>
                <div className="flex items-center gap-1 text-yellow-400 text-xs sm:text-sm">
                  <FiStar className="fill-current" />
                  <span>{driver.rating}</span>
                  <span className="text-gray-400">({driver.totalRides} rides)</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <FiPhone className="text-blue-400 flex-shrink-0" />
                <span className="truncate">{driver.contactNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                <FiMail className="text-blue-400 flex-shrink-0" />
                <span className="truncate">{driver.email}</span>
              </div>
            </div>

            {/* Car Details */}
            <div className="bg-white/5 rounded-xl p-3 sm:p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="text-purple-400 flex-shrink-0" />
                <span className="text-white font-medium text-xs sm:text-sm truncate">
                  {driver.carDetails.year} {driver.carDetails.make} {driver.carDetails.model}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-gray-400 space-y-1">
                <div className="truncate">Color: {driver.carDetails.color}</div>
                <div className="truncate">Plate: {driver.carDetails.licensePlate}</div>
                <div>Rate: R{driver.pricePerKm}/km</div>
              </div>
            </div>

            {/* Car Image */}
            {driver.carImage && (
              <div className="w-full h-24 sm:h-32 rounded-xl overflow-hidden mb-4">
                <img 
                  src={driver.carImage} 
                  alt="Car"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                  driver.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs sm:text-sm text-gray-300">
                  {driver.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                driver.status === 'active' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {driver.status}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => openEditModal(driver)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium py-2 px-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
              >
                <FiEdit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => toggleAvailability(driver._id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-medium py-2 px-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {driver.isAvailable ? <FiToggleRight className="w-4 h-4" /> : <FiToggleLeft className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDeleteClick(driver)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium py-2 px-2 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        ))}
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items justify-center p-2 sm:p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-4 sm:mb-6">
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Price per KM (R) *</label>
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Car Make *</label>
                  <input
                    type="text"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Car Model *</label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Car Year *</label>
                  <input
                    type="number"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max="2025"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Car Color *</label>
                  <input
                    type="text"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Profile Image</label>
                  {formData.profileImage && (
                    <div className="mb-3">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-700">
                        <img 
                          src={formData.profileImage} 
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteFromCloudinary(formData.profileImage);
                            setFormData(prev => ({ ...prev, profileImage: '' }));
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2 text-sm sm:text-base">Car Image</label>
                  {formData.carImage && (
                    <div className="mb-3">
                      <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gray-700">
                        <img 
                          src={formData.carImage} 
                          alt="Car preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteFromCloudinary(formData.carImage);
                            setFormData(prev => ({ ...prev, carImage: '' }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    name="carImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-white file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm sm:text-base flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingDriver ? 'Update Driver' : 'Add Driver'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDriver(null);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-xl text-gray-300 font-semibold transition-all duration-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Delete Driver</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <span className="font-semibold text-white">{driverToDelete?.fullName}</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deleting}
                  className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 text-gray-300 font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default DriverManagement;
