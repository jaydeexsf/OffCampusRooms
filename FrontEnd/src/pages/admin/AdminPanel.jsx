import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMessageSquare, FiStar, FiTruck, FiCalendar, FiSettings, FiBarChart, FiActivity } from 'react-icons/fi';
import RoomSection from '../../components/admin/RoomSection';
import FAQSection from '../../components/admin/FAQSection';
import DriverManagement from '../../components/admin/DriverManagement';
import AdvancedBookings from '../../components/admin/AdvancedBookings';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

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
        axios.get(API_ENDPOINTS.ALL_ROOMS),
        axios.get(API_ENDPOINTS.GET_ALL_DRIVERS),
        axios.get(API_ENDPOINTS.GET_FAQS)
      ]);
      
      setStats({
        totalRooms: roomsRes.data.rooms?.length || 0,
        totalDrivers: driversRes.data.drivers?.length || 0,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Rooms</p>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalRooms}</p>
            </div>
            <FiHome className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Active Drivers</p>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalDrivers}</p>
            </div>
            <FiTruck className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">FAQs</p>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalFAQs}</p>
            </div>
            <FiMessageSquare className="w-8 h-8 text-purple-400" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-400 text-sm font-medium">Bookings</p>
              <p className="text-3xl font-bold text-white">{loading ? '...' : stats.totalBookings}</p>
            </div>
            <FiCalendar className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab('rooms')}
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl p-4 text-left transition-all duration-200 group"
          >
            <FiHome className="w-6 h-6 text-blue-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Manage Rooms</p>
            <p className="text-gray-400 text-sm">Add, edit, or delete rooms</p>
          </button>
          
          <button
            onClick={() => setActiveTab('drivers')}
            className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl p-4 text-left transition-all duration-200 group"
          >
            <FiTruck className="w-6 h-6 text-green-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Manage Drivers</p>
            <p className="text-gray-400 text-sm">Add or remove drivers</p>
          </button>
          
          <button
            onClick={() => setActiveTab('faqs')}
            className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-xl p-4 text-left transition-all duration-200 group"
          >
            <FiMessageSquare className="w-6 h-6 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Manage FAQs</p>
            <p className="text-gray-400 text-sm">Update help content</p>
          </button>
          
          <button
            onClick={() => setActiveTab('bookings')}
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl p-4 text-left transition-all duration-200 group"
          >
            <FiCalendar className="w-6 h-6 text-orange-400 mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">View Bookings</p>
            <p className="text-gray-400 text-sm">Monitor reservations</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <FiActivity className="w-5 h-5 text-blue-400" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-white font-medium">System Status: All services operational</p>
              <p className="text-gray-400 text-sm">Last updated: {new Date().toLocaleString()}</p>
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
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-400">Manage your OffCampusRooms platform efficiently</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Welcome back, Admin</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-2 mb-8">
          <div className="flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-medium ${
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
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content Area */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 min-h-[600px]">
          {tabs.find(tab => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
