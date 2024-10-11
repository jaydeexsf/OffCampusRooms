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
        price: null,
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
        availableRooms: '',
        coordinates: {
            lat: null,
            long: null,
        }
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState(null); // For showing the full-screen image

    // const myLocationLat = 40.758896;
    // const myLocationLong = -73.985130;
    const [myLocationLat, setMyLocationLat] = useState(null)
    const [myLocationLong, setmyLocationLong] = useState(null)

    function getUserCoordinates() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              setMyLocationLat(latitude);
              setmyLocationLong(longitude);
              setNewRoom({...newRoom, coordinates: {...newRoom.coordinates, lat: latitude, long: longitude}});
            },
            function (error) {
              console.error("Error occurred. Error code: " + error.code);
            }
          );
        } else {
          console.error("Geolocation is not supported by this browser.");
        }
      }

      useEffect(()=> {
        getUserCoordinates()
      }, [])
      
    const destinations = [
        { long: 29.734105570334947, lat: -23.88695606138235 }, //Gate 2
        { long:  29.73331142439389, lat:-23.892532972613324}, // Gate 3
        { long:  29.738459289865034, lat:-23.880302596206946 }  // Gate 1
    ];
    
    const everything = {
        myLocationLat,
        myLocationLong,
        destinations
    };

    const [time, setTime] =  useState([])
    const [gateName, setGateName] =  useState()
    const [distance, setDistance] = useState([])
    const [timeToCampus, setTimeToCampus] = useState()
    
    const BURL = `https://offcampusrooms.onrender.com/api/google/distance`;
    
    const getDistance = async () => {
        try {
            const response = await axios.post(BURL, everything);
            setDistance(response.data.rows[0].elements.map(c => c.distance.text ))
            setTime(response.data.rows[0].elements.map(c => c.duration.text ))
            console.log(response.data);
            // setLocation(response.data); 
        } catch (err) {
            console.log('There was an error:', err.message);
        }
    };

    useEffect(() => {
        if (time.length === 3) { 
            const gateTimes = [
                { time: parseInt(time[0]), name: 'Gate 2' }, // Gate 1
                { time: parseInt(time[1]), name: 'Gate 3' }, // Gate 2
                { time: parseInt(time[2]), name: 'Gate 1' }  // Gate 3
            ];
    
            // ginding the gate with the smallest time
            const closestGate = gateTimes.reduce((prev, curr) => (curr.time < prev.time ? curr : prev));
            
            setTimeToCampus(closestGate.time); 
            setGateName(closestGate.name);
    
            setNewRoom(prevRoom => ({
                ...prevRoom,
                minutesAway: closestGate.time,
                location: closestGate.name.toLowerCase(),
            }));
    
            console.log(`${closestGate.name} is the closest gate with a time of ${closestGate.time} minutes away.`);
        }
    }, [time]);
    



    
    useEffect(() => {
        const fetchData = async () => {
            if (myLocationLat && myLocationLong) {
                await getDistance(); 
            }
        };
        fetchData();
    }, [myLocationLat, myLocationLong]);  
    
    
    
    
    



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

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="relative text-white bg-slate-900 pt-[100px] pb-16">
            <button onClick={() => navigate(-1)} className="absolute top-[70px] left-4 text-gray-100 hover:text-gray-300">
                <IoArrowBack size={24} />
            </button>

            <div className="bg-slate-950 p-8  rounded-md shadow-lg w-[90%] max-w-[500px] mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4 text-xs" aria-labelledby="add-room-form">
                    <h2 className="text-2xl font-bold text-gray-200 text-center mb-2" id="add-room-form">Add a New Room</h2>

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

                    <input
                            type="number"
                            name="price"
                            placeholder="Room Price"
                            value={newRoom.price}
                            onChange={(e) => setNewRoom({ ...newRoom, price: Math.max(0, e.target.value) })} // Prevent negative price
                            required
                            className="border border-gray-700 bg-slate-900 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-700"
                            aria-label="Room Price"
                        />

                    <div className="flex items-center justify-between gap-4">

                         {gateName ? 
                             <input
                            type="text"
                            name="minutesAway"
                            disabled={true}
                            placeholder="Minutes Away from Campus"
                            value={gateName + ' is the closest Gate'}
                            className="border-transparent hover:cursor-not-allowed border-b-gray-700 border-2 bg-transparent text-gray-400/50 rounded p-2 w-1/2 focus:outline-none focus:border-b-gray-300 focus:ring-sky-700"
                        /> :
                        <div className='w-[90%] flex justify-center'> 
                             <div className="border-t-2 border-t-white border-gray-600 border-2 rounded-full w-4 h-4 animate-spin" ></div>
                        </div>
                    }

                        {timeToCampus ? <input
                            type="text"
                            name="minutesAway"
                            disabled={true}
                            placeholder="Minutes Away from Campus"
                            value={timeToCampus + ' min away from campus'}
                            className="border-transparent hover:cursor-not-allowed border-b-gray-700 border-2 bg-transparent text-gray-400/50 rounded p-2 w-1/2 focus:outline-none focus:border-b-gray-300 focus:ring-sky-700"
                            aria-label="Minutes Away from Campus"
                        /> :
                         <div className='w-[50%] flex justify-center'>
                             <div className="border-t-2 border-t-white border-gray-600 border-2 rounded-full w-4 h-4 animate-spin" ></div>
                        </div>
                         }
                    </div>


                    {/* <select
                        className="border border-gray-700 text-gray-300 bg-slate-900 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-sky-700"
                        onChange={(e) => setNewRoom({ ...newRoom, location: e.target.value })}
                        aria-label="Room Location"
                    >
                        <option value="">Select Location</option>
                        <option value="gate 1">Gate 1</option>
                        <option value="gate 2">Gate 2</option>
                        <option value="gate 3">Gate 3</option>
                    </select> */}

                    <div className="space-y-2">
                        <h4 className="font-semibold text-md text-gray-200">Amenities:</h4>
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                            {Object.keys(newRoom.amenities).map((amenity) => (
                                <label key={amenity} className="flex text-gray-400 items-center space-x-1">
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

                    <h4 className="font-semibold text-md text-gray-200">Contact Information:</h4>
                    <div className="flex text-[10px] flex-col gap-4">
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
                                 onClick={() => handleImageClick(preview)} 
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
                        onChange={(e) => setNewRoom({ ...newRoom, availableRooms: Math.max(0, e.target.value) })} 
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
