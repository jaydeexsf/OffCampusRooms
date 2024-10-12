import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const LocationGoogle = ({ latitudeC, longitudeC }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAMCwh4mUljViilrr2QcNSRv-OiV6hq2RY',
  });

  const [coordinates, setCoordinates] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [directionsStatus, setDirectionsStatus] = useState('Get Directions');
  const [color, setColor] = useState('#FF5733');

  const colors = ['#FF5733', '#33FF57', '#5733FF', '#FFD700', '#FF00FF', '#00FFFF', '#800000', '#FF4500', '#2E8B57', '#4B0082'];

  // Random color change every second
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setColor(randomColor);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [color]);

  // Set destination coordinates on mount
  useEffect(() => {
    if (latitudeC && longitudeC) {
      setCoordinates({ lat: latitudeC, lng: longitudeC });
    }
  }, [latitudeC, longitudeC]);

  // Function to get directions
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

  if (!isLoaded || !coordinates) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold border-2 border-gray-400 border-t-black w-8 h-8 animate-spin rounded-full">
          Loading Map...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className="w-full h-[400px]">
        <GoogleMap
          center={coordinates}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%' }}
        >
          <Marker
            position={coordinates}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: color,
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
            }}
          />

          {coordinates && (
            <Marker
              position={coordinates}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          )}

          {directionsResponse && (
            <DirectionsRenderer
              directions={directionsResponse}
              options={{
                polylineOptions: {
                  strokeColor: '#3b0764',
                  strokeWeight: 6,
                },
              }}
            />
          )}
        </GoogleMap>
      </div>

      <button
        className={`${directionsStatus === 'get directions' ? 'hidden' : 'block'} mt-8 px-4 w-[90%] py-2 flex justify-center items-center gap-3 bg-primary hover:bg-secondary/100 text-white rounded-full`}
        onClick={getDirections}
      >
        <span className={`${directionsStatus === 'Getting Directions...' ? 'block' : 'hidden'} border-gray-400 border-2 border-t-primary w-4 h-4 rounded-full animate-spin`}></span>
        {directionsStatus}
      </button>
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
