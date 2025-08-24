import React, { useState, useEffect } from 'react';
import { FiStar, FiEye, FiEdit3, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import RatingViewModal from './RatingViewModal';
import RatingFormModal from './RatingFormModal';

const RoomRatingActions = ({ roomId, roomTitle, className = '' }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      fetchRatingsSummary();
    }
  }, [roomId]);

  const fetchRatingsSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.GET_ROOM_RATINGS}/${roomId}`);
      setAverageRating(response.data.averageRating || 0);
      setTotalRatings(response.data.totalRatings || 0);
    } catch (error) {
      console.error('Error fetching ratings summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingUpdate = () => {
    fetchRatingsSummary();
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={14}
        className={`${
          star <= Math.round(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <>
      <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
        {/* Rating Summary */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {loading ? (
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gray-600 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                renderStars(averageRating)
              )}
            </div>
            {!loading && (
              <>
                <span className="text-white font-semibold text-sm">
                  {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
                </span>
                <span className="text-gray-400 text-xs">
                  ({totalRatings} review{totalRatings !== 1 ? 's' : ''})
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-1">
          {/* View Ratings Button - Only show if there are reviews */}
          {totalRatings > 0 && (
            <button
              onClick={() => setShowViewModal(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] backdrop-blur-sm border border-blue-500/30"
            >
              <FiEye size={16} />
              <span className="hidden sm:inline">View Reviews</span>
              <span className="sm:hidden">Reviews</span>
            </button>
          )}

          {/* Rate Room Button */}
          <button
            onClick={() => setShowRateModal(true)}
            className={`${totalRatings > 0 ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] backdrop-blur-sm border border-purple-500/30`}
          >
            <FiStar size={16} />
            <span className="hidden sm:inline">Rate Room</span>
            <span className="sm:hidden">Rate</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <RatingViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        roomId={roomId}
        roomTitle={roomTitle}
      />

      <RatingFormModal
        isOpen={showRateModal}
        onClose={() => setShowRateModal(false)}
        roomId={roomId}
        roomTitle={roomTitle}
        onRatingUpdate={handleRatingUpdate}
      />
    </>
  );
};

export default RoomRatingActions;
