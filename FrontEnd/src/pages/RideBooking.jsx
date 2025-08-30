import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FiMapPin, FiMap, FiClock, FiDollarSign, FiUser, FiPhone, FiCheck } from 'react-icons/fi';
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiClient } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { getGoogleMapsApiKey } from '../config/env';

// Static libraries array outside component to prevent reloading
const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry'];

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -23.8962,
  lng: 29.4473
};

const RideBooking = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropoffCoords, setDropoffCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [similarRides, setSimilarRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingType, setBookingType] = useState('regular');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [groupSize, setGroupSize] = useState(1);
  const [luggageCount, setLuggageCount] = useState(0);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [semester, setSemester] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [holidayType, setHolidayType] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  
  // Split fare state
  const [splitFareEnabled, setSplitFareEnabled] = useState(false);
  const [splitFareParticipants, setSplitFareParticipants] = useState(2);
  
  // Ride sharing state
  const [rideSharing, setRideSharing] = useState(false);
  const [maxSharedPassengers, setMaxSharedPassengers] = useState(1);
  const [sharedRides, setSharedRides] = useState([]);
  const [showSharedRides, setShowSharedRides] = useState(false);
  
  // Additional state variables
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  // Get Google Maps API key
  const googleMapsApiKey = getGoogleMapsApiKey();

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    // Only load if we have an API key
    ...(googleMapsApiKey ? {} : { disable: true })
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (!pickupCoords) {
        setPickupCoords({ lat, lng });
        getAddressFromCoords(lat, lng, setPickupAddress);
      } else if (!dropoffCoords) {
        setDropoffCoords({ lat, lng });
        getAddressFromCoords(lat, lng, setDropoffAddress);
      }
    } catch (error) {
      console.error('Error handling map click:', error);
    }
  };

  const getAddressFromCoords = async (lat, lng, setAddress) => {
    try {
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setAddress(address);
        }
      });
    } catch (error) {
      console.error('Error in getAddressFromCoords:', error);
    }
  };

  const calculateRide = async () => {
    if (!pickupCoords || !dropoffCoords) {
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post(`${API_ENDPOINTS.CALCULATE_RIDE}`, {
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropoffLat: dropoffCoords.lat,
        dropoffLng: dropoffCoords.lng,
        scheduledDate: scheduledTime || new Date().toISOString()
      });

      if (response.data.success) {
        setDistance(response.data.distance.km);
        setEstimatedPrice(response.data.estimatedPrice);
        setSimilarRides(response.data.similarRides || []);
        setCurrentStep(2);
        
        // Show directions on map
        if (window.google?.maps?.DirectionsService) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route({
            origin: pickupCoords,
            destination: dropoffCoords,
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirections(result);
            }
          });
        }
      }
    } catch (error) {
      console.error('Error calculating ride:', error);
      alert('Error calculating ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestRide = async () => {
    if (!pickupCoords || !dropoffCoords || !isSignedIn) {
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      
      // Check if user exists
      if (!user) {
        throw new Error('User not found. Please sign in again.');
      }
      
      const requestData = {
        studentContact: user.primaryPhoneNumber?.phoneNumber || '',
        pickupLocation: {
          lat: pickupCoords.lat,
          lng: pickupCoords.lng
        },
        dropoffLocation: {
          lat: dropoffCoords.lat,
          lng: dropoffCoords.lng
        },
        distance,
        estimatedPrice,
        scheduledTime: scheduledTime || new Date().toISOString(),
        notes,
        bookingType,
        groupSize,
        luggageCount,
        furnitureItems,
        semester,
        academicYear,
        holidayType,
        specialRequirements,
        splitFare: splitFareEnabled ? {
          enabled: true,
          totalParticipants: splitFareParticipants,
          participants: [],
          isOpen: true
        } : undefined,
        isSharedRide: rideSharing,
        maxSharedPassengers: rideSharing ? maxSharedPassengers : 1
      };

      const response = await apiClient.post(`${API_ENDPOINTS.API_BASE_URL}/api/rides/request`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCurrentStep(3);
        alert('Ride request submitted! An admin will assign a driver soon.');
      } else {
        alert('Failed to submit ride request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting ride request:', error);
      alert('Error submitting ride request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setPickupCoords(null);
    setDropoffCoords(null);
    setPickupAddress('');
    setDropoffAddress('');
    setDirections(null);
    setCurrentStep(1);
    setScheduledTime('');
    setNotes('');
    setSplitFareEnabled(false);
    setSplitFareParticipants(2);
    setRideSharing(false);
    setMaxSharedPassengers(1);
    setSharedRides([]);
    setShowSharedRides(false);
    setDistance(null);
    setEstimatedPrice(null);
    setSimilarRides([]);
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <FiMap className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
              <p className="text-gray-400 mb-8">
                Please sign in to book a ride with our trusted drivers.
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              Book a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ride
              </span>
            </h1>
            <p className="text-gray-400">Safe and reliable transportation for University of Limpopo students</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiMapPin className="text-blue-400" />
                Select Locations
              </h3>
              
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                  onClick={handleMapClick}
                >
                  {pickupCoords && (
                    <Marker
                      position={pickupCoords}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#10B981" stroke="white" stroke-width="2"/>
                            <circle cx="16" cy="16" r="4" fill="white"/>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(32, 32)
                      }}
                    />
                  )}
                  {dropoffCoords && (
                    <Marker
                      position={dropoffCoords}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="12" fill="#EF4444" stroke="white" stroke-width="2"/>
                            <circle cx="16" cy="16" r="4" fill="white"/>
                          </svg>
                        `),
                        scaledSize: new window.google.maps.Size(32, 32)
                      }}
                    />
                  )}
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              ) : (
                <div className="h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400">Loading map...</p>
                </div>
              )}

              {/* Location Display */}
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-green-400 text-sm font-medium">Pickup Location</p>
                    <p className="text-white text-sm">{pickupAddress || 'Click on map to select'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-medium">Dropoff Location</p>
                    <p className="text-white text-sm">{dropoffAddress || 'Click on map to select'}</p>
                  </div>
                </div>
              </div>

              {/* Calculate Button */}
              {pickupCoords && dropoffCoords && currentStep === 1 && (
                <button
                  onClick={calculateRide}
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? 'Calculating...' : 'Calculate Ride'}
                </button>
              )}
            </div>

            {/* Booking Details Section */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              {currentStep === 1 && (
                <div className="text-center py-12">
                  <FiMapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Select Your Route</h3>
                  <p className="text-gray-500">Click on the map to set your pickup and dropoff locations</p>
                </div>
              )}

              {currentStep === 2 && distance && estimatedPrice && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Ride Details</h3>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Distance:</span>
                        <span className="text-white ml-2">{distance.toFixed(1)} km</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Estimated Price:</span>
                        <span className="text-white ml-2">R{estimatedPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Similar Rides */}
                  {similarRides.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Similar Rides Today</h4>
                      <div className="space-y-2">
                        {similarRides.map((ride, index) => (
                          <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white text-sm">{ride.studentName}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(ride.scheduledTime).toLocaleTimeString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-green-400 text-sm">R{ride.estimatedPrice.toFixed(2)}</p>
                                <p className="text-gray-400 text-xs">{ride.distance.toFixed(1)} km</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Options */}
                  <div className="space-y-4 mb-6">
                    {/* Split Fare Toggle */}
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">Split Fare with Friends</h4>
                          <p className="text-gray-400 text-sm">Share the cost with 2-6 people</p>
                        </div>
                        <button
                          onClick={() => setSplitFareEnabled(!splitFareEnabled)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            splitFareEnabled ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              splitFareEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {splitFareEnabled && (
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Number of participants:</label>
                          <select
                            value={splitFareParticipants}
                            onChange={(e) => setSplitFareParticipants(parseInt(e.target.value))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          >
                            {[2, 3, 4, 5, 6].map(num => (
                              <option key={num} value={num}>{num} people</option>
                            ))}
                          </select>
                          <p className="text-green-400 text-sm mt-2">
                            Cost per person: R{(estimatedPrice / splitFareParticipants).toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Ride Sharing Toggle */}
                    <div className="bg-gray-800/50 border border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-white font-medium">Share Ride</h4>
                          <p className="text-gray-400 text-sm">Allow others to join your ride</p>
                        </div>
                        <button
                          onClick={() => setRideSharing(!rideSharing)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            rideSharing ? 'bg-green-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              rideSharing ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {rideSharing && (
                        <div>
                          <label className="block text-gray-400 text-sm mb-2">Max shared passengers:</label>
                          <select
                            value={maxSharedPassengers}
                            onChange={(e) => setMaxSharedPassengers(parseInt(e.target.value))}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          >
                            {[1, 2, 3, 4].map(num => (
                              <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date/Time and Notes */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Scheduled Time (optional):</label>
                      <input
                        type="datetime-local"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Notes (optional):</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Any special requirements or notes..."
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white h-20 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Request Button */}
                  <button
                    onClick={requestRide}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting Request...
                      </div>
                    ) : (
                      'Submit Ride Request'
                    )}
                  </button>

                  <p className="text-gray-400 text-sm text-center mt-3">
                    An admin will assign a driver to your request soon!
                  </p>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-12">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <FiCheck className="w-10 h-10 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Request Submitted!</h3>
                  <p className="text-gray-400 mb-6">
                    Your ride request has been submitted successfully. An admin will assign a driver soon.
                  </p>
                  <button
                    onClick={resetBooking}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-200"
                  >
                    Book Another Ride
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideBooking;
