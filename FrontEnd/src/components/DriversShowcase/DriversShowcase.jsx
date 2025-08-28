import React, { useState, useEffect } from 'react';
import { FiStar, FiPhone, FiMail, FiTruck, FiX, FiMapPin } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const DriversShowcase = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Dummy data for when no drivers exist
  const dummyDrivers = [
    {
      _id: 'dummy1',
      fullName: 'John Smith',
      email: 'john@example.com',
      phone: '+27 123 456 789',
      contactNumber: '+27 123 456 789',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      carDetails: {
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
      isAvailable: true,
      isDummy: true
    },
    {
      _id: 'dummy2',
      fullName: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+27 987 654 321',
      contactNumber: '+27 987 654 321',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      carDetails: {
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
      isAvailable: true,
      isDummy: true
    },
    {
      _id: 'dummy3',
      fullName: 'Mike Wilson',
      email: 'mike@example.com',
      phone: '+27 555 123 456',
      contactNumber: '+27 555 123 456',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      carDetails: {
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
      isAvailable: true,
      isDummy: true
    }
  ];

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.API_BASE_URL}/api/drivers`);
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
      console.error('Error fetching drivers:', error);
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
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
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

  if (loading) {
    return (
      <section className="py-16 bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Trusted Drivers
            </h2>
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              ))}
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
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-4">
              Our Trusted Drivers
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto px-4">
              Meet our professional drivers who are ready to take you safely to your destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {drivers.slice(0, 6).map((driver) => (
              <div
                key={driver._id}
                onClick={() => openDriverModal(driver)}
                className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 backdrop-blur-sm border border-white/10 rounded-3xl p-4 sm:p-6 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
              >
                {/* Car Image */}
                <div className="relative mb-6 overflow-hidden rounded-2xl">
                  <img
                    src={driver.carImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop'}
                    alt={`${driver.carDetails.make} ${driver.carDetails.model}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base text-white">
                      R{driver.pricePerKm}/km
                    </div>
                  </div>
                  {driver.isDummy && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-blue-500/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 text-xs sm:text-sm text-white">
                        Demo
                      </div>
                    </div>
                  )}
                </div>

                {/* Driver Info */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                  <img
                    src={driver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={driver.fullName}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-1 truncate">
                      {driver.fullName}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {renderStars(driver.rating || 4.5)}
                      </div>
                      <span className="text-xs sm:text-sm md:text-base text-gray-400 truncate">
                        ({driver.rating || 4.5}) • {driver.totalRides || 0} rides
                      </span>
                    </div>
                  </div>
                </div>

                {/* Car Details */}
                <div className="bg-white/5 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <FiTruck className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm md:text-base text-white font-medium truncate">
                      {driver.carDetails.year} {driver.carDetails.make} {driver.carDetails.model}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-400 truncate">
                    {driver.carDetails.color} • {driver.carDetails.licensePlate}
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm md:text-base ${
                    driver.isAvailable 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                      driver.isAvailable ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    {driver.isAvailable ? 'Available' : 'Busy'}
                  </div>
                  <span className="text-blue-400 text-xs sm:text-sm md:text-base group-hover:text-blue-300">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {drivers.length > 6 && (
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300">
                View All Drivers
              </button>
            </div>
          )}
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
                alt={`${selectedDriver.carDetails.make} ${selectedDriver.carDetails.model}`}
                className="w-full h-32 sm:h-48 md:h-64 object-cover rounded-t-2xl sm:rounded-t-3xl"
              />
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/70 backdrop-blur-sm rounded-full p-1.5 sm:p-2 text-white hover:bg-black/90 transition-colors"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black/70 backdrop-blur-sm rounded-full px-2 sm:px-4 py-1 sm:py-2">
                <span className="text-xs sm:text-sm md:text-base text-white font-medium">R{selectedDriver.pricePerKm}/km</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-3 sm:p-4 md:p-6">
              {/* Mobile Compact Layout */}
              <div className="block sm:hidden">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedDriver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedDriver.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/30"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-white mb-1 truncate">
                      {selectedDriver.fullName}
                    </h2>
                    {renderSingleStar(selectedDriver.rating || 4.5)}
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mt-1 ${
                      selectedDriver.isAvailable 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${
                        selectedDriver.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      {selectedDriver.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>
                
                {/* Contact Information - Mobile Only */}
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-blue-400 w-3 h-3" />
                      <span className="text-xs text-gray-300">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail className="text-blue-400 w-3 h-3" />
                      <span className="text-xs text-gray-300">{selectedDriver.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:block">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                  <img
                    src={selectedDriver.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'}
                    alt={selectedDriver.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover border-2 sm:border-4 border-blue-500/30"
                  />
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">
                      {selectedDriver.fullName}
                    </h2>
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        {renderStars(selectedDriver.rating || 4.5)}
                      </div>
                      <span className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300">
                        {selectedDriver.rating || 4.5} ({selectedDriver.totalRides || 0} rides)
                      </span>
                    </div>
                    <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm md:text-base ${
                      selectedDriver.isAvailable 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                        selectedDriver.isAvailable ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      {selectedDriver.isAvailable ? 'Available Now' : 'Currently Busy'}
                    </div>
                  </div>
                </div>

                {/* Contact Information - Desktop Only */}
                <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">Contact Information</h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FiPhone className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="text-xs sm:text-sm md:text-base text-gray-300">{selectedDriver.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <FiMail className="text-blue-400 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="text-xs sm:text-sm md:text-base text-gray-300">{selectedDriver.email}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">Vehicle Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Make & Model</span>
                    <p className="text-xs sm:text-sm md:text-base text-white font-medium">
                      {selectedDriver.carDetails.make} {selectedDriver.carDetails.model}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Year</span>
                    <p className="text-xs sm:text-sm md:text-base text-white font-medium">{selectedDriver.carDetails.year}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">Color</span>
                    <p className="text-xs sm:text-sm md:text-base text-white font-medium">{selectedDriver.carDetails.color}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs sm:text-sm">License Plate</span>
                    <p className="text-xs sm:text-sm md:text-base text-white font-medium">{selectedDriver.carDetails.licensePlate}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 md:mt-8">
                <button 
                  onClick={handleBookRide}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm md:text-base"
                >
                  <FiMapPin className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                  Book a Ride
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 sm:py-3 rounded-full font-medium transition-all duration-300 text-xs sm:text-sm md:text-base">
                  <FiPhone className="inline w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                  Contact Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DriversShowcase;
