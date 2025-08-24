import React, { useState } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiArrowLeft, FiMapPin, FiClock, FiPhone, FiMail, FiMessageCircle, FiNavigation } from "react-icons/fi";
import { FiWifi, FiEye } from "react-icons/fi";
import { MdShower, MdBathtub, MdTableRestaurant, MdBed, MdElectricBolt } from "react-icons/md";
import LocationGoogle from "../Location/LocationGoogle";
import RatingComponent from "../Rating/RatingComponent";

const OrderPopup = ({ orderPopup, setOrderPopup, roomDetails }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLocation, setShowLocation] = useState(false);

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
              {!showLocation ? (
                <h1 className="text-xl font-bold text-white truncate">{title}</h1>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-all duration-200"
                    onClick={() => setShowLocation(false)}
                  >
                    <FiArrowLeft size={16} />
                    <span className="text-sm font-medium">Back</span>
                  </button>
                  <h1 className="text-lg font-bold text-white truncate">{title}</h1>
                </div>
              )}

              <button
                className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                onClick={() => {
                  setOrderPopup(false);
                  setShowLocation(false);
                }}
              >
                <FiX className="text-xl text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(95vh-80px)]">
              {!showLocation ? (
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

                      {/* Location Button */}
                      <button
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        onClick={() => setShowLocation(true)}
                      >
                        <FiNavigation className="text-lg" />
                        <span>View Location & Get Directions</span>
                      </button>
{/* Rating Component */}
                      <div className="pt-4">
                        <RatingComponent roomId={roomDetails._id} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-[500px]">
                  <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
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
