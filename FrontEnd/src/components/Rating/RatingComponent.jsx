import React, { useState, useEffect, useContext } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FiStar, FiX } from 'react-icons/fi';
import { GlobalContext } from '../GlobalContext';
import LoginPopup from '../LoginPopup/LoginPopup';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const RatingComponent = ({ roomId, onRatingUpdate }) => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Fetch user's existing rating
  useEffect(() => {
    if (isSignedIn && roomId) {
      fetchUserRating();
    }
  }, [isSignedIn, roomId]);

  const fetchUserRating = async () => {
    try {
      console.log('Fetching user rating...');
      const token = await getToken();
      console.log('Token for fetch:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_ENDPOINTS.GET_USER_RATING}/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.data.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating.rating);
        setReview(response.data.rating.review || '');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      console.error('Fetch error response:', error.response?.data);
      console.error('Fetch error status:', error.response?.status);
    }
  };

  const handleRatingClick = () => {
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }
    setShowRatingForm(true);
  };

  const handleSubmitRating = async () => {
    if (!isSignedIn) {
      setShowLoginPopup(true);
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Getting token...');
      const token = await getToken();
      console.log('Token received:', token ? 'Token exists' : 'No token');
      
      const ratingData = {
        roomId,
        rating,
        review: review.trim()
      };

      console.log('Submitting rating data:', ratingData);
      const response = await axios.post(API_ENDPOINTS.ADD_RATING, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setUserRating(response.data.rating);
      setShowRatingForm(false);
      
      // Notify parent component
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!isSignedIn) return;

    try {
      const token = await getToken();
      await axios.delete(`${API_ENDPOINTS.DELETE_RATING}/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserRating(null);
      setRating(0);
      setReview('');
      setShowRatingForm(false);
      
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className="text-2xl transition-colors duration-200 focus:outline-none"
      >
        <FiStar
          className={`${
            star <= (hoverRating || rating)
              ? 'text-yellow-400 fill-current'
              : 'text-gray-400'
          }`}
        />
      </button>
    ));
  };

  return (
    <>
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <FiStar className="text-white text-lg" />
            </div>
            <h3 className="text-xl font-bold text-white">Rate this room</h3>
          </div>
          {userRating && (
            <button
              onClick={handleDeleteRating}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all duration-200"
            >
              Remove Rating
            </button>
          )}
        </div>

        {!showRatingForm && !userRating ? (
          <div className="text-center">
            <button
              onClick={handleRatingClick}
              className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <FiStar className="text-xl" />
              Rate this room
            </button>
            <p className="text-gray-400 text-sm mt-3">Share your experience with other students</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Rating Stars Section */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3 text-center">How would you rate this room?</h4>
              <div className="flex justify-center space-x-3 mb-4">
                {renderStars()}
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  {rating === 0 && 'Select a rating'}
                  {rating === 1 && '⭐ Poor'}
                  {rating === 2 && '⭐⭐ Fair'}
                  {rating === 3 && '⭐⭐⭐ Good'}
                  {rating === 4 && '⭐⭐⭐⭐ Very Good'}
                  {rating === 5 && '⭐⭐⭐⭐⭐ Excellent'}
                </p>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-white font-semibold mb-3">Write a review (optional)</h4>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience about this room... What did you like or dislike?"
                className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200"
                rows="4"
                maxLength="500"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">
                  {review.length}/500 characters
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <span>💡 Tip: Be helpful and honest</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitRating}
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiStar className="text-lg" />
                    {userRating ? 'Update Rating' : 'Submit Rating'}
                  </>
                )}
              </button>
              
              {!userRating && (
                <button
                  onClick={() => setShowRatingForm(false)}
                  className="px-6 py-4 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show current user rating */}
        {userRating && !showRatingForm && (
          <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={userRating.userImage || user?.imageUrl || '/default-avatar.png'}
                  alt={userRating.userName || user?.firstName || 'User'}
                  className="w-12 h-12 rounded-full border-2 border-white/20 object-cover"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userRating.userName || 'User')}&background=3b82f6&color=fff&size=48`;
                  }}
                />
              </div>
              
              {/* Rating Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h5 className="text-white font-semibold">
                      {userRating.userName || user?.firstName || 'You'}
                    </h5>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={16}
                          className={`${
                            star <= userRating.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                      <span className="text-white font-semibold ml-1">
                        {userRating.rating}/5
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRatingForm(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-500/10 transition-all duration-200"
                  >
                    Edit
                  </button>
                </div>
                {userRating.review && (
                  <p className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-lg p-3 border border-white/10">
                    "{userRating.review}"
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(userRating.createdAt || Date.now()).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Login Popup */}
      <LoginPopup
        isOpen={showLoginPopup}
        onClose={() => setShowLoginPopup(false)}
        action="rate"
      />
    </>
  );
};

export default RatingComponent;
