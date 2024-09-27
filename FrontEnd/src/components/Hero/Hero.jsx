import React, { useState } from "react";
import axios from "axios";
import { FiHome } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import PlaceCard from "../Places/PlaceCard";

const Hero = () => {
  const [priceValue, setPriceValue] = useState(2000);
  const [location, setLocation] = useState("All");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Using axios to fetch data from the backend
  const searchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/rooms/search", {
        params: {
          location: location,
          maxPrice: priceValue,
        },
      });
      console.log(location)
      setSearchResults(response.data); // Set the results to the data returned from the API
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); // Ensure the loading state is stopped
    }
  };

  const handleSearch = () => {
    searchRooms(); // Perform the search when the button is clicked
  };

  const handleResetSearch = () => {
    setSearchResults(null); // Reset the search results
  };

  return (
    <div className="bg-gradient-to-b from-blac  to-white pt-12 flex justify-center">
      <div className="h-full flex justify-center items-center p-4">
        <div className="container grid grid-cols-1 md:mt-6 w-[90%] md:w-[75%] lg:w-[80%] gap-4">
          {!searchResults ? (
            <>
              {/* Search Form */}
              <div className="text-white text-center">
                <h1 className="font-bold text-2xl lg:text-3xl mb-4" data-aos="fade-up">
                  Find Your Perfect Room Near University of Limpopo
                </h1>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6 relative" data-aos="fade-up" data-aos-delay="300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                  <div>
                    <label htmlFor="section" className="block text-sm text-gray-600 mb-2">
                      Sort by Location
                    </label>
                    <select
                      name="section"
                      className="w-full text-sm bg-gray-200 border border-gray-300 rounded-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="All">All</option>
                      <option value="Gate 1">Gate 1</option>
                      <option value="Gate 2">Gate 2</option>
                      <option value="Gate 3">Gate 3</option>
                      <option value="Ga-motintane">Ga-motintane</option>
                    </select>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label htmlFor="price" className="block text-sm text-gray-600 -mb-2">
                        Max Price
                      </label>
                      <span className="ml-2 font-bold text-md text-gray-600">R {priceValue}</span>
                    </div>
                    <div className="w-full flex justify-between items-center">
                      <input
                        type="range"
                        name="price"
                        id="price"
                        className="w-full bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                        min="600"
                        max="5000"
                        value={priceValue}
                        step="100"
                        onChange={(e) => setPriceValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-950 hover:to-slate-800 hover:bg-dark text-white font-semibold px-4 py-3 rounded-full mt-6 w-full text-center transition-transform duration-300"
                  onClick={handleSearch}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ImSpinner2 className="animate-spin inline-block mr-2" />
                  ) : (
                    "Search Now"
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Search Results */}
              <div className="bg-white pb-36 absolute top- left-0 z-[11] rounded-lg shadow-lg p-6">
                <button
                  className="text-primary flex items-center mb-6 hover:text-primary-dark"
                  onClick={handleResetSearch}
                >
                  <FiHome className="mr-2" size={20} />
                  Back to Search
                </button>
                <div clasName="text-center w-full mb-4 mt-12 pb-8 font-bold">Your Search Results ...</div>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((room, index) => (
                      <PlaceCard
                      key={index}
                      {...room} // Spread the room data into PlaceCard props
                      handleOrderPopup={() => handleOrderPopup(item)} // Pass the selected room data
                    />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No rooms found matching your criteria.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
