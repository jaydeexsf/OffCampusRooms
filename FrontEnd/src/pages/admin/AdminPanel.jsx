import React, { useState } from 'react';
import { FiHome, FiUsers, FiMessageSquare, FiStar, FiTruck, FiCalendar, FiSettings } from 'react-icons/fi';
import RoomSection from '../../components/admin/RoomSection';
import FAQSection from '../../components/admin/FAQSection';
import DriverManagement from '../../components/admin/DriverManagement';
import AdvancedBookings from '../../components/admin/AdvancedBookings';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rooms');

  const tabs = [
    { id: 'rooms', name: 'Rooms', icon: <FiHome />, component: <RoomSection /> },
    { id: 'faqs', name: 'FAQs', icon: <FiMessageSquare />, component: <FAQSection /> },
    { id: 'drivers', name: 'Drivers', icon: <FiTruck />, component: <DriverManagement /> },
    { id: 'bookings', name: 'Advanced Bookings', icon: <FiCalendar />, component: <AdvancedBookings /> }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-400">Manage rooms, FAQs, drivers, and advanced bookings</p>
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
          <div className="min-h-[600px]">
            {tabs.find(tab => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
