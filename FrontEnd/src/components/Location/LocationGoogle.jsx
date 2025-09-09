import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, DirectionsRenderer } from '@react-google-maps/api';
import { getGoogleMapsApiKey } from '../../config/env';

// Static libraries array to prevent performance warnings
const GOOGLE_MAPS_LIBRARIES = ['places', 'marker'];

const LocationGoogle = ({ latitudeC, longitudeC }) => {
  // Get Google Maps API key
  const googleMapsApiKey = getGoogleMapsApiKey();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey || '',
    libraries: GOOGLE_MAPS_LIBRARIES
  });





  const [coordinates, setCoordinates] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsStatus, setDirectionsStatus] = useState('Get Directions');
  const [color, setColor] = useState('#FF5733');
  const [mapError, setMapError] = useState(null);
  const [mapLoadAttempts, setMapLoadAttempts] = useState(0);
  const [mapLoadTimeout, setMapLoadTimeout] = useState(false);
  const [map, setMap] = useState(null);
  const [roomMarker, setRoomMarker] = useState(null);

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
    }
  }, [latitudeC, longitudeC]);

  // Handle map loading errors
  const handleMapError = (error) => {
    setMapError(error);
    setMapLoadAttempts(prev => prev + 1);
  };

  // Handle successful map load
  const handleMapLoad = () => {
    setMapError(null);
    setMapLoadAttempts(0);
  };

  // Enhanced error handling for load errors
  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 mb-4">
            <h2 className="text-red-400 text-xl font-bold mb-2">Google Maps Load Error</h2>
            <p className="text-gray-300 text-sm mb-4">
              Failed to load Google Maps: {loadError.message}
            </p>
            

            
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
            

            
            {/* Force Retry Button */}
            <button
              onClick={() => {
                setMapLoadAttempts(prev => prev + 1);
                setMapLoadTimeout(false);
              }}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Retry
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
            

            
            <div className="bg-gray-800 rounded-lg p-3 text-left">
              <p className="text-gray-400 text-xs mb-2">🔧 <strong>To fix this issue:</strong></p>
              <div className="space-y-1 text-xs">
                <p>1. Check your Google Maps API key configuration</p>
                <p>2. Ensure billing is enabled in Google Cloud Console</p>
                <p>3. Verify required APIs are enabled</p>
                <p>4. Check domain restrictions in your API key settings</p>
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

  // Create room marker when map loads
  useEffect(() => {
    if (map && coordinates && window.google?.maps?.marker?.AdvancedMarkerElement) {
      const markerElement = document.createElement('div');
      markerElement.innerHTML = `
        <div style="
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>
      `;
      
      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: coordinates,
        content: markerElement,
        title: 'Room Location'
      });
      
      setRoomMarker(marker);
    }
  }, [map, coordinates]);

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
          onLoad={(map) => {
            setMap(map);
            handleMapLoad();
          }}
          onError={handleMapError}
        >
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
