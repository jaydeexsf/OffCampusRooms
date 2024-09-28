import React, { useContext, useState } from 'react';
import UpdateRoom from './UpdateRoom';
import { GlobalContext } from '../GlobalContext';
import { NavLink } from 'react-router-dom';

const RoomsSection = () => {
  const [isEditRoomOpen, setEditRoomOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const { allRooms, deleteRoom } = useContext(GlobalContext);

  const [confirm, setConfirm] = useState(false)
  const [roomDelete, setRoomDelete] = useState(null)
  const [message, setMessage] = useState()

  const handleCancel = () => {
    setEditRoomOpen(false);
  };

  // Loading or empty state handling
  if (!allRooms) {
    return <p>Loading rooms...</p>;
  }

  if (allRooms.length === 0) {
    return (
      <div className="text-center py-4">
        <NavLink to="/add-room">
          <button
            className="bg-gradient-to-r text-sm from-primary to-dark text-white py-3 px-6 rounded-full hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-lg"
          >
            Add New Room
          </button>
        </NavLink>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Add Room Button */}
      <div className="mb-6 text-right">
        <NavLink to="/add-room">
          <button
            className="bg-gradient-to-r text-xs shadow-white/10 hover:shadow-inner from-primary to-dark text-white py-[10px] px-[16px] rounded-full hover:bg-gradient-to-l focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-md"
          >
            Add New Room
          </button>
        </NavLink>
      </div>

      {/* Room Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 ${isEditRoomOpen ? 'filter blur-md' : ''}`}>
        {allRooms.map((room) => (
           <div
           className="shadow-md relative transition-all duration-500 hover:shadow-primary bg-slate-900 rounded-md hover:shadow-xl dark:bg-slate-950 dark:text-white cursor-pointer"
          //  onClick={handleOrderPopup}
         >
           <div className="overflow-hidden">
             <img
               src={room.images}
               alt="Room"
               className="mx-auto h-[250px] rounded-md w-full object-cover transition duration-700 hover:skew-x-2 hover:scale-110"
             />
           </div>
     
           <div className="space-y-2 p-3">
             <h1 className="line-clamp-1 font-bold text-xl">{room.title}</h1>
             {/* <div className="flex flex-wrap gap-[10px] mt-2">
               {Object.keys(room.amenities).map((amenity) => 
                 room.amenities[amenity] ? (
                   <div key={amenity} className="flex items-center gap-1 text-sm">
                     {amenitiesIcons[amenity]}
                     <span>{amenitiesLabels[amenity]}</span>
                   </div>
                 ) : null
               )}
             </div> */}

             <div className="flex items-center text-[12px] justify-between border-t-2 pt-2 !mt-3">
               <button
                    className="bg-gradient-to-r from-primary to-dark hover:from-secondary hover:to- text-white py-2 px-6 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-md"
                    onClick={() => {
                      setCurrentRoom(room); // Set the room to edit
                      setEditRoomOpen(true); // Open the edit room form
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-700 to-red-700 hover:from-red-800 hover:to-red-800 text-white py-2 px-6 rounded-full focus:outline-none transition duration-300 shadow-md"
                    onClick={() =>{
                      setRoomDelete(room);
                      setConfirm(true)}}
                  >
                    Delete
                </button>
               <div className="rounded-md absolute top-2 right-2  text-black flex flex-shrink-0 bg-white shadow-red-700 shadow-sm p-2">
                   <p className="text-[12px] flex-shrink-0 font-bold">
                     R {room.price} /month
                   </p>
                </div>
             </div>
             {confirm && roomDelete._id === room._id ? <div className='w-[10%]'>
                  <div className='absolute w-[70%] font-semibold rounded-md top-[45%] shadow-2xl border-8 border-gray-700 p-4 translate-y-[-50%] left-[50%] translate-x-[-50%] bg-primary'>
                    <h1 className='text-xs text-center text-gray-800'>Are you sure you want to delete this room</h1>
                    <div className='mt-2'>
                      <h1 className='text-center text-xl text-slate-900'>{room.title}</h1>
                      <div className='flex justify-between mt-6'>
                        <button
                          className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white py-1 text-sm px-3 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-md"
                          onClick={() => {
                            setConfirm(false); // Open the edit room form
                          }}
                        >
                          cancel
                        </button>
                        <button
                          className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-400 text-white py-1 px-3 text-sm rounded-full focus:outline-none transition duration-300 shadow-md"
                          onClick={() => {
                            setMessage('Room Deleted Sucsefully')
                            deleteRoom(room._id)}}
                        >
                          Delete
                      </button>
                      </div>
                    </div>
                  </div>
             </div> : ''}
           </div>
          
         </div>
         
         
          // <div key={room._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          //   <div className="relative w-full h-56 overflow-hidden rounded-t-xl">
          //     <img
          //       src={room.images}
          //       alt={room.title}
          //       className="w-full h-full object-cover"
          //     />
          //   </div>
          //   <div className="p-6">
          //     <h3 className="text-2xl font-bold text-gray-800 mb-4">{room.title}</h3>
          //     {/* <div className="flex justify-between">
          //       <button
          //         className="bg-blue-600 text-white py-2 px-6 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-300 shadow-md"
          //         onClick={() => {
          //           setCurrentRoom(room); // Set the room to edit
          //           setEditRoomOpen(true); // Open the edit room form
          //         }}
          //       >
          //         Edit
          //       </button>
          //       <button
          //         className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-300 shadow-md"
          //         onClick={() => deleteRoom(room._id)}
          //       >
          //         Delete
          //       </button>
          //     </div> */}
          //   </div>
          // </div>
        ))}
      </div>

      {/* Edit Room Modal */}
      {isEditRoomOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
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
