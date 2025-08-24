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
      const token = await getToken();
      const response = await axios.get(`${API_ENDPOINTS.GET_USER_RATING}/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.rating) {
        setUserRating(response.data.rating);
        setRating(response.data.rating.rating);
        setReview(response.data.rating.review || '');
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
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
      const token = await getToken();
      const ratingData = {
        roomId,
        rating,
        review: review.trim()
      };

      const response = await axios.post(API_ENDPOINTS.ADD_RATING, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`
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
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Rate this room</h3>
          {userRating && (
            <button
              onClick={handleDeleteRating}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              Remove Rating
            </button>
          )}
        </div>

        {!showRatingForm && !userRating ? (
          <button
            onClick={handleRatingClick}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Rate this room
          </button>
        ) : (
          <div className="space-y-4">
            {/* Stars */}
            <div className="flex justify-center space-x-2">
              {renderStars()}
            </div>

            {/* Rating Text */}
            <div className="text-center">
              <p className="text-gray-300">
                {rating === 0 && 'Select a rating'}
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Review Text */}
            <div>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Write a review (optional)..."
                className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                rows="3"
                maxLength="500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {review.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitRating}
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : userRating ? 'Update Rating' : 'Submit Rating'}
              </button>
              
              {!userRating && (
                <button
                  onClick={() => setShowRatingForm(false)}
                  className="px-4 py-3 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Show current user rating */}
        {userRating && !showRatingForm && (
          <div className="mt-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={`${
                        star <= userRating.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                  <span className="text-white font-semibold">
                    {userRating.rating}/5
                  </span>
                </div>
                {userRating.review && (
                  <p className="text-gray-300 text-sm">{userRating.review}</p>
                )}
              </div>
              <button
                onClick={() => setShowRatingForm(true)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Edit
              </button>
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
