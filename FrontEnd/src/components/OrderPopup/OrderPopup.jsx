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
  const [currentImageMobile, setCurrentImageMobile] = useState(0);
  const [currentImageDesktop, setCurrentImageDesktop] = useState(0);
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

  // Prepare safe primary index and derived arrays BEFORE any conditional returns
  const imagesArray = Array.isArray(roomDetails?.images) ? roomDetails.images : [];
  const safePrimaryIndex = Number.isInteger(roomDetails?.primaryImageIndex) && roomDetails.primaryImageIndex >= 0 && roomDetails.primaryImageIndex < imagesArray.length
    ? roomDetails.primaryImageIndex
    : 0;

  React.useEffect(() => {
    // When room changes, start carousel at the primary image
    setCurrentImageMobile(safePrimaryIndex);
    setCurrentImageDesktop(0);
  }, [roomDetails?._id, safePrimaryIndex]);

  const imagesExcludingPrimary = React.useMemo(() => {
    return imagesArray.filter((_, idx) => idx !== safePrimaryIndex);
  }, [imagesArray, safePrimaryIndex]);

  if (!roomDetails) return null;

  const { title, price, amenities, images, contact, coordinates, primaryImageIndex } = roomDetails;

  // Mobile and desktop carousels manage navigation inline

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-6" onClick={() => setOrderPopup(false)}>
          <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl border border-white/10 bg-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.75)]" onClick={(e) => e.stopPropagation()}>
            
            {/* Header with Back Button */}
            <div className="relative flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex items-center gap-3">
                {/* Back Button - Show when in sub-views */}
                {(showLocation || showRatings || showRateForm) && (
                  <button
                    onClick={handleBackNavigation}
                    className="rounded-md p-2 transition-colors hover:bg-white/10"
                  >
                    <FiArrowLeft className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                  </button>
                )}
              </div>
              
              <h3 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-semibold text-white sm:text-lg">
                {getCurrentView()}
              </h3>
              
              <button
                onClick={() => setOrderPopup(false)}
                className="rounded-md p-2 transition-colors hover:bg-white/10"
              >
                <svg className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto bg-white/5 px-5 py-5 sm:space-y-6 sm:p-6 space-y-5">
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Dual Image Layout: Static (left, md+) + Carousel (right, always). On mobile: only carousel */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    {/* Left Static Image (no navigation) - hidden on mobile */}
                    <div className="relative hidden overflow-hidden rounded-lg border border-white/10 md:block">
                      <img
                        src={images[safePrimaryIndex]}
                        alt={`Room 1`}
                        className="h-64 w-full bg-black object-contain sm:h-72 md:h-80 md:object-cover"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Right Carousel (with nav + indicators + price) - desktop only */}
                    <div className="relative hidden overflow-hidden rounded-lg border border-white/10 md:block">
                      <img
                        src={imagesExcludingPrimary[currentImageDesktop]}
                        alt={`Room ${currentImageDesktop + 1}`}
                        className="h-64 w-full bg-black object-contain sm:h-72 md:h-80 md:object-cover"
                      />

                      {/* Price Badge - Top Right */}
                      <div className="absolute right-2 top-2 sm:right-3 sm:top-3">
                        <div className="rounded-lg border border-white/30 bg-black/80 px-3 py-1.5 shadow-lg backdrop-blur-sm sm:px-4 sm:py-2">
                          <p className="text-xs font-semibold text-white sm:text-sm">
                            R{price.toLocaleString()}
                            <span className="ml-1 text-[10px] font-normal text-gray-300 sm:text-xs">/month</span>
                          </p>
                        </div>
                      </div>

                      {imagesExcludingPrimary.length > 1 && (
                        <>
                          <button
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-2 text-white transition-all duration-200 hover:bg-black/90"
                            onClick={() => setCurrentImageDesktop((prev) => (prev - 1 + imagesExcludingPrimary.length) % imagesExcludingPrimary.length)}
                          >
                            <FiChevronLeft size={18} />
                          </button>

                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-2 text-white transition-all duration-200 hover:bg-black/90"
                            onClick={() => setCurrentImageDesktop((prev) => (prev + 1) % imagesExcludingPrimary.length)}
                          >
                            <FiChevronRight size={18} />
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                            {imagesExcludingPrimary.map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                  index === currentImageDesktop ? 'bg-white' : 'bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Mobile-only carousel (includes primary) */}
                  <div className="relative overflow-hidden rounded-lg border border-white/10 md:hidden">
                    <img
                      src={images[currentImageMobile]}
                      alt={`Room ${currentImageMobile + 1}`}
                      className="h-64 w-full bg-black object-contain sm:h-72"
                    />

                    {/* Price Badge - Top Right */}
                    <div className="absolute right-2 top-2">
                      <div className="rounded-lg border border-white/30 bg-black/80 px-3 py-1.5 shadow-lg backdrop-blur-sm">
                        <p className="text-xs font-semibold text-white">
                          R{price.toLocaleString()}
                          <span className="ml-1 text-[10px] font-normal text-gray-300">/month</span>
                        </p>
                      </div>
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-2 text-white transition-all duration-200 hover:bg-black/90"
                          onClick={() => setCurrentImageMobile((prev) => (prev - 1 + images.length) % images.length)}
                        >
                          <FiChevronLeft size={18} />
                        </button>

                        <button
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-2 text-white transition-all duration-200 hover:bg-black/90"
                          onClick={() => setCurrentImageMobile((prev) => (prev + 1) % images.length)}
                        >
                          <FiChevronRight size={18} />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                                index === currentImageMobile ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Location & Distance Information */}
                  <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 sm:p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <FiMapPin className="text-sm text-blue-400 sm:text-base" />
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 sm:text-xs">Closest Gate</span>
                      </div>
                      <p className="capitalize text-xs font-medium text-white sm:text-sm md:text-base">{roomDetails.location}</p>
                    </div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3 sm:p-4">
                      <div className="mb-1.5 flex items-center gap-2">
                        <FiClock className="text-sm text-green-400 sm:text-base" />
                        <span className="text-[10px] uppercase tracking-wide text-gray-400 sm:text-xs">Distance</span>
                      </div>
                      <p className="text-xs font-medium text-white sm:text-sm md:text-base">{roomDetails.minutesAway} min to UL</p>
                    </div>
                  </div>

                  {/* Amenities & Contact */}
                  <div className="flex flex-col md:flex-row gap-3 sm:gap-[40px] md:items-start">
                    <div className="md:flex-shrink-0">
                      <h3 className="mb-2 text-xs font-semibold text-white sm:mb-3 sm:text-sm">Amenities</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {Object.keys(amenities).map((amenity) =>
                          amenities[amenity] ? (
                            <div
                              key={amenity}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-800/80 px-1.5 py-1 text-[10px] text-white sm:px-2 sm:py-1 sm:text-xs"
                            >
                              {amenitiesIcons[amenity]}
                              <span className="leading-tight font-medium whitespace-nowrap">{amenitiesLabels[amenity]}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                    <div className="md:flex-shrink-0">
                      <h3 className="mb-2 text-xs font-semibold text-white sm:mb-3 sm:text-sm">Contact</h3>
                      <div className="space-y-2 sm:space-y-2.5">
                        {contact.phone && (
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="rounded-md border border-blue-500/40 bg-slate-800 p-1 sm:rounded-lg sm:p-1.5">
                              <FiPhone className="h-3 w-3 text-blue-300 sm:h-3.5 sm:w-3.5" />
                            </div>
                            <span className="text-xs font-medium text-white sm:text-sm">{contact.phone}</span>
                          </div>
                        )}
                        {contact.whatsapp && (
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="rounded-md border border-green-500/40 bg-slate-800 p-1 sm:rounded-lg sm:p-1.5">
                              <FiMessageCircle className="h-3 w-3 text-green-300 sm:h-3.5 sm:w-3.5" />
                            </div>
                            <span className="text-xs font-medium text-white sm:text-sm">{contact.whatsapp}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="rounded-md border border-blue-500/40 bg-slate-800 p-1 sm:rounded-lg sm:p-1.5">
                              <FiMail className="h-3 w-3 text-blue-300 sm:h-3.5 sm:w-3.5" />
                            </div>
                            <span className="break-all text-xs font-medium text-white sm:text-sm">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating Summary */}
                  <div className="rounded-lg border border-blue-500/25 bg-blue-500/10 p-3 sm:rounded-xl sm:p-5">
                    <h3 className="mb-2 text-xs font-semibold text-white sm:text-sm">Rating</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        {loading ? (
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div key={i} className="h-2.5 w-2.5 animate-pulse rounded bg-gray-600"></div>
                            ))}
                          </div>
                        ) : (
                          renderStars(averageRating)
                        )}
                      </div>
                      {!loading && (
                        <>
                          <span className="text-xs font-semibold text-white sm:text-sm">
                            {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                          </span>
                          <span className="text-xs text-gray-400 sm:text-sm">
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
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] font-semibold text-white/80 transition-all duration-200 hover:bg-white/15 hover:text-white shadow-sm sm:text-xs"
                      >
                        <span>Scroll for more</span>
                        <FiChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </>
              ) : showLocation ? (
                <div className="h-[500px] overflow-hidden rounded-xl border border-white/10 sm:rounded-2xl">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
                </div>
              ) : showRatings ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-white/10 sm:rounded-2xl">
                  <RatingViewModal
                    isOpen={true}
                    onClose={() => setShowRatings(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    embedded={true}
                  />
                </div>
              ) : showRateForm ? (
                <div className="h-[500px] overflow-y-auto rounded-xl border border-white/10 sm:rounded-2xl">
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
            <div className="flex flex-col gap-2 border-t border-white/10 bg-slate-900/70 px-5 pb-5 pt-5 sm:flex-row sm:items-center sm:gap-3 md:gap-4 sm:rounded-b-3xl rounded-b-2xl">
              {/* Location Button - Hide when viewing location */}
              {!showLocation && (
                <button
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-500/40 bg-blue-600 px-3 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 sm:flex-1 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-base"
                  onClick={() => setShowLocation(true)}
                >
                  <FiMap className="w-4 h-4" />
                  <span className="text-[11px] sm:text-sm">View Location</span>
                </button>
              )}

              {/* Rating Action Buttons - Hide when in rating views */}
              {!showRatings && !showRateForm && (
                <div
                  className={`w-full ${totalRatings > 0 ? 'grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 md:gap-4' : 'grid grid-cols-1'} sm:flex sm:flex-1 sm:gap-3 md:gap-4`}
                >
                  {/* View Ratings Button - Only show if there are reviews */}
                  {totalRatings > 0 && (
                    <button
                      onClick={() => {
                        setShowRatings(true);
                        setShowRateForm(false);
                      }}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-400/50 bg-blue-500 px-3 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300/60 sm:flex-1 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-base"
                    >
                      <FiEye className="w-4 h-4" />
                      <span className="text-[11px] sm:text-sm">Reviews</span>
                    </button>
                  )}

                  {/* Rate Room Button */}
                  <button
                    onClick={() => {
                      setShowRateForm(true);
                      setShowRatings(false);
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-blue-500/40 bg-blue-600 px-3 py-2.5 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400/60 sm:flex-1 sm:px-5 sm:py-3 text-xs sm:text-sm md:text-base"
                  >
                    <FiStar className="w-4 h-4" />
                    <span className="text-[11px] sm:text-sm">Rate Room</span>
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
