import React, { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiChevronDown, FiArrowLeft, FiMapPin, FiClock, FiPhone, FiMail, FiMessageCircle, FiMap, FiStar, FiEye } from "react-icons/fi";
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
  const contentRef = React.useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(true);

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

  React.useEffect(() => {
    const container = contentRef.current;
    if (!orderPopup || showLocation || showRatings || showRateForm || !container) {
      setShowScrollHint(false);
      return;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 32;
      setShowScrollHint(!atBottom);
    };

    setShowScrollHint(true);
    handleScroll();
    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [orderPopup, showLocation, showRatings, showRateForm]);

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={12}
        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
          star <= Math.round(rating)
            ? 'text-blue-400 fill-current'
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
    wifi: <FiWifi className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" title="Free WiFi" />,
    shower: <MdShower className="text-green-400 w-4 h-4 sm:w-5 sm:h-5" title="Shower" />, 
    bathtub: <MdBathtub className="text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" title="Bathtub" />,
    table: <MdTableRestaurant className="text-yellow-400 w-4 h-4 sm:w-5 sm:h-5" title="Table" />, 
    bed: <MdBed className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" title="Bed" />,
    electricity: <MdElectricBolt className="text-orange-400 w-4 h-4 sm:w-5 sm:h-5" title="Electricity" />, 
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
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6" onClick={() => setOrderPopup(false)}>
          <div className="bg-[#0f172a] border border-white/10 rounded-md sm:rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.7)] flex flex-col" onClick={(e) => e.stopPropagation()}>
            
            {/* Header with Back Button */}
            <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                {/* Back Button - Show when in sub-views */}
                {(showLocation || showRatings || showRateForm) && (
                  <button
                    onClick={handleBackNavigation}
                    className="p-2 hover:bg-white/10 rounded-md transition-colors"
                  >
                    <FiArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </button>
                )}
                
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {getCurrentView()}
                </h3>
              </div>
              
              <button
                onClick={() => setOrderPopup(false)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div ref={contentRef} className="px-5 py-5 sm:p-6 space-y-5 sm:space-y-6 flex-1 overflow-y-auto bg-white/5">
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Image Gallery with Price Overlay */}
                  <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/10">
                    <img
                      src={images[currentImage]}
                      alt={`Room ${currentImage + 1}`}
                      className="w-full h-48 sm:h-60 md:h-72 object-cover"
                    />

                    {/* Price Badge - Top Right */}
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <div className="bg-black/80 backdrop-blur-sm border border-white/30 rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg">
                        <p className="text-white font-semibold text-xs sm:text-sm">
                          R{price.toLocaleString()}
                          <span className="text-gray-300 font-normal text-[10px] sm:text-xs ml-1">/month</span>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-slate-900 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FiMapPin className="text-blue-400 text-sm sm:text-base" />
                        <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Closest Gate</span>
                      </div>
                      <p className="text-white font-medium text-xs sm:text-sm md:text-base capitalize">{roomDetails.location}</p>
                    </div>
                    <div className="bg-slate-900 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-800">
                      <div className="flex items-center gap-2 mb-1.5">
                        <FiClock className="text-green-400 text-sm sm:text-base" />
                        <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-wide">Distance</span>
                      </div>
                      <p className="text-white font-medium text-xs sm:text-sm md:text-base">{roomDetails.minutesAway} min to UL</p>
                    </div>
                  </div>

                  {/* Amenities & Contact */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-3 sm:gap-4">
                    <div className="bg-slate-900 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-slate-800 shadow-inner">
                      <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Amenities</h3>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {Object.keys(amenities).map((amenity) =>
                          amenities[amenity] ? (
                            <div
                              key={amenity}
                              className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-[11px] sm:text-xs lg:text-sm text-white"
                            >
                              {amenitiesIcons[amenity]}
                              <span className="font-medium leading-tight">{amenitiesLabels[amenity]}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                    <div className="bg-slate-900 border border-blue-500/30 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-lg lg:ml-auto w-full">
                      <h3 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Contact</h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        {contact.phone && (
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-slate-800 border border-blue-500/40 rounded-md sm:rounded-lg">
                              <FiPhone className="text-blue-300 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-white text-xs sm:text-sm font-medium">{contact.phone}</span>
                          </div>
                        )}
                        {contact.whatsapp && (
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-slate-800 border border-green-500/40 rounded-md sm:rounded-lg">
                              <FiMessageCircle className="text-green-300 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-white text-xs sm:text-sm font-medium">{contact.whatsapp}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-slate-800 border border-blue-500/40 rounded-md sm:rounded-lg">
                              <FiMail className="text-blue-300 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-white text-xs sm:text-sm font-medium break-all">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="bg-blue-500/10 border border-blue-500/25 rounded-lg sm:rounded-xl p-3 sm:p-5">
                    <h3 className="text-xs sm:text-sm font-semibold text-white mb-2">Rating</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        {loading ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="w-2.5 h-2.5 bg-gray-600 rounded animate-pulse"></div>
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

                  {showScrollHint && (
                    <div className="sticky bottom-4 flex justify-center pt-2">
                      <button
                        onClick={() => contentRef.current?.scrollBy({ top: 240, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] sm:text-xs font-semibold text-white/80 hover:text-white hover:bg-white/15 transition-all duration-200 shadow-sm"
                      >
                        <span>Scroll for more</span>
                        <FiChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : showLocation ? (
                <div className="h-[500px] rounded-lg sm:rounded-xl overflow-hidden border border-white/10">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
                </div>
              ) : showRatings ? (
                <div className="h-[500px] overflow-y-auto rounded-lg sm:rounded-xl border border-white/10">
                  <RatingViewModal
                    isOpen={true}
                    onClose={() => setShowRatings(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    embedded={true}
                  />
                </div>
              ) : showRateForm ? (
                <div className="h-[500px] overflow-y-auto rounded-lg sm:rounded-xl border border-white/10">
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
            <div className="pt-5 border-t border-white/10 bg-slate-900/70 px-5 pb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 rounded-b-2xl sm:rounded-b-3xl">
              {/* Location Button - Hide when viewing location */}
              {!showLocation && (
                <button
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-md border border-blue-500/40 transition-all duration-200 text-sm sm:text-base shadow-lg shadow-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                  onClick={() => setShowLocation(true)}
                >
                  <FiMap className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">View Location</span>
                </button>
              )}

              {/* Rating Action Buttons - Hide when in rating views */}
              {!showRatings && !showRateForm && (
                <div
                  className={`w-full ${totalRatings > 0 ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3' : 'grid grid-cols-1'} sm:flex sm:flex-1 sm:gap-4`}
                >
                  {/* View Ratings Button - Only show if there are reviews */}
                  {totalRatings > 0 && (
                    <button
                      onClick={() => {
                        setShowRatings(true);
                        setShowRateForm(false);
                      }}
                      className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl border border-blue-400/50 transition-all duration-200 text-sm sm:text-base shadow-lg shadow-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-300/60"
                    >
                      <FiEye className="w-4 h-4" />
                      <span className="text-xs sm:text-sm">Reviews</span>
                    </button>
                  )}

                  {/* Rate Room Button */}
                  <button
                    onClick={() => {
                      setShowRateForm(true);
                      setShowRatings(false);
                    }}
                    className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-md border border-blue-500/40 transition-all duration-200 text-sm sm:text-base shadow-lg shadow-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-400/60"
                  >
                    <FiStar className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Rate Room</span>
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
