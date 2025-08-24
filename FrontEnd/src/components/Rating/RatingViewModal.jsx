import React, { useState, useEffect } from 'react';
import { FiStar, FiX, FiUser, FiMessageCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const RatingViewModal = ({ isOpen, onClose, roomId, roomTitle }) => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ratingsPerPage = 5;

  useEffect(() => {
    if (isOpen && roomId) {
      fetchRatings();
    }
  }, [isOpen, roomId]);

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
            : 'text-gray-300'
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

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    return distribution;
  };

  // Pagination
  const indexOfLastRating = currentPage * ratingsPerPage;
  const indexOfFirstRating = indexOfLastRating - ratingsPerPage;
  const currentRatings = ratings.slice(indexOfFirstRating, indexOfLastRating);
  const totalPages = Math.ceil(ratings.length / ratingsPerPage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors p-2 hover:bg-white/10 rounded-full"
          >
            <FiX size={24} />
          </button>
          
          <div className="pr-12">
            <h2 className="text-2xl font-bold text-white mb-2">Student Reviews</h2>
            <p className="text-blue-100">{roomTitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex gap-4 p-4 bg-gray-800 rounded-xl">
                    <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-700 rounded mb-2 w-1/3"></div>
                      <div className="h-3 bg-gray-700 rounded mb-2 w-1/4"></div>
                      <div className="h-16 bg-gray-700 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <FiMessageCircle className="text-red-400 text-4xl mx-auto mb-4" />
              <p className="text-red-300 font-medium mb-4">{error}</p>
              <button
                onClick={fetchRatings}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 mb-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Average Rating */}
                  <div className="text-center lg:text-left">
                    <div className="text-5xl font-bold text-white mb-2">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-1 mb-2">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <p className="text-gray-300">
                      Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  {totalRatings > 0 && (
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-3">Rating Distribution</h4>
                      {Object.entries(getRatingDistribution()).reverse().map(([stars, count]) => (
                        <div key={stars} className="flex items-center gap-3 mb-2">
                          <span className="text-gray-300 text-sm w-8">{stars}★</span>
                          <div className="flex-1 bg-gray-600 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${totalRatings > 0 ? (count / totalRatings) * 100 : 0}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 text-sm w-8">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              {totalRatings === 0 ? (
                <div className="text-center py-12">
                  <FiMessageCircle className="text-gray-400 text-5xl mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-400">Be the first to share your experience!</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {currentRatings.map((rating, index) => (
                      <div
                        key={rating._id || index}
                        className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-5 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          {/* User Avatar */}
                          <div className="flex-shrink-0">
                            <img
                              src={rating.userImage || '/default-avatar.png'}
                              alt={rating.userName || 'User'}
                              className="w-14 h-14 rounded-full border-2 border-gray-500 object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.userName || 'User')}&background=6366f1&color=fff&size=56`;
                              }}
                            />
                          </div>
                          
                          {/* Rating Content */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h5 className="text-white font-semibold text-lg">
                                  {rating.userName || 'Anonymous Student'}
                                </h5>
                                <div className="flex items-center gap-1">
                                  {renderStars(rating.rating)}
                                  <span className="text-white font-medium ml-2">
                                    {rating.rating}/5
                                  </span>
                                  <span className="text-gray-400 text-sm ml-2">
                                    • {getRatingText(rating.rating)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-sm text-gray-400">
                                {formatDate(rating.createdAt)}
                              </span>
                            </div>
                            
                            {rating.review && (
                              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-600">
                                <p className="text-gray-200 leading-relaxed">
                                  "{rating.review}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-8">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                      >
                        <FiChevronLeft size={16} />
                        Previous
                      </button>
                      
                      <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                      >
                        Next
                        <FiChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingViewModal;
