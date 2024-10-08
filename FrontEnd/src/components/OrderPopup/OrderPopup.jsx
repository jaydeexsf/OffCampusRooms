import React, { useState } from "react";
import { IoBed, IoCloseOutline, IoWifi, IoArrowBack, IoArrowForward, IoArrowBackCircle } from "react-icons/io5";
import { FaWifi, FaShower, FaBed, FaTable, FaBolt } from "react-icons/fa";

const OrderPopup = ({ orderPopup, setOrderPopup, roomDetails }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLocation, setShowLocation] = useState(false);

  if (!roomDetails) return null;

  const { title, price, amenities, images, contact, availableRooms, location } = roomDetails;

  const availabilityStatus = availableRooms > 0 ? `${availableRooms} room${availableRooms > 1 ? 's' : ''} available` : "Fully booked";

  const handleNextImage = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImage((prevImage) => (prevImage - 1 + images.length) % images.length);
  };

  return (
    <>
      {orderPopup && (
        <div className="h-screen w-[100vw] fixed overflow-hidden top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 shadow-md bg-white dark:bg-gray-900 rounded-md w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-black/70">{title}</h1>
              <IoCloseOutline
                className="text-2xl cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => setOrderPopup(false)}
              />
            </div>

            {/* Toggle between Room Details and Location */}
            {!showLocation ? (
              <>
                {/* Image Slider with Previous/Next buttons */}
                <div className="relative mt-4">
                  <img
                    src={images[currentImage]}
                    alt={`Slide ${currentImage}`}
                    className="w-full h-[250px] object-cover rounded-lg"
                  />

                  {/* Previous button */}
                  <IoArrowBack
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 text-3xl text-white bg-black/50 p-2 rounded-full cursor-pointer"
                    onClick={handlePrevImage}
                  />

                  {/* Next button */}
                  <IoArrowForward
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-3xl text-white bg-black/50 p-2 rounded-full cursor-pointer"
                    onClick={handleNextImage}
                  />
                </div>

                {/* Room Details */}
                <div className="mt-4">
                  <p className="font-semibold">Price: R{price}</p>
                  <p className="mt-2 font-semibold">Amenities:</p>
                  <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300">
                    <div className="flex items-center">
                      <IoWifi className="text-sky-400" title="Free WiFi" />
                      <span className="ml-1">{amenities.wifi ? "Wifi" : "No Wifi"}</span>
                    </div>
                    <div className="flex items-center">
                      <FaShower className="text-green-400" title="Shower" />
                      <span className="ml-1">{amenities.shower ? "Shower" : "No Shower"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-400" title="Table">🪑</span>
                      <span className="ml-1">{amenities.table ? "Table & Chair" : "No Table & Chair"}</span>
                    </div>
                    <div className="flex items-center">
                      <IoBed className="text-red-400" title="Bed" />
                      <span className="ml-1">{amenities.bed ? "Bed" : "No Bed"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-orange-400" title="Electricity">⚡</span>
                      <span className="ml-1">{amenities.electricity ? "FREE Electricity" : "Buy your own Electricity"}</span>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mt-4">
                    {contact.phone  ? <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {contact.phone || "N/A"}</p> : '' }
                    {contact.whatsapp ? <p className="text-gray-700 dark:text-gray-300"><strong>WhatsApp:</strong> {contact.whatsapp || "N/A"}</p> : ''}
                    {contact.email ? <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {contact.email || "N/A"}</p> : '' }
                  </div>

                  {/* Location Button */}
                  <button
                    className="mt-6 bg-primary w-full text-center hover:bg-secondary duration-200 text-white py-2 px-4 rounded-full shadow flex items-center justify-center"
                    onClick={() => setShowLocation(true)}
                  >
                    <IoArrowForward className="mr-2" />
                    See Location
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-semibold">Location</h2>
                <p className="text-gray-700 dark:text-gray-300 mt-2">{location || "Location not provided"}</p>

                {/* Back Button */}
                <button
                  className="mt-6 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full shadow flex items-center justify-center"
                  onClick={() => setShowLocation(false)}
                >
                  <IoArrowBackCircle className="mr-2" />
                  Back to Room Details
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
