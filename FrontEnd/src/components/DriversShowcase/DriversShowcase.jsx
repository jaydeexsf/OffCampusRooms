import React, { useState, useEffect } from 'react';
import { FiLoader, FiStar, FiX } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';
import DriverCard from './DriverCard';

const DriversShowcase = () => {
  const { getToken, isSignedIn } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showDriverPopup, setShowDriverPopup] = useState(false);
  const [driverContacts, setDriverContacts] = useState(null);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Show 3 drivers at a time

  // Dummy data for when no drivers exist
  const getDummyDrivers = () => [
    {
      _id: 'dummy1',
      fullName: 'John Smith',
      phone: '+27 123 456 789',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      carDetails: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2020,
        color: 'White',
      },
      pricePerKm: 15,
      rating: 4.8,
      totalRides: 156,
      experience: '5 years',
      location: 'Pretoria, Gauteng',
      bio: 'Professional driver with 5+ years of experience.',
    },
    {
      _id: 'dummy2',
      fullName: 'Sarah Johnson',
      phone: '+27 987 654 321',
      profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      carDetails: {
        make: 'Honda',
        model: 'Civic',
        year: 2019,
        color: 'Silver',
      },
      pricePerKm: 18,
      rating: 4.9,
      totalRides: 203,
      experience: '3 years',
      location: 'Johannesburg, Gauteng',
      bio: 'Reliable and friendly driver with excellent ratings.',
    },
    {
      _id: 'dummy3',
      fullName: 'Mike Wilson',
      phone: '+27 555 123 456',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      carDetails: {
        make: 'Nissan',
        model: 'Sentra',
        year: 2021,
        color: 'Black',
      },
      pricePerKm: 16,
      rating: 4.7,
      totalRides: 89,
      experience: '2 years',
      location: 'Cape Town, Western Cape',
      bio: 'New driver with modern vehicle and great service.',
    }
  ];

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      // Use public endpoint that doesn't require authentication
      const url = API_ENDPOINTS.GET_AVAILABLE_DRIVERS || '/api/drivers/available';
      console.log('🚗 Fetching drivers from:', url);
      const response = await apiClient.get(url);
      console.log('🚗 Drivers response:', response.data);
      
      // Handle the response structure from the backend
      if (response.data?.success && response.data?.drivers) {
        console.log('🚗 Found', response.data.drivers.length, 'drivers from API');
        setDrivers(response.data.drivers);
      } else if (response.data?.length) {
        console.log('🚗 Found', response.data.length, 'drivers from API (direct array)');
        setDrivers(response.data);
      } else {
        console.log('🚗 No drivers found, using dummy data');
        setDrivers(getDummyDrivers());
      }
      
    } catch (error) {
      console.error('🚗 Error fetching drivers:', error);
      console.log('🚗 Using dummy drivers as fallback');
      // If API fails, use dummy data
      setDrivers(getDummyDrivers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver);
    setShowDriverPopup(true);
  };

  const closeDriverPopup = () => {
    setShowDriverPopup(false);
    setSelectedDriver(null);
    setDriverContacts(null);
    setShowRatingModal(false);
    setRating(5);
    setReview('');
    setUserRating(null);
  };

  const handleGetContacts = async () => {
    if (!selectedDriver?._id) return;
    
    setLoadingContacts(true);
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.GET_DRIVER_CONTACTS}/${selectedDriver._id}/contacts`);
      if (response.data.success) {
        setDriverContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching driver contacts:', error);
      // Fallback to phone if available
      if (selectedDriver.phone) {
        setDriverContacts({
          phone: selectedDriver.phone,
          email: selectedDriver.email || 'N/A',
          name: selectedDriver.fullName
        });
      }
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchUserRating = async () => {
    if (!isSignedIn || !selectedDriver?._id) return;
    
    try {
      const token = await getToken();
      const response = await apiClient.get(`${API_ENDPOINTS.GET_USER_DRIVER_RATING}/${selectedDriver._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success && response.data.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating.rating);
        setReview(response.data.rating.review || '');
      }
    } catch (error) {
      // User hasn't rated yet, that's okay
      console.log('No existing rating found');
    }
  };

  const handleSubmitRating = async () => {
    if (!isSignedIn || !selectedDriver?._id) {
      alert('Please sign in to rate drivers');
      return;
    }

    setSubmittingRating(true);
    try {
      const token = await getToken();
      const response = await apiClient.post(
        API_ENDPOINTS.ADD_DRIVER_RATING,
        {
          driverId: selectedDriver._id,
          rating,
          review: review.trim()
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.rating) {
        setUserRating(response.data.rating);
        setShowRatingModal(false);
        // Refresh driver data to show updated rating
        fetchDrivers();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmittingRating(false);
    }
  };

  useEffect(() => {
    if (showDriverPopup && selectedDriver && isSignedIn) {
      fetchUserRating();
    }
  }, [showDriverPopup, selectedDriver, isSignedIn]);

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, drivers.length - itemsPerPage);
      return prevIndex >= maxIndex ? 0 : prevIndex + itemsPerPage;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, drivers.length - itemsPerPage);
      return prevIndex <= 0 ? maxIndex : prevIndex - itemsPerPage;
    });
  };

  // Get current drivers to display
  const getCurrentDrivers = () => {
    return drivers.slice(currentIndex, currentIndex + itemsPerPage);
  };

  const canGoNext = drivers.length > itemsPerPage;
  const canGoPrev = drivers.length > itemsPerPage;

  if (loading) {
    return (
      <div className="bg-gray-950 py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-400 text-base">Loading drivers...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!drivers.length) {
    return (
      <div className="bg-gray-950 py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Trusted Drivers
              </span>
            </h2>
            <p className="text-gray-400 mb-8">No drivers available at the moment.</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 py-16">
      <section data-aos="fade-up" className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Trusted Drivers
                </span>
              </h2>
              {/* <p className="text-gray-400 text-sm md:text-base mb-2">
                Professional drivers ready to assist you
              </p> */}
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            
            {/* Navigation Arrows */}
            {canGoNext && (
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide}
                  disabled={!canGoPrev}
                  className="p-3 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous drivers"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={!canGoNext}
                  className="p-3 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next drivers"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Drivers Carousel */}
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out">
              {getCurrentDrivers().map((driver, index) => (
                <div
                  key={`${driver._id}-${currentIndex + index}`}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <DriverCard driver={driver} onDriverClick={handleDriverClick} />
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            {drivers.length > itemsPerPage && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(drivers.length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * itemsPerPage)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      Math.floor(currentIndex / itemsPerPage) === index
                        ? 'w-8 bg-blue-500'
                        : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Driver Popup Modal */}
      {showDriverPopup && selectedDriver && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeDriverPopup}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Driver Details</h3>
              <button
                onClick={closeDriverPopup}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Driver Profile */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src={selectedDriver.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDriver.fullName || 'Driver')}&background=random`} 
                    alt={selectedDriver.fullName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedDriver.fullName || 'Driver'}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(selectedDriver.rating || 5) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-yellow-400 font-semibold">{selectedDriver.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{selectedDriver.experience || '2+'} years experience</p>
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0" />
                  </svg>
                  Vehicle Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-400">Make & Model:</span>
                    <span className="text-white ml-2">{selectedDriver.carDetails?.make || 'Toyota'} {selectedDriver.carDetails?.model || 'Corolla'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Year:</span>
                    <span className="text-white ml-2">{selectedDriver.carDetails?.year || '2020'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Color:</span>
                    <span className="text-white ml-2">{selectedDriver.carDetails?.color || 'White'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-white ml-2">R{selectedDriver.pricePerKm || '15'}/km</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4">
                  <h4 className="text-gray-400 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Total Rides</h4>
                  <p className="text-white text-lg sm:text-xl font-bold">{selectedDriver.totalRides || '156'}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 sm:p-4">
                  <h4 className="text-gray-400 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Experience</h4>
                  <p className="text-white text-lg sm:text-xl font-bold">{selectedDriver.experience || '5+'} years</p>
                </div>
              </div>

              {/* Contact Information - Show when fetched */}
              {driverContacts && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 space-y-3">
                  <h4 className="text-blue-400 font-semibold mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a href={`tel:${driverContacts.phone}`} className="text-white hover:text-blue-400 transition-colors">
                        {driverContacts.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href={`mailto:${driverContacts.email}`} className="text-white hover:text-blue-400 transition-colors">
                        {driverContacts.email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {!driverContacts ? (
                  <button
                    onClick={handleGetContacts}
                    disabled={loadingContacts}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95"
                  >
                    {loadingContacts ? (
                      <>
                        <FiLoader className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                        <span>Loading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>Get Contacts</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowRatingModal(true)}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 sm:py-2.5 sm:px-4 rounded-lg transition-all duration-200 text-xs sm:text-sm shadow-md hover:shadow-lg active:scale-95"
                  >
                    <FiStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{userRating ? 'Update Rating' : 'Rate Driver'}</span>
                  </button>
                )}
                <button
                  onClick={closeDriverPopup}
                  className="px-3 py-2 sm:px-4 sm:py-2.5 bg-gray-700/50 hover:bg-gray-700 text-white font-medium text-xs sm:text-sm rounded-lg transition-all duration-200 border border-gray-600/50 hover:border-gray-600 active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowRatingModal(false)}>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/20 rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Rate {selectedDriver?.fullName}</h3>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Star Rating */}
                <div>
                  <label className="block text-gray-300 mb-3">Rating</label>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <FiStar
                          className={`w-8 h-8 transition-colors ${
                            star <= rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-center text-gray-400 text-sm mt-2">{rating} out of 5 stars</p>
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-gray-300 mb-2">Review (Optional)</label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Share your experience with this driver..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                    rows="4"
                    maxLength="500"
                  />
                  <p className="text-gray-400 text-xs mt-1">{review.length}/500 characters</p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmitRating}
                    disabled={submittingRating}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                  >
                    {submittingRating ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
                  </button>
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200 border border-gray-600/50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversShowcase;
