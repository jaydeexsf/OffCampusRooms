import React, { useState, useEffect, useRef } from 'react';
import Slider from "react-slick";
import { FiStar, FiMessageSquare, FiLoader, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const url = `${API_ENDPOINTS.GET_PUBLIC_FEEDBACK}?limit=12`;
      console.log('[Testimonials] Fetch URL:', url);
      const response = await axios.get(url);
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

  // Fixed slider settings for consistent behavior
  const settings = {
    dots: true,
    arrows: false,
    infinite: testimonials.length > 3,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: testimonials.length > 3,
    autoplaySpeed: 5000,
    centerMode: false,
    centerPadding: '0px',
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: '0px',
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: '0px',
        },
      },
    ],
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

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Students
              </span> Say
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real reviews from University of Limpopo students who found their perfect accommodation
            </p>
          </div>

          {/* Testimonials Slider - Clean Professional Layout */}
          <div className="w-full relative" data-aos="fade-up" data-aos-delay="200">
            <div className="relative">
              {/* Left Navigation Arrow */}
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 
                           bg-black/80 backdrop-blur-sm border border-white/20 
                           rounded-full p-3 text-white shadow-lg opacity-0 lg:opacity-100
                           hover:bg-black/90 transition-all duration-200"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              {/* Right Navigation Arrow */}
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 
                           bg-black/80 backdrop-blur-sm border border-white/20 
                           rounded-full p-3 text-white shadow-lg opacity-0 lg:opacity-100
                           hover:bg-black/90 transition-all duration-200"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Container */}
              <div className="px-12 lg:px-16">
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                      <p className="text-gray-400 text-base">Loading student testimonials...</p>
                    </div>
                  </div>
                ) : testimonials.length > 0 ? (
                  <Slider ref={sliderRef} {...settings} className="testimonials-slider">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="px-4">
                        {/* Testimonial Card - Clean and Simple */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-800/70">
                          {/* Quote Icon and Rating */}
                          <div className="flex justify-between items-start mb-6">
                            <FiMessageSquare className="text-blue-400 w-6 h-6" />
                            <div className="flex gap-1">
                              {renderStars(testimonial.rating)}
                            </div>
                          </div>

                          {/* Review Text */}
                          <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-4">
                            "{testimonial.review}"
                          </p>

                          {/* Student Info - Simplified */}
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/50">
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
                              <h4 className="text-white font-semibold text-sm mb-1 truncate">
                                {testimonial.name}
                              </h4>
                              <p className="text-gray-400 text-xs mb-1 truncate">
                                {testimonial.course}
                              </p>
                              <p className="text-blue-400 text-xs font-medium truncate">
                                {testimonial.location}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Slider>
                ) : (
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
