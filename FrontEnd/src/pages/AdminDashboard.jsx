import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { FiUsers, FiTruck, FiMapPin, FiSettings, FiBarChart, FiClock } from 'react-icons/fi';
import RideRequestManagement from '../components/admin/RideRequestManagement';
import AdvancedBookings from '../components/admin/AdvancedBookings';

const AdminDashboard = () => {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState('ride-requests');

  const tabs = [
    {
      id: 'ride-requests',
      label: 'Ride Requests',
      icon: FiClock,
      component: RideRequestManagement
    },
    {
      id: 'advanced-bookings',
      label: 'Advanced Bookings',
      icon: FiBarChart,
      component: AdvancedBookings
    }
  ];

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-950 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
              <FiSettings className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
              <p className="text-gray-400 mb-8">
                Please sign in with admin credentials to access the dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || RideRequestManagement;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </span>
              </h1>
              <p className="text-gray-400 text-sm">Manage rides, drivers, and bookings</p>
            </div>
            
            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 text-yellow-400">
                  <FiClock className="text-lg" />
                  <span className="text-sm">Pending</span>
                </div>
                <p className="text-white font-bold text-lg">-</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-green-400">
                  <FiTruck className="text-lg" />
                  <span className="text-sm">Active</span>
                </div>
                <p className="text-white font-bold text-lg">-</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-blue-400">
                  <FiUsers className="text-lg" />
                  <span className="text-sm">Students</span>
                </div>
                <p className="text-white font-bold text-lg">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900/50 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-400 text-blue-400'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="text-lg" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default AdminDashboard;
