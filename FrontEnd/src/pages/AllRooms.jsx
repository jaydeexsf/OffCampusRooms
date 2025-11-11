import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PlaceCard from "../components/Places/PlaceCard";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import Img1 from "../assets/places/boat.jpg";
import { GlobalContext } from "../components/GlobalContext";
import Loader from './Loader';
import { FiFilter, FiX, FiSearch, FiLoader } from "react-icons/fi";
import { apiClient } from '../config/api';
import { API_ENDPOINTS } from '../config/api';
import SEO from "../components/SEO";

const AllRooms = () => {
  const { fetchAllRooms, allRooms, isUsingDummyRooms } = useContext(GlobalContext);
  const [searchParams, setSearchParams] = useSearchParams();
  // Temporary filter states (for UI - not applied until user clicks Apply)
  const [tempLocation, setTempLocation] = useState([]);
  const [tempAmenities, setTempAmenities] = useState([]);
  const [tempDistance, setTempDistance] = useState(null);
  const [tempPriceRange, setTempPriceRange] = useState(null);
  const [tempRentPeriod, setTempRentPeriod] = useState('month');
  const [tempPriceType, setTempPriceType] = useState('under');
  const [tempSecurity, setTempSecurity] = useState([]);
  const [tempBestRoom, setTempBestRoom] = useState(false);
  
  // Applied filter states (actually used for filtering)
  const [appliedLocation, setAppliedLocation] = useState([]);
  const [appliedAmenities, setAppliedAmenities] = useState([]);
  const [appliedDistance, setAppliedDistance] = useState(null);
  const [appliedPriceRange, setAppliedPriceRange] = useState(null);
  const [appliedRentPeriod, setAppliedRentPeriod] = useState('month');
  const [appliedPriceType, setAppliedPriceType] = useState('under');
  const [appliedSecurity, setAppliedSecurity] = useState([]);
  const [appliedBestRoom, setAppliedBestRoom] = useState(false);
  
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roomsData, setRooomsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [displayedRooms, setDisplayedRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    location: [],
    amenities: [],
    distance: null
  });
  const ROOMS_PER_PAGE = 6;

  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Handle URL parameters on component mount
  useEffect(() => {
    const locationParam = searchParams.get('location');
    if (locationParam) {
      // Map location names to match the filter values
      const locationMap = {
        'gate 1': 'gate 1',
        'gate 2': 'gate 2', 
        'gate 3': 'gate 3',
        'ga-motintane': 'motintane'
      };
      
      const mappedLocation = locationMap[locationParam.toLowerCase()];
      if (mappedLocation) {
        setTempLocation([mappedLocation]);
        setAppliedLocation([mappedLocation]);
        // Auto-apply if coming from URL
        setTimeout(() => {
          const filters = {
            location: [mappedLocation],
            amenities: [],
            distance: null
          };
          fetchFilteredRooms(filters);
        }, 100);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (allRooms) {
      setRooomsData(allRooms);
      // Set initial displayed rooms
      const initialRooms = allRooms.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(allRooms.length > ROOMS_PER_PAGE);
      setLoading(false); 
    }
  }, [allRooms]);

  // Function to fetch filtered rooms from API
  const fetchFilteredRooms = async (filters) => {
    setFilterLoading(true);
    try {
      // Check if any filters are actually applied
      const hasLocationFilter = filters.location.length > 0;
      const hasAmenitiesFilter = filters.amenities.length > 0;
      const hasDistanceFilter = filters.distance !== null;
      
      // If no filters are applied, fetch all rooms instead
      if (!hasLocationFilter && !hasAmenitiesFilter && !hasDistanceFilter) {
        await fetchAllRooms();
        setFilterLoading(false);
        return;
      }
      
      // If no locations selected, don't send location parameter (defaults to all)
      const params = {
        limitBy: 50 // Get more results for filtering
      };
      
      // Only add location parameter if specific locations are selected
      if (hasLocationFilter) {
        params.location = filters.location.join(',');
      }
      
      // Only add amenities parameter if specific amenities are selected
      if (hasAmenitiesFilter) {
        params.amenities = filters.amenities.join(',');
      }
      
      // Only add distance parameter if specific distance is selected
      if (hasDistanceFilter) {
        params.maxDistance = filters.distance;
      }
      
      const response = await apiClient.get(API_ENDPOINTS.SEARCH_ROOMS, { params });
      
      const filteredRooms = response.data.rooms || [];
      setRooomsData(filteredRooms);
      
      // Reset pagination
      const initialRooms = filteredRooms.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(filteredRooms.length > ROOMS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching filtered rooms:", error);
      // Fallback to client-side filtering if API fails
      const filtered = getFilteredRooms();
      const initialRooms = filtered.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(filtered.length > ROOMS_PER_PAGE);
    } finally {
      setFilterLoading(false);
    }
  };

  // Function to search rooms from API
  const searchRooms = async () => {
    if (!searchTerm.trim()) {
      // If search is empty, reset to all rooms
      fetchAllRooms();
      return;
    }
    
    setSearchLoading(true);
    try {
      const response = await apiClient.get(API_ENDPOINTS.SEARCH_ROOMS, {
        params: {
          search: searchTerm,
          limitBy: 50
        },
      });
      
      const searchResults = response.data.rooms || [];
      setRooomsData(searchResults);
      
      // Reset pagination
      const initialRooms = searchResults.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(searchResults.length > ROOMS_PER_PAGE);
    } catch (error) {
      console.error("Error searching rooms:", error);
      // Fallback to client-side search if API fails
      const filtered = getFilteredRooms();
      const initialRooms = filtered.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(filtered.length > ROOMS_PER_PAGE);
    } finally {
      setSearchLoading(false);
    }
  };

  // Client-side filtering fallback
  const getFilteredRooms = () => {
    if (!roomsData) return [];
    return roomsData.filter((room) => {
      // Location match: if no locations selected, show all (default behavior)
      // If locations selected, show rooms that match ANY of the selected locations (OR logic)
      const locationMatch = appliedLocation.length === 0 || appliedLocation.includes(room.location);
      
      // Amenities match: if no amenities selected, show all
      // If amenities selected, show rooms that have ANY of the selected amenities (OR logic)
      const amenitiesMatch = appliedAmenities.length === 0 || appliedAmenities.some(
        (amenity) => room.amenities && room.amenities[amenity]
      );
      
      // Search match: if no search term, show all
      const searchMatch = !searchTerm.trim() || 
        room.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Distance match: if no distance selected, show all
      const distanceMatch = appliedDistance === null || (room.minutesAway && room.minutesAway <= appliedDistance);

      // Price range match
      let priceMatch = true;
      if (appliedPriceRange && room.price) {
        const price = room.price;
        let calculatedPrice = price;
        if (appliedRentPeriod === '6months') {
          calculatedPrice = price * 6;
        } else if (appliedRentPeriod === 'year') {
          calculatedPrice = price * 12;
        }
        
        if (appliedPriceType === 'under') {
          priceMatch = calculatedPrice <= appliedPriceRange;
        } else if (appliedPriceType === 'over') {
          priceMatch = calculatedPrice >= appliedPriceRange;
        }
      }

      // Security match
      const securityMatch = appliedSecurity.length === 0 || 
        (room.securityStrength && appliedSecurity.includes(room.securityStrength));

      // Best room match
      const bestRoomMatch = !appliedBestRoom || room.bestRoom === true;

      return locationMatch && amenitiesMatch && searchMatch && distanceMatch && priceMatch && securityMatch && bestRoomMatch;
    });
  };

  // Update displayed rooms when applied filters change
  useEffect(() => {
    if (roomsData) {
      const filtered = getFilteredRooms();
      const initialRooms = filtered.slice(0, ROOMS_PER_PAGE);
      setDisplayedRooms(initialRooms);
      setCurrentPage(1);
      setHasMore(filtered.length > ROOMS_PER_PAGE);
    }
  }, [appliedLocation, appliedAmenities, appliedDistance, appliedPriceRange, appliedRentPeriod, appliedPriceType, appliedSecurity, appliedBestRoom, roomsData]);

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
    }, 500);
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    
    // Apply temporary filters to actual filter states
    setAppliedLocation([...tempLocation]);
    setAppliedAmenities([...tempAmenities]);
    setAppliedDistance(tempDistance);
    setAppliedPriceRange(tempPriceRange);
    setAppliedRentPeriod(tempRentPeriod);
    setAppliedPriceType(tempPriceType);
    setAppliedSecurity([...tempSecurity]);
    setAppliedBestRoom(tempBestRoom);
    
    const filters = {
      location: tempLocation,
      amenities: tempAmenities,
      distance: tempDistance
    };
    
    // Check if any filters are actually selected
    const hasAnyFilters = tempLocation.length > 0 || tempAmenities.length > 0 || tempDistance !== null || tempPriceRange !== null || tempSecurity.length > 0 || tempBestRoom;
    
    if (!hasAnyFilters) {
      // If no filters selected, just fetch all rooms
      fetchAllRooms();
    } else {
      // Apply the selected filters via API (for location, amenities, distance)
      // Price, security, and bestRoom filters are handled client-side
      fetchFilteredRooms(filters);
    }
  };

  const clearAllFilters = () => {
    // Clear both temporary and applied filters
    setTempLocation([]);
    setTempAmenities([]);
    setTempDistance(null);
    setTempPriceRange(null);
    setTempRentPeriod('month');
    setTempPriceType('under');
    setTempSecurity([]);
    setTempBestRoom(false);
    
    setAppliedLocation([]);
    setAppliedAmenities([]);
    setAppliedDistance(null);
    setAppliedPriceRange(null);
    setAppliedRentPeriod('month');
    setAppliedPriceType('under');
    setAppliedSecurity([]);
    setAppliedBestRoom(false);
    
    setSearchTerm("");
    // Reset to all rooms
    fetchAllRooms();
  };

  const handleLocationChange = (location) => {
    setTempLocation((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    );
  };

  const handleAmenityChange = (amenity) => {
    setTempAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleDistanceChange = (distance) => {
    setTempDistance(distance);
  };

  const handleOrderPopup = (room) => {
    setSelectedRoom(room);
    setOrderPopup(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchRooms();
  };

  // Reset search and show all rooms
  const handleSearchClear = () => {
    setSearchTerm("");
    fetchAllRooms();
  };

  const totalFilteredRooms = roomsData ? roomsData.length : 0;
  
  // Check if any temporary filters are selected (for button state)
  const hasTempFilters = tempLocation.length > 0 || tempAmenities.length > 0 || tempDistance !== null || tempPriceRange !== null || tempSecurity.length > 0 || tempBestRoom;
  
  // Check if any filters are actually applied
  const hasActiveFilters = appliedLocation.length > 0 || appliedAmenities.length > 0 || appliedDistance !== null || appliedPriceRange !== null || appliedSecurity.length > 0 || appliedBestRoom;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 py-10 gradient-dark">
    
        <>
          <SEO
            title="All Rooms near University of Limpopo | Browse Off-Campus Rooms"
            description="Browse off-campus rooms near UL in Mankweng/Turfloop, Polokwane. Filter by location, amenities, and distance to campus."
            canonical="https://off-campus-rooms.vercel.app/all-rooms"
            image="/vite.svg"
          />
          {/* Sticky Apply Filters Button - Always visible when filters are selected */}
          {hasTempFilters && (
            <div className="bottom-6 left-1/2 transform -translate-x-1/2 z-50 hidden lg:fixed">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-2xl border-2 border-white/20 backdrop-blur-lg">
                <button
                  onClick={applyFilters}
                  disabled={filterLoading}
                  className="px-8 py-4 text-white font-semibold rounded-full transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {filterLoading ? (
                    <>
                      <FiLoader className="animate-spin text-lg" />
                      <span>Applying Filters...</span>
                    </>
                  ) : (
                    <>
                      <FiFilter className="text-lg" />
                      <span>Apply Filters ({tempLocation.length + tempAmenities.length + (tempDistance ? 1 : 0) + (tempPriceRange ? 1 : 0) + tempSecurity.length + (tempBestRoom ? 1 : 0)} selected)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Banner Section */}
          <div className="relative">
            <img
              src={Img1}
              alt="Banner"
              className="w-full h-[200px] md:h-[250px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Browse All Rooms</h1>
            </div>
          </div>

          {/* Search Section */}
          <div className="container mx-auto px-4 -mt-8 md:-mt-12 relative z-10">
            <div className="max-w-2xl mx-auto">
                             <form onSubmit={handleSearchSubmit} className="relative">
                 <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 shadow-xl flex">
                   <input
                     type="text"
                     placeholder="Search by title, description, or location..."
                     className="flex-1 bg-transparent text-white placeholder-gray-300 px-4 py-3 focus:outline-none text-base"
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   {searchTerm && (
                     <button
                       type="button"
                       onClick={handleSearchClear}
                       className="px-3 py-3 text-gray-400 hover:text-white transition-colors duration-200"
                     >
                       <FiX size={18} />
                     </button>
                   )}
                   <button
                     type="submit"
                     disabled={searchLoading}
                     className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     {searchLoading ? (
                       <FiLoader className="animate-spin" />
                     ) : (
                       <FiSearch />
                     )}
                   </button>
                 </div>
               </form>
            </div>
          </div>

          {isUsingDummyRooms && (
            <div className="container mx-auto px-4 mt-6">
              <div className="bg-red-600/20 border border-red-500/40 text-red-100 rounded-2xl p-4 sm:p-5 shadow-lg">
                <h2 className="text-sm sm:text-base font-semibold">Dummy Listings For Testing</h2>
                <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                  The rooms shown below are placeholder entries (marked with XXXXX) because the live API request failed. If you are a real user, please try again later—these listings are not real accommodations.
                </p>
              </div>
            </div>
          )}

          {/* Main Content Section */}
          <section className="max-w-[1600px] mx-auto px-4 py-8 w-full">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Sidebar - Desktop only */}
              <div className="hidden lg:block lg:w-1/4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-lg p-4 lg:p-5 sticky top-6 flex flex-col">
                  <div className="flex-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
                  <h2 className="text-base lg:text-lg font-bold text-white mb-4">Filters</h2>
                  
                  {/* Location Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Location</h3>
                    <div className="space-y-1.5">
                      {["gate 1", "gate 2", "gate 3", "motintane"].map((loc) => (
                        <label key={loc} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tempLocation.includes(loc)}
                            onChange={() => handleLocationChange(loc)}
                            className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-200">
                            {loc.charAt(0).toUpperCase() + loc.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price/Rent Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Rent Price</h3>
                    <div className="mb-2 flex gap-2">
                      <select
                        value={tempRentPeriod}
                        onChange={(e) => {
                          setTempRentPeriod(e.target.value);
                          // Reset price range when period changes to avoid confusion
                          setTempPriceRange(null);
                        }}
                        className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="month">Per Month</option>
                        <option value="6months">Per 6 Months</option>
                        <option value="year">Per Year</option>
                      </select>
                      <select
                        value={tempPriceType}
                        onChange={(e) => setTempPriceType(e.target.value)}
                        className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="under">Under</option>
                        <option value="over">Over</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      {(() => {
                        // Base monthly prices
                        const basePrices = [1000, 2000, 3000, 4000, 5000, 7500, 10000];
                        // Calculate multiplier based on period
                        const multiplier = tempRentPeriod === '6months' ? 6 : tempRentPeriod === 'year' ? 12 : 1;
                        
                        return [
                          ...basePrices.map(basePrice => {
                            const adjustedPrice = basePrice * multiplier;
                            const formattedPrice = adjustedPrice >= 1000 
                              ? `R${(adjustedPrice / 1000).toFixed(adjustedPrice % 1000 === 0 ? 0 : 1)}k`
                              : `R${adjustedPrice}`;
                            return {
                              label: formattedPrice.replace('.0k', 'k'),
                              value: basePrice, // Store base monthly price
                              displayValue: adjustedPrice // For display
                            };
                          }),
                          { label: "Any price", value: null, displayValue: null }
                        ];
                      })().map((range) => (
                        <label key={range.value || 'any'} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="priceRange"
                            checked={tempPriceRange === range.value}
                            onChange={() => setTempPriceRange(range.value)}
                            className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-200">
                            {range.value ? `${tempPriceType === 'under' ? 'Under' : 'Over'} ${range.label}` : range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Amenities</h3>
                    <div className="space-y-1.5">
                      {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map(
                        (amenity) => (
                          <label
                            key={amenity}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={tempAmenities.includes(amenity)}
                              onChange={() => handleAmenityChange(amenity)}
                              className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-200">
                              {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Distance Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Distance to Campus</h3>
                    <div className="space-y-1.5">
                      {[5, 10, 20, 30, 40, 50].map((distance) => (
                        <label key={distance} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="distance"
                            checked={tempDistance === distance}
                            onChange={() => handleDistanceChange(distance)}
                            className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-200">{distance} min or less</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="distance"
                          checked={tempDistance === null}
                          onChange={() => handleDistanceChange(null)}
                          className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-200">Any distance</span>
                      </label>
                    </div>
                  </div>

                  {/* Security Filter */}
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white mb-2">Security Level</h3>
                    <div className="space-y-1.5">
                      {["Highly Secured", "Secured", "Moderately Secured", "Not Secured"].map(
                        (security) => (
                          <label
                            key={security}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={tempSecurity.includes(security)}
                              onChange={() => {
                                setTempSecurity(prev =>
                                  prev.includes(security)
                                    ? prev.filter(s => s !== security)
                                    : [...prev, security]
                                );
                              }}
                              className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-200">{security}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Best Room Filter */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tempBestRoom}
                        onChange={(e) => setTempBestRoom(e.target.checked)}
                        className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm font-semibold text-white">Featured Rooms Only</span>
                    </label>
                  </div>
                  </div>

                  {/* Apply Filters Button - Always visible at bottom */}
                  <div className="pt-3 border-t border-white/10 mt-4 flex-shrink-0">
                    <button
                      onClick={applyFilters}
                      disabled={filterLoading || !hasTempFilters}
                      className={`w-full text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                        hasTempFilters 
                          ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {filterLoading ? (
                        <>
                          <FiLoader className="animate-spin text-sm" />
                          <span>Applying...</span>
                        </>
                      ) : (
                        <>
                          <FiFilter className="text-sm" />
                          <span>
                            {hasTempFilters 
                              ? `Apply (${tempLocation.length + tempAmenities.length + (tempDistance ? 1 : 0) + (tempPriceRange ? 1 : 0) + tempSecurity.length + (tempBestRoom ? 1 : 0)})`
                              : 'Select filters'
                            }
                          </span>
                        </>
                      )}
                    </button>
                    
                    {/* Clear Filters Button - Always visible */}
                    <button
                      onClick={clearAllFilters}
                      disabled={!hasActiveFilters && !hasTempFilters}
                      className={`w-full mt-2 text-xs font-medium py-1.5 px-3 rounded transition-all duration-200 ${
                        hasActiveFilters || hasTempFilters
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Room Cards Grid */}
              <div className="w-full lg:w-3/4">
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-sm text-gray-300">
                    Showing {displayedRooms.length} of {totalFilteredRooms} room{totalFilteredRooms !== 1 ? 's' : ''}
                  </p>
                  {/* Mobile/Tablet Filter Toggle Button */}
                  <button
                    className="lg:hidden flex items-center gap-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-all duration-200"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <FiFilter className="text-sm" />
                    <span>Filters</span>
                  </button>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 group overflow-hidden h-full flex flex-col animate-pulse">
                        <div className="relative overflow-hidden rounded-xl mb-4">
                          <div className="w-full h-48 bg-gray-700 rounded-xl"></div>
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="h-6 bg-gray-700 rounded mb-3"></div>
                          <div className="flex items-center gap-4 mb-4">
                            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/3"></div>
                          </div>
                          <div className="h-4 bg-gray-700 rounded mb-6"></div>
                          <div className="mt-auto">
                            <div className="h-10 bg-gray-700 rounded-xl"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : displayedRooms.length > 0 ? (
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
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-white">Filters</h2>
                    <button
                      className="p-1.5 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
                      onClick={() => setShowMobileFilters(false)}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                
                {/* Location Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Location</h3>
                  <div className="space-y-1.5">
                    {["gate 1", "gate 2", "gate 3", "motintane"].map((loc) => (
                      <label key={loc} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempLocation.includes(loc)}
                          onChange={() => handleLocationChange(loc)}
                          className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-200">
                          {loc.charAt(0).toUpperCase() + loc.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price/Rent Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Rent Price</h3>
                  <div className="mb-2 flex gap-2">
                    <select
                      value={tempRentPeriod}
                      onChange={(e) => {
                        setTempRentPeriod(e.target.value);
                        // Reset price range when period changes to avoid confusion
                        setTempPriceRange(null);
                      }}
                      className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="month">Per Month</option>
                      <option value="6months">Per 6 Months</option>
                      <option value="year">Per Year</option>
                    </select>
                    <select
                      value={tempPriceType}
                      onChange={(e) => setTempPriceType(e.target.value)}
                      className="flex-1 text-xs bg-gray-700 border border-gray-600 rounded px-2 py-1.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="under">Under</option>
                      <option value="over">Over</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    {(() => {
                      // Base monthly prices
                      const basePrices = [1000, 2000, 3000, 4000, 5000, 7500, 10000];
                      // Calculate multiplier based on period
                      const multiplier = tempRentPeriod === '6months' ? 6 : tempRentPeriod === 'year' ? 12 : 1;
                      
                      return [
                        ...basePrices.map(basePrice => {
                          const adjustedPrice = basePrice * multiplier;
                          const formattedPrice = adjustedPrice >= 1000 
                            ? `R${(adjustedPrice / 1000).toFixed(adjustedPrice % 1000 === 0 ? 0 : 1)}k`
                            : `R${adjustedPrice}`;
                          return {
                            label: formattedPrice.replace('.0k', 'k'),
                            value: basePrice, // Store base monthly price
                            displayValue: adjustedPrice // For display
                          };
                        }),
                        { label: "Any price", value: null, displayValue: null }
                      ];
                    })().map((range) => (
                      <label key={range.value || 'any'} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="priceRangeMobile"
                          checked={tempPriceRange === range.value}
                          onChange={() => setTempPriceRange(range.value)}
                          className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-200">
                          {range.value ? `${tempPriceType === 'under' ? 'Under' : 'Over'} ${range.label}` : range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Amenities</h3>
                  <div className="space-y-1.5">
                    {["wifi", "shower", "bathtub", "table", "bed", "electricity"].map(
                      (amenity) => (
                        <label
                          key={amenity}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={tempAmenities.includes(amenity)}
                            onChange={() => handleAmenityChange(amenity)}
                            className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-200">
                            {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Distance Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Distance to Campus</h3>
                  <div className="space-y-1.5">
                    {[5, 10, 20, 30, 40, 50].map((distance) => (
                      <label key={distance} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="distanceMobile"
                          checked={tempDistance === distance}
                          onChange={() => handleDistanceChange(distance)}
                          className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-200">{distance} min or less</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="distanceMobile"
                        checked={tempDistance === null}
                        onChange={() => handleDistanceChange(null)}
                        className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 focus:ring-primary-500"
                      />
                      <span className="text-sm text-gray-200">Any distance</span>
                    </label>
                  </div>
                </div>

                {/* Security Filter */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">Security Level</h3>
                  <div className="space-y-1.5">
                    {["Highly Secured", "Secured", "Moderately Secured", "Not Secured"].map(
                      (security) => (
                        <label
                          key={security}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={tempSecurity.includes(security)}
                            onChange={() => {
                              setTempSecurity(prev =>
                                prev.includes(security)
                                  ? prev.filter(s => s !== security)
                                  : [...prev, security]
                              );
                            }}
                            className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-200">{security}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Best Room Filter */}
                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={tempBestRoom}
                      onChange={(e) => setTempBestRoom(e.target.checked)}
                      className="w-3.5 h-3.5 text-primary-500 bg-gray-700 border-gray-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold text-white">Featured Rooms Only</span>
                  </label>
                </div>
                  
                {/* Apply Button - Always visible at bottom */}
                <div className="mt-6 pt-4 border-t border-white/20 -mx-4 px-4 pb-4">
                  <button
                    onClick={applyFilters}
                    disabled={filterLoading || !hasTempFilters}
                    className={`w-full text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                      hasTempFilters 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white' 
                        : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {filterLoading ? (
                      <>
                        <FiLoader className="animate-spin text-sm" />
                        <span>Applying...</span>
                      </>
                    ) : (
                      <>
                        <FiFilter className="text-sm" />
                        <span>
                          {hasTempFilters 
                            ? `Apply (${tempLocation.length + tempAmenities.length + (tempDistance ? 1 : 0) + (tempPriceRange ? 1 : 0) + tempSecurity.length + (tempBestRoom ? 1 : 0)})`
                            : 'Select filters'
                          }
                        </span>
                      </>
                    )}
                  </button>
                  
                  {/* Clear Filters Button - Always visible */}
                  <button
                    onClick={clearAllFilters}
                    disabled={!hasActiveFilters && !hasTempFilters}
                    className={`w-full mt-2 text-xs font-medium py-1.5 px-3 rounded transition-all duration-200 ${
                      hasActiveFilters || hasTempFilters
                        ? 'text-gray-400 hover:text-white hover:bg-white/5'
                        : 'text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    Clear All
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
    </div>
  );
};

export default AllRooms;
