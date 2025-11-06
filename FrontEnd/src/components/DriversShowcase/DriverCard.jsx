import React from 'react';
import { FiStar, FiEye, FiUser } from 'react-icons/fi';

const DriverCard = ({ driver, onDriverClick }) => {
  return (
    <div className="h-full flex flex-col cursor-pointer" onClick={() => onDriverClick && onDriverClick(driver)}>
      {/* Driver Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={driver.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName || 'Driver')}&background=random`} 
          alt={driver.fullName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName || 'Driver')}&background=random`;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-blue-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
            <div className="flex items-center">
              <FiStar className="text-yellow-400 fill-current mr-1 w-3 h-3" />
              <span className="text-white text-xs font-medium">{driver.rating?.toFixed(1) || '5.0'}</span>
            </div>
          </div>
        </div>
        
        {/* Driver Name */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg md:text-xl font-bold text-white mb-1">{driver.fullName || 'Driver'}</h3>
          <p className="text-gray-300 text-xs md:text-sm">{driver.experience || '2+'} years experience</p>
        </div>
      </div>
      
      {/* Driver Details */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Car Info */}
        <div className="flex items-center gap-2 mb-4">
          <FiUser className="text-blue-400 w-4 h-4" />
          <span className="text-white font-bold text-sm md:text-base">{driver.carDetails?.year || '2020'} {driver.carDetails?.make || 'Toyota'}</span>
        </div>
        
        {/* Stats */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-xs md:text-sm">{driver.totalRides || '156'} rides</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-xs md:text-sm">R{driver.pricePerKm || '15'}/km</span>
          </div>
          {driver.location && (
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
              <span className="text-gray-300 text-xs md:text-sm truncate">{driver.location}</span>
            </div>
          )}
        </div>
        
        {/* View Details Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDriverClick && onDriverClick(driver);
          }}
          className="w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 sm:py-3 sm:px-5 rounded-lg transition-all duration-200 text-xs sm:text-sm group shadow-md hover:shadow-lg active:scale-95"
        >
          <FiEye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default DriverCard;
