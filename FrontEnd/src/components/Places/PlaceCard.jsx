import React, { useState, useEffect } from "react";
import { FiWifi, FiMapPin, FiClock, FiEye, FiStar, FiMessageCircle, FiHeart } from "react-icons/fi";
import { MdShower, MdBathtub, MdTableRestaurant, MdBed, MdElectricBolt } from "react-icons/md";
import { useUser, useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

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
  const { getToken } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if room is saved when component mounts
  useEffect(() => {
    if (isSignedIn && _id && user) {
      checkIfSaved();
    }
  }, [isSignedIn, _id, user]);

  const checkIfSaved = async () => {
    try {
      if (!user || !isSignedIn) return;
      
      // Wait a bit for user to be fully loaded
      if (!getToken) {
        setTimeout(checkIfSaved, 100);
        return;
      }
      
      const token = await getToken();
      if (!token) return;
      
      const response = await axios.get(
        `${API_ENDPOINTS.CHECK_SAVED_ROOM}/${_id}`,
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
    if (!isSignedIn || !user) return;

    setIsLoading(true);
    try {
      // Wait for user to be fully loaded
      if (!getToken) {
        setIsLoading(false);
        return;
      }
      
      const token = await getToken();
      if (!token) {
        console.error('Unable to get authentication token');
        setIsLoading(false);
        return;
      }
      
      if (isSaved) {
        // Unsave room
        console.log('[SaveRoom] Unsave URL:', `${API_ENDPOINTS.UNSAVE_ROOM}/${_id}`);
        await axios.delete(
          `${API_ENDPOINTS.UNSAVE_ROOM}/${_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsSaved(false);
      } else {
        // Save room
        console.log('[SaveRoom] Save URL:', API_ENDPOINTS.SAVE_ROOM, 'payload:', { roomId: _id });
        await axios.post(
          API_ENDPOINTS.SAVE_ROOM,
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
      console.error('[SaveRoom] Error details:', error?.response?.status, error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="group cursor-pointer h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.09] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      onClick={handleOrderPopup}
    >
      {/* Image (edge-to-edge) */}
      <div className="relative -mx-5 -mt-5 mb-5 overflow-hidden">
        <img
          src={images[0]}
          alt={title}
          className="block h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-64 md:h-60"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/0" />

        {/* Price Badge */}
        <div className="absolute right-3 top-3">
          <div className="rounded-full border border-white/20 bg-slate-950/80 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
            <span className="text-blue-400">R{price.toLocaleString()}</span>
            <span className="ml-1 text-xs text-gray-300">/mo</span>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="text-base font-semibold text-white sm:text-lg line-clamp-2 drop-shadow-md">
            {title}
          </h3>
        </div>

        {/* Save Button - Only show if user is signed in */}
        {isSignedIn && (
          <div className="absolute left-3 top-3">
            <button
              onClick={handleSaveToggle}
              disabled={isLoading}
              className={`rounded-full border px-2.5 py-2 text-white backdrop-blur-md transition-all duration-200 ${
                isSaved
                  ? 'border-red-400/50 bg-red-500/80 hover:bg-red-400/80'
                  : 'border-white/20 bg-black/60 hover:bg-white/20'
              } ${isLoading ? 'cursor-not-allowed opacity-50' : 'hover:scale-[1.03]'}`}
            >
              <FiHeart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        {/* Accessible title for screen readers */}
        <h3 className="sr-only">{title}</h3>

        {/* Location & Distance */}
        <div className="mb-3 flex items-center gap-3 text-sm text-gray-300">
          <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
            <FiMapPin className="text-blue-400" />
            <span className="text-white">{capitalizeFirstLetter(location)}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1">
            <FiClock className="text-green-400" />
            <span className="text-white">{minutesAway} min to UL</span>
          </div>
        </div>

        {/* Rating Display */}
        {averageRating > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`${
                    star <= averageRating ? 'text-yellow-400 fill-current' : 'text-gray-500'
                  } text-[15px]`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-white">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({totalRatings} reviews)</span>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.keys(amenities)
            .slice(0, 4)
            .map((amenity) =>
              amenities[amenity] ? (
                <div
                  key={amenity}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs backdrop-blur-sm"
                >
                  {amenitiesIcons[amenity]}
                  <span className="font-medium text-white">{amenitiesLabels[amenity]}</span>
                </div>
              ) : null
            )}
          {Object.keys(amenities).filter((key) => amenities[key]).length > 4 && (
            <div className="inline-flex items-center rounded-lg border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-gray-300 backdrop-blur-sm">
              +{Object.keys(amenities).filter((key) => amenities[key]).length - 4} more
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <button
            onClick={handleOrderPopup}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-900/30 transition-all duration-200 hover:from-blue-500 hover:to-blue-400 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60"
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
