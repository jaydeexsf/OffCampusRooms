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
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-gradient-to-r from-blue-600 to-blue-500">
              {!showLocation && !showRatings && !showRateForm ? (
                <h1 className="text-xl font-bold text-white truncate">{title}</h1>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-200"
                    onClick={handleBackNavigation}
                  >
                    <FiArrowLeft size={16} />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <h1 className="text-lg font-bold text-white truncate">{getCurrentView()}</h1>
                </div>
              )}

              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                onClick={() => {
                  setOrderPopup(false);
                  setShowLocation(false);
                  setShowRatings(false);
                  setShowRateForm(false);
                }}
              >
                <FiX className="text-xl text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              {!showLocation && !showRatings && !showRateForm ? (
                <>
                  {/* Main Content - Flex container for image and details */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Image Gallery - Left side on desktop, top on mobile */}
                    <div className="relative lg:w-1/2">
                      <img
                        src={images[currentImage]}
                        alt={`Room ${currentImage + 1}`}
                        className="w-full h-64 lg:h-full object-cover lg:object-contain"
                      />

                      {images.length > 1 && (
                        <>
                          <button
                            className="absolute top-1/2 left-4 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                            onClick={handlePrevImage}
                          >
                            <FiChevronLeft size={20} />
                          </button>

                          <button
                            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all duration-200"
                            onClick={handleNextImage}
                          >
                            <FiChevronRight size={20} />
                          </button>

                          {/* Image indicators */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
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

                    {/* Room Details - Right side on desktop, bottom on mobile */}
                    <div className="lg:w-1/2 p-6 space-y-6 max-h-[calc(95vh-80px)] lg:max-h-full overflow-y-auto">
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-white">
                            R{price.toLocaleString()}
                            <span className="text-sm text-gray-400 font-normal">/month</span>
                          </p>
                          <p className="text-sm text-gray-400">{availabilityStatus}</p>
                        </div>
                      </div>

                      {/* Location & Time */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-blue-400" />
                          <span className="text-white">{location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-green-400" />
                          <span className="text-white">{minutesAway}min to UL</span>
                        </div>
                      </div>

                      {/* Amenities */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(amenities).map((amenity) =>
                            amenities[amenity] ? (
                              <div
                                key={amenity}
                                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-xs border border-white/20"
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
                        <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          {contact.phone && (
                            <div className="flex items-center gap-3">
                              <FiPhone className="text-blue-400" />
                              <span className="text-white">{contact.phone}</span>
                            </div>
                          )}
                          {contact.whatsapp && (
                            <div className="flex items-center gap-3">
                              <FiMessageCircle className="text-green-400" />
                              <span className="text-white">{contact.whatsapp}</span>
                            </div>
                          )}
                          {contact.email && (
                            <div className="flex items-center gap-3">
                              <FiMail className="text-purple-400" />
                              <span className="text-white">{contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        {/* Location Button */}
                        <button
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                          onClick={() => setShowLocation(true)}
                        >
                          <FiMap className="text-lg" />
                          <span>View Location & Get Directions</span>
                        </button>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3">
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
                                <span className="text-gray-400 text-xs">
                                  ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rating Action Buttons */}
                        <div className="flex gap-2">
                          {/* View Ratings Button - Only show if there are reviews */}
                          {totalRatings > 0 && (
                            <button
                              onClick={() => setShowRatings(true)}
                              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform backdrop-blur-sm border border-blue-500/30"
                            >
                              <FiEye size={16} />
                              <span className="hidden sm:inline">View Reviews</span>
                              <span className="sm:hidden">Reviews</span>
                            </button>
                          )}

                          {/* Rate Room Button */}
                          <button
                            onClick={() => setShowRateForm(true)}
                            className={`${totalRatings > 0 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform backdrop-blur-sm border border-purple-500/30`}
                          >
                            <FiStar size={16} />
                            <span className="hidden sm:inline">Rate Room</span>
                            <span className="sm:hidden">Rate</span>
                          </button>
                        </div>
                      </div>
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
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
