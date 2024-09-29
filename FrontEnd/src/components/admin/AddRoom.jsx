import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddRoomForm = () => {
    const { addRoom, isAddingRoom } = useContext(GlobalContext);
    const navigate = useNavigate();
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
    const [fullscreenImage, setFullscreenImage] = useState(null); // For showing the full-screen image

    
    const myLocation = '40.758896,-73.985130'; // Times Square
    const destination = '40.785091,-73.968285'; 

    const myLocationLat = 40.758896;
    const myLocationLong = -73.985130;
    const cdestinationLat = 40.785091;
    const destinationLong = -73.968285;
    
    const everything = {
        myLocationLat,
        myLocationLong,
        cdestinationLat,
        destinationLong
    };
    
    const URL = `http://localhost:5000/api/google/distance`;
    
    const getDistance = async () => {
        try {
            const response = await axios.post(URL, everything);
            console.log(response.data);
            // setLocation(response.data) // Uncomment and define setLocation accordingly
        } catch (err) {
            console.log('There was an error:', err.message);
        }
    };
    
    useEffect(() => {
        getDistance();
    }, []);
    
    
    
    

    
    
    
    ///////////////////////// // location tracker ////////////////////////////////

    // const predefinedLocations = [
    //     { name: 'Gate 1', lng: -23.880706185486616, lat: 29.738466820385696},
    //     { name: 'Gate 2', lng: -23.88694413658466, lat: 29.73424542827584, },
    //     { name: 'Gate 3', lng: -23.89254715591565, lat: 29.73356772910418 },
    // ];

    // useEffect(() => {
    //     // Get user location on component mount
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         const userLocation = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude,
    //         };
    //         console.log('User Coordinates:', userLocation);
    //         calculateDistances(userLocation);
    //     }, (error) => {
    //         console.error('Error getting user location:', error);
    //         setError('Could not get user location. Please allow location access.');
    //     });
    // }, []);

    // const calculateDistances = async (userLocation) => {
    //     const origins = `${userLocation.lat},${userLocation.lng}`;
    //     const destinations = predefinedLocations.map(location => `${location.lat},${location.lng}`).join('|');

    //     try {
    //         const response = await axios.get(`http://localhost:5000/api/faq/distance`, {
    //             params: {
    //                 origins,
    //                 destinations,
    //            // Replace with your API 
    //             },
    //         });

    //         const distances = response.data.rows[0].elements;
    //         let shortestDistance = Infinity;
    //         let closestLocation = null;

    //         distances.forEach((distance, index) => {
    //             if (distance.status === 'OK') {
    //                 const distanceValue = distance.distance.value; // in meters
    //                 const durationValue = distance.duration.value; // in seconds

    //                 console.log(`Distance to ${predefinedLocations[index].name}:`, distance.text);
    //                 console.log(`Time to ${predefinedLocations[index].name}:`, distance.duration.text);

    //                 if (distanceValue < shortestDistance) {
    //                     shortestDistance = distanceValue;
    //                     closestLocation = predefinedLocations[index];
    //                 }
    //             }
                
    //         });

    //         if (closestLocation) {
    //             console.log('Closest Location:', closestLocation.name);
    //             console.log('Shortest Distance (m):', shortestDistance);
    //             console.log('Estimated Time (min):', Math.round((shortestDistance / 1000) / 60)); // converting meters to km and seconds to minutes
    //         }
    //     } catch (error) {
    //         console.error('Error fetching distances:', error);
    //         setError('Failed to calculate distances. Please try again.');
    //     }
    // };

    ////////////////////////////////////////////////////////////

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

        if (files.length > 5) {
            setError('You can upload a maximum of 5 images.');
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Additional validation
        if (newRoom.images.length === 0) {
            setError('Please upload at least 1 image before submitting.');
            return;
        }

        if (newRoom.price <= 0) {
            setError('Price must be a positive number.');
            return;
        }

        if (newRoom.availableRooms < 0) {
            setError('Available rooms cannot be negative.');
            return;
        }

        try {
            await addRoom(newRoom);
            navigate(-1);
        } catch (error) {
            setError('Error adding room. Please try again later.');
        }
    };

    const handleImageClick = (image) => {
        setFullscreenImage(image);
    };

    // Function to close the fullscreen view
    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="relative text-white bg-slate-900 pt-[100px] pb-16">
            <button onClick={() => navigate(-1)} className="absolute top-[70px] left-4 text-gray-100 hover:text-gray-300">
                <IoArrowBack size={24} />
            </button>

            <div className="bg-slate-950 p-8  rounded-md shadow-lg w-full max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4" aria-labelledby="add-room-form">
                    <h2 className="text-2xl font-bold text-gray-200 text-center mb-6" id="add-room-form">Add a New Room</h2>

                    <input
                        type="text"
                        name="title"
                        placeholder="Room Title"
                        value={newRoom.title}
                        onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                        required
                        className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                        aria-label="Room Title"
                    />

                    <textarea
                        name="description"
                        placeholder="Room Description"
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                        aria-label="Room Description"
                    ></textarea>

                    <div className="flex gap-4">
                        <input
                            type="number"
                            name="price"
                            placeholder="Room Price"
                            value={newRoom.price}
                            onChange={(e) => setNewRoom({ ...newRoom, price: Math.max(0, e.target.value) })} // Prevent negative price
                            required
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="Room Price"
                        />

                        <input
                            type="number"
                            name="minutesAway"
                            placeholder="Minutes Away from Campus"
                            value={newRoom.minutesAway}
                            onChange={(e) => setNewRoom({ ...newRoom, minutesAway: e.target.value })}
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-1/2 focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="Minutes Away from Campus"
                        />
                    </div>

                    <select
                        className="border border-gray-700 text-gray-300 bg-slate-900 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                        onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                        aria-label="Room Location"
                    >
                        <option value="">Select Location</option>
                        <option value="gate 1">Gate 1</option>
                        <option value="gate 2">Gate 2</option>
                        <option value="gate 3">Gate 3</option>
                    </select>

                    <div className="space-y-2">
                        <h4 className="font-semibold text-lg text-gray-200">Amenities:</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(newRoom.amenities).map((amenity) => (
                                <label key={amenity} className="flex text-gray-400 items-center space-x-2">
                                    <input
                                    className="bg-green-700 focus:bg-green-900 text-red-700 mr-2"
                                        type="checkbox"
                                        name={amenity}
                                        checked={newRoom.amenities[amenity]}
                                        onChange={(e) =>
                                            setNewRoom({
                                                ...newRoom,
                                                amenities: { ...newRoom.amenities, [amenity]: e.target.checked }
                                            })
                                        }
                                        aria-label={`Amenity: ${amenity.charAt(0).toUpperCase() + amenity.slice(1)}`}
                                    />
                                    <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <h4 className="font-semibold text-lg text-gray-200">Contact Information:</h4>
                    <div className="flex flex-col gap-4">
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            value={newRoom.contact.phone}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, phone: e.target.value } })}
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="Phone Number"
                        />
                        <input
                            type="text"
                            name="whatsapp"
                            placeholder="WhatsApp Number"
                            value={newRoom.contact.whatsapp}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, whatsapp: e.target.value } })}
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="WhatsApp Number"
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={newRoom.contact.email}
                            onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, email: e.target.value } })}
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="Email Address"
                        />
                    </div>

                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="border border-gray-700 bg-slate-900 text-gray-700 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                        aria-label="Upload Room Images"
                    />
                    
                    {imagePreviews.length > 0 && (
                         <div className="flex gap-4 my-4">
                         {imagePreviews.map((preview, index) => (
                             <img
                                 key={index}
                                 src={preview}
                                 alt={`Preview ${index + 1}`}
                                 className="h-20 w-20 object-cover rounded cursor-pointer"
                                 onClick={() => handleImageClick(preview)} // Open image in full screen
                             />
                         ))}
                     </div>
                    )}

                     {fullscreenImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={closeFullscreen}>
                    <img src={fullscreenImage} alt={fullscreenImage.title} className="max-w-full max-h-full object-contain" />
                    <button className="absolute top-4 right-4 text-white text-2xl" onClick={closeFullscreen}>✕</button>
                </div>
            )}

                    <input
                        type="number"
                        name="availableRooms"
                        placeholder="Number of Available Rooms"
                        value={newRoom.availableRooms}
                        onChange={(e) => setNewRoom({ ...newRoom, availableRooms: Math.max(0, e.target.value) })} // Prevent negative available rooms
                        required
                        className="border bg-slate-900 border-gray-700 text-white rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                        aria-label="Number of Available Rooms"
                    />

                    {error && <div className="text-red-500">{error}</div>}

                    <button
                        type="submit"
                        className={`bg-gradient-to-r from-black to-dark/50 hover:from-dark/50 hover:to-black rounded-full text-white font-bold py-2  hover:bg-dark/80 transition duration-300 w-full ${
                            isAddingRoom ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={isAddingRoom}
                    >
                        {isAddingRoom ? 'Adding Room...' : 'Add Room'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 rounded-full text-gray-700 font-bold py-2 hover:bg-gray-400 transition duration-300 w-full"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddRoomForm;
