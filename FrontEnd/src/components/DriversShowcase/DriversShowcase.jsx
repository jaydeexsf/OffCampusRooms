import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiPhone, FiMail, FiTruck, FiX, FiMapPin, FiLoader, FiChevronLeft, FiChevronRight, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, apiClient } from '../../config/api';

const DriversShowcase = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  // Custom slider functions
  const nextSlide = () => {
    if (isTransitioning) return;
    const maxSlides = Math.ceil(drivers.length / 3);
    console.log('Drivers next slide clicked, current:', currentSlide, 'maxSlides:', maxSlides, 'total drivers:', drivers.length);
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    const maxSlides = Math.ceil(drivers.length / 3);
    console.log('Drivers prev slide clicked, current:', currentSlide, 'maxSlides:', maxSlides, 'total drivers:', drivers.length);
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Auto-play functionality
  useEffect(() => {
    const maxSlides = Math.ceil(drivers.length / 3);
    if (maxSlides <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [drivers.length, currentSlide]);

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



  if (loading) {
    return (
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-4">
                Our Trusted <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Drivers
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Safe, reliable, and experienced drivers ready to take you anywhere around campus
              </p>
            </div>
            
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-400 text-base">Loading trusted drivers...</p>
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
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12" data-aos="fade-up">
              <h2 className="text-3xl font-bold text-white mb-4">
                Meet Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Trusted Drivers
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Safe, reliable, and experienced drivers ready to take you anywhere around campus
              </p>
            </div>

            {/* Drivers Display - Clean Professional Layout */}
            <div className="w-full relative" data-aos="fade-up" data-aos-delay="200">
              {drivers.length > 0 ? (
                <div className="relative">
                  

                  {/* Custom Slider Container */}
                  <div className="px-8 lg:px-12">
                    {/* Navigation Buttons - Top Right */}
                    <div className="absolute top-0 right-0 z-10 flex gap-2 mb-4">
                                             <button
                         onClick={prevSlide}
                         disabled={isTransitioning || Math.ceil(drivers.length / 3) <= 1}
                         className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                         title="Previous"
                       >
                         <FiChevronLeft className="w-5 h-5" />
                       </button>
                                             <button
                         onClick={nextSlide}
                         disabled={isTransitioning || Math.ceil(drivers.length / 3) <= 1}
                         className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                         title="Next"
                       >
                         <FiChevronRight className="w-5 h-5" />
                       </button>
                    </div>

                    {/* Slider Content */}
                    <div className="relative overflow-hidden rounded-2xl">
                      <div 
                        className="flex transition-transform duration-300 ease-out"
                        style={{
                          transform: `translateX(-${currentSlide * 100}%)`,
                          width: `${drivers.length * (100 / 3)}%`
                        }}
                      >
                        {drivers.map((driver, index) => (
                          <div 
                            key={driver._id} 
                            className="w-1/3 px-4 flex-shrink-0"
                            style={{ minWidth: '300px' }}
                          >
                            {/* Driver Card - Clean and Simple */}
                            <div
                              className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-xl overflow-hidden
                                         cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300
                                         hover:from-blue-600/30 hover:to-blue-500/30 group"
                              onClick={() => openDriverModal(driver)}
                            >
                              {/* Car Image */}
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={driver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                                  alt={`${driver.carDetails?.make || driver.vehicleInfo?.make || 'Car'} ${driver.carDetails?.model || driver.vehicleInfo?.model || ''}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                {/* Price Badge */}
                                <div className="absolute top-3 right-3">
                                  <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-full px-3 py-2 text-sm text-white font-semibold shadow-lg">
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

                              {/* Driver Info - Simplified */}
                              <div className="p-6">
                                {/* Profile Section */}
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="relative">
                                    <img
                                      src={driver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                                      alt={driver.fullName}
                                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/50 shadow-lg"
                                    />
                                    {/* Online Status */}
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                                      driver.isAvailable !== false ? 'bg-green-400' : 'bg-red-400'
                                    }`}></div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="text-base font-bold text-white mb-2 truncate">
                                      {driver.fullName}
                                    </h3>
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="flex items-center gap-1">
                                        {renderStars(driver.rating || 4.5)}
                                      </div>
                                      <span className="text-sm text-gray-300 font-medium">
                                        {driver.rating || 4.5}
                                      </span>
                                    </div>
                                    <p className="text-sm text-blue-400 font-medium">
                                      {driver.totalRides || 0} rides • {driver.experience || 'Experienced'}
                                    </p>
                                  </div>
                                </div>

                                {/* Simple Car Info */}
                                <div className="bg-gray-700/50 rounded-lg p-3 border border-white/5 mb-4">
                                  <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <FiTruck className="text-blue-400 w-4 h-4" />
                                    <span className="truncate">
                                      {driver.carDetails?.year || driver.vehicleInfo?.year || 'N/A'} {driver.carDetails?.make || driver.vehicleInfo?.make || 'N/A'}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-lg text-sm font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200">
                                  Book Now
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                                         {/* Dots Navigation */}
                     {Math.ceil(drivers.length / 3) > 1 && (
                       <div className="flex justify-center gap-2 mt-6">
                         {Array.from({ length: Math.ceil(drivers.length / 3) }, (_, index) => (
                           <button
                             key={index}
                             onClick={() => goToSlide(index)}
                             className={`w-3 h-3 rounded-full transition-all duration-200 ${
                               currentSlide === index
                                 ? 'bg-blue-400 scale-125'
                                 : 'bg-gray-600 hover:bg-gray-500'
                             }`}
                             title={`Go to slide ${index + 1}`}
                           />
                         ))}
                       </div>
                     )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No drivers available at the moment.</p>
                </div>
              )}
            </div>

            {/* View All Button */}
            {drivers.length > 6 && (
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200">
                  View All Drivers
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Driver Detail Modal */}
      {showModal && selectedDriver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="relative">
              <img
                src={selectedDriver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                alt={`${selectedDriver.carDetails?.make || selectedDriver.vehicleInfo?.make || 'Car'} ${selectedDriver.carDetails?.model || selectedDriver.vehicleInfo?.model || ''}`}
                className="w-full h-80 object-cover rounded-t-2xl"
              />
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-full p-3 text-white shadow-lg z-10 hover:bg-black/70 transition-all duration-200"
              >
                <FiX className="w-5 h-5" />
              </button>
              {/* Price Badge */}
              <div className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 backdrop-blur-sm border border-blue-400/30 rounded-full px-4 py-2 shadow-lg">
                <span className="text-white font-bold text-lg">R{selectedDriver.pricePerKm || 'N/A'}/km</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Column - Profile & Contact (Mobile: side by side, Desktop: stacked) */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Mobile: Profile and Contact side by side */}
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                    {/* Profile Section */}
                    <div className="text-center">
                      <div className="relative inline-block mb-4">
                        <img
                          src={selectedDriver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                          alt={selectedDriver.fullName}
                          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover border-4 border-blue-500/50 shadow-xl"
                        />
                        {/* Online Status */}
                        <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-gray-900 ${
                          selectedDriver.isAvailable !== false ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white mb-2">{selectedDriver.fullName}</h3>
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                i < Math.floor(selectedDriver.rating || 0)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-white font-bold text-sm sm:text-base ml-2">{selectedDriver.rating || 'N/A'}</span>
                      </div>
                      <p className="text-gray-300 text-xs sm:text-sm">({selectedDriver.totalRides || 0} rides completed)</p>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <FiPhone className="text-blue-400 w-4 h-4 sm:w-5 sm:h-5" />
                        Contact
                      </h4>
                      <p className="text-white font-semibold text-sm sm:text-base">{selectedDriver.contact || selectedDriver.contactNumber || selectedDriver.phone || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Vehicle Details & Actions */}
                <div className="space-y-4 sm:space-y-6">
                  {/* Vehicle Information */}
                  <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-white/10">
                    <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Vehicle Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <span className="text-gray-400 text-xs sm:text-sm">Make & Model</span>
                          <p className="text-white font-semibold text-sm sm:text-base">{selectedDriver.vehicleInfo?.make || selectedDriver.carDetails?.make || 'N/A'} {selectedDriver.vehicleInfo?.model || selectedDriver.carDetails?.model || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs sm:text-sm">Year</span>
                          <p className="text-white font-semibold text-sm sm:text-base">{selectedDriver.vehicleInfo?.year || selectedDriver.carDetails?.year || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <div>
                          <span className="text-gray-400 text-xs sm:text-sm">Color</span>
                          <p className="text-white font-semibold text-sm sm:text-base">{selectedDriver.vehicleInfo?.color || selectedDriver.carDetails?.color || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-gray-400 text-xs sm:text-sm">License Plate</span>
                          <p className="text-white font-semibold text-sm sm:text-base">{selectedDriver.vehicleInfo?.licensePlate || selectedDriver.carDetails?.licensePlate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <button 
                      onClick={handleBookRide}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 text-sm sm:text-base"
                    >
                      Book Ride Now
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
