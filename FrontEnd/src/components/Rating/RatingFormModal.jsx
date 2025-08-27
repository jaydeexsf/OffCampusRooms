import React, { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { FiStar, FiX, FiUser, FiEdit3, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import LoginPopup from '../LoginPopup/LoginPopup';

const RatingFormModal = ({ isOpen, onClose, roomId, roomTitle, onRatingUpdate, embedded = false }) => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [userRating, setUserRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen && isSignedIn && roomId) {
      fetchUserRating();
    } else if (isOpen && !isSignedIn) {
      // Reset form for non-signed-in users
      setRating(0);
      setReview('');
      setUserRating(null);
      setIsEditing(false);
    }
  }, [isOpen, isSignedIn, roomId]);

  const fetchUserRating = async () => {
    try {
      const token = await getToken();
      console.log('[Rating] GET_USER_RATING URL:', `${API_ENDPOINTS.GET_USER_RATING}/${roomId}`);
      console.log('[Rating] Auth token present:', Boolean(token));
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
        setIsEditing(false);
      } else {
        setUserRating(null);
        setRating(0);
        setReview('');
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching user rating:', error);
      console.error('[Rating] Error details:', error?.response?.status, error?.response?.data);
      setUserRating(null);
      setIsEditing(true);
    }
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
      console.log('[Rating] ADD_RATING URL:', API_ENDPOINTS.ADD_RATING);
      console.log('[Rating] Auth token present:', Boolean(token));
      const ratingData = {
        roomId,
        rating,
        review: review.trim()
      };

      const response = await axios.post(API_ENDPOINTS.ADD_RATING, ratingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setUserRating(response.data.rating);
      setIsEditing(false);
      
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      console.error('[Rating] Submit error details:', error?.response?.status, error?.response?.data);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRating = async () => {
    if (!isSignedIn || !userRating) return;

    if (!confirm('Are you sure you want to delete your rating?')) return;

    try {
      const token = await getToken();
      console.log('[Rating] DELETE_RATING URL:', `${API_ENDPOINTS.DELETE_RATING}/${roomId}`);
      await axios.delete(`${API_ENDPOINTS.DELETE_RATING}/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserRating(null);
      setRating(0);
      setReview('');
      setIsEditing(true);
      
      if (onRatingUpdate) {
        onRatingUpdate();
      }
    } catch (error) {
      console.error('Error deleting rating:', error);
      alert('Failed to delete rating. Please try again.');
    }
  };

  const handleClose = () => {
    if (!isEditing && userRating) {
      // Reset to original values if not editing
      setRating(userRating.rating);
      setReview(userRating.review || '');
    }
    onClose();
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => setRating(star)}
        onMouseEnter={() => setHoverRating(star)}
        onMouseLeave={() => setHoverRating(0)}
        className="text-4xl transition-all duration-200 focus:outline-none hover:scale-110"
        disabled={!isEditing}
      >
        <FiStar
          className={`${
            star <= (hoverRating || rating)
              ? 'text-yellow-400 fill-current drop-shadow-lg'
              : 'text-gray-400'
          } ${isEditing ? 'hover:text-yellow-300' : ''}`}
        />
      </button>
    ));
  };

  const getRatingText = (ratingValue) => {
    switch (ratingValue) {
      case 1: return { text: 'Poor', emoji: '😞', color: 'text-red-400' };
      case 2: return { text: 'Fair', emoji: '😐', color: 'text-orange-400' };
      case 3: return { text: 'Good', emoji: '🙂', color: 'text-yellow-400' };
      case 4: return { text: 'Very Good', emoji: '😊', color: 'text-green-400' };
      case 5: return { text: 'Excellent', emoji: '🤩', color: 'text-green-500' };
      default: return { text: 'Select a rating', emoji: '⭐', color: 'text-gray-400' };
    }
  };

  if (!isOpen) return null;

  const ratingInfo = getRatingText(rating);

  if (embedded) {
    return (
      <>
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl w-full h-full overflow-hidden shadow-xl flex flex-col">
          {/* Header */}
          {/* <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                {userRating && !isEditing ? 'Your Review' : 'Rate This Room fgf'}
              </h2>
              <p className="text-purple-100 text-sm">{roomTitle}</p>
            </div>
          </div> */}

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {!isSignedIn ? (
              <div className="text-center py-8">
                <FiUser className="text-gray-400 text-4xl mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Sign in to rate this room</h3>
                <p className="text-gray-400 mb-4 text-sm">Share your experience with other students</p>
                <button
                  onClick={() => setShowLoginPopup(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform text-sm"
                >
                  Sign In to Rate
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-3 text-sm">How would you rate this room?</h3>
                  <div className="flex justify-center gap-2 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-all duration-200 transform hover:scale-110"
                      >
                        <FiStar
                          size={28}
                          className={`${
                            star <= (hoverRating || rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          } transition-colors duration-200`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <div className={`text-center ${ratingInfo.color} font-medium text-sm`}>
                      <span className="mr-2">{ratingInfo.emoji}</span>
                      {ratingInfo.text}
                    </div>
                  )}
                </div>

                {/* Review Text */}
                <div>
                  <label className="block text-white font-medium mb-2 text-sm">
                    Share your experience (optional)
                  </label>
                  <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Tell other students about your experience with this room..."
                    className="w-full bg-gray-800 border border-gray-600 rounded-xl p-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none text-sm"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {review.length}/500 characters
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0 || isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    `${userRating ? 'Update' : 'Submit'} Rating`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login Popup */}
        <LoginPopup 
          isOpen={showLoginPopup} 
          onClose={() => setShowLoginPopup(false)} 
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <FiX size={24} />
            </button>
            
            <div className="pr-12">
              <h2 className="text-2xl font-bold text-white mb-2">
                {userRating && !isEditing ? 'Your Review' : 'Rate This Room'}
              </h2>
              <p className="text-purple-100">{roomTitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {!isSignedIn ? (
              <div className="text-center py-12">
                <FiUser className="text-gray-400 text-5xl mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Sign in to rate this room</h3>
                <p className="text-gray-400 mb-6">Share your experience with other students</p>
                <button
                  onClick={() => setShowLoginPopup(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Sign In to Rate
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Existing Rating Display */}
                {userRating && !isEditing && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={user?.imageUrl || '/default-avatar.png'}
                        alt={user?.firstName || 'User'}
                        className="w-16 h-16 rounded-full border-2 border-blue-500/30 object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}&background=6366f1&color=fff&size=64`;
                        }}
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold text-lg">
                            {user?.firstName || 'You'}
                          </h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setIsEditing(true)}
                              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-blue-500/10 transition-all duration-200"
                            >
                              <FiEdit3 size={16} />
                              Edit
                            </button>
                            <button
                              onClick={handleDeleteRating}
                              className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                            >
                              <FiTrash2 size={16} />
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FiStar
                                key={star}
                                size={20}
                                className={`${
                                  star <= userRating.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-white font-semibold text-lg">
                            {userRating.rating}/5
                          </span>
                          <span className={`font-medium ${getRatingText(userRating.rating).color}`}>
                            {getRatingText(userRating.rating).text}
                          </span>
                        </div>
                        
                        {userRating.review && (
                          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                            <p className="text-gray-200 leading-relaxed">
                              "{userRating.review}"
                            </p>
                          </div>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-3">
                          Reviewed on {new Date(userRating.createdAt || Date.now()).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Rating Form */}
                {isEditing && (
                  <>
                    {/* Rating Stars */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 text-center">
                      <h3 className="text-white font-semibold text-xl mb-4">
                        How would you rate this room?
                      </h3>
                      
                      <div className="flex justify-center space-x-2 mb-6">
                        {renderStars()}
                      </div>
                      
                      <div className="text-center">
                        <div className={`text-2xl mb-2`}>
                          {ratingInfo.emoji}
                        </div>
                        <p className={`text-xl font-semibold ${ratingInfo.color}`}>
                          {ratingInfo.text}
                        </p>
                        {rating > 0 && (
                          <p className="text-gray-400 text-sm mt-2">
                            {rating}/5 stars
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Review Section */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6">
                      <h4 className="text-white font-semibold text-lg mb-4">
                        Share your experience <span className="text-gray-400 text-sm font-normal">(optional)</span>
                      </h4>
                      
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        placeholder="What did you like or dislike about this room? Your review helps other students make informed decisions..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all duration-200 min-h-[120px]"
                        maxLength="500"
                      />
                      
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-gray-400">
                          {review.length}/500 characters
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>💡</span>
                          <span>Be helpful and honest</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <button
                        onClick={handleSubmitRating}
                        disabled={isSubmitting || rating === 0}
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-3"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <FiStar className="text-xl" />
                            {userRating ? 'Update Rating' : 'Submit Rating'}
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          if (userRating) {
                            setIsEditing(false);
                            setRating(userRating.rating);
                            setReview(userRating.review || '');
                          } else {
                            handleClose();
                          }
                        }}
                        className="px-6 py-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-xl transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
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

export default RatingFormModal;
