import React, { useContext, useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa'; 
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import UpdateRoom from './UpdateRoom';
import { GlobalContext } from '../GlobalContext';
import { NavLink } from 'react-router-dom';
import Loader from '../../pages/Loader';
// import { Loader } from '../../pages/Loader';  

const RoomsSection = () => {
  const [isEditRoomOpen, setEditRoomOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { allRooms, deleteRoom, fetchAllRooms } = useContext(GlobalContext);
  const [showBestRooms, setShowBestRooms] = useState(false); 

  const [confirm, setConfirm] = useState(false);
  const [roomDelete, setRoomDelete] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Search and pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(10);
  const [filteredRooms, setFilteredRooms] = useState([]);  

  useEffect(() => {
    fetchAllRooms();
  }, []);

  // Filter rooms based on search term and best rooms filter
  useEffect(() => {
    if (!allRooms) return;
    
    let filtered = allRooms;
    
    // Apply best rooms filter
    if (showBestRooms) {
      filtered = filtered.filter(room => room.bestRoom);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredRooms(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allRooms, showBestRooms, searchTerm]);

  // Get current page rooms
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleCancel = () => {
    setEditRoomOpen(false);
  };

  if (!allRooms) {
    return <p>Loading rooms...</p>;
  }

  if (allRooms.length === 0) {
    return (
      <div className="text-center py-4">
        <NavLink to="/add-room">
          <button className="bg-gradient-to-r text-sm from-primary to-dark text-white py-3 px-6 rounded-full hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-lg">
            Add New Room
          </button>
        </NavLink>
      </div>
    );
  }

  // Remove the old displayedRooms logic since we now use currentRooms

  const handleDelete = async (roomId) => {
    setLoading(true);
    const success = await deleteRoom(roomId);  
    setLoading(false);

    if (!success) {
      setMessage('Room Deleted Successfully');
    } else {
      setMessage('Failed to delete room');
    }

    setTimeout(() => {
      setMessage(null);
      fetchAllRooms(); 
    }, 3000); 
  };

  return (
    <div className="relative">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search rooms by title, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Filter and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowBestRooms(!showBestRooms)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2 ${
                showBestRooms 
                  ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' 
                  : 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20'
              }`}
            >
              <FiFilter className="w-4 h-4" />
              {showBestRooms ? 'Show All Rooms' : 'Show Best Rooms Only'}
            </button>
            
            {/* Results Count */}
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-sm">
              {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="flex gap-3">
            <NavLink to="/add-room">
              <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Room
              </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${isEditRoomOpen ? 'filter blur-md' : ''}`}>
        {currentRooms.map((room) => (
          <div
            key={room._id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 group"
          >
            <div className="relative overflow-hidden">
              <img
                src={room.images[0]}
                alt="Room"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <div className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                  R{room.price}/mo
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg text-white mb-2 line-clamp-1">{room.title}</h3>
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">{room.description}</p>
              
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="capitalize">{room.location}</span>
                <span className="text-gray-500">•</span>
                <span>{room.minutesAway} min away</span>
              </div>

              <div className="flex gap-2">
                <button
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                  onClick={() => {
                    setCurrentRoom(room); 
                    setEditRoomOpen(true);
                  }}
                >
                  <FaEdit className="w-3 h-3" />
                  Edit
                </button>
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                  onClick={() => {
                    setRoomDelete(room);
                    setConfirm(true);
                  }}
                >
                  <FaTrash className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
            {confirm && roomDelete?._id === room._id && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold text-white mb-2">Delete Room</h3>
                  <p className="text-gray-400 mb-4">Are you sure you want to delete this room?</p>
                  <p className="text-white font-semibold mb-6">{room.title}</p>
                  <div className="flex gap-3">
                    <button
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                      onClick={() => setConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                      onClick={() => handleDelete(room._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8">
          <div className="text-gray-400 text-sm">
            Showing {indexOfFirstRoom + 1} to {Math.min(indexOfLastRoom, filteredRooms.length)} of {filteredRooms.length} rooms
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isEditRoomOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-4xl w-full overflow-y-auto">
            <UpdateRoom
              onCancel={handleCancel}
              room={currentRoom}
              onClose={() => setEditRoomOpen(false)}
            />
          </div>
        </div>
      )}

      {message && (
        <div className="fixed top-5 right-5 z-[2000] bg-green-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-green-500/30">
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <p className="font-medium">{message}</p>
        </div>
      )}
    </div>
  );
};

export default RoomsSection;
