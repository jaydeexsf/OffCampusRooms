import React, { useState, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext';

const AddRoomForm = () => {
    const { addRoom, isAddingRoom } = useContext(GlobalContext);
    const [newRoom, setNewRoom] = useState({
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

    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');

    const cloudinaryUpload = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'roomImages');
        formData.append('cloud_name', 'daqzt4zy1');

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/daqzt4zy1/image/upload`,
                formData
            );
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error.response?.data || error.message);
            setError('Failed to upload image. Please try again.');
        }
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) {
            setError('Please upload at least 1 image.');
            return;
        }

        try {
            const uploadedImages = await Promise.all(files.map(cloudinaryUpload));
            const validImages = uploadedImages.filter(image => image);
            setNewRoom({ ...newRoom, images: validImages });
            setImagePreviews(files.map(file => URL.createObjectURL(file)));
            setError('');
        } catch (error) {
            console.error('Error uploading images:', error);
            setError('Failed to upload images. Please try again.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newRoom.images.length === 0) {
            setError('Please upload at least 1 image before submitting.');
            return;
        }

        // const formData = new FormData();
        // formData.append('title', newRoom.title);
        // formData.append('description', newRoom.description);
        // formData.append('price', newRoom.price);
        // formData.append('minutesAway', newRoom.minutesAway);
        // formData.append('location', newRoom.location);
        // formData.append('availableRooms', newRoom.availableRooms);
        // formData.append('contact[phone]', newRoom.contact.phone);
        // formData.append('contact[whatsapp]', newRoom.contact.whatsapp);
        // formData.append('contact[email]', newRoom.contact.email);
        // Object.entries(newRoom.amenities).forEach(([key, value]) => {
        //     formData.append(`amenities[${key}]`, value);
        // });

        // newRoom.images.forEach(image => formData.append('images', image));
        addRoom(newRoom);
        console.log(newRoom)
    };

    return (
        <div className="">
            <div className="bg-white p-[100px] rounded-md shadow-lg w-full">
                <form onSubmit={handleSubmit} className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">Add a New Room</h2>

                    <input
                        type="text"
                        name="title"
                        placeholder="Room Title"
                        value={newRoom.title}
                        onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                        required
                        className="border border-gray-300 rounded p-2 w-[80%] focus:outline-none focus:ring-2 focus:ring-sky-700"
                    />
<br></br>
                    <textarea
                        name="description"
                        placeholder="Room Description"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        required
                        className="border border-gray-300 rounded p-2 w-[80%] focus:outline-none focus:ring-2 focus:ring-sky-700"
                    ></textarea>
<br></br>
                    <input
                        type="number"
                        name="price"
                        placeholder="Room Price"
                        value={newRoom.price}
                        onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                        required
                        className="border border-gray-300 w-md rounded p-2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                    />
<br></br>
                    <input
                        type="number"
                        name="minutesAway"
                        placeholder="Minutes Away from Campus"
                        value={newRoom.minutesAway}
                        onChange={(e) => setNewRoom({ ...newRoom, minutesAway: e.target.value })}
                        required
                        className="border border-gray-300 rounded p-2 w-md focus:outline-none focus:ring-2 focus:ring-sky-700"
                    />

                    <select className='p-2 focus:border-sky-700 focus:border-2' onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}>
                        <option value="gate 1">Gate 1</option>
                        <option value="gate 2">Gate 2</option>
                        <option value="gate 3">Gate 3</option>
                    </select>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">Amenities:</h4>
                        {Object.keys(newRoom.amenities).map((amenity) => (
                            <label key={amenity} className="flex pl-4 items-center">
                                <input
                                    type="checkbox"
                                    name={amenity}
                                    checked={newRoom.amenities[amenity]}
                                    onChange={(e) =>
                                        setNewRoom({
                                            ...newRoom,
                                            amenities: { ...newRoom.amenities, [amenity]: e.target.checked }
                                        })
                                    }
                                    className="mr-2"
                                />
                                {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                            </label>
                        ))}
                    </div>

                    <h4 className="font-semibold text-gray-700">Contact Information:</h4>
                   <div className="contact flex gap-2 pl-4 flex-col text-sm w-full">
                    <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={newRoom.contact.phone}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, phone: e.target.value } })}
                            className="border border-gray-300 rounded-[3px] p-[6px]  min-w-[200px] w-1/4 focus:outline-none focus:ring-1 focus:ring-sky-700"
                        />
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="WhatsApp Number"
                            value={newRoom.contact.whatsapp}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, whatsapp: e.target.value } })}
                            className="border border-gray-300 rounded-[3px] p-[6px]  min-w-[200px] w-1/4 focus:outline-none focus:ring-1 focus:ring-sky-700"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={newRoom.contact.email}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, email: e.target.value } })}
                            required
                            className="border border-gray-300 rounded-[3px] p-[6px] min-w-[200px] w-1/4 focus:outline-none focus:ring-1 focus:ring-sky-700"
                        />
                   </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                    />

                    {error && <p className="text-red-500">{error}</p>}

                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {imagePreviews.map((img, index) => (
                            <img key={index} src={img} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover rounded" />
                        ))}
                    </div>

                    <input
                        type="number"
                        name="availableRooms"
                        placeholder="Available Rooms"
                        value={newRoom.availableRooms < 0 ? 0 : newRoom.availableRooms }
                        onChange={(e) => setNewRoom({ ...newRoom, availableRooms: e.target.value })}
                        required
                        className="border border-gray-300 rounded p-2 w-[150px] focus:outline-none focus:ring-2 focus:ring-sky-700"
                    />

                    <button
                        type="submit"
                        disabled={isAddingRoom}
                        className="bg-sky-700 text-white py-2 px-4 rounded hover:bg-sky-800 transition-colors duration-300 w-full"
                    >
                        {isAddingRoom ? 'Adding Room...' : 'Add Room'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRoomForm

