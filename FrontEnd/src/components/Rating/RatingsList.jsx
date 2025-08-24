import React, { useState, useEffect } from 'react';
import { FiStar, FiUser, FiMessageCircle } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const RatingsList = ({ roomId }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomId) {
      fetchRatings();
    }
  }, [roomId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_ENDPOINTS.GET_ROOM_RATINGS}/${roomId}`);
      setRatings(response.data.ratings || []);
      setAverageRating(response.data.averageRating || 0);
      setTotalRatings(response.data.totalRatings || 0);
      setError(null);
    } catch (error) {
      console.error('Error fetching ratings:', error);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={16}
        className={`${
          star <= rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="animate-pulse">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/20 rounded mb-2"></div>
                  <div className="h-3 bg-white/20 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 shadow-2xl">
        <div className="text-center">
          <FiMessageCircle className="text-red-400 text-3xl mx-auto mb-3" />
          <p className="text-red-300 font-medium">{error}</p>
          <button
            onClick={fetchRatings}
            className="mt-3 text-red-400 hover:text-red-300 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      {/* Header with Average Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <FiStar className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Student Reviews</h3>
            <p className="text-gray-400 text-sm">{totalRatings} review{totalRatings !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {totalRatings > 0 && (
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-gray-400 text-sm">Average rating</p>
          </div>
        )}
      </div>

      {/* Ratings List */}
      {totalRatings === 0 ? (
        <div className="text-center py-12">
          <FiMessageCircle className="text-gray-400 text-4xl mx-auto mb-4" />
          <h4 className="text-white font-semibold mb-2">No reviews yet</h4>
          <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {ratings.map((rating, index) => (
            <div
              key={rating._id || index}
              className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <img
                    src={rating.userImage || '/default-avatar.png'}
                    alt={rating.userName || 'User'}
                    className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.userName || 'User')}&background=3b82f6&color=fff&size=48`;
                    }}
                  />
                </div>
                
                {/* Rating Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h5 className="text-white font-semibold">
                        {rating.userName || 'Anonymous Student'}
                      </h5>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.rating)}
                        <span className="text-white font-medium ml-1">
                          {rating.rating}/5
                        </span>
                        <span className="text-gray-400 text-sm ml-2">
                          • {getRatingText(rating.rating)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {formatDate(rating.createdAt)}
                    </span>
                  </div>
                  
                  {rating.review && (
                    <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-3 border border-white/10">
                      "{rating.review}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};

export default RatingsList;
