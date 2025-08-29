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
        size={14}
        className={`${
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
    return title;
  };

  if (!roomDetails) return null;

  const { title, price, amenities, images, contact, availableRooms, location, coordinates, minutesAway } = roomDetails;

  const availabilityStatus = availableRooms > 0 ? `${availableRooms} room${availableRooms > 1 ? 's' : ''} available` : "Fully booked";

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
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 sm:p-4 shadow-md bg-white dark:bg-gray-900 rounded-md duration-200 w-[95%] sm:w-[90%] max-w-[500px] max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
            {/* header */}
            <div className="flex items-center justify-between mb-2 sm:mb-4 flex-shrink-0">
              <div>
                <h1 className="text-sm sm:text-xl font-semibold text-black dark:text-white">
                  Room Details
                </h1>
              </div>
              <div>
                <FiX
                  className="text-lg sm:text-2xl cursor-pointer text-black dark:text-white hover:text-red-500 transition-colors"
                  onClick={() => setOrderPopup(false)}
                />
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Image Gallery */}
                  <div className="relative mb-3 sm:mb-4">
                    <img
                      src={images[currentImage]}
                      alt={`Room ${currentImage + 1}`}
                      className="w-full h-32 sm:h-48 md:h-64 object-cover rounded-lg"
                    />

                    {images.length > 1 && (
                      <>
                        <button
                          className="absolute top-1/2 left-2 -translate-y-1/2 p-1 sm:p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                          onClick={handlePrevImage}
                        >
                          <FiChevronLeft size={16} className="sm:w-5 sm:h-5" />
                        </button>

                        <button
                          className="absolute top-1/2 right-2 -translate-y-1/2 p-1 sm:p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                          onClick={handleNextImage}
                        >
                          <FiChevronRight size={16} className="sm:w-5 sm:h-5" />
                        </button>

                        {/* Image indicators */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                          {images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-200 ${
                                index === currentImage ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                    {/* Title and Price */}
                    <div>
                      <h2 className="text-sm sm:text-lg font-bold text-black dark:text-white mb-1">
                        {title}
                      </h2>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg sm:text-2xl font-bold text-black dark:text-white">
                            R{price.toLocaleString()}
                            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-normal">/month</span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{availabilityStatus}</p>
                        </div>
                      </div>
                    </div>

                    {/* Location & Time */}
                    <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FiMapPin className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-black dark:text-white">{location}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <FiClock className="text-green-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-black dark:text-white">{minutesAway}min to UL</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-sm sm:text-lg font-semibold text-black dark:text-white mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {Object.keys(amenities).map((amenity) =>
                          amenities[amenity] ? (
                            <div
                              key={amenity}
                              className="flex items-center gap-1 sm:gap-2 bg-gray-100 dark:bg-white/10 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs border border-gray-200 dark:border-white/20"
                            >
                              {amenitiesIcons[amenity]}
                              <span className="text-black dark:text-white font-medium text-xs sm:text-sm">{amenitiesLabels[amenity]}</span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-sm sm:text-lg font-semibold text-black dark:text-white mb-2">Contact</h3>
                      <div className="space-y-2">
                        {contact.phone && (
                          <div className="flex items-center gap-2">
                            <FiPhone className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-black dark:text-white text-xs sm:text-sm">{contact.phone}</span>
                          </div>
                        )}
                        {contact.whatsapp && (
                          <div className="flex items-center gap-2">
                            <FiMessageCircle className="text-green-400 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-black dark:text-white text-xs sm:text-sm">{contact.whatsapp}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <FiMail className="text-purple-400 w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-black dark:text-white text-xs sm:text-sm">{contact.email}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 sm:p-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {loading ? (
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                              ))}
                            </div>
                          ) : (
                            renderStars(averageRating)
                          )}
                        </div>
                        {!loading && (
                          <>
                            <span className="text-black dark:text-white font-semibold text-xs sm:text-sm">
                              {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                </>
              ) : showLocation ? (
                <div className="h-[500px]">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
                </div>
              ) : showRatings ? (
                <div className="h-[500px] overflow-y-auto">
                  <RatingViewModal
                    isOpen={true}
                    onClose={() => setShowRatings(false)}
                    roomId={roomDetails._id}
                    roomTitle={roomDetails.title}
                    embedded={true}
                  />
                </div>
              ) : showRateForm ? (
                <div className="h-[500px] overflow-y-auto">
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
            <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 space-y-2 sm:space-y-3 flex-shrink-0">
              {/* Location Button */}
              <button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 sm:py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                onClick={() => setShowLocation(true)}
              >
                <FiMap className="text-sm sm:text-lg" />
                <span className="text-xs sm:text-sm">View Location</span>
              </button>

              {/* Rating Action Buttons */}
              <div className="flex gap-2">
                {/* View Ratings Button - Only show if there are reviews */}
                {totalRatings > 0 && (
                  <button
                    onClick={() => setShowRatings(true)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-medium py-2 sm:py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform backdrop-blur-sm border border-blue-500/30"
                  >
                    <FiEye size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">Reviews</span>
                  </button>
                )}

                {/* Rate Room Button */}
                <button
                  onClick={() => setShowRateForm(true)}
                  className={`${totalRatings > 0 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-medium py-2 sm:py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform backdrop-blur-sm border border-purple-500/30`}
                >
                  <FiStar size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm">Rate Room</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
