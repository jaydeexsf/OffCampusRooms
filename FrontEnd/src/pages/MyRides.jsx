import React, { useState, useEffect } from 'react';
import { FiMapPin, FiClock, FiDollarSign, FiUser, FiPhone, FiStar, FiTruck } from 'react-icons/fi';
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiClient } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

const MyRides = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (isSignedIn && user) {
      fetchMyRides();
    }
  }, [isSignedIn, user]);

  const fetchMyRides = async () => {
    try {
              const response = await apiClient.get(`${API_ENDPOINTS.API_BASE_URL}/api/rides/student`);
      if (response.data.success) {
        setRides(response.data.rides);
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'accepted':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredRides = rides.filter(ride => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'accepted', 'in_progress'].includes(ride.status);
    if (activeTab === 'completed') return ride.status === 'completed';
    return ride.status === activeTab;
  });

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <FiTruck className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-gray-400 mb-8">
                Please sign in to view your ride history and manage bookings.
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rides
              </span>
            </h1>
            <p className="text-gray-400">Track your ride bookings and history</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Rides' },
                { id: 'active', label: 'Active' },
                { id: 'completed', label: 'Completed' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rides List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredRides.length > 0 ? (
            <div className="space-y-6">
              {filteredRides.map((ride) => (
                <div key={ride._id} className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                        {ride.driverId?.profileImage ? (
                          <img 
                            src={`${API_ENDPOINTS.API_BASE_URL}${ride.driverId.profileImage}`} 
                            alt={ride.driverId.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{ride.driverId?.fullName}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <FiPhone />
                          {ride.driverId?.contactNumber}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusColor(ride.status)}`}>
                      {ride.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-4">
                    <div>
                      <div className="flex items-start gap-2 mb-3">
                        <FiMapPin className="text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Pickup</p>
                          <p className="text-white text-sm">{ride.pickupLocation.address}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiMapPin className="text-red-500 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-400">Dropoff</p>
                          <p className="text-white text-sm">{ride.dropoffLocation.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Distance:</span>
                        <span className="text-white text-sm">{ride.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Price:</span>
                        <span className="text-green-400 font-semibold">R{ride.actualPrice || ride.estimatedPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 text-sm">Booked:</span>
                        <span className="text-white text-sm">
                          {new Date(ride.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {ride.driverId?.carDetails && (
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FiTruck className="text-blue-400" />
                        <span className="text-white font-medium">
                          {ride.driverId.carDetails.year} {ride.driverId.carDetails.make} {ride.driverId.carDetails.model}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <span>{ride.driverId.carDetails.color} • {ride.driverId.carDetails.licensePlate}</span>
                      </div>
                    </div>
                  )}

                  {ride.notes && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4">
                      <p className="text-blue-400 text-sm font-medium mb-1">Notes:</p>
                      <p className="text-gray-300 text-sm">{ride.notes}</p>
                    </div>
                  )}

                  {ride.status === 'completed' && !ride.rating && (
                    <div className="flex justify-end">
                      <button className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2">
                        <FiStar />
                        Rate Ride
                      </button>
                    </div>
                  )}

                  {ride.rating && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 font-medium">Your Rating:</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < ride.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {ride.feedback && (
                        <p className="text-gray-300 text-sm">{ride.feedback}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <FiTruck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No rides found</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'all' 
                  ? "You haven't booked any rides yet." 
                  : `No ${activeTab} rides found.`}
              </p>
              <a 
                href="/ride-booking" 
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Book Your First Ride
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyRides;
