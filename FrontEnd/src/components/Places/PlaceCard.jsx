import React, { useState, useEffect } from "react";
import { FiWifi, FiMapPin, FiClock, FiEye, FiStar, FiMessageCircle, FiHeart } from "react-icons/fi";
import { MdShower, MdBathtub, MdTableRestaurant, MdBed, MdElectricBolt } from "react-icons/md";
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

const amenitiesIcons = {
  wifi: <FiWifi className="text-blue-400" title="Free WiFi" />,
  shower: <MdShower className="text-green-400" title="Shower" />, 
  bathtub: <MdBathtub className="text-cyan-400" title="Bathtub" />,
  table: <MdTableRestaurant className="text-yellow-400" title="Table" />, 
  bed: <MdBed className="text-purple-400" title="Bed" />,
  electricity: <MdElectricBolt className="text-orange-400" title="Electricity" />, 
};

const amenitiesLabels = {
  wifi: "WiFi",
  shower: "Shower",
  bathtub: "Bathtub",
  table: "Desk",
  bed: "Bed",
  electricity: "Power",
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const PlaceCard = ({
  _id,
  images,
  title,
  description,
  location,
  price,
  minutesAway,
  handleOrderPopup,
  amenities,
  averageRating = 0,
  totalRatings = 0,
  onRateClick,
  onCommentClick
}) => {
  const { user, isSignedIn } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if room is saved when component mounts
  useEffect(() => {
    if (isSignedIn && _id) {
      checkIfSaved();
    }
  }, [isSignedIn, _id]);

  const checkIfSaved = async () => {
    try {
      const token = await user.getToken();
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/saved-rooms/check/${_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSaved(response.data.isSaved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation(); // Prevent card click
    if (!isSignedIn) return;

    setIsLoading(true);
    try {
      const token = await user.getToken();
      
      if (isSaved) {
        // Unsave room
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/api/saved-rooms/unsave/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(false);
      } else {
        // Save room
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/saved-rooms/save`,
          { roomId: _id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 group cursor-pointer overflow-hidden h-full flex flex-col hover:bg-white/15 transition-all duration-300 shadow-xl hover:shadow-2xl"
      onClick={handleOrderPopup}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-full text-sm font-bold border border-white/20">
            <span className="text-blue-400">R{price.toLocaleString()}</span>
            <span className="text-gray-300 text-xs">/mo</span>
          </div>
        </div>

        {/* Save Button - Only show if user is signed in */}
        {isSignedIn && (
          <div className="absolute top-3 left-3">
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 ${
                isSaved
                  ? 'bg-red-500/80 border-red-400/50 text-white hover:bg-red-400/80'
                  : 'bg-black/60 border-white/20 text-white hover:bg-white/20'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <FiHeart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <h3 className="font-bold text-lg text-white mb-3 line-clamp-1 group-hover:text-blue-300 transition-colors duration-200">
          {title}
        </h3>

        {/* Location & Distance */}
        <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-blue-400" />
            <span className="text-white">{capitalizeFirstLetter(location)}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-green-400" />
            <span className="text-white">{minutesAway}min to UL</span>
          </div>
        </div>

        {/* Rating Display */}
        {averageRating > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`${
                    star <= averageRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-400'
                  } text-sm`}
                />
              ))}
            </div>
            <span className="text-white text-sm font-medium">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">
              ({totalRatings} reviews)
            </span>
          </div>
        )}

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(amenities).slice(0, 4).map((amenity) => 
            amenities[amenity] ? (
              <div 
                key={amenity} 
                className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg text-xs border border-white/20 backdrop-blur-sm"
              >
                {amenitiesIcons[amenity]}
                <span className="text-white font-medium">{amenitiesLabels[amenity]}</span>
              </div>
            ) : null
          )}
          {Object.keys(amenities).filter(key => amenities[key]).length > 4 && (
            <div className="flex items-center bg-white/10 px-3 py-2 rounded-lg text-xs border border-white/20 backdrop-blur-sm">
              <span className="text-gray-300 font-medium">
                +{Object.keys(amenities).filter(key => amenities[key]).length - 4} more
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto">
          {/* View Details Button */}
          <button
            onClick={handleOrderPopup}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <FiEye className="text-lg" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
