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
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setOrderPopup(false)}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            
            {/* Header with Back Button */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Back Button - Show when in sub-views */}
                {(showLocation || showRatings || showRateForm) && (
                  <button
                    onClick={handleBackNavigation}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiArrowLeft className="w-5 h-5 text-gray-400" />
                  </button>
                )}
                
                <h3 className="text-xl font-bold text-white">
                  {getCurrentView()}
                </h3>
              </div>
              
              <button
                onClick={() => setOrderPopup(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Image Gallery with Price Overlay */}
                  <div className="relative">
                    <img
                      src={images[currentImage]}
                      alt={`Room ${currentImage + 1}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl border border-white/10"
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
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Location & Distance</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <FiMapPin className="text-blue-400 text-sm" />
                          <span className="text-gray-400 text-xs">Closest Gate</span>
                        </div>
                        <p className="text-white font-medium text-sm capitalize">{roomDetails.location}</p>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <FiClock className="text-green-400 text-sm" />
                          <span className="text-gray-400 text-xs">Distance</span>
                        </div>
                        <p className="text-white font-medium text-sm">{roomDetails.minutesAway} min to UL</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
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
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Contact</h3>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-2">
                      {contact.phone && (
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                            <FiPhone className="text-blue-400 w-3 h-3" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.phone}</span>
                        </div>
                      )}
                      {contact.whatsapp && (
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-green-500/20 border border-green-500/30 rounded-lg">
                            <FiMessageCircle className="text-green-400 w-3 h-3" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.whatsapp}</span>
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                            <FiMail className="text-blue-400 w-3 h-3" />
                          </div>
                          <span className="text-white text-xs sm:text-sm">{contact.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Rating</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {loading ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-3 h-3 bg-gray-600 rounded animate-pulse"></div>
                            ))}
                          </div>
                        ) : (
                          renderStars(averageRating)
                        )}
                      </div>
                      {!loading && (
                        <>
                          <span className="text-white font-semibold text-sm">
                            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                          </span>
                          <span className="text-gray-400 text-sm">
                            ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </>
              ) : showLocation ? (
                <div className="h-[500px] rounded-xl overflow-hidden border border-white/10">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
                </div>
              ) : showRatings ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-white/10">
                  <RatingViewModal
                    isOpen={true}
                    onClose={() => setShowRatings(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    embedded={true}
                  />
                </div>
              ) : showRateForm ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-white/10">
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

            {/* Action Buttons */}
            <div className="pt-6 border-t border-white/10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {/* Location Button - Hide when viewing location */}
              {!showLocation && (
                <button
                  className="rounded-tl-none rounded-tr-none rounded-br-none w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
                  onClick={() => setShowLocation(true)}
                >
                  <FiMap className="w-4 h-4" />
                  <span>View Location</span>
                </button>
              )}

              {/* Rating Action Buttons - Hide when in rating views */}
              {!showRatings && !showRateForm && (
                <div
                  className={`w-full ${totalRatings > 0 ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-1 gap-2'} sm:flex sm:flex-1 sm:gap-4`}
                >
                  {/* View Ratings Button - Only show if there are reviews */}
                  {totalRatings > 0 && (
                    <button
                      onClick={() => {
                        setShowRatings(true);
                        setShowRateForm(false);
                      }}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>Reviews</span>
                    </button>
                  )}

                  {/* Rate Room Button */}
                  <button
                    onClick={() => {
                      setShowRateForm(true);
                      setShowRatings(false);
                    }}
                    className="rounded-tr-none rounded-tl-none rounded-bl-none w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
                  >
                    <FiStar className="w-4 h-4" />
                    <span>Rate Room</span>
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
