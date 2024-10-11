import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsRenderer } from '@react-google-maps/api';

const LocationGoogle = ({ latitudeC, longitudeC }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAMCwh4mUljViilrr2QcNSRv-OiV6hq2RY', 
  });

  const [coordinates, setCoordinates] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    if (latitudeC) {
      navigator.geolocation.getCurrentPosition((position) => {
        // const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitudeC, lng: longitudeC });
      }, 
      (error) => {
        console.error("Error getting Coordinates: ", error);
        alert(`Error: ${error.message}`);
      });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ lat: latitude, lng: longitude });
        }, 
        (error) => {
          console.error("Error getting Coordinates: ", error);
          alert(`Error: ${error.message}`);

        });
      }
  }, []);
// { long:  29.738459289865034, lat:-23.880302596206946 } 
  const getDirections = () => {
    if (window.google && coordinates && latitudeC && longitudeC) {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: userCoordinates,
          destination: { lat: parseFloat(latitudeC), lng: parseFloat(longitudeC) }, 
          travelMode: window.google.maps.TravelMode.WALKING, 
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            console.error(`Error fetching directions: ${status}`);
          }
        }
      );
    }
  };

  if (!isLoaded || !coordinates) {
    return (
      <div className="flex items-center justify-center h-">
        <div className="text-xl font-semibold border-2 border-gray-400 border-t-black w-8 h-8 animate-spin rounded-full">
             {/* Loading Map... */}
        </div>
        {/* loading map */}
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
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png', 
              scaledSize: new window.google.maps.Size(30, 30), 
            }} 
          />

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
        className="mt-8 px-4 w-[90%] py-2 bg-primary hover:bg-secondary/100 text-white rounded-full"
        onClick={getDirections}
      >
        Get Directions
      </button>
    </div>
  );
};

export default LocationGoogle;


/////////This code below i cant clear it becasue i wanted to see what was wrong with it compared to the above since i touched something and the icon

// import React, { useState, useEffect } from 'react';
// import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

// const LocationGoogle = ({ latitude, longitude }) => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: 'AIzaSyAMCwh4mUljViilrr2QcNSRv-OiV6hq2RY', // Replace with your actual API key
//   });

//   // State for coordinates
//   const [coordinates, setCoordinates] = useState(null);

//   useEffect(() => {
//     if (latitude && longitude) {
//       setCoordinates({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
//     }
//   }, [latitude, longitude]);

//   if (!isLoaded || !coordinates) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <div className="text-xl font-semibold">Loading Map...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <div className="w-full h-[400px]">
//         <GoogleMap
//           center={coordinates}
//           zoom={18}
//           mapContainerStyle={{ width: '100%', height: '100%' }}
//         >
//           <Marker
//             position={coordinates}
//             icon={{
//               url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Marker_Icon.png', 
//               scaledSize: new window.google.maps.Size(30, 30), // Correct scaling
//             }}
//           />
//           Uncomment this block to test using a built-in icon
//           {/* <Marker
//             position={coordinates}
//             icon={{
//               path: window.google.maps.SymbolPath.CIRCLE, // Built-in Google Maps circle icon
//               scale: 5,
//               fillColor: 'blue',
//               fillOpacity: 1,
//               strokeWeight: 1,
//             }}
//           /> */}
         
//         </GoogleMap>
//       </div>
//     </div>
//   );
// };

// export default LocationGoogle;