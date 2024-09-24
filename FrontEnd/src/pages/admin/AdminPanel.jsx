import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../components/GlobalContext';
import RoomsSection from '../../components/admin/RoomSection';
import FaqsSection from '../../components/admin/FAQSection';

const AdminPanel = () => {
  const { allRooms, faqs } = useContext(GlobalContext);
  const [activeTab, setActiveTab] = useState('rooms');

//   useEffect(() => {
//     fetchAllRooms();
//     fetchFaqs();
//   }, [fetchRooms, fetchFaqs]);

  return (
    <div className="p-6 pt-36 bg-gray-100 min-h-screen">
      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-8">
        <button
          className={`relative py-2 px-4 text-xl font-semibold ${activeTab === 'rooms' ? 'text-red-600' : 'text-black'}`}
          onClick={() => setActiveTab('rooms')}
        >
          Rooms
          {activeTab === 'rooms' && (
            <div className="custom-underline"></div>
          )}
        </button>
        <button
          className={`relative py-2 px-4 text-xl font-semibold ${activeTab === 'faqs' ? 'text-red-600' : 'text-black'}`}
          onClick={() => setActiveTab('faqs')}
        >
          FAQs
          {activeTab === 'faqs' && (
            <div className="custom-underline"></div>
          )}
        </button>
      </div>

      {/* Conditional rendering based on active tab */}
      {activeTab === 'rooms' ? (
        <RoomsSection />
      ) : (
        <FaqsSection faqs={faqs} />
      )}
    </div>
  );
};

export default AdminPanel;
