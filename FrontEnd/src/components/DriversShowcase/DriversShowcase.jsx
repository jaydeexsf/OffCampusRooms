import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiPhone, FiMail, FiTruck, FiX, FiMapPin, FiLoader, FiChevronLeft, FiChevronRight, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiClient } from '../../config/api';
import Slider from "react-slick";

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
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, Math.max(1, drivers.length)),
          slidesToScroll: 1,
          infinite: drivers.length > 2,
          autoplay: drivers.length > 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: drivers.length > 1,
          autoplay: drivers.length > 1,
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
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12" data-aos="fade-up">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-4">
                  Meet Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Trusted Drivers
                  </span>
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm md:text-lg max-w-2xl">
                  Safe, reliable, and experienced drivers ready to take you anywhere around campus
                </p>
              </div>
              
              {/* Navigation Buttons - Aligned to the right on desktop, centered on mobile */}
              <div className="flex gap-2 self-end">
                <button
                  onClick={() => sliderRef.current?.slickPrev()}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 sm:p-3 text-white transition-all duration-200 hover:scale-105"
                >
                  <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={() => sliderRef.current?.slickNext()}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-2 sm:p-3 text-white transition-all duration-200 hover:scale-105"
                >
                  <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Drivers Display - Slider on all screen sizes */}
            <div className="max-w-6xl mx-auto" data-aos="fade-up" data-aos-delay="200">
              {drivers.length > 0 ? (
                <div className="relative">
                  <Slider ref={sliderRef} {...settings}>
                    {drivers.map((driver) => (
                      <div key={driver._id} className="px-2 sm:px-3">
                        <div
                          className="bg-gray-800 border-2 border-blue-500 rounded-xl p-4 sm:p-6 hover:bg-gray-700 hover:border-blue-400 transition-all duration-300 cursor-pointer group mx-auto shadow-lg"
                          style={{height: 'auto', minHeight: '400px'}}
                          onClick={() => openDriverModal(driver)}
                        >
                        {/* Car Image */}
                        <div className="relative mb-3 sm:mb-4">
                          <img
                            src={driver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                            alt={`${driver.carDetails?.make || driver.vehicleInfo?.make || 'Car'} ${driver.carDetails?.model || driver.vehicleInfo?.model || ''}`}
                            className="w-full h-28 sm:h-32 md:h-40 object-cover rounded-lg"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">
                              R{driver.pricePerKm || 'N/A'}/km
                            </div>
                          </div>
                          {driver.isDummy && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">
                                Demo
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Driver Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <img
                            src={driver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                            alt={driver.fullName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1 truncate">
                              {driver.fullName}
                            </h3>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center gap-1">
                                {renderStars(driver.rating || 4.5)}
                              </div>
                              <span className="text-sm text-gray-400 truncate">
                                ({driver.rating || 4.5}) • {driver.totalRides || 0} rides
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Car Details */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <FiTruck className="text-blue-400 w-3 sm:w-4 h-3 sm:h-4" />
                            <span className="text-white font-medium truncate text-xs sm:text-sm">
                              {driver.carDetails?.year || driver.vehicleInfo?.year || 'N/A'} {driver.carDetails?.make || driver.vehicleInfo?.make || 'N/A'} {driver.carDetails?.model || driver.vehicleInfo?.model || 'N/A'}
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-gray-400 truncate">
                            {driver.carDetails?.color || driver.vehicleInfo?.color || 'N/A'} • {driver.carDetails?.licensePlate || driver.vehicleInfo?.licensePlate || 'N/A'}
                          </div>
                        </div>

                        {/* Availability Status */}
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
                            driver.isAvailable !== false
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              driver.isAvailable !== false ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            {driver.isAvailable !== false ? 'Available' : 'Busy'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No drivers available at the moment.</p>
                </div>
              )}
            </div>

            {drivers.length > 6 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
                  View All Drivers
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Driver Detail Modal */}
      {showModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-900 border border-white/10 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedDriver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                alt={`${selectedDriver.carDetails?.make || selectedDriver.vehicleInfo?.make || 'Car'} ${selectedDriver.carDetails?.model || selectedDriver.vehicleInfo?.model || ''}`}
                className="w-full h-32 sm:h-48 md:h-64 object-cover rounded-t-2xl sm:rounded-t-3xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 text-white hover:bg-black/90 transition-colors"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                <span className="text-xs sm:text-sm md:text-base text-white font-medium">R{selectedDriver.pricePerKm || 'N/A'}/km</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
                <div className="md:w-1/3">
                  <img
                    src={selectedDriver.profileImage || '/api/placeholder/200/200'}
                    alt={selectedDriver.fullName}
                    className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-xl"
                  />
                </div>
                
                <div className="md:w-2/3 space-y-2 sm:space-y-3 md:space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2">{selectedDriver.fullName}</h3>
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ${
                              i < Math.floor(selectedDriver.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm sm:text-base">{selectedDriver.rating || 'N/A'}</span>
                      <span className="text-gray-400 text-xs sm:text-sm">({selectedDriver.totalRides || 0} rides)</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <FiClock className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-gray-300 font-medium text-xs sm:text-sm">Experience</span>
                      </div>
                      <p className="text-white text-sm sm:text-base md:text-lg font-semibold">{selectedDriver.experience || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <FiMapPin className="text-green-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-gray-300 font-medium text-xs sm:text-sm">Location</span>
                      </div>
                      <p className="text-white text-sm sm:text-base md:text-lg font-semibold">{selectedDriver.location || 'Not specified'}</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <FiDollarSign className="text-yellow-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-gray-300 font-medium text-xs sm:text-sm">Rate</span>
                      </div>
                      <p className="text-white text-sm sm:text-base md:text-lg font-semibold">R{selectedDriver.pricePerKm || 'N/A'}/km</p>
                    </div>
                    
                    <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <FiPhone className="text-purple-400 w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-gray-300 font-medium text-xs sm:text-sm">Contact</span>
                      </div>
                      <p className="text-white text-sm sm:text-base md:text-lg font-semibold">{selectedDriver.contact || selectedDriver.contactNumber || selectedDriver.phone || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                    <h4 className="text-white font-semibold mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <FiUser className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                      About
                    </h4>
                    <p className="text-gray-300 leading-relaxed text-xs sm:text-sm md:text-base">{selectedDriver.bio || 'No bio available for this driver.'}</p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-2 sm:p-3 md:p-4">
                    <h4 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Vehicle Information</h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-gray-400">Make & Model:</span>
                        <p className="text-white font-medium">{selectedDriver.vehicleInfo?.make || selectedDriver.carDetails?.make || 'N/A'} {selectedDriver.vehicleInfo?.model || selectedDriver.carDetails?.model || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Year:</span>
                        <p className="text-white font-medium">{selectedDriver.vehicleInfo?.year || selectedDriver.carDetails?.year || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Color:</span>
                        <p className="text-white font-medium">{selectedDriver.vehicleInfo?.color || selectedDriver.carDetails?.color || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">License Plate:</span>
                        <p className="text-white font-medium">{selectedDriver.vehicleInfo?.licensePlate || selectedDriver.carDetails?.licensePlate || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-3 md:pt-4">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-xs sm:text-sm md:text-base">
                      Book Ride
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 text-xs sm:text-sm md:text-base">
                      Message
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
