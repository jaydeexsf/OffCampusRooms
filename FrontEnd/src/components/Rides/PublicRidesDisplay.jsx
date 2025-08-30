import React, { useState, useEffect } from 'react';
import { FiCalendar, FiMapPin, FiClock, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { apiClient } from '../../config/api';

const PublicRidesDisplay = ({ pickupCoords, dropoffCoords, onRideSelect }) => {
  const [publicRides, setPublicRides] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    if (pickupCoords && dropoffCoords) {
      fetchPublicRides();
    }
  }, [pickupCoords, dropoffCoords]);

  // Show message when no coordinates are selected
  if (!pickupCoords || !dropoffCoords) {
    return (
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="text-center py-8">
          <FiMapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Select Your Route First</h3>
          <p className="text-gray-500 text-sm">
            Choose pickup and dropoff locations on the map to see similar rides from other students
          </p>
        </div>
      </div>
    );
  }

  const fetchPublicRides = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (pickupCoords) {
        params.append('pickupArea', JSON.stringify(pickupCoords));
      }
      if (dropoffCoords) {
        params.append('dropoffArea', JSON.stringify(dropoffCoords));
      }

      const response = await apiClient.get(`/api/rides/public?${params}`);
      
      if (response.data.success) {
        setPublicRides(response.data.rides);
      }
    } catch (error) {
      console.error('Error fetching public rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString([], { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getRideCount = () => {
    return Object.values(publicRides).reduce((total, rides) => total + rides.length, 0);
  };

  const handleRideSelect = (ride) => {
    if (onRideSelect) {
      onRideSelect(ride);
    }
  };

  if (loading) {
    return (
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <span className="ml-3 text-gray-400">Finding similar rides...</span>
        </div>
      </div>
    );
  }

  if (getRideCount() === 0) {
    return (
      <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
        <div className="text-center py-8">
          <FiTrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">No Similar Rides Found</h3>
          <p className="text-gray-500 text-sm">
            Be the first to book a ride on this route!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FiUsers className="text-blue-400 text-xl" />
          <div>
            <h3 className="text-xl font-bold text-white">Other Students' Rides</h3>
            <p className="text-gray-400 text-sm">
              {getRideCount()} ride{getRideCount() !== 1 ? 's' : ''} found on similar routes
            </p>
          </div>
        </div>
        <button
          onClick={fetchPublicRides}
          className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg hover:bg-blue-500/30 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(publicRides).map(([dateKey, rides]) => (
          <div key={dateKey} className="border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="text-green-400" />
              <h4 className="text-white font-semibold">{formatDate(rides[0].scheduledTime)}</h4>
              <span className="text-gray-400 text-sm">
                ({rides.length} ride{rides.length !== 1 ? 's' : ''})
              </span>
            </div>
            
            <div className="space-y-3">
              {rides.map((ride, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => handleRideSelect(ride)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-green-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs">Pickup</p>
                          <p className="text-white text-sm">
                            {ride.pickupLocation.address || `${ride.pickupLocation.lat.toFixed(4)}, ${ride.pickupLocation.lng.toFixed(4)}`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-red-400 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-400 text-xs">Dropoff</p>
                          <p className="text-white text-sm">
                            {ride.dropoffLocation.address || `${ride.dropoffLocation.lat.toFixed(4)}, ${ride.dropoffLocation.lng.toFixed(4)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FiClock className="text-blue-400" />
                        <span className="text-white">{formatTime(ride.scheduledTime)}</span>
                      </div>
                      <div className="text-green-400 font-semibold">
                        R{ride.estimatedPrice}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {ride.distance} km
                      </div>
                    </div>
                  </div>
                  
                  {/* Ride Features */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-700">
                    {ride.bookingType !== 'regular' && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {ride.bookingType.replace('_', ' ')}
                      </span>
                    )}
                    {ride.groupSize > 1 && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                        Group: {ride.groupSize}
                      </span>
                    )}
                    {ride.isSharedRide && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Shared Ride
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <div className="flex items-start gap-3">
          <FiTrendingUp className="text-blue-400 mt-1" />
          <div>
            <h4 className="text-blue-400 font-medium mb-1">Ride Sharing Benefits</h4>
            <p className="text-gray-300 text-sm">
              Booking rides on similar routes and times can help reduce costs and environmental impact. 
              Consider coordinating with other students for shared rides!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRidesDisplay;
