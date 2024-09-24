import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';

const AddRoomForm = () => {
    const { addRoom, isAddingRoom } = useContext(GlobalContext);
    const [newRoom, setNewRoom] = useState({
        img: '',
        title: '',
        description: '',
        price: '',
        minutesAway: '',
        location: '',
        amenities: {
            wifi: false,
            shower: false,
            bathtub: false,
            table: false,
            bed: false,
            electricity: false,
        },
        contact: {
            phone: '',
            whatsapp: '',
            email: '',
        },
        images: [],
        availableRooms: 0,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle nested amenities and contact updates
        if (name in newRoom.amenities) {
            setNewRoom({
                ...newRoom,
                amenities: {
                    ...newRoom.amenities,
                    [name]: e.target.checked, // For checkboxes
                },
            });
        } else if (name in newRoom.contact) {
            setNewRoom({
                ...newRoom,
                contact: {
                    ...newRoom.contact,
                    [name]: value,
                },
            });
        } else {
            setNewRoom({ ...newRoom, [name]: value });
        }
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setNewRoom({
            ...newRoom,
            images: files.map(file => URL.createObjectURL(file)), // For preview
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addRoom(newRoom);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                name="title"
                placeholder="Room Title"
                value={newRoom.title}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <textarea
                name="description"
                placeholder="Room Description"
                value={newRoom.description}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            ></textarea>
            <input
                type="number"
                name="price"
                placeholder="Room Price"
                value={newRoom.price}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <input
                type="number"
                name="minutesAway"
                placeholder="Minutes Away from Campus"
                value={newRoom.minutesAway}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />
            <input
                type="text"
                name="location"
                placeholder="Room Location"
                value={newRoom.location}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />

            <div>
                <h4 className="font-semibold">Amenities:</h4>
                {Object.keys(newRoom.amenities).map((amenity) => (
                    <label key={amenity} className="flex items-center">
                        <input
                            type="checkbox"
                            name={amenity}
                            checked={newRoom.amenities[amenity]}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)} {/* Capitalize first letter */}
                    </label>
                ))}
            </div>

            <h4 className="font-semibold">Contact Information:</h4>
            <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={newRoom.contact.phone}
                onChange={handleChange}
                className="border rounded p-2 w-full"
            />
            <input
                type="text"
                name="whatsapp"
                placeholder="WhatsApp Number"
                value={newRoom.contact.whatsapp}
                onChange={handleChange}
                className="border rounded p-2 w-full"
            />
            <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={newRoom.contact.email}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />

            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="border rounded p-2 w-full"
            />
            <div>
                <h4 className="font-semibold">Image Previews:</h4>
                <div className="grid grid-cols-2 gap-2">
                    {newRoom.images.map((img, index) => (
                        <img key={index} src={img} alt={`Room preview ${index + 1}`} className="h-20 w-full object-cover rounded" />
                    ))}
                </div>
            </div>

            <input
                type="number"
                name="availableRooms"
                placeholder="Available Rooms"
                value={newRoom.availableRooms}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full"
            />

            <button type="submit" disabled={isAddingRoom} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                {isAddingRoom ? 'Adding Room...' : 'Add Room'}
            </button>
        </form>
    );
};

export default AddRoomForm;
