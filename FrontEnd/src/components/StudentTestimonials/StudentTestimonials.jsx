import React from 'react';
import Slider from "react-slick";
import { FiStar, FiMessageSquare } from 'react-icons/fi';

const StudentTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Mokoena",
      course: "Computer Science, 3rd Year",
      location: "Gate 1",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "Found my perfect room through StudentRooms! The location is ideal - just 5 minutes walk to campus. The room is clean, well-maintained, and the landlord is very responsive. Highly recommend!",
      roomType: "Single Room",
      price: "R2,200/month"
    },
    {
      id: 2,
      name: "David Nkosi",
      course: "Engineering, 2nd Year",
      location: "Gate 2",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "The search process was so easy! I found a great room with all the amenities I needed. The platform is user-friendly and the support team helped me with everything. Great experience overall.",
      roomType: "Shared Room",
      price: "R1,800/month"
    },
    {
      id: 3,
      name: "Amanda Dlamini",
      course: "Business Management, 4th Year",
      location: "Gate 3",
      rating: 4,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "I've been using StudentRooms for 2 years now. The rooms are always as described and the verification process gives me peace of mind. Perfect for students!",
      roomType: "Studio",
      price: "R2,800/month"
    },
    {
      id: 4,
      name: "Thabo Molefe",
      course: "Medicine, 1st Year",
      location: "Ga-motintane",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "As a first-year student, I was worried about finding accommodation. StudentRooms made it so simple! Found an affordable room close to campus with great facilities.",
      roomType: "Single Room",
      price: "R1,600/month"
    },
    {
      id: 5,
      name: "Zinhle Khumalo",
      course: "Law, 3rd Year",
      location: "Gate 1",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "The best student accommodation platform! I love how easy it is to filter by location and price. My room is perfect and the community is great. Thank you StudentRooms!",
      roomType: "Shared Room",
      price: "R2,000/month"
    },
    {
      id: 6,
      name: "Lungile Zulu",
      course: "Education, 2nd Year",
      location: "Gate 2",
      rating: 4,
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      review: "Found my accommodation quickly and easily. The room is clean, safe, and affordable. The landlord is very helpful and the location is perfect for my studies.",
      roomType: "Single Room",
      price: "R2,100/month"
    }
  ];

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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Students
              </span> Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Real reviews from University of Limpopo students who found their perfect accommodation
            </p>
          </div>

          {/* Testimonials Slider */}
          <div className="max-w-5xl mx-auto" data-aos="fade-up" data-aos-delay="200">
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
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      "{testimonial.review}"
                    </p>

                    {/* Student Info */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-sm">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 text-xs">
                          {testimonial.course}
                        </p>
                        <p className="text-blue-400 text-xs font-medium">
                          {testimonial.location} • {testimonial.roomType} • {testimonial.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Overall Rating */}
          <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                {renderStars(5)}
                <span className="text-white font-bold text-lg ml-2">4.9/5</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Excellent Student Satisfaction
              </h3>
              <p className="text-gray-300 text-sm">
                Based on {testimonials.length}+ verified student reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentTestimonials;
