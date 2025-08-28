import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { FiMapPin, FiMap, FiClock, FiDollarSign, FiUser, FiPhone } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

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

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    // Only load if we have an API key
    ...(import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? {} : { disable: true })
  });

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    if (!pickupLocation) {
      setPickupLocation({ lat, lng });
      getAddressFromCoords(lat, lng, setPickupAddress);
    } else if (!dropoffLocation) {
      setDropoffLocation({ lat, lng });
      getAddressFromCoords(lat, lng, setDropoffAddress);
    }
  };

  const getAddressFromCoords = async (lat, lng, setAddress) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setAddress(results[0].formatted_address);
        }
      });
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const calculateRide = async () => {
    if (!pickupLocation || !dropoffLocation) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_ENDPOINTS.CALCULATE_RIDE}`, {
        pickupLat: pickupLocation.lat,
        pickupLng: pickupLocation.lng,
        dropoffLat: dropoffLocation.lat,
        dropoffLng: dropoffLocation.lng
      });

      if (response.data.success) {
        setRideDetails(response.data);
        setAvailableDrivers(response.data.availableDrivers);
        setBookingStep('drivers');
        
        // Show directions on map
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route({
          origin: pickupLocation,
          destination: dropoffLocation,
          travelMode: window.google.maps.TravelMode.DRIVING,
        }, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          }
        });
      }
    } catch (error) {
      console.error('Error calculating ride:', error);
      alert('Error calculating ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async () => {
    if (!selectedDriver || !isSignedIn) return;

    setLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${API_ENDPOINTS.API_BASE_URL}/api/rides/book`, {
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
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setBookingStep('confirmation');
      }
    } catch (error) {
      console.error('Error booking ride:', error);
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
                          <svg xmlns="http://www.w3.org/2000/svg" width="32 24" fill="#EF4444">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                          </svg>
                        `)
                      }}
                    />
                  )}
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              ) : (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Map Loading...</h3>
                  <p className="text-gray-400 mb-4">
                    {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 
                      'Loading Google Maps...' : 
                      'Google Maps API key not configured'
                    }
                  </p>
                  {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
                    <div className="text-sm text-gray-500 bg-gray-800/50 rounded-lg p-3">
                      <p>To enable maps, add your Google Maps API key to the .env file:</p>
                      <code className="text-blue-400">VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
                      <p className="mt-2 text-xs">See GOOGLE_MAPS_SETUP.md for detailed instructions.</p>
                    </p>
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
