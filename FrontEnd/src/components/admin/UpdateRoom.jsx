import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiX, FiTrash2 } from 'react-icons/fi'; // Import icons

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
        bestRoom: room.bestRoom,
    });

    const [previewImages, setPreviewImages] = useState(updatedRoom.images);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploading, setUploading] = useState(false);

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
            formData.append('cloud_name', 'daqzt4zy1');

            try {
                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/daqzt4zy1/image/upload',
                    formData
                );
                const imageUrl = response.data.secure_url;
                newImages.push(imageUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        setPreviewImages(newImages.slice(0, 6));
        setUpdatedRoom((prevRoom) => ({
            ...prevRoom,
            images: newImages,
        }));
        setUploading(false);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const confirmDelete = () => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            const newImages = updatedRoom.images.filter(img => img !== selectedImage);
            setPreviewImages(newImages);
            setUpdatedRoom((prevRoom) => ({ ...prevRoom, images: newImages }));
            setSelectedImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateRoom(room._id, updatedRoom);
        window.location.reload();
    };

    // const updateBestRoom = (e) => {
    //     setUpdatedRoom((prev) => ({
    //         ...prev,
    //         bestRoom: e.target.value,
    //     }));
    // };

    const updateBest = () => {
        setUpdatedRoom((prev) => ({
            ...prev,
            bestRoom: !prev.bestRoom, 
        }));
    };
    

    return (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto bg-gray-950 p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <label htmlFor="title" className="block text-gray-400 font-semibold">Title</label>
            <input
                type="text"
                name="title"
                value={updatedRoom.title}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full bg-slate-900 focus:outline-none focus:border-sky-700 border-gray-700 "
            />

            <label htmlFor="description" className="block text-gray-400 font-semibold">Description</label>
            <textarea
                name="description"
                value={updatedRoom.description}
                onChange={handleChange}
                required
                className="border rounded p-2 w-full bg-slate-900 focus:outline-none  focus:border-sky-700 border-gray-700"
            />

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-gray-400 font-semibold">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={updatedRoom.price}
                        onChange={handleChange}
                        required
                        className="border rounded p-2 w-full bg-slate-900 focus:outline-none  focus:border-sky-700 border-gray-700"
                    />
                </div>
                <div>
                    <label htmlFor="location" className="block text-gray-400 font-semibold">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={updatedRoom.location}
                        onChange={handleChange}
                        required
                        className="border rounded p-2 w-full bg-slate-900 focus:outline-none  focus:border-sky-700 border-gray-700"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="images" className="block text-gray-400 font-semibold">Images (up to 6)</label>
                <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="file:bg-dark/80 file:rounded-md file:px-4 file:py-2 file:border-[1px] file:text-white file:font-semibold text-gray-300 file:hover:cursor-pointer file:hover:bg-dark file:border-none p-2 w-full "
                />
                {uploading && <p className="text-dark">Uploading images...</p>}
            </div>

            <div className="grid grid-cols-3 gap-2">
                {previewImages.map((image, index) => (
                    <div key={index} className="relative">
                        <img
                            src={image}
                            alt={`Room Preview ${index + 1}`}
                            className="w-full h-24 object-cover cursor-pointer rounded"
                            onClick={() => handleImageClick(image)}
                        />
                    </div>
                ))}
            </div>

            {selectedImage && (
                <div className="fixed inset-0 backdrop-blur-l bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <img src={selectedImage} alt="Full-size preview" className="w-full max-w-lg rounded" />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-2 right-2 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-400"
                        >
                            <FiX size={20} />
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="absolute bottom-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-500"
                        >
                            <FiTrash2 size={20} />
                        </button>
                    </div>
                </div>
            )}

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

<div>
                <label htmlFor="bestRoom" className="block text-gray-700 font-semibold">Is this the Best Room?</label>
                <input
                    type="checkbox"
                    name="bestRoom"
                    checked={updatedRoom.bestRoom}
                    onClick={updateBest}
                    // onChange={updateBestRoom}
                    className="rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex flex-col space-x- gap-2">
                <button
                    type="submit"
                    disabled={isUpdatingRoom || uploading}
                    className="w-full bg-gradient-to-r from-black font-semibold to-dark/50 hover:from-dark lg:py-3 hover:to-dark/30 text-white py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                >
                    {isUpdatingRoom || uploading ? 'Updating Room...' : 'Update Room'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 lg:py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out"
                >
                    Cancel
                </button>
            </div>

        </form>
    );
};

export default UpdateRoom;
