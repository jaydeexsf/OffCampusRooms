import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMessageSquare, FiStar, FiTruck, FiCalendar, FiSettings, FiBarChart, FiActivity } from 'react-icons/fi';
import RoomSection from '../../components/admin/RoomSection';
import FAQSection from '../../components/admin/FAQSection';
import DriverManagement from '../../components/admin/DriverManagement';
import AdvancedBookings from '../../components/admin/AdvancedBookings';
import { apiClient, API_ENDPOINTS } from '../../config/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalDrivers: 0,
    totalFAQs: 0,
    totalBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [roomsRes, driversRes, faqsRes] = await Promise.all([
        apiClient.get(API_ENDPOINTS.ALL_ROOMS),
        apiClient.get(API_ENDPOINTS.GET_DRIVERS_COUNT),
        apiClient.get(API_ENDPOINTS.GET_FAQS)
      ]);
      
      setStats({
        totalRooms: roomsRes.data.rooms?.length || 0,
        totalDrivers: driversRes.data.totalDrivers || 0,
        totalFAQs: faqsRes.data.faqs?.length || 0,
        totalBookings: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-xs sm:text-sm lg:text-base font-medium">Total Rooms</p>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white">{loading ? '...' : stats.totalRooms}</p>
            </div>
            <FiHome className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-xs sm:text-sm lg:text-base font-medium">Active Drivers</p>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white">{loading ? '...' : stats.totalDrivers}</p>
            </div>
            <FiTruck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-xs sm:text-sm lg:text-base font-medium">FAQs</p>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white">{loading ? '...' : stats.totalFAQs}</p>
            </div>
            <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-xs sm:text-sm lg:text-base font-medium">Bookings</p>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold text-white">{loading ? '...' : stats.totalBookings}</p>
            </div>
            <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <button
            onClick={() => setActiveTab('rooms')}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-left transition-all duration-200 group"
          >
            <FiHome className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Add Room</p>
            <p className="text-gray-400 text-xs lg:text-sm">Create new listings</p>
          </button>
          
          <button
            onClick={() => setActiveTab('drivers')}
            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-left transition-all duration-200 group"
          >
            <FiTruck className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Add Driver</p>
            <p className="text-gray-400 text-xs lg:text-sm">Register drivers</p>
          </button>
          
          <button
            onClick={() => setActiveTab('faqs')}
            className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-left transition-all duration-200 group"
          >
            <FiMessageSquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">Add FAQ</p>
            <p className="text-gray-400 text-xs lg:text-sm">Create help content</p>
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg lg:rounded-xl p-2 sm:p-3 lg:p-4 text-left transition-all duration-200 group"
          >
            <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-400 mb-1 sm:mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium text-xs sm:text-sm lg:text-base">View Bookings</p>
            <p className="text-gray-400 text-xs lg:text-sm">Monitor reservations</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 flex items-center gap-2">
          <FiActivity className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400" />
          Recent Activity
        </h3>
        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 p-2 sm:p-3 lg:p-4 bg-white/5 rounded-lg lg:rounded-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white font-medium text-xs sm:text-sm lg:text-base">System Status: All services operational</p>
              <p className="text-gray-400 text-xs lg:text-sm">Last updated: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <FiBarChart />, component: <DashboardOverview /> },
    { id: 'rooms', name: 'Rooms', icon: <FiHome />, component: <RoomSection /> },
    { id: 'faqs', name: 'FAQs', icon: <FiMessageSquare />, component: <FAQSection /> },
    { id: 'drivers', name: 'Drivers', icon: <FiTruck />, component: <DriverManagement /> },
    { id: 'bookings', name: 'Bookings', icon: <FiCalendar />, component: <AdvancedBookings /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Enhanced Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">Manage your OffCampusRooms platform efficiently</p>
            </div>
            <div className="text-left lg:text-right">
              <p className="text-gray-400 text-xs sm:text-sm">Welcome back, Admin</p>
              <p className="text-white font-medium text-sm sm:text-base">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation - Mobile Optimized */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-1 sm:p-2 mb-4 sm:mb-6 lg:mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1 lg:gap-2 px-2 sm:px-3 lg:px-6 py-2 lg:py-3 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-300 font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-white/10 hover:scale-102'
                }`}
              >
                <span className={`transition-transform duration-200 ${
                  activeTab === tab.id ? 'scale-110' : ''
                }`}>
                  {tab.icon}
                </span>
                <span className="hidden xs:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl lg:rounded-3xl p-3 sm:p-4 lg:p-8 min-h-[500px] sm:min-h-[600px]">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
