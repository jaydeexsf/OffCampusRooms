import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../components/GlobalContext';
import RoomsSection from '../../components/admin/RoomSection';
import FaqsSection from '../../components/admin/FAQSection';
import { 
  HiOutlineHome, 
  HiOutlineQuestionMarkCircle, 
  HiOutlineMenu, 
  HiOutlineX,
  HiOutlinePlus,
  HiOutlineCog,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineDocumentText
} from 'react-icons/hi';
import { FiUsers, FiSettings, FiBarChart3, FiFileText } from 'react-icons/fi';

const AdminPanel = () => {
  const { allRooms, faqs } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState('rooms');
  const [isOpen, setIsOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const adminStats = {
    totalRooms: allRooms?.length || 0,
    totalFaqs: faqs?.length || 0,
    activeListings: allRooms?.filter(room => room.availableRooms > 0).length || 0,
    totalBookings: 0 // You can add this later
  };

  const menuItems = [
    {
      id: 'rooms',
      name: 'Manage Rooms',
      icon: <HiOutlineHome className="w-5 h-5" />,
      description: 'Add, edit, or remove room listings'
    },
    {
      id: 'faqs',
      name: 'Manage FAQs',
      icon: <HiOutlineQuestionMarkCircle className="w-5 h-5" />,
      description: 'Manage frequently asked questions'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Mobile Header */}
      <div className="md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
          >
            {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed top-0 left-0 md:static pt-16 md:pt-0 bg-black/95 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-80 h-screen z-50 md:z-auto`}>
          
          {/* Desktop Header */}
          <div className="hidden md:block p-6 border-b border-white/10">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Manage your student accommodation platform</p>
          </div>

          {/* Stats Cards */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-400">{adminStats.totalRooms}</p>
                    <p className="text-xs text-gray-400">Total Rooms</p>
                  </div>
                  <HiOutlineHome className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-green-400">{adminStats.activeListings}</p>
                    <p className="text-xs text-gray-400">Available</p>
                  </div>
                  <HiOutlineChartBar className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="px-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Management
            </h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        activeTab === item.id 
                          ? 'bg-white/20' 
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs opacity-75">{item.description}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="px-6 mt-8">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <HiOutlinePlus className="w-5 h-5" />
                Add New Room
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-6 md:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {activeTab === 'rooms' ? 'Room Management' : 'FAQ Management'}
              </h2>
              <p className="text-gray-400">
                {activeTab === 'rooms' 
                  ? 'Manage all room listings and availability' 
                  : 'Handle frequently asked questions and student inquiries'
                }
              </p>
            </div>

            {/* Content */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              {activeTab === 'rooms' ? (
                <RoomsSection />
              ) : (
                <FaqsSection faqs={faqs} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPanel;
