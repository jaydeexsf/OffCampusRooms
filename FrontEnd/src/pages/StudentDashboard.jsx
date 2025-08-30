import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { FiHeart, FiEye, FiSettings, FiUser, FiHome, FiMapPin, FiDollarSign, FiMessageSquare, FiStar, FiEdit3, FiTrash2, FiSave, FiX, FiMap } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { apiClient } from '../config/api';
import { API_ENDPOINTS } from '../config/api';

const StudentDashboard = () => {
  const { user, isSignedIn } = useUser();
  const { getToken, isSignedIn: authSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [savedRooms, setSavedRooms] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [myComments, setMyComments] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch real data from backend
  useEffect(() => {
    if (isSignedIn) {
      fetchSavedRooms();
      fetchUserFeedback();
      fetchMyComments();
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

  const dashboardStats = {
    savedRooms: savedRooms.length,
    feedbackSubmitted: userFeedback ? 1 : 0,
    averagePrice: savedRooms.length > 0 
      ? Math.round(savedRooms.reduce((sum, room) => sum + room.price, 0) / savedRooms.length)
      : 0
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiHome /> },
    { id: 'saved', name: 'Saved Rooms', icon: <FiHeart /> },
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{dashboardStats.savedRooms}</p>
                <p className="text-gray-300 text-sm font-medium">Saved Rooms</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl">
                <FiHeart className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">{dashboardStats.feedbackSubmitted}</p>
                <p className="text-gray-300 text-sm font-medium">Feedback Submitted</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl">
                <FiMessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">R{dashboardStats.averagePrice}</p>
                <p className="text-gray-300 text-sm font-medium">Avg. Price</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <FiDollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRooms.map((room) => (
                      <div key={room.id} className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 group">
                        <img src={room.images?.[0] || '/placeholder-room.jpg'} alt={room.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-2">{room.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-400 font-medium">{room.location}</span>
                            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-bold">R{room.price}/month</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">Saved on {new Date(room.savedDate).toLocaleDateString()}</p>
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
      </div>
    </div>
  );
};

export default StudentDashboard;
