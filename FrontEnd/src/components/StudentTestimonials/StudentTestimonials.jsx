import React, { useState, useEffect, useRef } from 'react';
import { FiStar, FiMessageSquare, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { apiClient } from '../../config/api';
import { API_ENDPOINTS } from '../../config/api';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Responsive items per view
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const computeItemsPerView = () => {
      if (typeof window === 'undefined') return 3;
      const width = window.innerWidth;
      if (width < 640) return 1; // mobile - single item
      if (width < 768) return 1; // small mobile - single item
      if (width < 1024) return 2; // tablet - two items
      return 3; // desktop - three items
    };

    const updateItems = () => setItemsPerView(computeItemsPerView());
    updateItems();
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  // Custom slider functions
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const maxSlides = Math.ceil(testimonials.length / Math.max(itemsPerView, 1));
    if (maxSlides <= 1) {
      setIsTransitioning(false);
      return;
    }
    console.log('Testimonials next slide clicked, current:', currentSlide, 'maxSlides:', maxSlides);
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const maxSlides = Math.ceil(testimonials.length / Math.max(itemsPerView, 1));
    if (maxSlides <= 1) {
      setIsTransitioning(false);
      return;
    }
    console.log('Testimonials prev slide clicked, current:', currentSlide, 'maxSlides:', maxSlides);
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    console.log('Testimonials go to slide:', index);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Auto-play functionality
  useEffect(() => {
    const maxSlides = Math.ceil(testimonials.length / Math.max(itemsPerView, 1));
    if (maxSlides <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [testimonials.length, currentSlide, itemsPerView]);

  const fetchTestimonials = async () => {
    try {
      const url = `${API_ENDPOINTS.GET_PUBLIC_FEEDBACK}?limit=12`;
      console.log('[Testimonials] Fetch URL:', url);
      const response = await apiClient.get(url);
      console.log('[Testimonials] Response:', response.status, response.data);
      const { feedback, averageRating, total } = response.data;
      
      // Transform feedback data to match testimonial format
      const transformedTestimonials = feedback.map(item => ({
        id: item._id,
        name: item.userName,
        course: `${item.course}, ${item.studyYear}`,
        location: item.location,
        rating: item.websiteRating,
        image: item.userImage || `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1494790108755-2616b612b786' : '1507003211169-0a1dd7228f2d'}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
        review: item.review,
        roomType: item.roomType,
        price: `R${item.monthlyRent}/month`
      }));

      // Remove duplicates based on multiple criteria to ensure uniqueness
      const uniqueTestimonials = transformedTestimonials.filter((testimonial, index, self) => 
        index === self.findIndex(t => 
          t.id === testimonial.id || 
          (t.name === testimonial.name && 
           t.review === testimonial.review && 
           t.location === testimonial.location &&
           t.course === testimonial.course)
        )
      );
      
      setTestimonials(uniqueTestimonials);
      setAverageRating(averageRating);
      setTotalCount(total);
    } catch (error) {
      console.error('[Testimonials] Error fetching testimonials:', error);
      console.error('[Testimonials] Error details:', error?.response?.status, error?.response?.data);
      // Fallback to empty array if API fails
      setTestimonials([]);
    } finally {
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

  // Helper to render content clearly (avoids nested ternaries that can confuse parsers)
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
            <p className="text-gray-400 text-base">Loading student testimonials...</p>
          </div>
        </div>
      );
    }

    if (testimonials.length > 0) {
      return (
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${testimonials.length * (100 / Math.max(itemsPerView, 1))}%`
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="px-3 sm:px-4 flex-shrink-0"
                style={{ 
                  flex: `0 0 ${100 / Math.max(itemsPerView, 1)}%`, 
                  minWidth: itemsPerView === 1 ? '280px' : undefined 
                }}
              >
                {/* Enhanced Testimonial Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-2xl p-5 sm:p-6 h-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:from-blue-500/20 hover:to-blue-600/30 hover:border-blue-400/50 group">
                  {/* Quote Icon and Rating */}
                  <div className="flex justify-between items-start mb-5 sm:mb-6">
                    <FiMessageSquare className="text-blue-400 w-6 h-6 sm:w-7 sm:h-7 group-hover:text-blue-300 transition-colors duration-300" />
                    <div className="flex gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed mb-6 sm:mb-7 line-clamp-4 group-hover:text-white transition-colors duration-300">
                    "{testimonial.review}"
                  </p>

                  {/* Enhanced Student Info */}
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-3 border-blue-400/60 shadow-xl group-hover:border-blue-400/80 transition-all duration-300">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-sm sm:text-base mb-2 truncate group-hover:text-blue-100 transition-colors duration-300">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-300 text-xs sm:text-sm mb-1 truncate font-medium">
                        {testimonial.course}
                      </p>
                      <p className="text-blue-300 text-xs sm:text-sm font-semibold truncate">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-20">
        <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No testimonials yet</h3>
        <p className="text-gray-500 text-base mb-6">Be the first to share your experience!</p>
        <a 
          href="/feedback" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
        >
          Share Your Experience
        </a>
      </div>
    );
  };

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Students
              </span> Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto">
              Real reviews from University of Limpopo students who found their perfect accommodation
            </p>
          </div>

          {/* Testimonials Slider - Clean Professional Layout */}
          <div className="w-full relative" data-aos="fade-up" data-aos-delay="200">
            <div className="relative">
              {/* Navigation Buttons - Top Right */}
              <div className="absolute top-0 right-0 z-10 flex gap-2 mb-4">
                <button
                  onClick={prevSlide}
                  disabled={isTransitioning || loading || testimonials.length === 0}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  title="Previous"
                >
                  <FiChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  disabled={isTransitioning || loading || testimonials.length === 0}
                  className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  title="Next"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Slider Container */}
              <div className="px-12 lg:px-16">
                {renderContent()}
                                 {/* Dots Navigation */}
                 {Math.ceil(testimonials.length / 3) > 1 && !loading && (
                   <div className="flex justify-center gap-2 mt-6">
                     {Array.from({ length: Math.ceil(testimonials.length / 3) }, (_, index) => (
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
          </div>

          {/* Overall Rating - Clean Design */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-3">
                {renderStars(Math.round(averageRating))}
                <span className="text-white font-bold text-sm sm:text-base ml-2">
                  {averageRating > 0 ? `${averageRating}/5` : 'No ratings yet'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                {averageRating >= 4.5 ? 'Excellent' : averageRating >= 4 ? 'Very Good' : averageRating >= 3 ? 'Good' : 'Growing'} Student Satisfaction
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm">
                {totalCount > 0 ? `Based on ${totalCount} verified student review${totalCount !== 1 ? 's' : ''}` : 'Share your experience to help other students'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
