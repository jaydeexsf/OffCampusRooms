import React, { useState, useEffect } from 'react';
import { FiStar, FiEye, FiEdit3, FiUsers, FiTrendingUp } from 'react-icons/fi';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import RatingViewModal from './RatingViewModal';
import RatingFormModal from './RatingFormModal';

const ProfessionalRatingSystem = ({ roomId, roomTitle, showFullInterface = true, compact = false }) => {
  const { isSignedIn } = useAuth();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [userRating, setUserRating] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      fetchRatingsSummary();
      if (isSignedIn) {
        fetchUserRating();
      }
    }
  }, [roomId, isSignedIn]);

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

  const fetchUserRating = async () => {
    if (!isSignedIn) return;
    
    try {
      const token = await useAuth().getToken();
      const response = await axios.get(`${API_ENDPOINTS.GET_USER_RATING}/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setUserRating(response.data.rating);
    } catch (error) {
      console.error('Error fetching user rating:', error);
    }
  };

  const handleRatingUpdate = () => {
    fetchRatingsSummary();
    fetchUserRating();
  };

  const renderStars = (rating, size = 16) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FiStar
        key={star}
        size={size}
        className={`${
          star <= Math.round(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-400'
        }`}
      />
    ));
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4) return 'text-green-500';
    if (rating >= 3) return 'text-yellow-400';
    if (rating >= 2) return 'text-orange-400';
    return 'text-red-400';
  };

  const getRatingLabel = (rating) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4) return 'Very Good';
    if (rating >= 3) return 'Good';
    if (rating >= 2) return 'Fair';
    if (rating >= 1) return 'Poor';
    return 'No ratings';
  };

  if (compact) {
    return (
      <>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {loading ? (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-3 h-3 bg-gray-600 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              renderStars(averageRating, 14)
            )}
          </div>
          {!loading && (
            <>
              <span className={`font-semibold text-sm ${getRatingColor(averageRating)}`}>
                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
              </span>
              <span className="text-gray-400 text-xs">
                ({totalRatings})
              </span>
            </>
          )}
          <button
            onClick={() => setShowViewModal(true)}
            className="text-blue-400 hover:text-blue-300 text-xs underline ml-2"
          >
            View
          </button>
        </div>

        <RatingViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          roomId={roomId}
          roomTitle={roomTitle}
        />
      </>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <FiStar className="text-white text-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Room Rating</h3>
              <p className="text-gray-400 text-sm">Student reviews & ratings</p>
            </div>
          </div>
          
          {userRating && (
            <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-1">
              <FiStar className="text-blue-400" size={14} />
              <span className="text-blue-400 text-sm font-medium">You rated: {userRating.rating}/5</span>
            </div>
          )}
        </div>

        {/* Rating Summary */}
        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-1 ${getRatingColor(averageRating)}`}>
                  {loading ? (
                    <div className="w-16 h-10 bg-gray-600 rounded animate-pulse"></div>
                  ) : (
                    averageRating > 0 ? averageRating.toFixed(1) : 'N/A'
                  )}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {loading ? (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-4 h-4 bg-gray-600 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    renderStars(averageRating, 18)
                  )}
                </div>
                <p className={`text-sm font-medium ${getRatingColor(averageRating)}`}>
                  {getRatingLabel(averageRating)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <FiUsers className="text-gray-400" size={16} />
                <span className="text-white font-semibold">
                  {loading ? (
                    <div className="w-12 h-4 bg-gray-600 rounded animate-pulse"></div>
                  ) : (
                    totalRatings
                  )}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Total review{totalRatings !== 1 ? 's' : ''}
              </p>
              
              {totalRatings > 0 && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <FiTrendingUp size={12} />
                  <span>Recent activity</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowViewModal(true)}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] backdrop-blur-sm border border-blue-500/30"
          >
            <FiEye size={18} />
            <span>View All Reviews</span>
            {totalRatings > 0 && (
              <span className="bg-blue-400/20 text-blue-100 text-xs px-2 py-1 rounded-full">
                {totalRatings}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowRateModal(true)}
            className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600/80 to-purple-500/80 hover:from-purple-600 hover:to-purple-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] backdrop-blur-sm border border-purple-500/30"
          >
            <FiEdit3 size={18} />
            <span>{userRating ? 'Update Rating' : 'Rate This Room'}</span>
          </button>
        </div>

        {/* Quick Stats */}
        {totalRatings > 0 && !loading && (
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Verified reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Student community</span>
              </div>
            </div>
          </div>
        )}
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

export default ProfessionalRatingSystem;
