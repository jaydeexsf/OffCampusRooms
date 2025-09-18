import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api';
import { FiMapPin, FiMap, FiClock, FiDollarSign, FiUser, FiPhone, FiCheck, FiEye, FiX } from 'react-icons/fi';
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiClient, API_BASE_URL } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { getGoogleMapsApiKey } from '../config/env';
import PublicRidesDisplay from '../components/Rides/PublicRidesDisplay';
import { useToast } from '../hooks/useToast';
import ToastNotification from '../components/ToastNotification';

// Static libraries array outside component to prevent reloading
const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry', 'marker'];

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: -23.8962,
  lng: 29.4473
};

const RideBooking = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const { toasts, success, error, removeToast } = useToast();
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
  const [showPublicRides, setShowPublicRides] = useState(true);
  
  // Booked routes state
  const [bookedRoutes, setBookedRoutes] = useState([]);
  const [showBookedRoutes, setShowBookedRoutes] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showRoutePopup, setShowRoutePopup] = useState(false);

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

  // Create AdvancedMarkerElement markers
  const createMarker = (position, color, label) => {
    if (!map || !window.google?.maps?.marker?.AdvancedMarkerElement) return null;
    
    const markerElement = document.createElement('div');
    markerElement.innerHTML = `
      <div style="
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${label}</div>
    `;
    
    return new window.google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: position,
      content: markerElement
    });
  };

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
        studentContact: user.primaryPhoneNumber?.phoneNumber || user?.phoneNumbers?.[0]?.phoneNumber || user?.emailAddresses?.[0]?.emailAddress || 'N/A',
        pickupLocation: {
          lat: pickupCoords.lat,
          lng: pickupCoords.lng,
          address: pickupAddress || `(${pickupCoords.lat.toFixed(5)}, ${pickupCoords.lng.toFixed(5)})`
        },
        dropoffLocation: {
          lat: dropoffCoords.lat,
          lng: dropoffCoords.lng,
          address: dropoffAddress || `(${dropoffCoords.lat.toFixed(5)}, ${dropoffCoords.lng.toFixed(5)})`
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

      const response = await apiClient.post(`${API_BASE_URL}/api/rides/request`, requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setCurrentStep(3);
        success('Ride request submitted! An admin will assign a driver soon.');
      } else {
        error('Failed to submit ride request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting ride request:', error);
      
      let errorMessage = 'Error submitting ride request. Please try again.';
      
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
        
        if (error.response.status === 400) {
          errorMessage = error.response.data.message || 'Invalid request data. Please check your input.';
        } else if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please sign in again.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error occurred. Please try again later.';
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      error(errorMessage);
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

  // Fetch booked routes for the user
  const fetchBookedRoutes = async () => {
    try {
      const token = await getToken();
      const response = await apiClient.get(`${API_BASE_URL}/api/rides/my-rides`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setBookedRoutes(response.data.rides || []);
        setShowBookedRoutes(true);
        success('Booked routes loaded successfully!');
      } else {
        error('Failed to load booked routes.');
      }
    } catch (error) {
      console.error('Error fetching booked routes:', error);
      error('Error loading booked routes. Please try again.');
    }
  };

  // Handle route marker click
  const handleRouteClick = (route) => {
    setSelectedRoute(route);
    setShowRoutePopup(true);
  };

  // Close route popup
  const closeRoutePopup = () => {
    setShowRoutePopup(false);
    setSelectedRoute(null);
  };

  // Create markers when map loads
  useEffect(() => {
    if (map && window.google?.maps?.marker?.AdvancedMarkerElement) {
      // Create pickup marker
      if (pickupCoords) {
        const pickupElement = document.createElement('div');
        pickupElement.innerHTML = `
          <div style="
            background: #10B981;
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">P</div>
        `;
        
        new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: pickupCoords,
          content: pickupElement
        });
      }

      // Create dropoff marker
      if (dropoffCoords) {
        const dropoffElement = document.createElement('div');
        dropoffElement.innerHTML = `
          <div style="
            background: #EF4444;
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">D</div>
        `;
        
        new window.google.maps.marker.AdvancedMarkerElement({
          map: map,
          position: dropoffCoords,
          content: dropoffElement
        });
      }

      // Create booked route markers
      if (showBookedRoutes && bookedRoutes.length > 0) {
        bookedRoutes.forEach((route) => {
          // Pickup marker
          const pickupElement = document.createElement('div');
          pickupElement.innerHTML = `
            <div style="
              background: #3B82F6;
              border: 3px solid white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            ">P</div>
          `;
          
          const pickupMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: route.pickupLocation,
            content: pickupElement
          });
          
          pickupMarker.addListener('click', () => handleRouteClick(route));

          // Dropoff marker
          const dropoffElement = document.createElement('div');
          dropoffElement.innerHTML = `
            <div style="
              background: #EF4444;
              border: 3px solid white;
              border-radius: 50%;
              width: 20px;
              height: 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              cursor: pointer;
            ">D</div>
          `;
          
          const dropoffMarker = new window.google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: route.dropoffLocation,
            content: dropoffElement
          });
          
          dropoffMarker.addListener('click', () => handleRouteClick(route));
        });
      }
    }
  }, [map, pickupCoords, dropoffCoords, showBookedRoutes, bookedRoutes]);

  const handleRideSelect = (selectedRide) => {
    // Auto-fill the form with selected ride details
    setPickupCoords(selectedRide.pickupLocation);
    setDropoffCoords(selectedRide.dropoffLocation);
    setPickupAddress(selectedRide.pickupLocation.address || 'Selected from similar ride');
    setDropoffAddress(selectedRide.dropoffLocation.address || 'Selected from similar ride');
    setScheduledTime(selectedRide.scheduledTime);
    
    // Show success message
    success('Route selected! Pickup and dropoff locations have been set. You can now calculate your ride.');
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Book a <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Ride
              </span>
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400">Safe and reliable transportation for University of Limpopo students</p>
          </div>

          {/* Public Rides Display - Show other students' rides for potential coordination */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-semibold text-white">See Other Students' Rides</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPublicRides(!showPublicRides)}
                  className="px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm sm:text-base"
                >
                  {showPublicRides ? 'Hide' : 'Show'} Similar Rides
                </button>
                <button
                  onClick={fetchBookedRoutes}
                  className="px-3 sm:px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm sm:text-base flex items-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  {showBookedRoutes ? 'Hide' : 'Show'} My Routes
                </button>
              </div>
            </div>
            
            {showPublicRides && (
              <PublicRidesDisplay
                pickupCoords={pickupCoords}
                dropoffCoords={dropoffCoords}
                onRideSelect={handleRideSelect}
              />
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Map Section */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
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
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              ) : (
                <div className="h-96 bg-gray-800 rounded-xl flex items-center justify-center">
                  <p className="text-gray-400">Loading map...</p>
                </div>
              )}

              {/* Location Display */}
              <div className="mt-4 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-green-400 text-xs sm:text-sm font-medium">Pickup Location</p>
                    <p className="text-white text-xs sm:text-sm truncate">{pickupAddress || 'Click on map to select'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-red-400 text-xs sm:text-sm font-medium">Dropoff Location</p>
                    <p className="text-white text-xs sm:text-sm truncate">{dropoffAddress || 'Click on map to select'}</p>
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
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
              {currentStep === 1 && (
                <div className="text-center py-12">
                  <FiMapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Select Your Route</h3>
                  <p className="text-gray-500">Click on the map to set your pickup and dropoff locations</p>
                </div>
              )}

              {currentStep === 2 && distance && estimatedPrice && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Ride Details</h3>
                  
                                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 sm:p-4 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
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
                      <h4 className="text-base sm:text-lg font-semibold text-white mb-3">Similar Rides Today</h4>
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
      
      {/* Route Details Popup */}
      {showRoutePopup && selectedRoute && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeRoutePopup}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Route Details</h3>
              <button
                onClick={closeRoutePopup}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Route Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Pickup Location
                  </h4>
                  <p className="text-white text-sm">{selectedRoute.pickupLocation.address}</p>
                </div>
                
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" />
                    Dropoff Location
                  </h4>
                  <p className="text-white text-sm">{selectedRoute.dropoffLocation.address}</p>
                </div>
              </div>
              
              {/* Route Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-gray-400 font-semibold mb-2 flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    Scheduled Time
                  </h4>
                  <p className="text-white text-sm">
                    {new Date(selectedRoute.scheduledTime).toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-gray-400 font-semibold mb-2 flex items-center gap-2">
                    <FiDollarSign className="w-4 h-4" />
                    Estimated Price
                  </h4>
                  <p className="text-white text-sm">R{selectedRoute.estimatedPrice}</p>
                </div>
                
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-gray-400 font-semibold mb-2 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Status
                  </h4>
                  <p className="text-white text-sm capitalize">{selectedRoute.status || 'Pending'}</p>
                </div>
              </div>
              
              {/* Additional Info */}
              {selectedRoute.notes && (
                <div className="bg-gray-800/50 border border-white/10 rounded-xl p-4">
                  <h4 className="text-gray-400 font-semibold mb-2">Notes</h4>
                  <p className="text-white text-sm">{selectedRoute.notes}</p>
                </div>
              )}
              
              {selectedRoute.driver && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <h4 className="text-green-400 font-semibold mb-2">Assigned Driver</h4>
                  <p className="text-white text-sm">{selectedRoute.driver.fullName}</p>
                  <p className="text-gray-400 text-xs">{selectedRoute.driver.contact}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          showProgress={toast.showProgress}
          allowCancel={toast.allowCancel}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default RideBooking;
