import React from 'react';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 flex-shrink-0">
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
          <div>
            <h4 className="font-semibold text-lg">{testimonial.name}</h4>
            <p className="text-gray-600 text-sm">{testimonial.course}</p>
            <div className="flex items-center mt-1">
              {[...Array(5)].map((_, i) => (
                <FiStar 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.round(testimonial.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        <p className="text-gray-700 flex-1">"{testimonial.comment}"</p>
      </div>
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-500">
          <span className="truncate">{testimonial.location}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
