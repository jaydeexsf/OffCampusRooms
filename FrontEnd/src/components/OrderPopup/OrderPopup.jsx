import React, { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiArrowLeft, FiMapPin, FiClock, FiPhone, FiMail, FiMessageCircle, FiMap, FiStar, FiEye } from "react-icons/fi";
import { FiWifi } from "react-icons/fi";
import { MdShower, MdBathtub, MdTableRestaurant, MdBed, MdElectricBolt } from "react-icons/md";
import LocationGoogle from "../Location/LocationGoogle";
import RatingViewModal from "../Rating/RatingViewModal";
import RatingFormModal from "../Rating/RatingFormModal";
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const OrderPopup = ({ orderPopup, setOrderPopup, roomDetails }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLocation, setShowLocation] = useState(false);
  const [showRatings, setShowRatings] = useState(false);
  const [showRateForm, setShowRateForm] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch ratings data
  React.useEffect(() => {
    if (roomDetails?._id) {
      fetchRatingsSummary();
    }
  }, [roomDetails?._id]);

  const fetchRatingsSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.GET_ROOM_RATINGS}/${roomDetails._id}`);
      setAverageRating(response.data.averageRating || 0);
      setTotalRatings(response.data.totalRatings || 0);
    } catch (error) {
      console.error('Error fetching ratings summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = () => {
    fetchRatingsSummary();
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={12}
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
          star <= Math.round(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const handleBackNavigation = () => {
    if (showLocation) {
      setShowLocation(false);
    } else if (showRatings) {
      setShowRatings(false);
    } else if (showRateForm) {
      setShowRateForm(false);
    }
  };

  const getCurrentView = () => {
    if (showLocation) return 'Location & Directions';
    if (showRatings) return 'Room Reviews';
    if (showRateForm) return 'Rate Room';
    return roomDetails?.title || 'Room Details';
  };

  if (!roomDetails) return null;

  const { title, price, amenities, images, contact, coordinates } = roomDetails;

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  };

  const amenitiesIcons = {
    wifi: <FiWifi className="text-blue-400" title="Free WiFi" />,
    shower: <MdShower className="text-green-400" title="Shower" />, 
    bathtub: <MdBathtub className="text-cyan-400" title="Bathtub" />,
    table: <MdTableRestaurant className="text-yellow-400" title="Table" />, 
    bed: <MdBed className="text-purple-400" title="Bed" />,
    electricity: <MdElectricBolt className="text-orange-400" title="Electricity" />, 
  };

  const amenitiesLabels = {
    wifi: "WiFi",
    shower: "Shower",
    bathtub: "Bathtub",
    table: "Desk",
    bed: "Bed",
    electricity: "Power",
  };

  return (
    <>
      {orderPopup && (
        <div className="h-screen w-screen fixed top-0 left-0 bg-black/80 z-[9999] backdrop-blur-sm">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 sm:p-4 shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl duration-200 w-[95%] sm:w-[90%] max-w-[500px] lg:max-w-[600px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Back Button - Show when in sub-views */}
                {(showLocation || showRatings || showRateForm) && (
                  <button
                    onClick={handleBackNavigation}
                    className="p-2 bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 border border-blue-500/30 rounded-xl text-blue-400 hover:text-blue-300 transition-all duration-200"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                  </button>
                )}
                
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white">
                  {getCurrentView()}
                </h1>
              </div>
              
              <button
                onClick={() => setOrderPopup(false)}
                className="p-2 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/30 hover:to-red-500/30 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content with scroll indicator */}
            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar relative">
              {/* Scroll indicator - fade gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Image Gallery with Price Overlay */}
                  <div className="relative mb-6">
                    <img
                      src={images[currentImage]}
                      alt={`Room ${currentImage + 1}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl border border-gray-600/30"
                    />

                    {/* Price Badge - Top Right */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-white font-bold text-sm sm:text-base">
                          R{price.toLocaleString()}
                          <span className="text-gray-300 font-normal text-xs sm:text-sm ml-1">/month</span>
                        </p>
                      </div>
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          className="absolute top-1/2 left-3 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-200 border border-white/20"
                          onClick={handlePrevImage}
                        >
                          <FiChevronLeft size={18} />
                        </button>

                        <button
                          className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all duration-200 border border-white/20"
                          onClick={handleNextImage}
                        >
                          <FiChevronRight size={18} />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentImage ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Location & Distance Information */}
                  <div className="mb-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4">Location & Distance</h3>
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMapPin className="text-blue-400 text-sm" />
                          <span className="text-gray-400 text-xs">Closest Gate</span>
                        </div>
                        <p className="text-white font-medium text-sm capitalize">{roomDetails.location}</p>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <FiClock className="text-green-400 text-sm" />
                          <span className="text-gray-400 text-xs">Distance</span>
                        </div>
                        <p className="text-white font-medium text-sm">{roomDetails.minutesAway} min to UL</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4">Amenities</h3>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {Object.keys(amenities).map((amenity) =>
                        amenities[amenity] ? (
                          <div
                            key={amenity}
                            className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-xs sm:text-sm"
                          >
                            {amenitiesIcons[amenity]}
                            <span className="text-white font-medium">{amenitiesLabels[amenity]}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-3 sm:mb-4">Contact</h3>
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                      {contact.phone && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                            <FiPhone className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.phone}</span>
                        </div>
                      )}
                      {contact.whatsapp && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <FiMessageCircle className="text-green-400 w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.whatsapp}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                            <FiMail className="text-purple-400 w-3 h-3 sm:w-4 sm:h-4" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2 sm:mb-3">Rating</h3>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex items-center gap-1">
                        {loading ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gray-600 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ) : (
                          renderStars(averageRating)
                        )}
                      </div>
                      {!loading && (
                        <>
                          <span className="text-white font-semibold text-xs sm:text-sm">
                            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                          </span>
                          <span className="text-gray-400 text-xs sm:text-sm">
                            ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : showLocation ? (
                <div className="h-[500px] rounded-xl overflow-hidden border border-gray-600/30">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
                </div>
              ) : showRatings ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-gray-600/30">
                  <RatingViewModal
                    isOpen={true}
                    onClose={() => setShowRatings(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    embedded={true}
                  />
                </div>
              ) : showRateForm ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-gray-600/30">
                  <RatingFormModal
                    isOpen={true}
                    onClose={() => setShowRateForm(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    onRatingUpdate={handleRatingUpdate}
                    embedded={true}
                  />
                </div>
              ) : null}
            </div>

            {/* Sticky bottom actions */}
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700/50 p-4 space-y-3 flex-shrink-0">
              {/* Location Button - Hide when viewing location */}
              {!showLocation && (
                <button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 border border-blue-500/30"
                  onClick={() => setShowLocation(true)}
                >
                  <FiMap className="w-5 h-5" />
                  <span className="text-sm">View Location</span>
                </button>
              )}

              {/* Rating Action Buttons - Hide when in rating views */}
              {!showRatings && !showRateForm && (
                <div className="flex gap-3">
                  {/* View Ratings Button - Only show if there are reviews */}
                  {totalRatings > 0 && (
                    <button
                      onClick={() => {
                        setShowRatings(true);
                        setShowRateForm(false);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-blue-500/30"
                    >
                      <FiEye size={16} />
                      <span className="text-sm">Reviews</span>
                    </button>
                  )}

                  {/* Rate Room Button */}
                  <button
                    onClick={() => {
                      setShowRateForm(true);
                      setShowRatings(false);
                    }}
                    className={`${totalRatings > 0 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-purple-500/30`}
                  >
                    <FiStar size={16} />
                    <span className="text-sm">Rate Room</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
