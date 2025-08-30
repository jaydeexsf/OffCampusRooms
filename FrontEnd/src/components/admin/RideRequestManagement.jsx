import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FiClock, FiMapPin, FiUser, FiDollarSign, FiCheck, FiX, FiUsers, FiTruck, FiMessageCircle, FiPhone, FiMail } from 'react-icons/fi';
import { apiClient, API_BASE_URL } from '../../config/api';

const RideRequestManagement = () => {
  const { getToken, isSignedIn } = useAuth();
  const [rideRequests, setRideRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');

  useEffect(() => {
    if (isSignedIn) {
      fetchRideRequests();
      fetchAvailableDrivers();
    }
  }, [isSignedIn]);

  const fetchRideRequests = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await apiClient.get(`${API_BASE_URL}/api/rides/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter for pending requests
        const pendingRequests = response.data.rides.filter(ride => ride.status === 'pending');
        setRideRequests(pendingRequests);
      }
    } catch (error) {
      console.error('Error fetching ride requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableDrivers = async () => {
    try {
      const token = await getToken();
      const response = await apiClient.get(`${API_BASE_URL}/api/drivers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter for available drivers
        const availableDrivers = response.data.drivers.filter(driver => 
          driver.isAvailable && driver.status === 'active'
        );
        setDrivers(availableDrivers);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const assignDriver = async (rideId, driverId) => {
    try {
      setLoading(true);
      const token = await getToken();
      const response = await apiClient.post(
        `${API_BASE_URL}/api/rides/assign/${rideId}`,
        { driverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert('Driver assigned successfully!');
        fetchRideRequests(); // Refresh the list
        setSelectedRequest(null);
        setSelectedDriver('');
      } else {
        alert('Failed to assign driver: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Error assigning driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDistance = (distance) => {
    return `${distance.toFixed(1)} km`;
  };

  const formatPrice = (price) => {
    return `R${price.toFixed(2)}`;
  };

  // Function to send WhatsApp message
  const sendWhatsAppMessage = (studentContact, studentName, requestDetails) => {
    const message = `Hi ${studentName}! Your ride request has been assigned to a driver.\n\n` +
      `📅 Date: ${new Date(requestDetails.scheduledTime).toLocaleDateString()}\n` +
      `📍 From: ${requestDetails.pickupLocation.address}\n` +
      `🎯 To: ${requestDetails.dropoffLocation.address}\n` +
      `💰 Price: R${requestDetails.estimatedPrice}\n\n` +
      `Your driver will contact you soon. Please be ready at the pickup location.`;
    
    const whatsappUrl = `https://wa.me/${studentContact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to copy SMS message to clipboard
  const copySMSToClipboard = (studentContact, studentName, requestDetails) => {
    const message = `Hi ${studentName}! Your ride request has been assigned to a driver.\n\n` +
      `📅 Date: ${new Date(requestDetails.scheduledTime).toLocaleDateString()}\n` +
      `📍 From: ${requestDetails.pickupLocation.address}\n` +
      `🎯 To: ${requestDetails.dropoffLocation.address}\n` +
      `💰 Price: R${requestDetails.estimatedPrice}\n\n` +
      `Your driver will contact you soon. Please be ready at the pickup location.`;
    
    navigator.clipboard.writeText(message).then(() => {
      alert('SMS message copied to clipboard! You can now paste it in your SMS app.');
    }).catch(() => {
      alert('Failed to copy message. Please copy manually:\n\n' + message);
    });
  };

  // Function to send WhatsApp message to driver with student booking details
  const sendWhatsAppToDriver = (driverContact, driverName, studentName, requestDetails) => {
    const message = `Hi ${driverName}! You have a new ride assignment.\n\n` +
      `👤 Student: ${studentName}\n` +
      `📅 Date: ${new Date(requestDetails.scheduledTime).toLocaleDateString()}\n` +
      `📍 Pickup: ${requestDetails.pickupLocation.address || `${requestDetails.pickupLocation.lat}, ${requestDetails.pickupLocation.lng}`}\n` +
      `🎯 Dropoff: ${requestDetails.dropoffLocation.address || `${requestDetails.dropoffLocation.lng}, ${requestDetails.dropoffLocation.lng}`}\n` +
      `💰 Price: R${requestDetails.estimatedPrice}\n` +
      `📏 Distance: ${requestDetails.distance} km\n\n` +
      `Please contact the student and confirm pickup time.`;
    
    const whatsappUrl = `https://wa.me/${driverContact.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Function to copy SMS message to clipboard for driver
  const copySMSToDriver = (driverContact, driverName, studentName, requestDetails) => {
    const message = `Hi ${driverName}! You have a new ride assignment.\n\n` +
      `👤 Student: ${studentName}\n` +
      `📅 Date: ${new Date(requestDetails.scheduledTime).toLocaleDateString()}\n` +
      `📍 Pickup: ${requestDetails.pickupLocation.address || `${requestDetails.pickupLocation.lat}, ${requestDetails.pickupLocation.lng}`}\n` +
      `🎯 Dropoff: ${requestDetails.dropoffLocation.address || `${requestDetails.dropoffLocation.lng}, ${requestDetails.dropoffLocation.lng}`}\n` +
      `💰 Price: R${requestDetails.estimatedPrice}\n` +
      `📏 Distance: ${requestDetails.distance} km\n\n` +
      `Please contact the student and confirm pickup time.`;
    
    navigator.clipboard.writeText(message).then(() => {
      alert('Driver SMS message copied to clipboard! You can now paste it in your SMS app.');
    }).catch(() => {
      alert('Failed to copy message. Please copy manually:\n\n' + message);
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <FiUser className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
              <p className="text-gray-400 mb-8">
                Please sign in with admin credentials to manage ride requests.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Ride Request <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            <p className="text-gray-400">Assign drivers to pending ride requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <FiClock className="text-yellow-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Pending Requests</p>
                  <p className="text-white text-2xl font-bold">{rideRequests.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <FiTruck className="text-green-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Available Drivers</p>
                  <p className="text-white text-2xl font-bold">{drivers.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3">
                <FiUsers className="text-blue-400 text-2xl" />
                <div>
                  <p className="text-gray-400 text-sm">Total Revenue</p>
                  <p className="text-white text-2xl font-bold">
                    {formatPrice(rideRequests.reduce((sum, ride) => sum + ride.estimatedPrice, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
              <p className="text-gray-400 mt-2">Loading...</p>
            </div>
          )}

          {/* Ride Requests List */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Pending Ride Requests</h2>
            
            {rideRequests.length === 0 ? (
              <div className="text-center py-12">
                <FiCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No pending ride requests</p>
                <p className="text-gray-500 text-sm">All requests have been assigned!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div key={request._id} className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Request Details */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-blue-400" />
                          <div>
                            <p className="text-white font-semibold">{request.studentName}</p>
                            <p className="text-gray-400 text-sm">{request.studentContact}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <FiMapPin className="text-green-400 mt-1" />
                            <div>
                              <p className="text-gray-400 text-sm">Pickup</p>
                              <p className="text-white text-sm">
                                {request.pickupLocation.address || `${request.pickupLocation.lat}, ${request.pickupLocation.lng}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <FiMapPin className="text-red-400 mt-1" />
                            <div>
                              <p className="text-gray-400 text-sm">Dropoff</p>
                              <p className="text-white text-sm">
                                {request.dropoffLocation.address || `${request.dropoffLocation.lat}, ${request.dropoffLocation.lng}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Distance</p>
                            <p className="text-white">{formatDistance(request.distance)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Price</p>
                            <p className="text-white">{formatPrice(request.estimatedPrice)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Scheduled</p>
                            <p className="text-white text-sm">{formatDateTime(request.scheduledTime)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Booking Type</p>
                            <p className="text-white capitalize">{request.bookingType}</p>
                          </div>
                        </div>

                        {request.notes && (
                          <div>
                            <p className="text-gray-400 text-sm">Notes</p>
                            <p className="text-white text-sm">{request.notes}</p>
                          </div>
                        )}

                        {/* Special Features */}
                        <div className="flex flex-wrap gap-2">
                          {request.splitFare?.enabled && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                              Split Fare ({request.splitFare.totalParticipants} people)
                            </span>
                          )}
                          {request.isSharedRide && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              Shared Ride (max {request.maxSharedPassengers})
                            </span>
                          )}
                          {request.groupSize > 1 && (
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                              Group Size: {request.groupSize}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Driver Assignment */}
                      <div className="space-y-4">
                        <h3 className="text-white font-semibold">Assign Driver</h3>
                        
                        <div className="space-y-3">
                          <select
                            value={selectedRequest === request._id ? selectedDriver : ''}
                            onChange={(e) => {
                              setSelectedRequest(request._id);
                              setSelectedDriver(e.target.value);
                            }}
                            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400"
                          >
                            <option value="">Select a driver...</option>
                            {drivers.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.name} - {driver.carMake} {driver.carModel} ({driver.carColor})
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => assignDriver(request._id, selectedDriver)}
                            disabled={!selectedDriver || loading || selectedRequest !== request._id}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
                          >
                            {loading && selectedRequest === request._id ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Assigning...
                              </div>
                            ) : (
                              'Assign Driver'
                            )}
                          </button>
                        </div>

                        {/* Available Drivers Preview */}
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-sm mb-2">Available Drivers ({drivers.length})</p>
                          <div className="space-y-1 max-h-32 overflow-y-auto">
                            {drivers.slice(0, 3).map((driver) => (
                              <div key={driver._id} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-white">{driver.name}</span>
                                <span className="text-gray-400">- {driver.carMake} {driver.carModel}</span>
                              </div>
                            ))}
                            {drivers.length > 3 && (
                              <p className="text-gray-500 text-xs">+{drivers.length - 3} more drivers</p>
                            )}
                          </div>
                        </div>

                        {/* Communication Actions */}
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-sm mb-2">Contact Student</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => sendWhatsAppMessage(request.studentContact, request.studentName, request)}
                              className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                              title="Send WhatsApp Message"
                            >
                              <FiMessageCircle className="w-3 h-3" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                            
                            <button
                              onClick={() => copySMSToClipboard(request.studentContact, request.studentName, request)}
                              className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                              title="Copy SMS Message"
                            >
                              <FiPhone className="w-3 h-3" />
                              <span className="hidden sm:inline">SMS</span>
                            </button>
                          </div>
                        </div>

                        {/* Driver Communication Section */}
                        <div className="bg-gray-800/50 rounded-lg p-3">
                          <p className="text-gray-400 text-sm mb-2">Notify Driver</p>
                          <p className="text-gray-500 text-xs mb-2">Send booking details to assigned driver</p>
                          
                          {selectedDriver ? (
                            <div className="space-y-2">
                              {drivers.find(d => d._id === selectedDriver) && (
                                <div className="bg-gray-700/50 rounded p-2 mb-2">
                                  <p className="text-white text-xs font-medium">
                                    Selected Driver: {drivers.find(d => d._id === selectedDriver)?.name}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    Contact: {drivers.find(d => d._id === selectedDriver)?.contactNumber}
                                  </p>
                                </div>
                              )}
                              
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    const driver = drivers.find(d => d._id === selectedDriver);
                                    if (driver) {
                                      sendWhatsAppToDriver(driver.contactNumber, driver.name, request.studentName, request);
                                    }
                                  }}
                                  className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                                  title="Send WhatsApp to Driver"
                                >
                                  <FiMessageCircle className="w-3 h-3" />
                                  <span className="hidden sm:inline">Driver WhatsApp</span>
                                </button>
                                
                                <button
                                  onClick={() => {
                                    const driver = drivers.find(d => d._id === selectedDriver);
                                    if (driver) {
                                      copySMSToDriver(driver.contactNumber, driver.name, request.studentName, request);
                                    }
                                  }}
                                  className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 rounded-lg px-2 py-2 text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1"
                                  title="Copy SMS for Driver"
                                >
                                  <FiPhone className="w-3 h-3" />
                                  <span className="hidden sm:inline">Driver SMS</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-gray-500 text-xs">Select a driver first to send notification</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideRequestManagement;
