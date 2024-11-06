import React, { useContext, useEffect, useState } from "react";
import PlaceCard from "../components/Places/PlaceCard";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import Img1 from "../assets/places/boat.jpg";
import { GlobalContext } from "../components/GlobalContext";
import Loader from './Loader';

const AllRooms = () => {
  const { fetchAllRooms, allRooms } = useContext(GlobalContext);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistance, setSelectedDistance] = useState(null);
  const [roomsData, setRooomsData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    fetchAllRooms();
  }, []);

  useEffect(() => {
    if (allRooms) {
      setRooomsData(allRooms);
      setLoading(false); 
    }
  }, [allRooms]);

  const handleLocationChange = (location) => {
    setSelectedLocation((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleDistanceChange = (distance) => {
    setSelectedDistance(distance);
  };

  const handleOrderPopup = (room) => {
    setSelectedRoom(room);
    setOrderPopup(true);
  };

  const filteredRooms = roomsData
    ? roomsData.filter((room) => {
        const locationMatch =
          selectedLocation.length === 0 || selectedLocation.includes(room.location);
        const amenitiesMatch = selectedAmenities.every(
          (amenity) => room.amenities[amenity]
        );
        const searchMatch =
          room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.description.toLowerCase().includes(searchTerm.toLowerCase());
        const distanceMatch =
          selectedDistance === null || room.minutesAway <= selectedDistance;

        return locationMatch && amenitiesMatch && searchMatch && distanceMatch;
      })
    : [];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="relative">
            <img
              src={Img1}
              alt="Banner"
              className="w-full h-[200px] object-cover"
            />
            <div className="absolute top-[0px] left-0 w-full h-full flex items-center justify-center bg-black/50 text-white">
              <h1 className="text-4xl mb-16 font-bold">Browse Rooms</h1>
            </div>

            <div className="absolute bottom-12 left-1/2 transform max-w-[600px] -translate-x-1/2 w-[80%]">
              <input
                type="text"
                placeholder="Search by title or description"
                className="w-full text-xs p-3 px-5 border text-white focus:outline-none focus:shadow-dark focus:shadow-md focus:border-dark bg-primary border-dark rounded-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <section className="container md:mx-auto px-0">
            <div className="flex flex-row gap-[-58px]">
              <div className="md:w-1/4 w-[35%] sticky top-[60px] p-2 bg-white dark:bg-gray-800 shadow-lg max-h-[600px] overflow-y-auto">
                <div className="mb-4">
                  <h2 className="text-xs md:text-sm font-semibold">Filter by Location</h2>
                  <div className="flex flex-col gap-1 mt-2  md:text-xs text-[10px]">
                    {["gate 1", "gate 2", "gate 3", "motintane"].map((loc) => (
                      <label key={loc} className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={selectedLocation.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                        />
                        <span>{loc.slice(0, 1).toUpperCase() +loc.slice(1, loc.length) }</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className=" mb-4">
                  <h2 className="text-xs md:text-sm font-semibold">Filter by Amenities</h2>
                  <div className="flex flex-col gap-1 mt-2 md:text-xs text-[10px]">
                    {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map(
                      (amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                          />
                          <span>
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <h2 className="text-xs md:text-sm  font-semibold">
                    Filter by Distance (away from campus)
                  </h2>
                  <div className="flex flex-col gap-1 mt-2 md:text-xs text-[8px]">
                    {[5, 10, 20, 30, 40, 50].map((distance) => (
                      <label key={distance} className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="distance"
                          checked={selectedDistance === distance}
                          onChange={() => handleDistanceChange(distance)}
                        />
                        <span>{distance} minutes or less</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-1">
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

              <div className="md:w-[100%] grid grid-cols-1 ml-[-10px] md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
                {filteredRooms.map((room, index) => (
                  <PlaceCard
                    {...room}
                    handleOrderPopup={() => handleOrderPopup(room)}
                  />
                ))}
              </div>
            </div>
          </section>

          {orderPopup && selectedRoom && (
            <OrderPopup
              roomDetails={selectedRoom}
              setOrderPopup={setOrderPopup}
              orderPopup={orderPopup}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AllRooms;
