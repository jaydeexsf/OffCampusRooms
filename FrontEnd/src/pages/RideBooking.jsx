import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FiMapPin, FiMap, FiClock, FiDollarSign, FiUser, FiPhone } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import { apiClient } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import { getGoogleMapsApiKey } from '../config/env';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -23.8962,
  lng: 29.4473
};

const RideBooking = () => {
  const { getToken, isSignedIn, user } = useAuth();
  const [map, setMap] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [directions, setDirections] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [rideDetails, setRideDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingStep, setBookingStep] = useState('location'); // location, drivers, booking, confirmation
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');

  // Get Google Maps API key with comprehensive debugging
  const googleMapsApiKey = getGoogleMapsApiKey();
  console.log('🔑 RideBooking - Google Maps API Key Status:', {
    hasKey: !!googleMapsApiKey,
    keyLength: googleMapsApiKey ? googleMapsApiKey.length : 0,
    keyPreview: googleMapsApiKey ? `${googleMapsApiKey.substring(0, 10)}...` : 'NONE',
    envVariable: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT_SET',
    envValue: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY.substring(0, 10)}...` : 'NONE',
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    fullUrl: window.location.href
  });

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey || '',
    libraries: ['places', 'geometry'],
    // Only load if we have an API key
    ...(googleMapsApiKey ? {} : { disable: true })
  });

  // Log Google Maps loading status
  console.log('🗺️ Google Maps Loading Status:', {
    isLoaded,
    hasLoadError: !!loadError,
    loadError: loadError?.message || 'None',
    apiKey: googleMapsApiKey ? 'Present' : 'Missing',
    timestamp: new Date().toISOString()
  });

  // Log any Google Maps errors from the global error handler
  useEffect(() => {
    const originalError = window.console.error;
    window.console.error = function(...args) {
      if (args.some(arg => typeof arg === 'string' && arg.includes('Google Maps'))) {
        console.log('🚨 Google Maps Error Detected:', {
          error: args,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          apiKey: googleMapsApiKey ? 'Present' : 'Missing'
        });
      }
      originalError.apply(console, args);
    };

    return () => {
      window.console.error = originalError;
    };
  }, [googleMapsApiKey]);

  const onLoad = useCallback(function callback(map) {
    console.log('🗺️ Google Map onLoad callback triggered:', {
      mapInstance: !!map,
      mapCenter: map?.getCenter()?.toJSON(),
      mapZoom: map?.getZoom(),
      timestamp: new Date().toISOString()
    });
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    console.log('🗺️ Google Map onUnmount callback triggered:', {
      mapInstance: !!map,
      timestamp: new Date().toISOString()
    });
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    console.log('🖱️ Map click event:', {
      hasEvent: !!event,
      hasLatLng: !!event?.latLng,
      canGetLat: typeof event?.latLng?.lat === 'function',
      canGetLng: typeof event?.latLng?.lng === 'function'
    });

    try {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      console.log('📍 Map clicked at coordinates:', {
        lat,
        lng,
        hasPickup: !!pickupLocation,
        hasDropoff: !!dropoffLocation,
        timestamp: new Date().toISOString()
      });

      if (!pickupLocation) {
        setPickupLocation({ lat, lng });
        console.log('✅ Setting pickup location:', { lat, lng });
        getAddressFromCoords(lat, lng, setPickupAddress);
      } else if (!dropoffLocation) {
        setDropoffLocation({ lat, lng });
        console.log('✅ Setting dropoff location:', { lat, lng });
        getAddressFromCoords(lat, lng, setDropoffAddress);
      }
    } catch (error) {
      console.error('❌ Error handling map click:', {
        error: error.message,
        stack: error.stack,
        event,
        timestamp: new Date().toISOString()
      });
    }
  };

  const getAddressFromCoords = async (lat, lng, setAddress) => {
    console.log('🔍 Starting geocoding for coordinates:', { lat, lng });
    
    try {
      if (!window.google || !window.google.maps || !window.google.maps.Geocoder) {
        console.error('❌ Google Maps Geocoder not available:', {
          hasGoogle: !!window.google,
          hasMaps: !!window.google?.maps,
          hasGeocoder: !!window.google?.maps?.Geocoder,
          timestamp: new Date().toISOString()
        });
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      console.log('🔍 Geocoder instance created, making request...');
      
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        console.log('🔍 Geocoding response:', {
          status,
          resultsCount: results?.length || 0,
          firstResult: results?.[0]?.formatted_address,
          timestamp: new Date().toISOString()
        });
        
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          console.log('✅ Address found:', address);
          setAddress(address);
        } else {
          console.error('❌ Geocoding failed:', {
            status,
            results,
            timestamp: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('❌ Error in getAddressFromCoords:', {
        error: error.message,
        stack: error.stack,
        lat,
        lng,
        timestamp: new Date().toISOString()
      });
    }
  };

  const calculateRide = async () => {
    console.log('🚗 Starting ride calculation:', {
      hasPickup: !!pickupLocation,
      hasDropoff: !!dropoffLocation,
      pickup: pickupLocation,
      dropoff: dropoffLocation,
      timestamp: new Date().toISOString()
    });

    if (!pickupLocation || !dropoffLocation) {
      console.error('❌ Missing pickup or dropoff location');
      return;
    }

    setLoading(true);
    try {
      console.log('📡 Making API request to calculate ride...');
      const response = await apiClient.post(`${API_ENDPOINTS.CALCULATE_RIDE}`, {
        pickupLat: pickupLocation.lat,
        pickupLng: pickupLocation.lng,
        dropoffLat: dropoffLocation.lat,
        dropoffLng: dropoffLocation.lng
      });

      console.log('📡 Ride calculation API response:', {
        success: response.data.success,
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        setRideDetails(response.data);
        setAvailableDrivers(response.data.availableDrivers);
        setBookingStep('drivers');
        
        console.log('🗺️ Setting up directions on map...');
        
        if (!window.google?.maps?.DirectionsService) {
          console.error('❌ Google Maps DirectionsService not available:', {
            hasGoogle: !!window.google,
            hasMaps: !!window.google?.maps,
            hasDirectionsService: !!window.google?.maps?.DirectionsService
          });
          return;
        }

        // Show directions on map
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route({
          origin: pickupLocation,
          destination: dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          console.log('🗺️ Directions API response:', {
            status,
            hasResult: !!result,
            timestamp: new Date().toISOString()
          });
          
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('✅ Directions loaded successfully');
            setDirections(result);
          } else {
            console.error('❌ Directions request failed:', {
              status,
              result,
              timestamp: new Date().toISOString()
            });
          }
        });
      } else {
        console.error('❌ Ride calculation failed:', response.data);
      }
    } catch (error) {
      console.error('❌ Error calculating ride:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
      alert('Error calculating ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async () => {
    console.log('📝 Starting ride booking:', {
      hasSelectedDriver: !!selectedDriver,
      isSignedIn,
      selectedDriver,
      timestamp: new Date().toISOString()
    });

    if (!selectedDriver || !isSignedIn) {
      console.error('❌ Cannot book ride:', {
        hasSelectedDriver: !!selectedDriver,
        isSignedIn,
        timestamp: new Date().toISOString()
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Getting authentication token...');
      const token = await getToken();
      
      const bookingData = {
        studentId: user.id,
        studentName: user.fullName || user.firstName + ' ' + user.lastName,
        studentContact: user.primaryPhoneNumber?.phoneNumber || '',
        driverId: selectedDriver.driverId,
        pickupLocation: {
          address: pickupAddress,
          lat: pickupLocation.lat,
          lng: pickupLocation.lng
        },
        dropoffLocation: {
          address: dropoffAddress,
          lat: dropoffLocation.lat,
          lng: dropoffLocation.lng
        },
        distance: rideDetails.distance.km,
        estimatedPrice: selectedDriver.estimatedPrice,
        scheduledTime: scheduledTime || new Date().toISOString(),
        notes
      };

      console.log('📡 Making booking API request:', {
        endpoint: `${API_ENDPOINTS.API_BASE_URL}/api/rides/book`,
        bookingData,
        hasToken: !!token,
        timestamp: new Date().toISOString()
      });

      const response = await apiClient.post(`${API_ENDPOINTS.API_BASE_URL}/api/rides/book`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('📡 Booking API response:', {
        success: response.data.success,
        data: response.data,
        status: response.status,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        console.log('✅ Ride booked successfully');
        setBookingStep('confirmation');
      } else {
        console.error('❌ Booking failed:', response.data);
      }
    } catch (error) {
      console.error('❌ Error booking ride:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setPickupLocation(null);
    setDropoffLocation(null);
    setPickupAddress('');
    setDropoffAddress('');
    setDirections(null);
    setAvailableDrivers([]);
    setSelectedDriver(null);
    setRideDetails(null);
    setBookingStep('location');
    setScheduledTime('');
    setNotes('');
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

          {/* Debug Panel - Only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl">
              <h3 className="text-yellow-400 font-semibold mb-2">🔍 Debug Panel (Development Only)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <p><span className="text-gray-300">Google Maps API Key:</span> <span className={googleMapsApiKey ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey ? 'VALID' : 'INVALID'}</span></p>
                  <p><span className="text-gray-300">Map Loaded:</span> <span className={isLoaded ? 'text-green-400' : 'text-red-400'}>{isLoaded ? 'YES' : 'NO'}</span></p>
                  <p><span className="text-gray-300">Environment:</span> <span className="text-blue-400">{import.meta.env.MODE || 'unknown'}</span></p>
                </div>
                <div>
                  <p><span className="text-gray-300">Hostname:</span> <span className="text-blue-400">{window.location.hostname}</span></p>
                  <p><span className="text-gray-300">Protocol:</span> <span className="text-blue-400">{window.location.protocol}</span></p>
                  <p><span className="text-gray-300">User Signed In:</span> <span className={isSignedIn ? 'text-green-400' : 'text-red-400'}>{isSignedIn ? 'YES' : 'NO'}</span></p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FiMapPin className="text-blue-400" />
                Select Locations
              </h3>
              
{isLoaded ? (
                <div>
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">✅ Google Maps loaded successfully!</p>
                    <p className="text-green-300 text-xs">API Key: {googleMapsApiKey ? 'Valid' : 'Invalid'}</p>
                    <p className="text-green-300 text-xs">Load Error: {loadError ? loadError.message : 'None'}</p>
                    <p className="text-green-300 text-xs">Timestamp: {new Date().toLocaleTimeString()}</p>
                  </div>
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    onClick={handleMapClick}
                    onError={(error) => {
                      console.error('🗺️ Google Map Error:', {
                        error,
                        timestamp: new Date().toISOString()
                      });
                    }}
                    options={{
                      styles: [
                        {
                          featureType: 'all',
                          elementType: 'geometry.fill',
                          stylers: [{ color: '#1f2937' }]
                        },
                        {
                          featureType: 'water',
                          elementType: 'geometry',
                          stylers: [{ color: '#374151' }]
                        }
                      ]
                    }}
                  >
                    {pickupLocation && (
                      <Marker
                        position={pickupLocation}
                        icon={{
                          url: 'data:image/svg+xml;base64,' + btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#10B981">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                          `)
                        }}
                      />
                    )}
                    {dropoffLocation && (
                      <Marker
                        position={dropoffLocation}
                        icon={{
                          url: 'data:image/svg+xml;base64,' + btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#EF4444">
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                            </svg>
                          `)
                        }}
                      />
                    )}
                    {directions && <DirectionsRenderer directions={directions} />}
                  </GoogleMap>
                </div>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {googleMapsApiKey ? 'Map Loading...' : 'Google Maps API Key Required'}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {googleMapsApiKey ? 
                      'Loading Google Maps...' : 
                      'Google Maps API key not configured'
                    }
                  </p>
                  
                  {/* Debug Information */}
                  <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3 mb-4 text-left">
                    <h4 className="text-gray-300 font-semibold mb-2">🔍 Debug Information:</h4>
                    <div className="space-y-1 text-xs">
                      <p><span className="text-gray-400">Environment Variable:</span> <span className={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'text-green-400' : 'text-red-400'}>{import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET'}</span></p>
                      <p><span className="text-gray-400">Config File:</span> <span className={googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? 'SET' : 'NOT SET'}</span></p>
                      <p><span className="text-gray-400">Final API Key:</span> <span className={googleMapsApiKey ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey ? 'VALID' : 'INVALID'}</span></p>
                      <p><span className="text-gray-400">Hostname:</span> <span className="text-blue-400">{window.location.hostname}</span></p>
                    </div>
                  </div>
                  
                  {!googleMapsApiKey && (
                    <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                      <p className="text-red-400 font-semibold mb-2">❌ To fix this issue:</p>
                      <div className="space-y-2 text-xs">
                        <p>1. Create a <code className="text-blue-400">.env</code> file in your FrontEnd directory</p>
                        <p>2. Add: <code className="text-blue-400">VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key</code></p>
                        <p>3. Or update <code className="text-blue-400">FrontEnd/src/config/env.js</code></p>
                        <p>4. Restart your development server</p>
                      </div>
                      <p className="mt-2 text-xs">See SETUP_INSTRUCTIONS.md for detailed instructions.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300">
                    Pickup: {pickupAddress || 'Click on map to select pickup location'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">
                    Dropoff: {dropoffAddress || 'Click on map to select dropoff location'}
                  </span>
                </div>
              </div>

              {pickupLocation && dropoffLocation && bookingStep === 'location' && (
                <button
                  onClick={calculateRide}
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {loading ? 'Calculating...' : 'Find Drivers'}
                </button>
              )}
            </div>

            {/* Booking Details Section */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              {bookingStep === 'location' && (
                <div className="text-center py-12">
                  <FiMapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Select Your Route</h3>
                  <p className="text-gray-500">Click on the map to set your pickup and dropoff locations</p>
                </div>
              )}

              {bookingStep === 'drivers' && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Available Drivers</h3>
                  
                  {rideDetails && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Distance:</span>
                          <span className="text-white ml-2">{rideDetails.distance.text}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white ml-2">{rideDetails.duration}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {availableDrivers.map((driver) => (
                      <div
                        key={driver.driverId}
                        onClick={() => setSelectedDriver(driver)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                          selectedDriver?.driverId === driver.driverId
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/20 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-semibold">{driver.driverName}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <span>⭐ {driver.rating}</span>
                              <span>•</span>
                              <span>{driver.totalRides} rides</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-400">
                              R{driver.estimatedPrice}
                            </div>
                            <div className="text-xs text-gray-400">
                              R{driver.pricePerKm}/km
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedDriver && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Scheduled Time (Optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-white font-semibold mb-2">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Any special instructions for the driver..."
                          rows={3}
                          className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 resize-none"
                        />
                      </div>

                      <button
                        onClick={bookRide}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                      >
                        {loading ? 'Booking...' : `Book Ride - R${selectedDriver.estimatedPrice}`}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {bookingStep === 'confirmation' && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ride Booked Successfully!</h3>
                  <p className="text-gray-400 mb-8">
                    Your driver will contact you shortly. You can track your ride status in your dashboard.
                  </p>
                  <button
                    onClick={resetBooking}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
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
