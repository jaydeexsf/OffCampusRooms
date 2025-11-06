import React, { useState, useEffect } from 'react';
import { FiStar, FiLoader } from 'react-icons/fi';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';
import TestimonialCard from './TestimonialCard';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Show 3 testimonials at a time

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const url = `${API_ENDPOINTS.GET_PUBLIC_FEEDBACK}?limit=15`;
      console.log('[Testimonials] Fetch URL:', url);
      const response = await apiClient.get(url);
      console.log('[Testimonials] Response:', response.status, response.data);
      const { feedback, averageRating, total } = response.data;
      
      // Transform feedback data to match testimonial format and limit to 15
      const transformedTestimonials = feedback
        .slice(0, 15)
        .map(item => ({
          id: item._id,
          name: item.userName || 'Anonymous',
          course: item.course ? `${item.course}${item.studyYear ? `, ${item.studyYear}` : ''}` : 'Student',
          location: item.location || 'Cape Town',
          rating: item.websiteRating || 5,
          comment: item.comment || 'Great service! Highly recommended.',
          image: item.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName || 'User')}&background=random`
        }));
      
      setTestimonials(transformedTestimonials);
      setAverageRating(averageRating || 0);
      setTotalCount(total || 0);
      setLoading(false);
      
    } catch (error) {
      console.error('[Testimonials] Error fetching testimonials:', error);
      console.error('[Testimonials] Error details:', error?.response?.status, error?.response?.data);
      setTestimonials([]);
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FiStar
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, testimonials.length - itemsPerPage);
      return prevIndex >= maxIndex ? 0 : prevIndex + itemsPerPage;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const maxIndex = Math.max(0, testimonials.length - itemsPerPage);
      return prevIndex <= 0 ? maxIndex : prevIndex - itemsPerPage;
    });
  };

  // Get current testimonials to display
  const getCurrentTestimonials = () => {
    return testimonials.slice(currentIndex, currentIndex + itemsPerPage);
  };

  const canGoNext = testimonials.length > itemsPerPage;
  const canGoPrev = testimonials.length > itemsPerPage;

  // If no testimonials, show a message
  if (!loading && testimonials.length === 0) {
    return (
      <div className="bg-gray-950 py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Students
              </span> Say
            </h2>
            <p className="text-gray-400 mb-8">No testimonials available at the moment. Check back later!</p>
          </div>
        </section>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-950 py-16">
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center gap-4">
                <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                <p className="text-gray-400 text-base">Loading student testimonials...</p>
              </div>
            </div>
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
                What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Students
                </span> Say
              </h2>
              <p className="text-gray-400 text-sm md:text-base mb-2">
                {averageRating.toFixed(1)}/5 from {totalCount} reviews
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"></div>
            </div>
            
            {/* Navigation Arrows */}
            {canGoNext && (
              <div className="flex gap-3">
                <button 
                  onClick={prevSlide}
                  disabled={!canGoPrev}
                  className="p-3 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Previous testimonials"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={nextSlide}
                  disabled={!canGoNext}
                  className="p-3 rounded-full bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  aria-label="Next testimonials"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Testimonials Carousel */}
          <div className="relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-transform duration-500 ease-in-out">
              {getCurrentTestimonials().map((testimonial, index) => (
                <div
                  key={`${testimonial.id}-${currentIndex + index}`}
                  className="group relative overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
            
            {/* Carousel Indicators */}
            {testimonials.length > itemsPerPage && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map((_, index) => (
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
    </div>
  );
};

export default StudentTestimonials;
