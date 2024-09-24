import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const UpdateRoom = ({ room, onCancel }) => {
    const { updateRoom, isUpdatingRoom } = useContext(GlobalContext);
    
    // Initialize the state with the room's data
    const [updatedRoom, setUpdatedRoom] = useState({
        img: room.img,
        title: room.title,
        description: room.description,
        price: room.price,
        minutesAway: room.minutesAway,
        location: room.location,
        amenities: room.amenities,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested amenities updates
        if (name in updatedRoom.amenities) {
            setUpdatedRoom({
                ...updatedRoom,
                amenities: {
                    ...updatedRoom.amenities,
                    [name]: e.target.checked, // For checkboxes
                },
            });
        } else {
            setUpdatedRoom({ ...updatedRoom, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateRoom(room.id, updatedRoom);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                placeholder="Updated Title"
                value={updatedRoom.title}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <textarea
                name="description"
                placeholder="Updated Description"
                value={updatedRoom.description}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            ></textarea>
            <input
                type="number"
                name="price"
                placeholder="Updated Price"
                value={updatedRoom.price}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <input
                type="number"
                name="minutesAway"
                placeholder="Updated Minutes Away"
                value={updatedRoom.minutesAway}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <input
                type="text"
                name="location"
                placeholder="Updated Location"
                value={updatedRoom.location}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />

            {/* Amenities checkboxes */}
            <div>
                <h4 className="font-semibold">Amenities:</h4>
                {Object.keys(updatedRoom.amenities).map((amenity) => (
                    <label key={amenity} className="flex items-center">
                        <input
                            type="checkbox"
                            name={amenity}
                            checked={updatedRoom.amenities[amenity]}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)} {/* Capitalize first letter */}
                    </label>
                ))}
            </div>

            <div className="flex space-x-4">
                <button type="submit" disabled={isUpdatingRoom} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    {isUpdatingRoom ? 'Updating Room...' : 'Update Room'}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateRoom;
