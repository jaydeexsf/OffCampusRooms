import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FaWifi, FaShower, FaBed, FaTable, FaBolt } from "react-icons/fa"; // Importing available icons
import 'swiper/css';
import 'swiper/css/navigation';

const OrderPopup = ({ orderPopup, setOrderPopup, roomDetails }) => {
  if (!roomDetails) return null;

  const { title, description, price, amenities, images, contact, availableRooms } = roomDetails;

  // Determine availability status
  const availabilityStatus = availableRooms > 0 ? `${availableRooms} room${availableRooms > 1 ? 's' : '' } available` : "Fully booked";

  return (
    <>
      {orderPopup && (
        <div className="h-screen w-screen fixed top-0 left-0 bg-black/50 z-50 backdrop-blur-sm">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 shadow-md bg-white dark:bg-gray-900 rounded-md w-[400px] md:w-[600px] duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-black/70">{title}</h1>
              <IoCloseOutline
                className="text-2xl cursor-pointer hover:text-red-600 transition-colors duration-200"
                onClick={() => setOrderPopup(false)}
              />
            </div>
            {/* Image Slider */}
            <Swiper spaceBetween={10} slidesPerView={1} navigation>
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img src={img} alt={`Slide ${idx}`} className="w-full h-[200px] object-cover rounded-lg" />
                </SwiperSlide>
              ))}
            </Swiper>
            {/* Room Details */}
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">{description}</p>
              <p className="font-semibold">Price: R{price}</p>
              <p className="mt-2 font-semibold">Status: {availabilityStatus}</p>
              <p className="mt-2 font-semibold">Amenities:</p>
              <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300">
                <div className="flex items-center"><FaWifi /> <span className="ml-1">{amenities.wifi ? "Wifi" : "No Wifi"}</span></div>
                <div className="flex items-center"><FaShower /> <span className="ml-1">{amenities.shower ? "Shower" : "No Shower"}</span></div>
                <div className="flex items-center"><FaTable /> <span className="ml-1">{amenities.table ? "Table" : "No Table"}</span></div>
                <div className="flex items-center"><FaBed /> <span className="ml-1">{amenities.bed ? "Bed" : "No Bed"}</span></div>
                <div className="flex items-center"><FaBolt /> <span className="ml-1">{amenities.electricity ? "Electricity" : "No Electricity"}</span></div>
              </div>

              {/* Contact Information */}
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> {contact.phone || "N/A"}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>WhatsApp:</strong> {contact.whatsapp || "N/A"}</p>
                <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> {contact.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderPopup;
