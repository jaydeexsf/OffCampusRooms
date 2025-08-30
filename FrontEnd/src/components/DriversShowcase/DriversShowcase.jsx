import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiPhone, FiMail, FiTruck, FiX, FiMapPin, FiLoader, FiChevronLeft, FiChevronRight, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiClient } from '../../config/api';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DriversShowcase = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Dummy data for when no drivers exist
  const dummyDrivers = [
    {
      _id: 'dummy1',
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '+27 123 456 789',
      contactNumber: '+27 123 456 789',
      contact: '+27 123 456 789',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      carDetails: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
        licensePlate: 'ABC 123 GP'
      },
      vehicleInfo: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
        licensePlate: 'ABC 123 GP'
      },
      carImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop',
      pricePerKm: 15,
      rating: 4.8,
      totalRides: 156,
      experience: '5 years',
      location: 'Pretoria, Gauteng',
      bio: 'Professional driver with 5 years of experience. Safe, reliable, and punctual service guaranteed.',
      isAvailable: true,
      isDummy: true
    },
    {
      _id: 'dummy2',
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+27 987 654 321',
      contactNumber: '+27 987 654 321',
      contact: '+27 987 654 321',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      carDetails: {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        color: 'Blue',
        licensePlate: 'XYZ 789 GP'
      },
      vehicleInfo: {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        color: 'Blue',
        licensePlate: 'XYZ 789 GP'
      },
      carImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop',
      pricePerKm: 12,
      rating: 4.9,
      totalRides: 203,
      experience: '3 years',
      location: 'Johannesburg, Gauteng',
      bio: 'Experienced driver specializing in student transportation. Clean vehicle and friendly service.',
      isAvailable: true,
      isDummy: true
    },
    {
      _id: 'dummy3',
      fullName: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+27 555 123 456',
      contactNumber: '+27 555 123 456',
      contact: '+27 555 123 456',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      carDetails: {
        make: 'Nissan',
        model: 'Sentra',
        year: 2021,
        color: 'Silver',
        licensePlate: 'DEF 456 GP'
      },
      vehicleInfo: {
        make: 'Nissan',
        model: 'Sentra',
        year: 2021,
        color: 'Silver',
        licensePlate: 'DEF 456 GP'
      },
      carImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=300&fit=crop',
      pricePerKm: 18,
      rating: 4.7,
      totalRides: 98,
      experience: '2 years',
      location: 'Cape Town, Western Cape',
      bio: 'New driver with a passion for providing excellent service. Always on time and professional.',
      isAvailable: true,
      isDummy: true
    }
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Add custom CSS to ensure slider visibility
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .drivers-slider .slick-slide {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }
      .drivers-slider .slick-slide > div {
        opacity: 1 !important;
        visibility: visible !important;
        display: block !important;
      }
      .drivers-slider .slick-track {
        opacity: 1 !important;
        visibility: visible !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showModal]);

  const fetchDrivers = async () => {
    try {
              const response = await apiClient.get(API_ENDPOINTS.GET_AVAILABLE_DRIVERS);
      const realDrivers = response.data.drivers || [];
      
      // Always show real drivers first, then add dummy data if needed for demo
      const allDrivers = [...realDrivers];
      
      // If we have fewer than 3 real drivers, add some dummy data for demo purposes
      if (realDrivers.length < 3) {
        const neededDummies = 3 - realDrivers.length;
        allDrivers.push(...dummyDrivers.slice(0, neededDummies));
      }
      
      setDrivers(allDrivers);
    } catch (error) {
      // Fallback to dummy data on error
      setDrivers(dummyDrivers);
    } finally {
      setLoading(false);
    }
  };

  const openDriverModal = (driver) => {
    setSelectedDriver(driver);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDriver(null);
  };

  const handleBookRide = () => {
    closeModal();
    navigate('/ride-booking');
  };

  const renderStars = (rating) => {
    const safeRating = rating || 0;
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(safeRating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const renderSingleStar = (rating) => {
    return (
      <div className="flex items-center gap-1">
        <FiStar className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
        <span className="text-xs sm:text-sm md:text-base text-gray-300">
          {rating || 4.5} ({selectedDriver?.totalRides || 0} rides)
        </span>
      </div>
    );
  };

  // Slider settings for mobile responsiveness
  const settings = {
    dots: true,
    infinite: drivers.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, Math.max(1, drivers.length)),
    slidesToScroll: 1,
    autoplay: drivers.length > 3,
    autoplaySpeed: 4000,
    arrows: false,
    centerMode: false,
    centerPadding: '0px',
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, Math.max(1, drivers.length)),
          slidesToScroll: 1,
          infinite: drivers.length > 2,
          autoplay: drivers.length > 2,
          centerMode: false,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: drivers.length > 1,
          autoplay: drivers.length > 1,
          centerMode: false,
          centerPadding: '0px',
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Our Trusted <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Drivers
                </span>
              </h2>
              <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
                Safe, reliable, and experienced drivers ready to take you anywhere around campus
              </p>
            </div>
            
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-400 text-sm md:text-base">Loading trusted drivers...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                Meet Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Trusted Drivers
                </span>
              </h2>
              <div className="w-12 md:w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-3"></div>
              <p className="text-gray-400 text-xs sm:text-sm md:text-lg max-w-2xl mx-auto">
                Safe, reliable, and experienced drivers ready to take you anywhere around campus
              </p>
            </div>

 {/* Drivers Display - Professional Carousel Layout */}
 <div className="w-full relative" data-aos="fade-up" data-aos-delay="200">
       {drivers.length > 0 ? (
      <div className="relative">
               {/* Left Arrow - Fixed Position */}
        <button
          onClick={() => sliderRef.current?.slickPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                     bg-black/80 backdrop-blur-sm border border-white/20 
                     rounded-full p-3 text-white shadow-lg opacity-0 lg:opacity-100"
        >
          <FiChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow - Fixed Position */}
        <button
          onClick={() => sliderRef.current?.slickNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 
                     bg-black/80 backdrop-blur-sm border border-white/20 
                     rounded-full p-3 text-white shadow-lg opacity-0 lg:opacity-100"
        >
          <FiChevronRight className="w-5 h-5" />
        </button>

       {/* Slider Container with Side Padding for Arrows */}
       <div className="px-4 lg:px-8">
         <Slider ref={sliderRef} {...settings} className="drivers-slider">
           {drivers.map((driver) => (
             <div key={driver._id} className="px-2">
               {/* Driver Card */}
                               <div
                  className="bg-gray-800 border border-white/10 rounded-2xl p-4 sm:p-6
                             cursor-pointer mx-auto shadow-xl transition-none"
                  style={{height: 'auto', minHeight: '420px', maxWidth: '350px', width: '100%'}}
                  onClick={() => openDriverModal(driver)}
                >
                                                   {/* Car Image */}
                  <div className="relative mb-4 sm:mb-5 overflow-hidden rounded-xl">
                    <img
                      src={driver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                      alt={`${driver.carDetails?.make || driver.vehicleInfo?.make || 'Car'} ${driver.carDetails?.model || driver.vehicleInfo?.model || ''}`}
                      className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl"
                    />
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/90 border border-white/20 rounded-full px-3 py-2 text-sm text-white font-semibold shadow-lg">
                        R{driver.pricePerKm || 'N/A'}/km
                      </div>
                    </div>
                    {/* Demo Badge */}
                    {driver.isDummy && (
                      <div className="absolute top-3 left-3">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 border border-blue-400/30 rounded-full px-3 py-2 text-sm text-white font-semibold shadow-lg">
                          Demo
                        </div>
                      </div>
                    )}
                  </div>
                                 {/* Driver Profile Section */}
                 <div className="flex items-center gap-4 mb-4">
                   <div className="relative">
                     <img
                       src={driver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                       alt={driver.fullName}
                       className="w-14 h-14 rounded-full object-cover border-3 border-blue-500 shadow-lg"
                     />
                     {/* Online Status Indicator */}
                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                       driver.isAvailable !== false ? 'bg-green-400' : 'bg-red-400'
                     }`}></div>
                   </div>
                   <div className="flex-1 min-w-0">
                     <h3 className="text-lg font-bold text-white mb-1 truncate">
                       {driver.fullName}
                     </h3>
                     <div className="flex items-center gap-2 mb-1">
                       <div className="flex items-center gap-1">
                         {renderStars(driver.rating || 4.5)}
                       </div>
                       <span className="text-sm text-gray-300 font-medium truncate">
                         {driver.rating || 4.5} • {driver.totalRides || 0} rides
                       </span>
                     </div>
                     <p className="text-xs text-blue-400 font-medium truncate">
                       {driver.experience || 'Experienced'} driver
                     </p>
                   </div>
                 </div>
                                 {/* Car Details with Icons */}
                 <div className="mb-4 bg-gray-700 rounded-xl p-3 border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTruck className="text-blue-400 w-4 h-4" />
                    <span className="text-white font-semibold text-sm">
                      {driver.carDetails?.year || driver.vehicleInfo?.year || 'N/A'} {driver.carDetails?.make || driver.vehicleInfo?.make || 'N/A'} {driver.carDetails?.model || driver.vehicleInfo?.model || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <FiMapPin className="text-blue-400 w-3 h-3" />
                    <span className="truncate">
                      {driver.carDetails?.color || driver.vehicleInfo?.color || 'N/A'} • {driver.carDetails?.licensePlate || driver.vehicleInfo?.licensePlate || 'N/A'}
                    </span>
                  </div>
                </div>
                                 {/* Action Button */}
                 <div className="flex justify-center">
                   <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg">
                     Book Now
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  ) : (
    <div className="text-center py-20">
      <p className="text-gray-400 text-lg">No drivers available at the moment.</p>
    </div>
  )}
</div>


                         {drivers.length > 6 && (
               <div className="text-center mt-12">
                 <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full font-medium">
                   View All Drivers
                 </button>
               </div>
             )}
          </div>
        </div>
      </section>

             {/* Driver Detail Modal */}
       {showModal && selectedDriver && (
         <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={closeModal}>
           <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header with Hero Image */}
            <div className="relative">
                             <img
                 src={selectedDriver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                 alt={`${selectedDriver.carDetails?.make || selectedDriver.vehicleInfo?.make || 'Car'} ${selectedDriver.carDetails?.model || selectedDriver.vehicleInfo?.model || ''}`}
                 className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-t-3xl"
               />
                             {/* Close Button */}
                               <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-full p-3 text-white shadow-lg z-10"
                >
                  <FiX className="w-5 h-5" />
                </button>
              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-white font-bold text-lg">R{selectedDriver.pricePerKm || 'N/A'}/km</span>
              </div>
              
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile & Quick Info */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Profile Section */}
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <img
                        src={selectedDriver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                        alt={selectedDriver.fullName}
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500/50 shadow-xl"
                      />
                      {/* Online Status */}
                      <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-gray-900 ${
                        selectedDriver.isAvailable !== false ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedDriver.fullName}</h3>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(selectedDriver.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-bold text-lg ml-2">{selectedDriver.rating || 'N/A'}</span>
                    </div>
                    <p className="text-gray-300 text-sm">({selectedDriver.totalRides || 0} rides completed)</p>
                  </div>

                  

                                     {/* Contact Info */}
                   <div className="bg-gray-800 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <FiPhone className="text-blue-400 w-5 h-5" />
                      Contact
                    </h4>
                    <p className="text-white font-semibold text-lg">{selectedDriver.contact || selectedDriver.contactNumber || selectedDriver.phone || 'Not specified'}</p>
                  </div>
                </div>
                
                {/* Right Column - Detailed Info */}
                <div className="lg:col-span-2 space-y-6">
                  
                  
                                     {/* Vehicle Information */}
                   <div className="bg-gray-800 rounded-2xl p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-4 text-lg">Vehicle Information</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400 text-sm">Make & Model</span>
                          <p className="text-white font-semibold text-lg">{selectedDriver.vehicleInfo?.make || selectedDriver.carDetails?.make || 'N/A'} {selectedDriver.vehicleInfo?.model || selectedDriver.carDetails?.model || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">Year</span>
                          <p className="text-white font-semibold text-lg">{selectedDriver.vehicleInfo?.year || selectedDriver.carDetails?.year || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <span className="text-gray-400 text-sm">Color</span>
                          <p className="text-white font-semibold text-lg">{selectedDriver.vehicleInfo?.color || selectedDriver.carDetails?.color || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-sm">License Plate</span>
                          <p className="text-white font-semibold text-lg">{selectedDriver.vehicleInfo?.licensePlate || selectedDriver.carDetails?.licensePlate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                                     {/* Action Buttons */}
                   <div className="flex gap-4 pt-4">
                     <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg text-lg">
                       Book Ride Now
                     </button>
                     <button className="flex-1 bg-gray-700 text-white font-bold py-4 px-6 rounded-2xl text-lg">
                       Send Message
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriversShowcase;
