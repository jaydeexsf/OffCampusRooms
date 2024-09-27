import React, { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom'; // For navigation

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
        images: room.images || [], // Current images
    });

    const [previewImages, setPreviewImages] = useState(updatedRoom.images);
    const [selectedImage, setSelectedImage] = useState(null); // For full-screen view

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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];

        // Use FileReader to generate preview URLs for the uploaded images
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                newImages.push(reader.result);
                if (newImages.length === files.length) {
                    const combinedImages = [...updatedRoom.images, ...newImages].slice(0, 6);
                    setPreviewImages(combinedImages); // Update image preview
                    setUpdatedRoom((prevRoom) => ({
                        ...prevRoom,
                        images: combinedImages, // Store in the room data
                    }));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleImageClick = (image) => {
        setSelectedImage(image); // Show full-screen modal with the selected image
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateRoom(room._id, updatedRoom);
        navigate(-1); // Redirect to the previous URL after successful update
        window.location.reload(); // Reload the page
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <label htmlFor="title">Title</label>
            <input
                type="text"
                name="title"
                value={updatedRoom.title}
                onChange={handleChange}
                required
                className="border rounded p-1 w-full"
            />

            {/* Description */}
            <label htmlFor="description">Description</label>
            <textarea
                name="description"
                value={updatedRoom.description}
                onChange={handleChange}
                required
                className="border rounded p-1 w-full"
            />

            {/* Price and Location in the same line */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={updatedRoom.price}
                        onChange={handleChange}
                        required
                        className="border rounded p-1 w-full"
                    />
                </div>
                <div>
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={updatedRoom.location}
                        onChange={handleChange}
                        required
                        className="border rounded p-1 w-full"
                    />
                </div>
            </div>

            {/* Images */}
            <div>
                <label htmlFor="images">Images (up to 6)</label>
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="border rounded p-1 w-full"
                />
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
                <h4 className="font-semibold">Amenities:</h4>
                {Object.keys(updatedRoom.amenities).map((amenity) => (
                    <label key={amenity} className="inline-block mr-4">
                        <input
                            type="checkbox"
                            name={amenity}
                            checked={updatedRoom.amenities[amenity]}
                            onChange={handleChange}
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
                <button type="submit" disabled={isUpdatingRoom} className="bg-blue-500 text-white py-1 px-3 rounded">
                    {isUpdatingRoom ? 'Updating Room...' : 'Update Room'}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 py-1 px-3 rounded">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default UpdateRoom;
