import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { FiStar, FiMessageSquare, FiLoader } from 'react-icons/fi';
import axios from 'axios';

const StudentTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/feedback/public?limit=12`);
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
      
      setTestimonials(transformedTestimonials);
      setAverageRating(averageRating);
      setTotalCount(total);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Fallback to empty array if API fails
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Students
              </span> Say
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Real reviews from University of Limpopo students who found their perfect accommodation
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <FiLoader className="w-8 h-8 text-blue-400 animate-spin" />
                  <p className="text-gray-400 text-sm md:text-base">Loading student testimonials...</p>
                </div>
              </div>
            ) : testimonials.length > 0 ? (
              <Slider {...settings}>
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="px-4">
                    <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full">
                      {/* Quote Icon */}
                      <div className="flex justify-between items-start mb-4">
                        <FiMessageSquare className="text-blue-400 w-6 h-6" />
                        <div className="flex gap-1">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6">
                        "{testimonial.review}"
                      </p>

                      {/* Student Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`;
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-xs md:text-sm">
                            {testimonial.name}
                          </h4>
                          <p className="text-gray-400 text-xs md:text-sm">
                            {testimonial.course}
                          </p>
                          <p className="text-blue-400 text-xs md:text-sm font-medium">
                            {testimonial.location} • {testimonial.roomType} • {testimonial.price}
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
                <h3 className="text-lg md:text-xl font-semibold text-gray-400 mb-2">No testimonials yet</h3>
                <p className="text-gray-500 text-sm md:text-base mb-6">Be the first to share your experience!</p>
                <a 
                  href="/feedback" 
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Share Your Experience
                </a>
              </div>
            )}
          </div>

          {/* Overall Rating */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                {renderStars(Math.round(averageRating))}
                <span className="text-white font-bold text-base md:text-lg ml-2">
                  {averageRating > 0 ? `${averageRating}/5` : 'No ratings yet'}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                {averageRating >= 4.5 ? 'Excellent' : averageRating >= 4 ? 'Very Good' : averageRating >= 3 ? 'Good' : 'Growing'} Student Satisfaction
              </h3>
              <p className="text-gray-300 text-xs md:text-sm">
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
