import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Profile Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden mr-3 md:mr-4 flex-shrink-0">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.name);
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white text-sm md:text-lg truncate">{testimonial.name}</h4>
            <p className="text-gray-400 text-xs md:text-sm truncate">{testimonial.course}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-3 h-3 md:w-4 md:h-4 ${i < Math.round(testimonial.rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} 
                />
              ))}
              <span className="text-yellow-400 text-xs md:text-sm ml-1">{testimonial.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Comment */}
        <div className="flex-1">
          <p className="text-gray-300 text-xs md:text-sm leading-relaxed">"{testimonial.comment}"</p>
        </div>
      </div>
      
      {/* Location Footer */}
      <div className="px-6 py-3 border-t border-gray-700/50">
        <div className="flex items-center text-xs md:text-sm text-gray-400">
          <span className="truncate">{testimonial.location}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

