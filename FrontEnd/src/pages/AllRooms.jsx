import React, { useState } from "react";
import PlaceCard from "../components/Places/PlaceCard";
import OrderPopup from "../components/OrderPopup/OrderPopup"; // Import the OrderPopup component
import roomsData from '../assets/RoomsData';
import Img1 from "../assets/places/boat.jpg";

const AllRooms = () => {
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [orderPopup, setOrderPopup] = useState(false); // State to control popup visibility
  const [selectedRoom, setSelectedRoom] = useState(null); // State to store selected room details
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [selectedDistance, setSelectedDistance] = useState(null); // Filter by distance state

  // Function to handle location filter change
  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  // Function to handle amenities filter change
  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Function to handle distance filter change
  const handleDistanceChange = (distance) => {
    setSelectedDistance(distance);
  };

  // Function to handle popup opening
  const handleOrderPopup = (room) => {
    setSelectedRoom(room); // Set the selected room
    setOrderPopup(true);   // Show the popup
  };

  // Filter rooms based on selected criteria
  const filteredRooms = roomsData
    .filter((room) => {
      const locationMatch =
        selectedLocation.length === 0 || selectedLocation.includes(room.location);
      const amenitiesMatch = selectedAmenities.every((amenity) => room.amenities[amenity]);
      const searchMatch =
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase());
      const distanceMatch =
        selectedDistance === null || room.minutesAway <= selectedDistance;

      return locationMatch && amenitiesMatch && searchMatch && distanceMatch;
    });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10">
      {/* Banner Section */}
      <div className="relative">
        <img src={Img1} alt="Banner" className="w-full h-[200px] object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 text-white">
          <h1 className="text-4xl font-bold">Browse Rooms</h1>
        </div>
      </div>

      <section className="container md:mx-auto px-0">
        <div className="flex flex-row">
          {/* Filters Section */}
          <div className="md:w-1/4 w-[40%] sticky top-0 p-4 bg-white dark:bg-gray-800 shadow-lg max-h-screen overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Search</h2>
              <input
                type="text"
                placeholder="Search by title or description"
                className="w-full p-2 border rounded mt-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Filter by Location</h2>
              <div className="flex flex-col gap-2 mt-2">
                {["Gate 1", "Gate 2", "Gate 3", "Motintane", "Nearby", "Hostel"].map((loc) => (
                  <label key={loc} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedLocation.includes(loc)}
                      onChange={() => handleLocationChange(loc)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Filter by Amenities</h2>
              <div className="flex flex-col gap-2 mt-2">
                {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold">Filter by Distance (minutes away)</h2>
              <div className="flex flex-col gap-2 mt-2">
                {[5, 10, 20, 30].map((distance) => (
                  <label key={distance} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="distance"
                      checked={selectedDistance === distance}
                      onChange={() => handleDistanceChange(distance)}
                    />
                    <span>{distance} minutes or less</span>
                  </label>
                ))}
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="distance"
                    checked={selectedDistance === null}
                    onChange={() => handleDistanceChange(null)}
                  />
                  <span>Any distance</span>
                </label>
              </div>
            </div>
          </div>

          {/* Rooms Listing */}
          <div className="md:w-[100%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
            {filteredRooms.map((room, index) => (
              <PlaceCard
                key={index}
                img={room.img}
                title={room.title}
                description={room.description}
                price={room.price}
                minutesAway={room.minutesAway}
                amenities={room.amenities}
                handleOrderPopup={() => handleOrderPopup(room)} // Pass room data to popup
              />
            ))}
          </div>
        </div>
      </section>

      {/* Show the popup if a room is selected */}
      {orderPopup && selectedRoom && (
        <OrderPopup
          room={selectedRoom} // Pass selected room data to popup
          setOrderPopup={setOrderPopup} // Function to close the popup
        />
      )}
    </div>
  );
};

export default AllRooms;
