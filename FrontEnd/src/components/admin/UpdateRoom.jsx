import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // For handling Cloudinary uploads

const UpdateRoom = ({ room, onCancel }) => {
    const { updateRoom, isUpdatingRoom } = useContext(GlobalContext);
    const navigate = useNavigate();

    const [updatedRoom, setUpdatedRoom] = useState({
        img: room.img,
        title: room.title,
        description: room.description,
        price: room.price,
        minutesAway: room.minutesAway,
        location: room.location,
        amenities: room.amenities,
        images: room.images || [],
    });

    const [previewImages, setPreviewImages] = useState(updatedRoom.images);
    const [selectedImage, setSelectedImage] = useState(null); // For full-screen view
    const [uploading, setUploading] = useState(false); // For image upload state

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in updatedRoom.amenities) {
            setUpdatedRoom({
                ...updatedRoom,
                amenities: {
                    ...updatedRoom.amenities,
                    [name]: checked,
                },
            });
        } else if (type === 'checkbox') {
            setUpdatedRoom({ ...updatedRoom, [name]: checked });
        } else {
            setUpdatedRoom({ ...updatedRoom, [name]: value });
        }
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...updatedRoom.images];

        setUploading(true);
        for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'roomImages');
            formData.append('cloud_name', 'daqzt4zy1'); // Use your Cloudinary upload preset

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/daqzt4zy1/image/upload',
                    formData
                );
                const imageUrl = response.data.secure_url;
                newImages.push(imageUrl); // addig Cloudinary URL to the room's images
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        setPreviewImages(newImages.slice(0, 6)); // Only show up to 6 images
        setUpdatedRoom((prevRoom) => ({
            ...prevRoom,
            images: newImages,
        }));
        setUploading(false);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image); // Full-screen modal with selected image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateRoom(room._id, updatedRoom);
        window.location.reload(); // Reload the page on same URL
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-primary p-6 rounded-lg shadow-md max-w-lg mx-aut">
            {/* Title */}
            <label htmlFor="title" className="block text-whitw font-semibold">Title</label>
            <input
                type="text"
                name="title"
                value={updatedRoom.title}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Description */}
            <label htmlFor="description" className="block text-white font-semibold">Description</label>
            <textarea
                name="description"
                value={updatedRoom.description}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {/* Price and Location in the same line */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-white font-semibold">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={updatedRoom.price}
                        onChange={handleChange}
                        required
                        className="border rounded p-2 w-full bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-white font-semibold">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={updatedRoom.location}
                        onChange={handleChange}
                        required
                        className="border rounded p-2 w-full bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
            </div>

            {/* Images */}
            <div>
                <label htmlFor="images" className="block text-white font-semibold">Images (up to 6)</label>
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="border rounded p-2 w-full bg-secondary text-white"
                />
                {uploading && <p className="text-dark">Uploading images...</p>}
            </div>

            {/* Display Images */}
            <div className="grid grid-cols-3 gap-2">
                {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image}
                            alt={`Room Preview ${index + 1}`}
                            className="w-full h-24 object-cover cursor-pointer"
                            onClick={() => handleImageClick(image)} // Full-screen on click
                        />
                    </div>
                ))}
            </div>

            {/* Amenities */}
            <div>
                <h4 className="font-semibold text-primary">Amenities:</h4>
                {Object.keys(updatedRoom.amenities).map((amenity) => (
                    <label key={amenity} className="inline-block mr-4 text-white">
                        <input
                            type="checkbox"
                            name={amenity}
                            checked={updatedRoom.amenities[amenity]}
                            onChange={handleChange}
                            className="mr-1"
                        />
                        {amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                    </label>
                ))}
            </div>

            {/* Full-screen Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img src={selectedImage} alt="Full-size preview" className="w-full max-w-lg" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-0 right-0 p-2 text-white bg-red-600 rounded-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Submit and Cancel buttons */}
            <div className="flex space-x-4">
                <button type="submit" disabled={isUpdatingRoom || uploading} className="bg-dark hover:bg-primary-dark text-white py-2 px-3 rounded shadow-lg transition-colors">
                    {isUpdatingRoom || uploading ? 'Updating Room...' : 'Update Room'}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-400 text-gray-900 py-2 px-3 rounded shadow-lg hover:bg-gray-500 transition-colors">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateRoom;
