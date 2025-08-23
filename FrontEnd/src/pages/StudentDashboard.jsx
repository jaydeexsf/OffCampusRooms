import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { FiHeart, FiEye, FiSettings, FiUser, FiHome, FiMapPin, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [savedRooms, setSavedRooms] = useState([]);
  const [recentViews, setRecentViews] = useState([]);

  // Mock data - you can replace with real data from your backend
  useEffect(() => {
    if (isSignedIn) {
      // Mock saved rooms
      setSavedRooms([
        {
          id: 1,
          title: "Modern Single Room near Gate 1",
          price: 2500,
          location: "Gate 1",
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          savedDate: "2024-01-15"
        },
        {
          id: 2,
          title: "Affordable Shared Room",
          price: 1800,
          location: "Gate 2",
          image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          savedDate: "2024-01-12"
        }
      ]);

      // Mock recent views
      setRecentViews([
        {
          id: 3,
          title: "Studio Apartment near Campus",
          price: 3200,
          location: "Gate 3",
          image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          viewedDate: "2024-01-14"
        }
      ]);
    }
  }, [isSignedIn]);

  const dashboardStats = {
    savedRooms: savedRooms.length,
    viewedRooms: recentViews.length,
    averagePrice: savedRooms.length > 0 
      ? Math.round(savedRooms.reduce((sum, room) => sum + room.price, 0) / savedRooms.length)
      : 0
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <FiHome /> },
    { id: 'saved', name: 'Saved Rooms', icon: <FiHeart /> },
    { id: 'recent', name: 'Recent Views', icon: <FiEye /> },
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
          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-400">{dashboardStats.savedRooms}</p>
                <p className="text-gray-400 text-sm">Saved Rooms</p>
              </div>
              <FiHeart className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-400">{dashboardStats.viewedRooms}</p>
                <p className="text-gray-400 text-sm">Recently Viewed</p>
              </div>
              <FiEye className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-400">R{dashboardStats.averagePrice}</p>
                <p className="text-gray-400 text-sm">Avg. Price</p>
              </div>
              <FiDollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
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
                    className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-200"
                  >
                    <FiHome className="w-8 h-8 text-blue-400 mb-3" />
                    <h4 className="text-white font-semibold mb-2">Browse All Rooms</h4>
                    <p className="text-gray-400 text-sm">Find your perfect accommodation</p>
                  </Link>

                  <Link 
                    to="/tips"
                    className="bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-xl p-6 hover:scale-105 transition-all duration-200"
                  >
                    <FiMapPin className="w-8 h-8 text-green-400 mb-3" />
                    <h4 className="text-white font-semibold mb-2">Safety Tips</h4>
                    <p className="text-gray-400 text-sm">Learn about student safety</p>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'saved' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Saved Rooms</h3>
                {savedRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedRooms.map((room) => (
                      <div key={room.id} className="bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
                        <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-2">{room.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-400">{room.location}</span>
                            <span className="text-green-400 font-semibold">R{room.price}/month</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">Saved on {room.savedDate}</p>
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

            {activeTab === 'recent' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Recently Viewed</h3>
                {recentViews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentViews.map((room) => (
                      <div key={room.id} className="bg-black/30 border border-white/10 rounded-xl overflow-hidden hover:scale-105 transition-all duration-200">
                        <img src={room.image} alt={room.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                          <h4 className="text-white font-semibold mb-2">{room.title}</h4>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-blue-400">{room.location}</span>
                            <span className="text-green-400 font-semibold">R{room.price}/month</span>
                          </div>
                          <p className="text-gray-400 text-xs mt-2">Viewed on {room.viewedDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiEye className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No recently viewed rooms</p>
                    <Link 
                      to="/all-rooms"
                      className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
                    >
                      Start browsing rooms
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Profile Settings</h3>
                <div className="bg-black/30 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <FiUser className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{user?.fullName}</h4>
                      <p className="text-gray-400">{user?.emailAddresses[0]?.emailAddress}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">
                      Edit Profile
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20">
                      Change Password
                    </button>
                    <button className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 border border-white/20">
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
