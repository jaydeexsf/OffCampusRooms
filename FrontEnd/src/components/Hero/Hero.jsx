import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiHome } from "react-icons/fi";
import { ImSpinner2 } from "react-icons/im";
import PlaceCard from "../Places/PlaceCard";
import { FaAngleDown } from "react-icons/fa";

const Hero = ({handleOrderPopup}) => {
  const [priceValue, setPriceValue] = useState(2000);
  const [location, setLocation] = useState("All");
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [limitations, setLimitations] = useState(6);
  const [roomsC, setRoomsC]= useState();
  const [roomLoading, setRoomLoading] = useState(false);

  // Using axios to fetch data from the backend
  const searchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://offcampusrooms.onrender.com/api/rooms/search", {
        params: {
          location: location,
          maxPrice: priceValue,
          limitBy: limitations,
        },
      });
      setRoomLoading(true)
      setSearchResults(response.data.rooms);
      // setRoomsC(response.data.roomCount) 

      console.log(response.data.rooms.length)
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false); 
      setRoomLoading(false)
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
    <div className="bg-gradient-to-b from-blac  to-white pt-12 flex justify-center">
      <div className="h-full flex justify-center items-center p-4">
        <div className="container grid grid-cols-1 md:mt-6 w-[90%] md:w-[75%] lg:w-[80%] gap-4">
          {!searchResults ? (
            <>
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
                  className="bg-gradient-to-r from-slate-900 to-slate-950 hover:from-slate-950 hover:to-slate-800 hover:bg-dark text-white font-semibold px-4 py-2 rounded-full mt-6 w-full text-center transition-transform duration-300"
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
              <div className="bg-white pb-8 sm:pt-16 absolute top-5 left-0 w-full z-[11] rounded-lg shadow-lg p-6">
                <button
                  className="text-primary flex items-center mb-3 hover:text-primary-dark"
                  onClick={handleResetSearch}
                >
                  <FiHome className="mr-2" size={20} />
                  Back 
                </button>
                <div className="text-center w-full pb-2 font-bold ">Your Search Results...</div>
                {searchResults.length > 0 ? (
                 <div>
                   <div className="grid grid-cols-1 mt-4 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {searchResults.map((item, index) => (
                      <PlaceCard
                      key={index}
                      {...item} 
                      handleOrderPopup={() => handleOrderPopup(item)} 
                    />
                    ))}
                   
                  </div>
                  { roomsC && roomsC <= limitations ? <div className="w-full mt-8 flex justify-center text-lg font-bold">No more rooms maching your criteria</div> : 
                  <div className="mt-4 w-full items-center flex text-center self-center justify-center font-semibold ">
                      {/* <span className="w-1/3 h-[2px] bg-dark"></span> */}
                      <button onClick={() => {
                            setLimitations(limitations + 6)
                          }}
                           className="flex w-[200px] md:w-[30%] text-center py-2 bg-dark/70 hover:bg-dark/60 text-white rounded-full justify-center items-center gap-4">
                        <span> show more </span><FaAngleDown />
                      </button>
                      {/* <span className="w-1/3 h-[2px] bg-dark"></span> */}
                      {/* Your Seacrh results ends here. */}
                    </div>
                    
                  }
                 {roomLoading ?  <div className="border-gray-400 flex justify-center border-t-primary w-16 h-16 border-2 animate-spin rounded-full"></div> : ''}
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
