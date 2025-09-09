import React, { useState } from 'react';
import { FiX, FiUpload, FiMapPin, FiDollarSign, FiClock, FiWifi, FiShower, FiBed, FiTable, FiZap } from 'react-icons/fi';
import { apiClient, API_ENDPOINTS } from '../../config/api';
import { useToast } from '../../hooks/useToast';
import ToastContainer from '../ToastContainer';

const AddRoomPopup = ({ isOpen, onClose, onRoomAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    minutesAway: '',
    location: '',
    amenities: {
      wifi: false,
      shower: false,
      bathtub: false,
      table: false,
      bed: false,
      electricity: false,
    },
    contact: {
      phone: '',
      whatsapp: '',
      email: ''
    },
    availableRooms: '',
    bestRoom: false,
    coordinates: {
      lat: '',
      long: ''
    }
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toasts, success, error: showError, removeToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert images to base64 or upload them
      const imageUrls = images.map(img => URL.createObjectURL(img)); // For demo, use object URLs
      
      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        minutesAway: parseInt(formData.minutesAway),
        availableRooms: parseInt(formData.availableRooms),
        coordinates: {
          lat: parseFloat(formData.coordinates.lat),
          long: parseFloat(formData.coordinates.long)
        },
        images: imageUrls
      };

      const response = await apiClient.post(API_ENDPOINTS.ADD_ROOM, roomData);
      
      if (response.data.success) {
        success('Room added successfully!');
        onRoomAdded && onRoomAdded();
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          minutesAway: '',
          location: '',
          amenities: {
            wifi: false,
            shower: false,
            bathtub: false,
            table: false,
            bed: false,
            electricity: false,
          },
          contact: {
            phone: '',
            whatsapp: '',
            email: ''
          },
          availableRooms: '',
          bestRoom: false,
          coordinates: {
            lat: '',
            long: ''
          }
        });
        setImages([]);
      }
    } catch (error) {
      console.error('Error adding room:', error);
      showError('Failed to add room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">Add New Room</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Room Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter room title"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Price (R) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter monthly rent"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the room and its features"
              />
            </div>

            {/* Location & Distance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Location *</label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="gate 1">Gate 1</option>
                  <option value="gate 2">Gate 2</option>
                  <option value="gate 3">Gate 3</option>
                  <option value="motintane">Ga-motintane</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Distance (minutes) *</label>
                <input
                  type="number"
                  name="minutesAway"
                  value={formData.minutesAway}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Minutes to UL"
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">Available Rooms</label>
                <input
                  type="number"
                  name="availableRooms"
                  value={formData.availableRooms}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Number of rooms"
                />
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-white font-medium mb-3">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(formData.amenities).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name={`amenities.${key}`}
                      checked={value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
                    />
                    <span className="text-white capitalize">{key}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-white font-medium mb-3">Contact Information</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="tel"
                  name="contact.phone"
                  value={formData.contact.phone}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone Number"
                />
                <input
                  type="tel"
                  name="contact.whatsapp"
                  value={formData.contact.whatsapp}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="WhatsApp Number"
                />
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email Address"
                />
              </div>
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  name="coordinates.lat"
                  value={formData.coordinates.lat}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Latitude"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  name="coordinates.long"
                  value={formData.coordinates.long}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Longitude"
                />
              </div>
            </div>

            {/* Best Room Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="bestRoom"
                checked={formData.bestRoom}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500"
              />
              <label className="text-white font-medium">Mark as Best Room</label>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Room...' : 'Add Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRoomPopup;
