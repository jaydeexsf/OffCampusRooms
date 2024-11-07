import React, { useState } from "react";
import { IoBed, IoCloseOutline, IoWifi, IoArrowBack, IoArrowForward, IoArrowBackCircle } from "react-icons/io5";
import { FaWifi, FaShower, FaBed, FaTable, FaBolt } from "react-icons/fa";
import LocationGoogle from "../Location/LocationGoogle";

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

  return (
    <>
      {orderPopup && (
        <div className="h-screen w-[100vw] fixed overflow-hidden top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
          <div className="fixed top-[50%] left-1/2 pb-4 -translate-x-1/2 -translate-y-[52%] px-0 py-0 shadow-md items-center bg-white dark:bg-gray-900 rounded-md w-[90%] md:max-w-[500px] max-h-[95%] h-fit overflow-y-auto duration-200">
          <div className="flex sticky top-0 z-10  py-4 bg-primary text-white px-4 items-center justify-between">
            {!showLocation ? (
              <h1 className="text-xl text-center font-semibold">{title}</h1>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-full shadow"
                  onClick={() => setShowLocation(false)}
                >
                  <IoArrowBackCircle className="mr-2" />
                  Back
                </button>
                <h1 className="text-xl font-semibold">{title}</h1>
              </div>
            )}

            <IoCloseOutline
              className="text-2xl cursor-pointer hover:text-gray-300 transition-colors duration-200"
              onClick={() => {
                setOrderPopup(false);
                setShowLocation(false);
              }}
            />
          </div>


            {!showLocation ? (
              <>
                <div className="relative px-2 mt-2">
                  <img
                    src={images[currentImage]}
                    alt={`Slide ${currentImage}`}
                    className="w-full max-h-[500px] object-cover rounded-lg"
                  />

                  <IoArrowBack
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 text-4xl text-white bg-primary hover:bg-primary/80 transition-all duration-200 p-2 rounded-full cursor-pointer"
                    onClick={handlePrevImage}
                  />

                  <IoArrowForward
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl text-white bg-primary hover:bg-primary/80 transition-all duration-200 p-2 rounded-full cursor-pointer"
                    onClick={handleNextImage}
                  />
                </div>

                <div className="mt-4 px-4">
                  <p className="font-semibold">Rent: R {price.toLocaleString('en-US').replace(/,/g, ',')} </p>
                  <p className="mt-2 font-semibold">Amenities:</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
                    {amenities.wifi && (
                      <div className="flex items-center tex">
                        <IoWifi className="text-sky-400" title="Free WiFi" />
                        <span className="ml-1">Wifi</span>
                      </div>
                    )}
                    {amenities.shower && (
                      <div className="flex items-center">
                        <FaShower className="text-green-400" title="Shower" />
                        <span className="ml-1">Shower</span>
                      </div>
                    )}
                    {amenities.table && (
                      <div className="flex items-center">
                        <span className="text-yellow-400" title="Table">🪑</span>
                        <span className="ml-1">Table & Chair</span>
                      </div>
                    )}
                    {amenities.bed && (
                      <div className="flex items-center">
                        <IoBed className="text-red-400" title="Bed" />
                        <span className="ml-1">Bed</span>
                      </div>
                    )}
                    {amenities.electricity && (
                      <div className="flex items-center">
                        <FaBolt className="text-orange-400" title="Electricity" />
                        <span className="ml-1">
                          {amenities.electricity === "free" ? "Free Electricity" : "Buy your own Electricity"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    {contact.phone && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Phone:</strong> {contact.phone}
                      </p>
                    )}
                    {contact.whatsapp && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>WhatsApp:</strong> {contact.whatsapp}
                      </p>
                    )}
                    {contact.email && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Email:</strong> {contact.email}
                      </p>
                    )}
                     {location && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Closest Gate:</strong> {location}
                      </p>
                    )}
                     {minutesAway && (
                      <p className="text-gray-700 dark:text-gray-300">
                        <strong>Travel Time:</strong> {minutesAway} min from UL campus via {location}
                    </p>
                    )}
                  </div>

                  <button
                    className="mt-6 bg-primary w-full font-semibold text-center hover:bg-secondary duration-200 text-slate-100/80  py-[8px] px-4 rounded-full shadow flex items-center justify-center"
                    onClick={() => setShowLocation(true)}
                  >
                    <IoArrowForward className="mr-2 font-bold" />
                    See Location
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-0">
                <LocationGoogle latitudeC={coordinates.lat} longitudeC={coordinates.long} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
