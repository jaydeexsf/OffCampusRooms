import React, { useState } from 'react';
import UpdateRoom from './UpdateRoom';
import AddRoom from './AddRoom';

const RoomsSection = ({ rooms, deleteRoom }) => {
  const [isAddRoomOpen, setAddRoomOpen] = useState(false);
  const [isEditRoomOpen, setEditRoomOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleCancel = () => {
    setEditRoomOpen(false);
};

  return (
    <div className="rooms-section">
      <button
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
        onClick={() => setAddRoomOpen(true)} // Open the add room form
      >
        Add New Room
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room._id} className="bg-white p-4 rounded shadow-md">
            <img src={room.img} alt={room.title} className="h-40 w-full object-cover mb-4 rounded" />
            <h3 className="text-xl font-semibold mb-2">{room.title}</h3>
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                onClick={() => {
                  setCurrentRoom(room); // Set the room to edit
                  setEditRoomOpen(true); // Open the edit room form
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={() => deleteRoom(room._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddRoomOpen && <AddRoom onClose={() => setAddRoomOpen(false)}  />}
      {isEditRoomOpen && <UpdateRoom onCancel={handleCancel}  room={currentRoom} onClose={() => setEditRoomOpen(false)} />}
    </div>
  );
};

export default RoomsSection;

  