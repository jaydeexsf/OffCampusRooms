import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FiHeart, FiEye, FiSettings, FiUser, FiHome, FiMapPin, FiDollarSign, FiMessageSquare, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const StudentDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [savedRooms, setSavedRooms] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch real data from backend
  useEffect(() => {
    if (isSignedIn) {
      fetchSavedRooms();
      fetchUserFeedback();
    }
  }, [isSignedIn]);

  const fetchSavedRooms = async () => {
    try {
      setLoading(true);
      const token = await user.getToken();
      const response = await axios.get(
        API_ENDPOINTS.GET_SAVED_ROOMS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSavedRooms(response.data);
    } catch (error) {
      console.error('Error fetching saved rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedback = async () => {
    try {
      const token = await user.getToken();
      const response = await axios.get(
        API_ENDPOINTS.GET_USER_FEEDBACK,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserFeedback(response.data);
    } catch (error) {
      console.error('Error fetching user feedback:', error);
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
    { id: 'feedback', name: 'My Feedback', icon: <FiMessageSquare /> },
    { id: 'profile', name: 'Profile', icon: <FiUser /> }
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
                    : 'text-gray-400 hover:text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:border hover:border-blue-500/30'
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link 
                    to="/all-rooms"
                    className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-6 hover:scale-105 hover:border-blue-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiHome className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">Browse All Rooms</h4>
                    <p className="text-gray-300 text-sm">Find your perfect accommodation</p>
                  </Link>

                  <Link 
                    to="/resources"
                    className="bg-gradient-to-br from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6 hover:scale-105 hover:border-green-400/50 transition-all duration-300 group"
                  >
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300">
                      <FiMapPin className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold mb-2 text-lg">Student Resources</h4>
                    <p className="text-gray-300 text-sm">Safety tips and helpful guides</p>
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
                      <div key={room.id} className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl overflow-hidden hover:scale-105 hover:border-blue-500/30 transition-all duration-300 group">
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
                  <div className="bg-gradient-to-br from-black/40 to-gray-900/40 border border-white/10 rounded-2xl p-6">
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
