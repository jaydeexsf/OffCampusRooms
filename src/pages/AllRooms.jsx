import React, { useState } from "react";
import PlaceCard from "../components/Places/PlaceCard";
import roomsData from '../assets/RoomsData';

import Img1 from "../assets/places/boat.jpg";

const AllRooms = ({ handleOrderPopup }) => {
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

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

  // Filter rooms based on selected criteria
  const filteredRooms = roomsData.filter((room) => {
    const locationMatch =
      selectedLocation.length === 0 || selectedLocation.includes(room.location);
    const amenitiesMatch = selectedAmenities.every((amenity) =>
      room.amenities[amenity]
    );

    return locationMatch && amenitiesMatch;
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
      <section className="container mx-auto px-4">
        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
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
            <div>
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
          </div>
        </div>
        {/* Rooms Listing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredRooms.map((room, index) => (
            <PlaceCard
              key={index}
              img={room.img}
              title={room.title}
              description={room.description}
              price={room.price}
              minutesAway={room.minutesAway}
              handleOrderPopup={handleOrderPopup}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AllRooms;