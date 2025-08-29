import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { getGoogleMapsApiKey } from '../../config/env';

// Static libraries array to prevent performance warnings
const GOOGLE_MAPS_LIBRARIES = ['places'];

const LocationGoogle = ({ latitudeC, longitudeC }) => {
  // Get Google Maps API key with enhanced debugging
  const googleMapsApiKey = getGoogleMapsApiKey();
  
  console.log('🔑 LocationGoogle - Google Maps API Key Status:', {
    hasKey: !!googleMapsApiKey,
    keyLength: googleMapsApiKey ? googleMapsApiKey.length : 0,
    keyPreview: googleMapsApiKey ? `${googleMapsApiKey.substring(0, 10)}...` : 'NONE',
    coordinates: { lat: latitudeC, lng: longitudeC },
    timestamp: new Date().toISOString(),
    currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'server'
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });

  // Add debugging for useLoadScript
  console.log('🗺️ useLoadScript Status:', {
    isLoaded,
    loadError: loadError ? { name: loadError.name, message: loadError.message } : null,
    hasApiKey: !!googleMapsApiKey,
    timestamp: new Date().toISOString()
  });

  // Test if Google Maps script is actually loaded
  useEffect(() => {
    if (isLoaded) {
      console.log('🔍 Testing Google Maps script availability...');
      console.log('🔍 window.google exists:', !!window.google);
      console.log('🔍 window.google.maps exists:', !!(window.google && window.google.maps));
      console.log('🔍 window.google.maps.Map exists:', !!(window.google && window.google.maps && window.google.maps.Map));
      
      if (window.google && window.google.maps) {
        console.log('✅ Google Maps script is fully loaded and available');
      } else {
        console.warn('⚠️ Google Maps script loaded but not fully available');
      }
    }
  }, [isLoaded]);

  const [coordinates, setCoordinates] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsStatus, setDirectionsStatus] = useState('Get Directions');
  const [color, setColor] = useState('#FF5733');
  const [mapError, setMapError] = useState(null);
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0);
  const [mapLoadTimeout, setMapLoadTimeout] = useState(false);

  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF00FF', '#00FFFF', '#800000', '#FF4500', '#2E8B57', '#4B0082'];

  // Add timeout for map loading
  useEffect(() => {
    if (isLoaded && coordinates && !mapError) {
      const timeoutId = setTimeout(() => {
        console.warn('⚠️ Map loading timeout - taking longer than expected');
        setMapLoadTimeout(true);
      }, 10000); // 10 seconds timeout

      return () => clearTimeout(timeoutId);
    }
  }, [isLoaded, coordinates, mapError]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setColor(randomColor);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [color]);

  useEffect(() => {
    if (latitudeC && longitudeC) {
      setCoordinates({ lat: latitudeC, lng: longitudeC });
      console.log('📍 LocationGoogle - Coordinates set:', { lat: latitudeC, lng: longitudeC });
    } else {
      console.warn('⚠️ LocationGoogle - No coordinates provided:', { latitudeC, longitudeC });
    }
  }, [latitudeC, longitudeC]);

  // Handle map loading errors
  const handleMapError = (error) => {
    console.error('❌ Google Maps Runtime Error:', error);
    setMapError(error);
    setMapLoadAttempts(prev => prev + 1);
  };

  // Handle successful map load
  const handleMapLoad = () => {
    console.log('✅ Google Maps loaded successfully');
    setMapError(null);
    setMapLoadAttempts(0);
  };

  // Enhanced error handling for load errors
  if (loadError) {
    console.error('❌ Google Maps Load Error:', loadError);
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-4">
            <h2 className="text-red-400 text-xl font-bold mb-2">Google Maps Load Error</h2>
            <p className="text-gray-300 text-sm mb-4">
              Failed to load Google Maps: {loadError.message}
            </p>
            
            {/* Debug Information */}
            <div className="bg-gray-800 rounded-lg p-3 text-left mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">🔍 Debug Information:</h4>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-400">Error Type:</span> <span className="text-red-400">{loadError.name}</span></p>
                <p><span className="text-gray-400">Error Message:</span> <span className="text-red-400">{loadError.message}</span></p>
                <p><span className="text-gray-400">API Key Status:</span> <span className={googleMapsApiKey ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey ? 'VALID' : 'INVALID'}</span></p>
                <p><span className="text-gray-400">Coordinates:</span> <span className="text-blue-400">{JSON.stringify({ lat: latitudeC, lng: longitudeC })}</span></p>
                <p><span className="text-gray-400">Load Attempts:</span> <span className="text-blue-400">{mapLoadAttempts}</span></p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-left">
              <p className="text-gray-400 text-xs mb-2">Common solutions:</p>
              <div className="space-y-1 text-xs">
                <p>1. Check if your API key is valid and has billing enabled</p>
                <p>2. Verify the required APIs are enabled in Google Cloud Console</p>
                <p>3. Check if your domain is allowed in API key restrictions</p>
                <p>4. Ensure you have sufficient quota remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!googleMapsApiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-4">
            <h2 className="text-red-400 text-xl font-bold mb-2">Google Maps API Key Required</h2>
            <p className="text-gray-300 text-sm mb-4">
              To display the location map, you need to set up a Google Maps API key.
            </p>
            
            {/* Debug Information */}
            <div className="bg-gray-800 rounded-lg p-3 text-left mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">🔍 Debug Information:</h4>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-400">Environment Variable:</span> <span className={import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'text-green-400' : 'text-red-400'}>{import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET'}</span></p>
                <p><span className="text-gray-400">Config File:</span> <span className={googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey && googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE' ? 'SET' : 'NOT SET'}</span></p>
                <p><span className="text-gray-400">Final API Key:</span> <span className={googleMapsApiKey ? 'text-green-400' : 'text-red-400'}>{googleMapsApiKey ? 'VALID' : 'INVALID'}</span></p>
                <p><span className="text-gray-400">Hostname:</span> <span className="text-blue-400">{typeof window !== 'undefined' ? window.location.hostname : 'server'}</span></p>
                <p><span className="text-gray-400">Coordinates:</span> <span className="text-blue-400">{JSON.stringify({ lat: latitudeC, lng: longitudeC })}</span></p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-left">
              <p className="text-gray-400 text-xs mb-2">To fix this issue:</p>
              <div className="space-y-1 text-xs">
                <p>1. Create a <code className="text-blue-400">.env</code> file in your FrontEnd directory</p>
                <p>2. Add: <code className="text-blue-400">VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key</code></p>
                <p>3. Or update <code className="text-blue-400">FrontEnd/src/config/env.js</code></p>
                <p>4. Restart your development server</p>
                <p>5. Make sure billing is enabled in Google Cloud Console</p>
              </div>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            See SETUP_INSTRUCTIONS.md for detailed instructions.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !coordinates) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-6 mb-4">
            <h2 className="text-blue-400 text-xl font-bold mb-2">Loading Google Maps...</h2>
            <p className="text-gray-300 text-sm mb-4">
              Please wait while we initialize the map.
            </p>
            
            {/* Loading Spinner */}
            <div className="flex justify-center mb-4">
              <div className="text-xl font-semibold border-2 border-blue-400 border-t-transparent w-8 h-8 animate-spin rounded-full"></div>
            </div>
            
            {/* Debug Information */}
            <div className="bg-gray-800 rounded-lg p-3 text-left">
              <h4 className="text-gray-300 font-semibold mb-2">🔍 Loading Status:</h4>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-400">API Key:</span> <span className="text-green-400">LOADED</span></p>
                <p><span className="text-gray-400">Script Loading:</span> <span className={isLoaded ? 'text-green-400' : 'text-yellow-400'}>{isLoaded ? 'COMPLETE' : 'IN PROGRESS'}</span></p>
                <p><span className="text-gray-400">Coordinates:</span> <span className={coordinates ? 'text-green-400' : 'text-yellow-400'}>{coordinates ? 'SET' : 'WAITING'}</span></p>
                <p><span className="text-gray-400">Coordinates Value:</span> <span className="text-blue-400">{coordinates ? JSON.stringify(coordinates) : 'Not yet set'}</span></p>
                <p><span className="text-gray-400">Load Attempts:</span> <span className="text-blue-400">{mapLoadAttempts}</span></p>
                <p><span className="text-gray-400">Current Time:</span> <span className="text-blue-400">{new Date().toLocaleTimeString()}</span></p>
                {mapLoadTimeout && (
                  <p><span className="text-red-400">⚠️ TIMEOUT: Map taking longer than expected</span></p>
                )}
              </div>
            </div>
            
            {/* Force Retry Button */}
            <button
              onClick={() => {
                console.log('🔄 Manual retry triggered');
                setMapLoadAttempts(prev => prev + 1);
                setMapLoadTimeout(false);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Force Retry
            </button>
            
            {/* Troubleshooting Tips */}
            {mapLoadTimeout && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
                <h4 className="text-yellow-400 font-semibold text-sm mb-2">Troubleshooting Tips:</h4>
                <div className="text-xs text-yellow-200 space-y-1">
                  <p>• Check your internet connection</p>
                  <p>• Try refreshing the page</p>
                  <p>• Check if Google Maps is blocked by firewall</p>
                  <p>• Verify API key domain restrictions in Google Cloud Console</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show runtime error if map failed after loading
  if (mapError) {
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'server';
    const currentPort = typeof window !== 'undefined' ? window.location.port : '';
    const fullDomain = currentPort ? `${currentDomain}:${currentPort}` : currentDomain;
    
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-4">
            <h2 className="text-red-400 text-xl font-bold mb-2">Google Maps Runtime Error</h2>
            <p className="text-gray-300 text-sm mb-4">
              The map loaded but encountered an error: {mapError.message || 'Unknown error'}
            </p>
            
            {/* Debug Information */}
            <div className="bg-gray-800 rounded-lg p-3 text-left mb-4">
              <h4 className="text-gray-300 font-semibold mb-2">🔍 Error Details:</h4>
              <div className="space-y-1 text-xs">
                <p><span className="text-gray-400">Error Type:</span> <span className="text-red-400">{mapError.name || 'Unknown'}</span></p>
                <p><span className="text-gray-400">Error Message:</span> <span className="text-red-400">{mapError.message || 'No message'}</span></p>
                <p><span className="text-gray-400">API Key:</span> <span className="text-green-400">LOADED</span></p>
                <p><span className="text-gray-400">Coordinates:</span> <span className="text-blue-400">{JSON.stringify(coordinates)}</span></p>
                <p><span className="text-gray-400">Current Domain:</span> <span className="text-blue-400">{fullDomain}</span></p>
                <p><span className="text-gray-400">Full URL:</span> <span className="text-blue-400">{typeof window !== 'undefined' ? window.location.href : 'N/A'}</span></p>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-3 text-left">
              <p className="text-gray-400 text-xs mb-2">🔧 <strong>IMMEDIATE FIX REQUIRED:</strong></p>
              <div className="space-y-1 text-xs">
                <p>1. <strong>Go to Google Cloud Console</strong>: <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">console.cloud.google.com</a></p>
                <p>2. <strong>Navigate to</strong>: APIs & Services → Credentials</p>
                <p>3. <strong>Click on your API key</strong> (starts with AIzaSyDOCD...)</p>
                <p>4. <strong>Under "Application restrictions"</strong>, add these domains:</p>
                <div className="bg-gray-700 p-2 rounded mt-2 font-mono text-xs">
                  <p className="text-green-400">localhost:*</p>
                  <p className="text-green-400">127.0.0.1:*</p>
                  <p className="text-green-400">{fullDomain}/*</p>
                  <p className="text-green-400">{currentDomain}:*</p>
                </div>
                <p className="mt-2 text-yellow-400">5. <strong>Save changes</strong> and wait 1-2 minutes</p>
                <p className="text-yellow-400">6. <strong>Refresh this page</strong> to test again</p>
              </div>
            </div>
            
            <button
              onClick={() => setMapError(null)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getDirections = () => {
    setDirectionsStatus('Getting Directions...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ lat: latitude, lng: longitude });

          if (window.google && latitudeC && longitudeC) {
            const directionsService = new window.google.maps.DirectionsService();
            directionsService.route(
              {
                origin: { lat: latitude, lng: longitude },
                destination: { lat: latitudeC, lng: longitudeC },
                travelMode: window.google.maps.TravelMode.WALKING,
              },
              (result, status) => {
                if (status === 'OK') {
                  setDirectionsResponse(result);
                  setDirectionsStatus('get directions');
                } else {
                  console.error(`Error fetching directions: ${status}`);
                }
              }
            );
          }
        },
        (error) => {
          console.error("Error getting user's location: ", error);
          alert(`Error: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 w-full">
        <GoogleMap
          center={coordinates}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
          onLoad={handleMapLoad}
          onError={handleMapError}
        >
          <Marker
            position={coordinates}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: color,
              fillOpacity: 1,
              strokeWeight: 3,
              strokeColor: '#FFFFFF',
            }}
          />

          {coordinates && (
            <Marker
              position={coordinates}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(35, 35),
              }}
            />
          )}

          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: '#3b82f6',
                  strokeWeight: 4,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>

      {directionsStatus !== 'get directions' && (
        <div className="p-4">
          <button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            onClick={getDirections}
            disabled={directionsStatus === 'Getting Directions...'}
          >
            {directionsStatus === 'Getting Directions...' && (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            )}
            <span>{directionsStatus}</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default LocationGoogle;


// import React, { useEffect, useState } from 'react';
// import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

// const LocationGoogle = ({ latitudeC, longitudeC }) => {
//   // Load the Google Maps API
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyAMCwh4mUljViilrr2QcNSRv-OiV6hq2RY', // Ensure your key is secured
//   });

//   const [coordinates, setCoordinates] = useState(null); // Destination coordinates
//   const [userCoordinates, setUserCoordinates] = useState(null); // User's current coordinates
//   const [directionsResponse, setDirectionsResponse] = useState(null); // Directions response from the API
//   const [directionsStatus, setDirectionsStatus] = useState('Get Directions'); // Status of directions fetching
//   const [color, setColor] = useState('#FF5733'); // Default color for the marker

//   // Define an array of colors for the marker
//   const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF00FF', '#00FFFF', '#800000', '#FF4500', '#2E8B57', '#4B0082'];

//   // Change the color of the marker every 2 seconds
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const randomColor = colors[Math.floor(Math.random() * colors.length)];
//       setColor(randomColor); 
//     }, 2000);

//     // Cleanup function to prevent memory leaks
//     return () => clearTimeout(timeoutId);
//   }, [color]); // Depend on color to create new timeouts correctly

//   // Set destination coordinates when the component mounts or when props change
//   useEffect(() => {
//     setCoordinates({ lat: latitudeC, lng: longitudeC });
//   }, [latitudeC, longitudeC]); // Added dependencies to avoid stale closures

//   // Function to get directions from user's location
//   const getDirections = () => {
//     setDirectionsStatus('Getting Directions...'); // Update the status to indicate loading
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords; // Get user's current position
//           setUserCoordinates({ lat: latitude, lng: longitude }); // Set user coordinates

//           // Now fetch the directions after getting the user's location
//           if (window.google && latitudeC && longitudeC) {
//             const directionsService = new window.google.maps.DirectionsService();
//             directionsService.route(
//               {
//                 origin: { lat: latitude, lng: longitude }, // User's current location
//                 destination: { lat: latitudeC, lng: longitudeC }, // Destination coordinates
//                 travelMode: window.google.maps.TravelMode.WALKING, // Set travel mode to walking
//               },
//               (result, status) => {
//                 if (status === 'OK') {
//                   setDirectionsResponse(result); // Set the directions response
//                   setDirectionsStatus('Get Directions'); // Reset status after getting directions
//                 } else {
//                   console.error(`Error fetching directions: ${status}`);
//                 }
//               }
//             );
//           }
//         },
//         (error) => {
//           console.error("Error getting user's location: ", error);
//           alert(`Error: ${error.message}`); // Alert user on error
//         }
//       );
//     } else {
//       alert('Geolocation is not supported by your browser.');
//     }
//   };

//   // Display loading state if the Google Map is not yet loaded
//   if (!isLoaded || !coordinates) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-xl font-semibold border-2 border-gray-400 border-t-black w-8 h-8 animate-spin"></div>
//         {/* Keep loader while the map is loading */}
//         <p>Loading Map...</p> {/* Loading message */}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center h-screen">
//       <div className="w-full h-[400px]">
//         <GoogleMap
//           center={coordinates} // Center the map on the destination
//           zoom={16}
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//         >
//           <Marker
//             position={coordinates} // Destination marker
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE,
//               scale: 6,
//               fillColor: `${color}`, // Dynamic marker color
//               fillOpacity: 1,
//               strokeWeight: 2,
//               strokeColor: '#FFFFFF',
//             }}
//           />

//       {   coordinates && (
//             <Marker
//               position={coordinates}
//               icon={{
//                 url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', // User location marker
//                 scaledSize: new window.google.maps.Size(30, 30),
//               }}
//             />
//           )}

//           {/* Render directions if available */}
//           {directionsResponse && (
//             <DirectionsRenderer
//               directions={directionsResponse}
//               options={{
//                 polylineOptions: {
//                   strokeColor: '#3b0764',
//                   strokeWeight: 6,
//                 },
//               }}
//             />
//           )}
//         </GoogleMap>
//       </div>

//       {/* Button to get directions */}
//       <button
//         className={`${directionsStatus === 'Get Directions' ? 'block' : 'hidden'} mt-8 px-4 w-[90%] py-2 flex justify-center items-center gap-3 bg-primary hover:bg-secondary/100 text-white rounded-full`}
//         onClick={getDirections}
//       >
//         <span className={`${directionsStatus === 'Getting Directions...' ? 'block' : 'hidden'} border-gray-400 border-2 border-t-primary w-4 h-4 rounded-full animate-spin`}></span>
//         {directionsStatus} {/* Show status of direction fetching */}
//       </button>
//     </div>
//   );
// };

// export default LocationGoogle;
