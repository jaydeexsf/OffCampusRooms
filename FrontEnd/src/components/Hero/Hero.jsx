import React, { useEffect, useState } from "react";
import { FiHome, FiMapPin, FiDollarSign, FiSearch, FiShield, FiMessageCircle } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import PlaceCard from "../Places/PlaceCard";
import { FaAngleDown } from "react-icons/fa";
import { apiClient, API_ENDPOINTS } from "../../config/api";

const Hero = ({ handleOrderPopup }) => {
  const [priceValue, setPriceValue] = useState(2000);
  const [location, setLocation] = useState("All");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limitations, setLimitations] = useState(6);
  const [roomsC, setRoomsC] = useState(0);
  const [roomLoading, setRoomLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const searchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.SEARCH_ROOMS, {
        params: {
          location,
          maxPrice: priceValue,
          limitBy: limitations,
        },
      });
      setSearchResults(response.data.rooms);
      setRoomsC(response.data.roomCount);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
      setRoomLoading(false);
      setLoadingMore(false);
    }
  };

  const handleSearch = () => {
    searchRooms();
  };

  useEffect(() => {
    if (limitations > 6) {
      searchRooms();
    }
  }, [limitations]);

  const handleResetSearch = () => {
    setSearchResults(null);
  };

  return (
    <div className="gradient-dark pt-20 pb-16 h-full flex items-center justify-center">
      <div className="container mx-auto px-4 sm:pt-12">
        <div className="max-w-4xl mx-auto">
          {!searchResults ? (
            <>
              {/* Hero Header */}
              <div className="text-center mb-12" data-aos="fade-up">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                  Find Your Perfect{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Student Room
                  </span>
                  <br />
                  Near University of Limpopo
                </h1>
                <p className="text-base md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Discover comfortable, affordable accommodation with modern amenities. 
                  Your ideal student living experience starts here.
                </p>
              </div>

              {/* Search Card */}
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl mx-auto shadow-2xl" data-aos="fade-up" data-aos-delay="200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Location Filter */}
                  <div className="space-y-3">
                    <label htmlFor="section" className="flex items-center gap-2 text-xs md:text-sm font-medium text-white">
                      <FiMapPin className="text-blue-400" />
                      Location
                    </label>
                    <select
                      name="section"
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="All" className="bg-gray-800 text-white">All Locations</option>
                      <option value="Gate 1" className="bg-gray-800 text-white">Gate 1</option>
                      <option value="Gate 2" className="bg-gray-800 text-white">Gate 2</option>
                      <option value="Gate 3" className="bg-gray-800 text-white">Gate 3</option>
                      <option value="Ga-motintane" className="bg-gray-800 text-white">Ga-motintane</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label htmlFor="price" className="flex items-center gap-2 text-xs md:text-sm font-medium text-white">
                        <FiDollarSign className="text-green-400" />
                        Max Budget
                      </label>
                      <span className="text-blue-400 font-mono font-semibold text-base md:text-lg">
                        R {priceValue.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        name="price"
                        id="price"
                        className="w-full h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        min="600"
                        max="5000"
                        value={priceValue}
                        step="100"
                        onChange={(e) => setPriceValue(e.target.value)}
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((priceValue - 600) / (5000 - 600)) * 100}%, rgba(255,255,255,0.2) ${((priceValue - 600) / (5000 - 600)) * 100}%, rgba(255,255,255,0.2) 100%)`
                        }}
                      />
                      <div className="flex justify-between text-xs md:text-sm text-gray-300 mt-2">
                        <span>R600</span>
                        <span>R5,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <ImSpinner2 className="animate-spin text-xl" />
                      <span>Searching...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <FiSearch className="text-xl" />
                      <span>Search Rooms</span>
                    </div>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-sm z-50 overflow-y-auto">
                <div className="container mx-auto px-4 py-8">
                  <div className="max-w-6xl mx-auto">
                    {/* Header with back button */}
                    <div className="flex items-center justify-between mb-8">
                      <button
                        className="btn-ghost flex items-center gap-2"
                        onClick={handleResetSearch}
                      >
                        <FiHome size={20} />
                        <span>Go Back</span>
                      </button>
                      <div className="text-center">
                        <h2 className="text-xl md:text-2xl font-bold text-neutral-100"><span className="text-blue-400 md:hidden"> Search </span>Results</h2>
                        {/* <p className="text-neutral-400 text-xs md:text-sm">
                          {searchResults?.length || 0} rooms found
                        </p> */}
                      </div>
                      <div className="w-32"></div> {/* Spacer for centering */}
                    </div>

                    {/* Results Grid */}
                    {searchResults && searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                        {searchResults.map((item, index) => (
                          <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                            <PlaceCard
                              {...item}
                              handleOrderPopup={() => handleOrderPopup(item)}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-lg md:text-xl font-semibold text-neutral-300 mb-2">No rooms found</h3>
                        <p className="text-xs md:text-base text-neutral-500">Try adjusting your search criteria</p>
                      </div>
                    )}

                    {/* Load More Button */}
                    {searchResults && searchResults.length > 0 && (
                      <div className="text-center">
                        {roomsC && roomsC <= limitations ? (
                          <div className="text-neutral-400 font-medium">
                            🎉 You've seen all available rooms
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setLoadingMore(true);
                              setLimitations(prev => prev + 6);
                            }}
                            className="btn-secondary flex items-center gap-3 mx-auto"
                            disabled={loadingMore}
                          >
                            {loadingMore ? (
                              <>
                                <ImSpinner2 className="animate-spin" />
                                <span>Loading...</span>
                              </>
                            ) : (
                              <>
                                <span>Load More Rooms</span>
                                <FaAngleDown />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
