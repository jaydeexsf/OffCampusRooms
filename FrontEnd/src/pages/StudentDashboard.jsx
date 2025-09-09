import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FiHeart, FiEye, FiSettings, FiUser, FiHome, FiMapPin, FiDollarSign, FiMessageSquare, FiStar, FiEdit3, FiTrash2, FiSave, FiX, FiMap, FiClock, FiCheckCircle, FiAlertCircle, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiClient } from '../config/api';
import { API_ENDPOINTS, getRoomUrl } from '../config/api';

const StudentDashboard = () => {
  const { user, isSignedIn } = useUser();
  const { getToken, isSignedIn: authSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('rides');
  const [savedRooms, setSavedRooms] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [myComments, setMyComments] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomLoading, setRoomLoading] = useState(false);
  const [roomError, setRoomError] = useState(null);
  
  // Rides state
  const [userRides, setUserRides] = useState([]);
  const [ridesLoading, setRidesLoading] = useState(false);
  const [selectedRideCategory, setSelectedRideCategory] = useState('all');

  // Fetch real data from backend
  useEffect(() => {
    if (isSignedIn) {
      fetchSavedRooms();
      fetchUserFeedback();
      fetchMyComments();
      fetchMyRatings();
      fetchUserRides();
    }
  }, [isSignedIn]);

  const fetchSavedRooms = async () => {
    try {
      setLoading(true);
      if (!user) return;
      const token = await getToken();
      console.log('[Dashboard] GET_SAVED_ROOMS URL:', API_ENDPOINTS.GET_SAVED_ROOMS);
      console.log('[Dashboard] Auth token present:', Boolean(token));
      const response = await apiClient.get(
        API_ENDPOINTS.GET_SAVED_ROOMS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('[Dashboard] Saved rooms response:', response.status, response.data);
      setSavedRooms(response.data);
    } catch (error) {
      console.error('Error fetching saved rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open inline Room Detail without navigating to /room/:id
  const openRoomModal = async (roomId, fallbackRoom = null) => {
    try {
      setRoomError(null);
      setRoomLoading(true);
      setRoomModalOpen(true);
      if (fallbackRoom) {
        // Show something immediately
        setSelectedRoom(fallbackRoom);
      }
      // Normalize roomId which may be an object or string
      const normalizedId = typeof roomId === 'string'
        ? roomId
        : (roomId?._id || roomId?.id || (typeof roomId === 'number' ? String(roomId) : undefined));
      if (!normalizedId) {
        throw new Error('Invalid room id');
      }
      const res = await apiClient.get(getRoomUrl(normalizedId));
      const room = res.data?.room || res.data; // support either shape
      setSelectedRoom(room);
    } catch (e) {
      console.error('[Dashboard] Failed to load room details:', e);
      setRoomError('Failed to load room details');
    } finally {
      setRoomLoading(false);
    }
  };

  const closeRoomModal = () => {
    setRoomModalOpen(false);
    setSelectedRoom(null);
    setRoomError(null);
  };

  const fetchUserFeedback = async () => {
    try {
      if (!user) return;
      const token = await getToken();
      console.log('[Dashboard] GET_USER_FEEDBACK URL:', API_ENDPOINTS.GET_USER_FEEDBACK);
      console.log('[Dashboard] Auth token present:', Boolean(token));
      const response = await apiClient.get(
        API_ENDPOINTS.GET_USER_FEEDBACK,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('[Dashboard] Feedback response:', response.status, response.data);
      setUserFeedback(response.data?.feedback || null);
    } catch (error) {
      console.error('[Dashboard] Error fetching user feedback:', error);
      console.error('[Dashboard] Error details:', error?.response?.status, error?.response?.data);
    }
  };

  const fetchMyComments = async () => {
    try {
      if (!user) return;
      const token = await getToken();
      console.log('[Dashboard] GET_MY_COMMENTS URL:', API_ENDPOINTS.GET_MY_COMMENTS);
      const response = await apiClient.get(API_ENDPOINTS.GET_MY_COMMENTS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[Dashboard] My comments response:', response.status, response.data);
      setMyComments(response.data?.comments || []);
    } catch (error) {
      console.error('[Dashboard] Error fetching my comments:', error);
      console.error('[Dashboard] Error details:', error?.response?.status, error?.response?.data);
    }
  };

  const fetchMyRatings = async () => {
    try {
      if (!user) return;
      const token = await getToken();
      console.log('[Dashboard] GET_MY_RATINGS URL:', API_ENDPOINTS.GET_MY_RATINGS);
      console.log('[Dashboard] Auth token present:', Boolean(token));
      const response = await apiClient.get(API_ENDPOINTS.GET_MY_RATINGS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('[Dashboard] My ratings response:', response.status, response.data);
      setMyRatings(response.data?.ratings || []);
    } catch (error) {
      console.error('[Dashboard] Error fetching my ratings:', error);
      console.error('[Dashboard] Error details:', error?.response?.status, error?.response?.data);
      console.error('[Dashboard] Error message:', error?.message);
    }
  };

  const startEditingComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditingCommentText(comment.content);
  };

  const cancelEditingComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const saveEditedComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    try {
      if (!user) return;
      const token = await getToken();
      await apiClient.put(`${API_ENDPOINTS.UPDATE_COMMENT}/${commentId}`, { content: editingCommentText.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cancelEditingComment();
      fetchMyComments();
    } catch (error) {
      console.error('[Dashboard] Error saving comment:', error);
    }
  };

  const deleteMyComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      if (!user) return;
      const token = await getToken();
      await apiClient.delete(`${API_ENDPOINTS.DELETE_COMMENT}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMyComments();
    } catch (error) {
      console.error('[Dashboard] Error deleting comment:', error);
    }
  };

  // Fetch user rides
  const fetchUserRides = async () => {
    try {
      if (!user) return;
      setRidesLoading(true);
      const token = await getToken();
      const response = await apiClient.get('/api/rides/my-rides', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUserRides(response.data.rides || []);
      } else {
        console.error('[Dashboard] Failed to fetch rides:', response.data.message);
      }
    } catch (error) {
      console.error('[Dashboard] Error fetching rides:', error);
    } finally {
      setRidesLoading(false);
    }
  };

  const dashboardStats = {
    savedRooms: savedRooms.length,
    feedbackSubmitted: userFeedback ? 1 : 0,
    totalRides: userRides.length,
    confirmedRides: userRides.filter(ride => ride.status === 'confirmed').length
  };

  const tabs = [
    { id: 'rides', name: 'My Rides', icon: <FiMap /> },
    { id: 'saved', name: 'Saved Rooms', icon: <FiHeart /> },
    { id: 'ratings', name: 'My Ratings', icon: <FiStar /> },
    { id: 'feedback', name: 'My Feedback', icon: <FiMessageSquare /> }
  ];

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to access your dashboard</p>
          <Link 
            to="/login"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.firstName || 'Student'}!
          </h1>
          <div className="w-12 md:w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-3"></div>
          <p className="text-gray-400">
            Manage your saved rooms, preferences, and account settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{dashboardStats.savedRooms}</p>
                <p className="text-gray-300 text-sm font-medium">Saved Rooms</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-xl">
                <FiHeart className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-4 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{dashboardStats.totalRides}</p>
                <p className="text-gray-300 text-sm font-medium">Total Rides</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl">
                <FiMap className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-4 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">{dashboardStats.confirmedRides}</p>
                <p className="text-gray-300 text-sm font-medium">Confirmed Rides</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-xl">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-4 mb-6">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab('saved')}
                    className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiHome className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">View Bookings</h4>
                    <p className="text-gray-300 text-sm">Check your saved rooms</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('ratings')}
                    className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-6 hover:border-yellow-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiStar className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">My Ratings</h4>
                    <p className="text-gray-300 text-sm">View your room ratings</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiMessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">My Feedback</h4>
                    <p className="text-gray-300 text-sm">View your feedback</p>
                  </button>

                  <Link 
                    to="/all-rooms"
                    className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiEye className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">Browse Rooms</h4>
                    <p className="text-gray-300 text-sm">Find accommodation</p>
                  </Link>

                  <Link 
                    to="/ride-booking"
                    className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiMap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">Book Ride</h4>
                    <p className="text-gray-300 text-sm">Get transportation</p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Saved Rooms</h3>
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading saved rooms...</p>
                  </div>
                ) : savedRooms.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                    {savedRooms.map((room) => (
                      <div key={room.id || room._id || room.roomId} className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group">
                        <img src={room.images?.[0] || '/placeholder-room.jpg'} alt={room.title} className="w-full h-40 sm:h-48 object-cover" />
                        <div className="p-3 sm:p-4">
                          <h4 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base truncate">{room.title}</h4>
                          <div className="flex items-center justify-between text-xs sm:text-sm gap-2">
                            <span className="text-blue-400 font-medium truncate">{room.location}</span>
                            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-bold whitespace-nowrap">R{room.price}/month</span>
                          </div>
                          <p className="text-gray-400 text-[11px] sm:text-xs mt-2">Saved on {new Date(room.savedDate).toLocaleDateString()}</p>
                          <div className="mt-3 flex justify-end">
                            <button
                              onClick={() => openRoomModal(room.roomId || room._id || room.id, room)}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-xs sm:text-sm"
                            >
                              <FiEye className="w-4 h-4" /> View Room
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiHeart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No saved rooms yet</p>
                    <Link 
                      to="/all-rooms"
                      className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                    >
                      Browse rooms to save
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ratings' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">My Room Ratings</h3>
                {myRatings.length === 0 ? (
                  <div className="text-center py-12">
                    <FiStar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">You haven't rated any rooms yet</p>
                    <Link 
                      to="/all-rooms"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 inline-block"
                    >
                      Browse Rooms to Rate
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myRatings.map((rating) => (
                      <div key={rating._id} className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {/* Room Image */}
                          <div className="w-full h-40 sm:w-24 sm:h-24 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                            {rating.room && rating.room.images && rating.room.images.length > 0 ? (
                              <img 
                                src={rating.room.images[0]} 
                                alt={rating.room.title || 'Room'} 
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                                <FiHome className="w-8 h-8 text-gray-500" />
                              </div>
                            )}
                          </div>
                          
                          {/* Rating Details */}
                          <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                              <div>
                                <h4 className="text-white font-semibold text-base sm:text-lg mb-1">
                                  {rating.room ? rating.room.title : `Room ${rating.roomId}`}
                                </h4>
                                {rating.room && (
                                  <p className="text-gray-400 text-sm mb-2">
                                    {rating.room.location} • R{rating.room.price}/month
                                  </p>
                                )}
                              </div>
                              
                              <div className="text-left sm:text-right">
                                <div className="flex items-center gap-1 mb-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <FiStar
                                      key={star}
                                      className={`$
                                        {star <= rating.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-400'
                                      } text-lg`}
                                    />
                                  ))}
                                </div>
                                <span className="text-white font-bold text-lg">{rating.rating}/5</span>
                              </div>
                            </div>
                            
                            {rating.review && (
                              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <p className="text-gray-200 leading-relaxed">"{rating.review}"</p>
                              </div>
                            )}
                            
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                              <span className="text-xs text-gray-400">
                                Rated on {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                              
                              <div className="flex gap-2 flex-wrap">
                                <button 
                                  onClick={() => openRoomModal(rating.roomId, rating.room)}
                                  className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm inline-flex items-center gap-2"
                                >
                                  <FiEye className="w-4 h-4" /> View Room
                                </button>
                                <button 
                                  onClick={() => {
                                    // This would open the rating modal for editing
                                    // You can implement this functionality
                                  }}
                                  className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
                                >
                                  Edit Rating
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">My Feedback</h3>
                {userFeedback ? (
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-white font-semibold text-lg">Your Website Review</h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            className={`${
                              star <= userFeedback.websiteRating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-400'
                            } text-lg`}
                          />
                        ))}
                        <span className="text-white ml-2 font-medium">{userFeedback.websiteRating}/5</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-300 mb-2"><strong>Review:</strong></p>
                        <p className="text-white bg-black/30 p-4 rounded-xl">{userFeedback.review}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-400">Location:</span> <span className="text-white">{userFeedback.location}</span></div>
                        <div><span className="text-gray-400">Monthly Rent:</span> <span className="text-green-400 font-semibold">R{userFeedback.monthlyRent}</span></div>
                        <div><span className="text-gray-400">Study Year:</span> <span className="text-white">{userFeedback.studyYear}</span></div>
                        <div><span className="text-gray-400">Course:</span> <span className="text-white">{userFeedback.course}</span></div>
                        <div><span className="text-gray-400">Room Type:</span> <span className="text-white">{userFeedback.roomType}</span></div>
                        <div><span className="text-gray-400">Submitted:</span> <span className="text-white">{new Date(userFeedback.createdAt).toLocaleDateString()}</span></div>
                      </div>
                      
                      <div className="flex gap-4 mt-6">
                        <Link 
                          to="/feedback"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200"
                        >
                          Edit Feedback
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiMessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">You haven't submitted any feedback yet</p>
                    <Link 
                      to="/feedback"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 inline-block"
                    >
                      Share Your Experience
                    </Link>
                  </div>
                )}

                {/* My Room Comments */}
                <div className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold text-lg">My Room Comments</h4>
                    <span className="text-gray-400 text-sm">{myComments.length} comment{myComments.length !== 1 ? 's' : ''}</span>
                  </div>

                  {myComments.length === 0 ? (
                    <p className="text-gray-400">You haven't commented on any rooms yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {myComments.map((comment) => (
                        <div key={comment._id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-400">Room:</span>
                                <span className="text-blue-300 text-xs font-mono">{String(comment.roomId)}</span>
                                <span className="text-gray-500 text-xs">•</span>
                                <span className="text-gray-400 text-xs">{new Date(comment.createdAt).toLocaleString()}</span>
                              </div>

                              {editingCommentId === comment._id ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editingCommentText}
                                    onChange={(e) => setEditingCommentText(e.target.value)}
                                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                    rows="3"
                                    maxLength="300"
                                  />
                                  <div className="flex gap-2">
                                    <button onClick={() => saveEditedComment(comment._id)} className="px-3 py-2 bg-green-600 hover:bg-green-500 text-white rounded flex items-center gap-2 text-sm">
                                      <FiSave /> Save
                                    </button>
                                    <button onClick={cancelEditingComment} className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded flex items-center gap-2 text-sm">
                                      <FiX /> Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-200 whitespace-pre-wrap">{comment.content}</p>
                              )}
                            </div>

                            {editingCommentId !== comment._id && (
                              <div className="flex flex-col gap-2">
                                <button onClick={() => startEditingComment(comment)} className="text-blue-400 hover:text-blue-300 p-2" title="Edit">
                                  <FiEdit3 />
                                </button>
                                <button onClick={() => deleteMyComment(comment._id)} className="text-red-400 hover:text-red-300 p-2" title="Delete">
                                  <FiTrash2 />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Profile Settings</h3>
                <div className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{user?.fullName}</h4>
                      <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                      Edit Profile
                    </button>
                    <button className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30">
                      Change Password
                    </button>
                    <button className="w-full bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30">
                      Notification Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* Room Detail Modal (inline) - Enhanced to match OrderPopup */}
        {roomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={closeRoomModal}>
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl w-full max-w-[500px] lg:max-w-[600px] max-h-[95vh] shadow-2xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700/50 flex-shrink-0">
                <h3 className="text-lg font-bold text-white">{selectedRoom?.title || 'Room Details'}</h3>
                <button onClick={closeRoomModal} className="p-2 bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/30 hover:to-red-500/30 border border-red-500/30 rounded-xl text-red-400 hover:text-red-300 transition-all duration-200">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {roomLoading && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
                    Loading room details...
                  </div>
                )}
                {!roomLoading && roomError && (
                  <div className="text-center py-12 text-red-400">{roomError}</div>
                )}
                {!roomLoading && !roomError && selectedRoom && (
                  <>
                    {/* Image Gallery with Price Overlay */}
                    <div className="relative">
                      {selectedRoom.images && selectedRoom.images.length > 0 ? (
                        <div className="relative">
                          <img 
                            src={selectedRoom.images[0]} 
                            alt={selectedRoom.title || 'Room'} 
                            className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-xl border border-gray-600/30" 
                          />
                          {/* Price Badge */}
                          <div className="absolute top-3 right-3">
                            <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 shadow-lg">
                              <p className="text-white font-bold text-sm sm:text-base">
                                R{selectedRoom.price?.toLocaleString() || 'N/A'}
                                <span className="text-gray-300 font-normal text-xs sm:text-sm ml-1">/month</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 sm:h-56 bg-gray-800 rounded-xl border border-gray-600/30 flex items-center justify-center text-gray-500">
                          <FiHome className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Location & Distance */}
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Location & Distance</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <FiMapPin className="text-blue-400 text-sm" />
                            <span className="text-gray-400 text-xs">Closest Gate</span>
                          </div>
                          <p className="text-white font-medium text-sm capitalize">{selectedRoom.location || 'Not specified'}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <FiSettings className="text-green-400 text-sm" />
                            <span className="text-gray-400 text-xs">Distance</span>
                          </div>
                          <p className="text-white font-medium text-sm">{selectedRoom.minutesAway || 'N/A'} min to UL</p>
                        </div>
                      </div>
                    </div>

                    {/* Amenities */}
                    {selectedRoom.amenities && (
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(selectedRoom.amenities).map((amenity) =>
                            selectedRoom.amenities[amenity] ? (
                              <div key={amenity} className="flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm px-3 py-2 rounded-lg text-xs sm:text-sm">
                                <span className="text-white font-medium capitalize">{amenity}</span>
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    )}

                    {/* Contact Information */}
                    {selectedRoom.contact && (
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Contact</h3>
                        <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 rounded-xl p-3 space-y-2">
                          {selectedRoom.contact.phone && (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                                <FiSettings className="text-blue-400 w-3 h-3" />
                              </div>
                              <span className="text-white text-xs sm:text-sm">{selectedRoom.contact.phone}</span>
                            </div>
                          )}
                          {selectedRoom.contact.email && (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                                <FiUser className="text-purple-400 w-3 h-3" />
                              </div>
                              <span className="text-white text-xs sm:text-sm">{selectedRoom.contact.email}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {selectedRoom.description && (
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-white mb-3">Description</h3>
                        <p className="text-gray-300 text-sm bg-white/5 border border-white/10 rounded-xl p-3 leading-relaxed">{selectedRoom.description}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;

// Inline Room Detail Modal
// Added below export for clarity (component-local JSX block would normally be within return, but we render conditionally above root)
