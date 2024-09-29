import React, { useState, useContext } from 'react';
import { GlobalContext } from '../../components/GlobalContext';
import RoomsSection from '../../components/admin/RoomSection';
import FaqsSection from '../../components/admin/FAQSection';
import { HiOutlineHome, HiOutlineQuestionMarkCircle, HiOutlineMenu, HiOutlineX } from 'react-icons/hi'; // Importing menu icons

const AdminPanel = () => {
  const { allRooms, faqs } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState('rooms');
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar visibility

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-slate-900 mt-[-35px] text-white min-h-screen flex flex-col md:flex-row">
      {/* Hamburger Menu Button */}
      <div className="md:hidden p-4">
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:static bg-primary p-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-full h-[100vh] z-[100] md:w-1/4`}>
        <h2 className="text-4xl font-bold mb-8">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-300 ${
                activeTab === 'rooms' ? 'bg-dark text-white' : 'bg-secondary text-gray-300'
              } hover:bg-dark/70 flex items-center`}
              onClick={() => {
                setActiveTab('rooms');
                setIsOpen(false); // Close sidebar on selection
              }}
            >
              <HiOutlineHome className="mr-2 w-5 h-5" /> {/* Icon for Manage Rooms */}
              Manage Rooms
            </button>
          </li>
          <li>
            <button
              className={`w-full text-left py-2 px-4 rounded-lg transition-colors duration-300 ${
                activeTab === 'faqs' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'
              } hover:bg-indigo-500 flex items-center`}
              onClick={() => {
                setActiveTab('faqs');
                setIsOpen(false); // Close sidebar on selection
              }}
            >
              <HiOutlineQuestionMarkCircle className="mr-2 w-5 h-5" /> {/* Icon for Manage FAQs */}
              Manage FAQs
            </button>
          </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="w-full md:w-3/4 px-10">
        {/* Tab Content */}
        {activeTab === 'rooms' ? (
          <div>
            <h3 className="text-3xl font-semibold mb-4">Rooms Management</h3>
            <RoomsSection />
          </div>
        ) : (
          <div>
            <h3 className="text-3xl font-semibold mb-4">FAQs Management</h3>
            <FaqsSection faqs={faqs} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
