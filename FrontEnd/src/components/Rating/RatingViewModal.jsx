import React, { useState, useEffect } from 'react';
import { FiStar, FiX, FiUser, FiMessageCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const RatingViewModal = ({ isOpen, onClose, roomId, roomTitle, embedded = false }) => {
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

  if (embedded) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl w-full h-full overflow-hidden shadow-xl flex flex-col">
        {/* Header */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Student Reviews</h2>
            <p className="text-blue-100 text-sm">{roomTitle}</p>
          </div>
        </div> */}

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto min-h-0">
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
            <div className="text-center py-8">
              <FiMessageCircle className="text-red-400 text-3xl mx-auto mb-3" />
              <p className="text-red-300 font-medium mb-3">{error}</p>
              <button
                onClick={fetchRatings}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Reviews List */}
              {totalRatings === 0 ? (
                <div className="text-center py-8">
                  <FiMessageCircle className="text-gray-400 text-4xl mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">No reviews yet</h3>
                  <p className="text-gray-400 text-sm">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentRatings.map((rating, index) => (
                    <div
                      key={rating._id || index}
                      className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-3 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <img
                            src={rating.userImage || '/default-avatar.png'}
                            alt={rating.userName || 'User'}
                            className="w-10 h-10 rounded-full border-2 border-gray-500 object-cover"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.userName || 'User')}&background=6366f1&color=fff&size=40`;
                            }}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h5 className="text-white font-semibold text-sm truncate">
                                {rating.userName || 'Anonymous Student'}
                              </h5>
                              <div className="flex items-center gap-1">
                                {renderStars(rating.rating)}
                                <span className="text-white font-medium ml-1 text-xs">
                                  {rating.rating}/5
                                </span>
                              </div>
                            </div>
                            <span className="text-xs text-gray-400">
                              {formatDate(rating.createdAt)}
                            </span>
                          </div>
                          
                          {rating.review && (
                            <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
                              <p className="text-gray-200 leading-relaxed text-sm break-words">
                                "{rating.review}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-3xl w-full max-w-5xl h-[95vh] sm:h-[90vh] overflow-hidden shadow-2xl flex flex-col">
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
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto min-h-0">
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
              {/* Mobile: Rating Summary at Top */}
              <div className="md:hidden bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-4 mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(Math.round(averageRating))}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Desktop/Tablet: Side-by-side Layout */}
              <div className="hidden md:flex gap-6">
                {/* Rating Summary - Left Side (Sticky) */}
                <div className="w-80 flex-shrink-0">
                  <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6">
                    {/* Average Rating */}
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-white mb-3">
                        {averageRating.toFixed(1)}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <p className="text-gray-300 text-base">
                        Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Rating Distribution */}
                    {totalRatings > 0 && (
                      <div className="border-t border-gray-600 pt-6">
                        <h4 className="text-white font-semibold mb-4 text-base">Rating Distribution</h4>
                        {Object.entries(getRatingDistribution()).reverse().map(([stars, count]) => (
                          <div key={stars} className="flex items-center gap-3 mb-3">
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

                {/* Reviews List - Right Side */}
                <div className="flex-1 min-w-0">
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
                        className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-3 sm:p-5 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3 sm:gap-4">
                          {/* User Avatar */}
                          <div className="flex-shrink-0">
                            <img
                              src={rating.userImage || '/default-avatar.png'}
                              alt={rating.userName || 'User'}
                              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-500 object-cover"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.userName || 'User')}&background=6366f1&color=fff&size=56`;
                              }}
                            />
                          </div>
                          
                          {/* Rating Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h5 className="text-white font-semibold text-base sm:text-lg truncate">
                                  {rating.userName || 'Anonymous Student'}
                                </h5>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {renderStars(rating.rating)}
                                  <span className="text-white font-medium ml-1 sm:ml-2 text-sm sm:text-base">
                                    {rating.rating}/5
                                  </span>
                                  <span className="text-gray-400 text-xs sm:text-sm ml-1 sm:ml-2">
                                    • {getRatingText(rating.rating)}
                                  </span>
                                </div>
                              </div>
                              <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                                {formatDate(rating.createdAt)}
                              </span>
                            </div>
                            
                            {rating.review && (
                              <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-600">
                                <p className="text-gray-200 leading-relaxed text-sm sm:text-base break-words">
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
                            <FiChevronLeft size={14} />
                            <span>Previous</span>
                          </button>
                          
                          <div className="flex items-center gap-2">
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                              let page;
                              if (totalPages <= 5) {
                                page = i + 1;
                              } else if (currentPage <= 3) {
                                page = i + 1;
                              } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                              } else {
                                page = currentPage - 2 + i;
                              }
                              
                              return (
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
                              );
                            })}
                          </div>
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors"
                          >
                            <span>Next</span>
                            <FiChevronRight size={14} />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Mobile: Reviews List */}
              <div className="md:hidden">
                {totalRatings === 0 ? (
                  <div className="text-center py-12">
                    <FiMessageCircle className="text-gray-400 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No reviews yet</h3>
                    <p className="text-gray-400">Be the first to share your experience!</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 sm:space-y-4">
                      {currentRatings.map((rating, index) => (
                        <div
                          key={rating._id || index}
                          className="bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl p-3 sm:p-5 hover:from-gray-700 hover:to-gray-600 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="flex-shrink-0">
                              <img
                                src={rating.userImage || '/default-avatar.png'}
                                alt={rating.userName || 'User'}
                                className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-gray-500 object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(rating.userName || 'User')}&background=6366f1&color=fff&size=56`;
                                }}
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                  <h5 className="text-white font-semibold text-base sm:text-lg truncate">
                                    {rating.userName || 'Anonymous Student'}
                                  </h5>
                                  <div className="flex items-center gap-1 flex-wrap">
                                    {renderStars(rating.rating)}
                                    <span className="text-white font-medium ml-1 sm:ml-2 text-sm sm:text-base">
                                      {rating.rating}/5
                                    </span>
                                    <span className="text-gray-400 text-xs sm:text-sm ml-1 sm:ml-2">
                                      • {getRatingText(rating.rating)}
                                    </span>
                                  </div>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                                  {formatDate(rating.createdAt)}
                                </span>
                              </div>
                              
                              {rating.review && (
                                <div className="bg-gray-900/50 rounded-lg p-3 sm:p-4 border border-gray-600">
                                  <p className="text-gray-200 leading-relaxed text-sm sm:text-base break-words">
                                    "{rating.review}"
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination - Mobile */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 sm:gap-4 mt-6 sm:mt-8 px-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors text-sm sm:text-base"
                      >
                        <FiChevronLeft size={14} />
                        <span className="hidden sm:inline">Previous</span>
                        <span className="sm:hidden">Prev</span>
                      </button>
                      
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-[200px] sm:max-w-none">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let page;
                          if (totalPages <= 5) {
                            page = i + 1;
                          } else if (currentPage <= 3) {
                            page = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            page = totalPages - 4 + i;
                          } else {
                            page = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-lg transition-colors text-sm sm:text-base"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span className="sm:hidden">Next</span>
                        <FiChevronRight size={14} />
                      </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingViewModal;
