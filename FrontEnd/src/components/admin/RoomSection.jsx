import React, { useContext, useEffect, useState } from 'react';
import UpdateRoom from './UpdateRoom';
import { GlobalContext } from '../GlobalContext';
import { NavLink } from 'react-router-dom';

const RoomsSection = () => {
  const [isEditRoomOpen, setEditRoomOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { allRooms, deleteRoom, fetchAllRooms } = useContext(GlobalContext);
  const [showBestRooms, setShowBestRooms] = useState(false); 

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const [confirm, setConfirm] = useState(false);
  const [roomDelete, setRoomDelete] = useState(null);
  const [message, setMessage] = useState();

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

  const displayedRooms = showBestRooms ? allRooms.filter(room => room.bestRoom) : allRooms;

  return (
    <div className="relative">
      <div className='flex justify-between'>
        <div className="mb-6 text-right">
          <button
            onClick={() => setShowBestRooms(!showBestRooms)}
            className="bg-gradient-to-r text-xs shadow-white/10 hover:shadow-inner from-primary to-dark text-white py-[10px] px-[14px] rounded-md hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-md"
          >
            {showBestRooms ? 'Show All Rooms' : 'Show Best Rooms'}
          </button>
        </div>

        <div className="mb-6 text-right">
          <NavLink to="/add-room">
            <button className="bg-gradient-to-r text-xs shadow-white/10 hover:shadow-inner from-primary to-dark text-white py-[10px] px-[16px] rounded-full hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-md">
              Add New Room
            </button>
          </NavLink>
        </div>
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isEditRoomOpen ? 'filter blur-md' : ''}`}>
        {displayedRooms.map((room) => (
          <div
            key={room._id}
            className="shadow-xs relative transition-all duration-500 hover:shadow-primary/70 bg-gray-950 rounded-sm hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer"
          >
            <div className="overflow-hidden p-1">
              <img
                src={room.images[0]}
                alt="Room"
                className="mx-auto h-[170px] rounded-t-md w-full object-cover transition duration-700"
              />
            </div>

            <div className="space-y-0 px-2">
              <h1 className="line-clamp-1 font-semibold text-xl">{room.title}</h1>

              <div className="flex items-center pb-2 text-[12px] justify-between border-t-[1px] pt-2 !mt-1">
                <button
                  className="bg-gradient-to-r from-secondary/90 to-secondary/20 hover:from-secondary hover:to- text-white py-[7px] px-5 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-md"
                  onClick={() => {
                    setCurrentRoom(room); 
                    setEditRoomOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-gradient-to-r from-red-700 to-red-700 hover:from-red-800 hover:to-red-800 text-white py-[7px] px-4 rounded-full focus:outline-none transition duration-300 shadow-md"
                  onClick={() => {
                    setRoomDelete(room);
                    setConfirm(true);
                  }}
                >
                  Delete
                </button>
                <div className="rounded-md absolute top-2 right-2 text-black flex flex-shrink-0 bg-white shadow-red-700 shadow-sm p-2">
                  <p className="text-[12px] flex-shrink-0 font-bold">
                    R {room.price} /month
                  </p>
                </div>
              </div>
              {confirm && roomDelete?._id === room._id ? (
                <div className="w-[10%]">
                  <div className="absolute w-[70%] font-semibold rounded-md top-[45%] shadow-2xl border-8 border-gray-700 p-4 translate-y-[-50%] left-[50%] translate-x-[-50%] bg-primary">
                    <h1 className="text-xs text-center text-gray-800">Are you sure you want to delete this room?</h1>
                    <div className="mt-2">
                      <h1 className="text-center text-xl text-slate-900">{room.title}</h1>
                      <div className="flex justify-between mt-6">
                        <button
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white py-1 text-sm px-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-md"
                          onClick={() => {
                            setConfirm(false); 
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-400 text-white py-1 px-3 text-sm rounded-full focus:outline-none transition duration-300 shadow-md"
                          onClick={() => {
                            setMessage('Room Deleted Successfully');
                            deleteRoom(room._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditRoomOpen && (
        <div className="fixed z-[100000000000000000000000] pb-[50px] sm:pt-[200px] inset-0 flex items-center justify-center backdrop-blur-lg bg-gray-900 bg-opacity-50 overflow-y-auto">
          <div className="p-6 rounded-lg shadow-lg max-w-[1000px] w-full">
            <UpdateRoom
              onCancel={handleCancel}
              room={currentRoom}
              onClose={() => setEditRoomOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsSection;
