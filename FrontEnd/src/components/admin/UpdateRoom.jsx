import React, { useState, useContext } from 'react';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../config/api';
import { FiX, FiTrash2, FiUpload, FiEye } from 'react-icons/fi';

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
                // Use direct fetch instead of apiClient to avoid CORS issues with authorization header
                const response = await fetch(
                    'https://api.cloudinary.com/v1_1/daqzt4zy1/image/upload',
                    {
                        method: 'POST',
                        body: formData
                    }
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                const imageUrl = data.secure_url;
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 sm:pt-20 pb-8 sm:pb-16">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
                    <button 
                        onClick={onCancel} 
                        className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                        <FiX size={16} className="sm:w-5 sm:h-5" />
                    </button>
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-white">Update Room</h1>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8 max-w-2xl mx-auto shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-6" aria-labelledby="update-room-form">
                        <div className="space-y-1 sm:space-y-2">
                            <label className="text-white font-medium text-xs sm:text-sm md:text-base">Room Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter room title"
                                value={updatedRoom.title}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="text-white font-medium text-xs sm:text-sm md:text-base">Room Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe the room features and details"
                                value={updatedRoom.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
                            <div className="space-y-1 sm:space-y-2">
                                <label className="text-white font-medium text-xs sm:text-sm md:text-base">Monthly Price (R) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    placeholder="0"
                                    value={updatedRoom.price || ''}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div className="space-y-1 sm:space-y-2">
                                <label className="text-white font-medium text-xs sm:text-sm md:text-base">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    placeholder="Room location"
                                    value={updatedRoom.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-lg sm:rounded-xl px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            <label className="text-white font-medium text-xs sm:text-sm md:text-base">Room Images (Max 6)</label>
                            <div className="border-2 border-dashed border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 text-center hover:border-white/40 transition-all duration-200">
                                <input
                                    type="file"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="image-upload-edit"
                                />
                                <label htmlFor="image-upload-edit" className="cursor-pointer">
                                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                                        <FiUpload className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400" />
                                        <span className="text-gray-400 text-xs sm:text-sm md:text-base">Click to upload new images</span>
                                        <span className="text-gray-500 text-xs sm:text-sm">PNG, JPG up to 10MB each</span>
                                    </div>
                                </label>
                            </div>
                            {uploading && (
                                <div className="flex items-center justify-center gap-1 sm:gap-2 text-blue-400">
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin"></div>
                                    <span className="text-xs sm:text-sm">Uploading images...</span>
                                </div>
                            )}
                        </div>

                        {previewImages.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                                {previewImages.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Room Preview ${index + 1}`}
                                            className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg sm:rounded-xl cursor-pointer group-hover:opacity-80 transition-opacity duration-200"
                                            onClick={() => handleImageClick(image)}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                                            <FiEye className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedImage && (
                                <div className="relative max-w-4xl max-h-[90vh] p-4">
                                    <img src={selectedImage} alt="Full-size preview" className="max-w-full max-h-full object-contain rounded-xl" />
                                    <button
                                        onClick={() => setSelectedImage(null)}
                                        className="absolute top-2 right-2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200"
                                    >
                                        <FiX className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="absolute bottom-2 right-2 bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-500 transition-all duration-200"
                                    >
                                        <FiTrash2 className="w-6 h-6" />
                                    </button>
                            </div>
                        )}

                        <div className="space-y-2 sm:space-y-3 md:space-y-4">
                            <label className="text-white font-medium text-xs sm:text-sm md:text-base">Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                                {Object.keys(updatedRoom.amenities).map((amenity) => (
                                    <label key={amenity} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 md:p-3 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name={amenity}
                                            checked={updatedRoom.amenities[amenity]}
                                            onChange={handleChange}
                                            className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        <span className="text-white text-xs sm:text-sm capitalize">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1 sm:space-y-2">
                            <label className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 bg-white/5 border border-white/10 rounded-lg sm:rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="bestRoom"
                                    checked={updatedRoom.bestRoom}
                                    onClick={updateBest}
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-white font-medium text-xs sm:text-sm md:text-base">Mark as Best Room</span>
                            </label>
                        </div>

                        <div className="flex gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-3 md:pt-4">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-200 text-xs sm:text-sm md:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUpdatingRoom || uploading}
                                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-2 sm:py-2.5 md:py-3 px-3 sm:px-4 md:px-6 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base ${
                                    isUpdatingRoom || uploading ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                                }`}
                            >
                                {isUpdatingRoom || uploading ? (
                                    <>
                                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">Updating...</span>
                                        <span className="sm:hidden">Update...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Update Room</span>
                                        <span className="sm:hidden">Update</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateRoom;
