import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit3, FiTrash2, FiToggleLeft, FiToggleRight, FiUser, FiPhone, FiMail, FiStar, FiTruck } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const DriverManagement = () => {
  const { getToken } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
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

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.GET_ALL_DRIVERS);
      if (response.data.success) {
        setDrivers(response.data.drivers);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await getToken();
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const url = editingDriver 
        ? `${API_ENDPOINTS.UPDATE_DRIVER}/${editingDriver._id}`
        : API_ENDPOINTS.ADD_DRIVER;
      
      const method = editingDriver ? 'put' : 'post';
      
      const response = await axios[method](url, formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        fetchDrivers();
        resetForm();
        setShowAddModal(false);
        setEditingDriver(null);
      }
    } catch (error) {
      console.error('Error saving driver:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (driverId) => {
    if (!window.confirm('Are you sure you want to delete this driver?')) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_ENDPOINTS.API_BASE_URL}/api/drivers/delete/${driverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
    }
  };

  const toggleAvailability = async (driverId) => {
    try {
      const token = await getToken();
      await axios.patch(`${API_ENDPOINTS.API_BASE_URL}/api/drivers/toggle-availability/${driverId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDrivers();
    } catch (error) {
      console.error('Error toggling availability:', error);
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
      profileImage: null,
      carImage: null
    });
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
      profileImage: null,
      carImage: null
    });
    setShowAddModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Driver Management</h2>
          <p className="text-gray-400">Manage drivers for the ride-sharing service</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingDriver(null);
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <FiPlus />
          Add Driver
        </button>
      </div>

      {/* Drivers Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drivers.map((driver) => (
          <div key={driver._id} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            {/* Driver Header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                {driver.profileImage ? (
                  <img 
                    src={`${API_ENDPOINTS.API_BASE_URL}${driver.profileImage}`} 
                    alt={driver.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{driver.fullName}</h3>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <FiStar className="fill-current" />
                  <span>{driver.rating}</span>
                  <span className="text-gray-400">({driver.totalRides} rides)</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FiPhone className="text-blue-400" />
                {driver.contactNumber}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <FiMail className="text-blue-400" />
                {driver.email}
              </div>
            </div>

            {/* Car Details */}
            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="text-purple-400" />
                <span className="text-white font-medium">
                  {driver.carDetails.year} {driver.carDetails.make} {driver.carDetails.model}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                <div>Color: {driver.carDetails.color}</div>
                <div>Plate: {driver.carDetails.licensePlate}</div>
                <div>Rate: R{driver.pricePerKm}/km</div>
              </div>
            </div>

            {/* Car Image */}
            {driver.carImage && (
              <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                <img 
                  src={`${API_ENDPOINTS.API_BASE_URL}${driver.carImage}`} 
                  alt="Car"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Status */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  driver.isAvailable ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className="text-sm text-gray-300">
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
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(driver)}
                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FiEdit3 />
                Edit
              </button>
              <button
                onClick={() => toggleAvailability(driver._id)}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                {driver.isAvailable ? <FiToggleRight /> : <FiToggleLeft />}
              </button>
              <button
                onClick={() => handleDelete(driver._id)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-medium py-2 px-4 rounded-lg transition-all duration-200"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              {editingDriver ? 'Edit Driver' : 'Add New Driver'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Contact Number *</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Price per KM (R) *</label>
                  <input
                    type="number"
                    name="pricePerKm"
                    value={formData.pricePerKm}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Car Make *</label>
                  <input
                    type="text"
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Car Model *</label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Car Year *</label>
                  <input
                    type="number"
                    name="carYear"
                    value={formData.carYear}
                    onChange={handleInputChange}
                    required
                    min="1990"
                    max="2025"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Car Color *</label>
                  <input
                    type="text"
                    name="carColor"
                    value={formData.carColor}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white font-semibold mb-2">License Plate *</label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Profile Image</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Car Image</label>
                  <input
                    type="file"
                    name="carImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : (editingDriver ? 'Update Driver' : 'Add Driver')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingDriver(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-600/20 hover:bg-gray-600/30 border border-gray-500/30 rounded-xl text-gray-300 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverManagement;
