import React from 'react';
import { FiPhone, FiStar, FiMapPin, FiClock, FiDollarSign, FiUser } from 'react-icons/fi';

const DriverCard = ({ driver }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      {/* Driver Image and Basic Info */}
      <div className="relative">
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img 
            src={driver.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName || 'Driver')}&background=random`} 
            alt={driver.fullName} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(driver.fullName || 'Driver')}&background=random`;
            }}
          />
        </div>
        
        {/* Rating Badge */}
        <div className="absolute -bottom-4 right-4 bg-white rounded-full shadow-md p-2 flex items-center">
          <FiStar className="text-yellow-400 fill-current mr-1" />
          <span className="font-semibold text-gray-800">{driver.rating?.toFixed(1) || '5.0'}</span>
        </div>
      </div>
      
      {/* Driver Details */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{driver.fullName || 'Driver'}</h3>
        
        {/* Car Info */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <span className="mr-2">{driver.carDetails?.make || 'Car'}</span>
          <span className="text-gray-400">•</span>
          <span className="mx-2">{driver.carDetails?.model || 'Model'}</span>
          <span className="text-gray-400">•</span>
          <span className="ml-2">{driver.carDetails?.year || 'Year'}</span>
        </div>
        
        {/* Contact Info */}
        {driver.phone && (
          <div className="flex items-center text-gray-600 mb-3">
            <FiPhone className="w-4 h-4 mr-2 text-blue-500" />
            <a href={`tel:${driver.phone}`} className="hover:text-blue-600 transition-colors">
              {driver.phone}
            </a>
          </div>
        )}
        
        {/* Location */}
        {driver.location && (
          <div className="flex items-start text-gray-600 mb-4">
            <FiMapPin className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" />
            <span className="text-sm">{driver.location}</span>
          </div>
        )}
        
        {/* Stats */}
        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center">
            <FiUser className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-gray-700">{driver.experience || '2+'} years</span>
          </div>
          <div className="flex items-center">
            <FiClock className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-gray-700">{driver.totalRides || '100+'}+ rides</span>
          </div>
          <div className="flex items-center">
            <FiDollarSign className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-gray-700">R{driver.pricePerKm || '15'}/km</span>
          </div>
          <div className="flex items-center">
            <FiStar className="w-4 h-4 mr-2 text-blue-500" />
            <span className="text-gray-700">{driver.rating?.toFixed(1) || '5.0'}/5</span>
          </div>
        </div>
      </div>
      
      {/* Action Button */}
      <div className="px-5 pb-5">
        <a 
          href={`tel:${driver.phone}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
        >
          Contact Driver
        </a>
      </div>
    </div>
  );
};

export default DriverCard;
