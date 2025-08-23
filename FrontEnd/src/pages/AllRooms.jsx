import React, { useContext, useEffect, useState } from "react";
import PlaceCard from "../components/Places/PlaceCard";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import Img1 from "../assets/places/boat.jpg";
import { GlobalContext } from "../components/GlobalContext";
import Loader from './Loader';
import { FiFilter, FiX } from "react-icons/fi";
import axios from "axios";

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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const ROOMS_PER_PAGE = 4;

  useEffect(() => {
    fetchAllRooms();
  }, []);

  useEffect(() => {
    if (allRooms) {
      setRooomsData(allRooms);
      setLoading(false); 
    }
  }, [allRooms]);

  // Update displayed rooms when filters change
  useEffect(() => {
    const filtered = getFilteredRooms();
    const initialRooms = filtered.slice(0, ROOMS_PER_PAGE);
    setDisplayedRooms(initialRooms);
    setCurrentPage(1);
    setHasMore(filtered.length > ROOMS_PER_PAGE);
  }, [roomsData, selectedLocation, selectedAmenities, searchTerm, selectedDistance]);

  const getFilteredRooms = () => {
    if (!roomsData) return [];
    return roomsData.filter((room) => {
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
    });
  };

  const loadMoreRooms = () => {
    setLoadingMore(true);
    const filtered = getFilteredRooms();
    const nextPage = currentPage + 1;
    const startIndex = currentPage * ROOMS_PER_PAGE;
    const endIndex = nextPage * ROOMS_PER_PAGE;
    const newRooms = filtered.slice(startIndex, endIndex);
    
    setTimeout(() => {
      setDisplayedRooms(prev => [...prev, ...newRooms]);
      setCurrentPage(nextPage);
      setHasMore(endIndex < filtered.length);
      setLoadingMore(false);
    }, 500); // Simulate API delay
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    // Filters are automatically applied via useEffect
  };

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

  const totalFilteredRooms = getFilteredRooms().length;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10 gradient-dark">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Banner Section */}
          <div className="relative">
            <img
              src={Img1}
              alt="Banner"
              className="w-full h-[200px] md:h-[250px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white">Browse All Rooms</h1>
            </div>
          </div>

          {/* Search Section */}
          <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 shadow-xl">
                <input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  className="w-full bg-transparent text-white placeholder-gray-300 px-4 py-3 focus:outline-none text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <section className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Sidebar - Hidden on mobile/tablet */}
              <div className="hidden lg:block lg:w-1/4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-white mb-6">Filters</h2>
                  
                  {/* Location Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
                    <div className="space-y-2">
                      {["gate 1", "gate 2", "gate 3", "motintane"].map((loc) => (
                        <label key={loc} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedLocation.includes(loc)}
                            onChange={() => handleLocationChange(loc)}
                            className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-gray-200">
                            {loc.charAt(0).toUpperCase() + loc.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                    <div className="space-y-2">
                      {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map(
                        (amenity) => (
                          <label
                            key={amenity}
                            className="flex items-center gap-3 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAmenities.includes(amenity)}
                              onChange={() => handleAmenityChange(amenity)}
                              className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-gray-200">
                              {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Distance Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Distance to Campus</h3>
                    <div className="space-y-2">
                      {[5, 10, 20, 30, 40, 50].map((distance) => (
                        <label key={distance} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="distance"
                            checked={selectedDistance === distance}
                            onChange={() => handleDistanceChange(distance)}
                            className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-200">{distance} minutes or less</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="distance"
                          checked={selectedDistance === null}
                          onChange={() => handleDistanceChange(null)}
                          className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-200">Any distance</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room Cards Grid */}
              <div className="lg:w-3/4">
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-300">
                    Showing {displayedRooms.length} of {totalFilteredRooms} room{totalFilteredRooms !== 1 ? 's' : ''}
                  </p>
                  {/* Mobile/Tablet Filter Toggle Button */}
                  <button
                    className="lg:hidden flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-200"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <FiFilter />
                    <span>Filters</span>
                  </button>
                </div>
                
                {displayedRooms.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {displayedRooms.map((room, index) => (
                        <PlaceCard
                          key={index}
                          {...room}
                          handleOrderPopup={() => handleOrderPopup(room)}
                        />
                      ))}
                    </div>
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <div className="text-center">
                        <button
                          onClick={loadMoreRooms}
                          disabled={loadingMore}
                          className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingMore ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Loading...</span>
                            </div>
                          ) : (
                            'Load More Rooms'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No rooms found</h3>
                    <p className="text-gray-500">Try adjusting your filters to see more results</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Mobile/Tablet Filter Sliding Panel */}
          {showMobileFilters && (
            <>
              {/* Backdrop */}
              <div 
                className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={() => setShowMobileFilters(false)}
              />
              
              {/* Sliding Panel */}
              <div className={`lg:hidden fixed right-0 top-0 z-50 h-screen w-full max-w-md bg-gray-900/95 backdrop-blur-xl border-l border-white/20 transform transition-transform duration-300 overflow-y-auto ${
                showMobileFilters ? 'translate-x-0' : 'translate-x-full'
              }`}>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Filters</h2>
                    <button
                      className="p-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                
                {/* Location Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
                  <div className="space-y-2">
                    {["gate 1", "gate 2", "gate 3", "motintane"].map((loc) => (
                      <label key={loc} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedLocation.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                          className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-gray-200">
                          {loc.charAt(0).toUpperCase() + loc.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                  <div className="space-y-2">
                    {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map(
                      (amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-gray-200">
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                  {/* Distance Filter */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Distance to Campus</h3>
                    <div className="space-y-2">
                      {[5, 10, 20, 30, 40, 50].map((distance) => (
                        <label key={distance} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="distance"
                            checked={selectedDistance === distance}
                            onChange={() => handleDistanceChange(distance)}
                            className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                          />
                          <span className="text-gray-200">{distance} minutes or less</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="distance"
                          checked={selectedDistance === null}
                          onChange={() => handleDistanceChange(null)}
                          className="w-4 h-4 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                        />
                        <span className="text-gray-200">Any distance</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Apply Button */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <button
                      onClick={applyFilters}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

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
