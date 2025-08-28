import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../GlobalContext';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { API_ENDPOINTS } from '../../config/api';

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
        },
        bestRooms: false,
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [fullscreenImage, setFullscreenImage] = useState(null); // For showing the full-screen image

    // const myLocationLat = 40.758896;
    // const myLocationLong = -73.985130;
    const [myLocationLat, setMyLocationLat] = useState(null)
    const [myLocationLong, setmyLocationLong] = useState(null)

    function getUserCoordinates() {
        console.log('🔍 Starting geolocation request...');
        
        if (navigator.geolocation) {
          console.log('✅ Geolocation is supported by this browser');
          
          navigator.geolocation.getCurrentPosition(
            function (position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              console.log('✅ Location obtained successfully:', { latitude, longitude });
              
              setMyLocationLat(latitude);
              setmyLocationLong(longitude);
              setNewRoom(prevRoom => ({
                ...prevRoom, 
                coordinates: { lat: latitude, long: longitude }
              }));
            },
            function (error) {
              console.error('❌ Geolocation error occurred:', {
                code: error.code,
                message: error.message,
                errorTypes: {
                  1: 'PERMISSION_DENIED - User denied location access',
                  2: 'POSITION_UNAVAILABLE - Location information unavailable', 
                  3: 'TIMEOUT - Location request timed out'
                }
              });
              
              // Fallback to default coordinates (University of Limpopo area)
              const fallbackLat = -23.888;
              const fallbackLong = 29.735;
              console.log('🔄 Using fallback coordinates:', { fallbackLat, fallbackLong });
              
              setMyLocationLat(fallbackLat);
              setmyLocationLong(fallbackLong);
              setNewRoom(prevRoom => ({
                ...prevRoom,
                coordinates: { lat: fallbackLat, long: fallbackLong }
              }));
              
              setError('Could not access your location. Using approximate campus location instead.');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000
            }
          );
        } else {
          console.error('❌ Geolocation is not supported by this browser');
          // Use fallback coordinates
          const fallbackLat = -23.888;
          const fallbackLong = 29.735;
          setMyLocationLat(fallbackLat);
          setmyLocationLong(fallbackLong);
          setNewRoom(prevRoom => ({
            ...prevRoom,
            coordinates: { lat: fallbackLat, long: fallbackLong }
          }));
          setError('Geolocation not supported. Using approximate campus location.');
        }
      }

      useEffect(() => {
        console.log('🚀 Component mounted, requesting user coordinates...');
        getUserCoordinates();
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
    
    const BURL = API_ENDPOINTS.CALCULATE_DISTANCE || `${import.meta.env.VITE_API_BASE_URL || 'https://offcampusrooms.onrender.com'}/api/google/distance`;
    
    // Calculate straight-line distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance;
    };

    const getDistance = async () => {
        console.log('🚗 Starting distance calculation...');
        console.log('📍 Request data:', everything);
        console.log('🌐 API URL:', BURL);
        console.log('📍 Coordinates:', { myLocationLat, myLocationLong });
        console.log('🎯 Destinations:', destinations);
        
        // Check network connectivity
        console.log('🌐 Network status:', navigator.onLine ? 'Online' : 'Offline');
        console.log('🔗 Current origin:', window.location.origin);
        console.log('🔗 Current protocol:', window.location.protocol);
        
        try {
            // First, test if the endpoint is reachable
            console.log('🔍 Testing endpoint connectivity...');
            try {
                // Test basic backend connectivity
                const baseUrl = BURL.split('/api/')[0];
                console.log('🔍 Testing base URL:', baseUrl);
                
                const testResponse = await axios.get(`${baseUrl}/api/rooms/all`, { timeout: 5000 });
                console.log('✅ Backend connectivity test passed:', testResponse.status);
            } catch (testErr) {
                console.log('⚠️ Backend connectivity test failed:', testErr.message);
                console.log('⚠️ This suggests the backend is not reachable');
            }
            
            console.log('📡 Making API request to:', BURL);
            console.log('📤 Request payload:', JSON.stringify(everything, null, 2));
            
            const response = await axios.post(BURL, everything, {
                timeout: 10000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('✅ Distance API response status:', response.status);
            console.log('✅ Distance API response data:', response.data);
            
            // Check if Google API is working
            if (response.data && response.data.status === 'REQUEST_DENIED') {
                console.log('⚠️ Google API billing issue detected, using fallback calculation');
                
                // Fallback: Calculate distances manually
                const userLat = myLocationLat;
                const userLon = myLocationLong;
                
                const gateDistances = destinations.map((gate, index) => {
                    const distanceKm = calculateDistance(userLat, userLon, gate.lat, gate.long);
                    const distanceText = `${distanceKm.toFixed(1)} km`;
                    // Estimate time: assume 40km/h average speed in urban area
                    const timeMinutes = Math.round((distanceKm / 40) * 60);
                    const timeText = `${timeMinutes} min`;
                    
                    console.log(`📏 Gate ${index + 1}: ${distanceText}, ${timeText}`);
                    return { distance: distanceText, time: timeText };
                });
                
                const distances = gateDistances.map(g => g.distance);
                const times = gateDistances.map(g => g.time);
                
                console.log('📏 Fallback distances:', distances);
                console.log('⏱️ Fallback times:', times);
                
                setDistance(distances);
                setTime(times);
                return;
            }
            
            if (response.data && response.data.rows && response.data.rows[0] && response.data.rows[0].elements) {
                const elements = response.data.rows[0].elements;
                console.log('📊 Distance elements:', elements);
                
                const distances = elements.map(c => c.distance?.text || 'N/A');
                const times = elements.map(c => c.duration?.text || 'N/A');
                
                console.log('📏 Distances:', distances);
                console.log('⏱️ Times:', times);
                
                setDistance(distances);
                setTime(times);
            } else {
                console.error('❌ Invalid response structure:', response.data);
                throw new Error('Invalid API response');
            }
        } catch (err) {
            console.error('❌ Distance calculation error, using fallback:');
            console.error('❌ Error message:', err.message);
            console.error('❌ Error name:', err.name);
            console.error('❌ Error code:', err.code);
            console.error('❌ Response status:', err.response?.status);
            console.error('❌ Response data:', err.response?.data);
            console.error('❌ Request config:', {
                url: err.config?.url,
                method: err.config?.method,
                baseURL: err.config?.baseURL,
                timeout: err.config?.timeout
            });
            console.error('❌ Full error object:', err);
            
            // Fallback calculation when API fails
            console.log('🔄 Using manual distance calculation...');
            const userLat = myLocationLat;
            const userLon = myLocationLong;
            
            const gateDistances = destinations.map((gate, index) => {
                const distanceKm = calculateDistance(userLat, userLon, gate.lat, gate.long);
                const distanceText = `${distanceKm.toFixed(1)} km`;
                // Estimate time: assume 40km/h average speed
                const timeMinutes = Math.round((distanceKm / 40) * 60);
                const timeText = `${timeMinutes} min`;
                
                console.log(`📏 Fallback Gate ${index + 1}: ${distanceText}, ${timeText}`);
                return { distance: distanceText, time: timeText };
            });
            
            const distances = gateDistances.map(g => g.distance);
            const times = gateDistances.map(g => g.time);
            
            console.log('📏 Manual distances:', distances);
            console.log('⏱️ Manual times:', times);
            
            setDistance(distances);
            setTime(times);
        }
    };

    useEffect(() => {
        console.log('🔄 Processing time data:', time);
        
        if (time.length === 3) { 
            const gateTimes = [
                { time: parseInt(time[0]) || 999, name: 'Gate 2' },
                { time: parseInt(time[1]) || 999, name: 'Gate 3' },
                { time: parseInt(time[2]) || 999, name: 'Gate 1' }
            ];
            
            console.log('🚪 Gate times calculated:', gateTimes);
    
            const closestGate = gateTimes.reduce((prev, curr) => (curr.time < prev.time ? curr : prev));
            console.log('🎯 Closest gate determined:', closestGate);
            
            setTimeToCampus(closestGate.time); 
            setGateName(closestGate.name);
    
            setNewRoom(prevRoom => ({
                ...prevRoom,
                minutesAway: closestGate.time,
                location: closestGate.name.toLowerCase(),
            }));
    
            console.log(`✅ ${closestGate.name} is the closest gate with a time of ${closestGate.time} minutes away.`);
        } else {
            console.log('⏳ Waiting for all gate times... Current count:', time.length);
        }
    }, [time]);
    



    
    useEffect(() => {
        const fetchData = async () => {
            console.log('🔄 Location coordinates changed:', { myLocationLat, myLocationLong });
            console.log('🔄 Destinations available:', destinations);
            console.log('🔄 Everything object:', everything);
            
            if (myLocationLat && myLocationLong) {
                console.log('✅ Both coordinates available, fetching distance...');
                console.log('✅ Coordinates:', { lat: myLocationLat, lng: myLocationLong });
                await getDistance(); 
            } else {
                console.log('⏳ Waiting for coordinates...', { 
                    lat: myLocationLat ? '✅' : '❌', 
                    long: myLocationLong ? '✅' : '❌' 
                });
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
        setError('');

        // Validation
        if (!newRoom.title.trim()) {
            setError('Room title is required.');
            return;
        }

        if (newRoom.images.length === 0) {
            setError('Please upload at least 1 image before submitting.');
            return;
        }

        if (!newRoom.price || newRoom.price <= 0) {
            setError('Price must be a positive number.');
            return;
        }

        if (!newRoom.availableRooms || newRoom.availableRooms < 0) {
            setError('Available rooms must be a positive number.');
            return;
        }

        if (!newRoom.location || !newRoom.minutesAway) {
            setError('Please wait for location calculation to complete.');
            return;
        }

        if (!newRoom.coordinates.lat || !newRoom.coordinates.long) {
            setError('Location coordinates are required. Please enable location access.');
            return;
        }

        // Prepare data for backend
        const roomData = {
            title: newRoom.title.trim(),
            description: newRoom.description.trim(),
            price: parseInt(newRoom.price),
            minutesAway: parseInt(newRoom.minutesAway),
            location: newRoom.location,
            amenities: newRoom.amenities,
            contact: {
                phone: newRoom.contact.phone.trim(),
                whatsapp: newRoom.contact.whatsapp.trim(),
                email: newRoom.contact.email.trim()
            },
            images: newRoom.images,
            availableRooms: parseInt(newRoom.availableRooms),
            coordinates: {
                lat: parseFloat(newRoom.coordinates.lat),
                long: parseFloat(newRoom.coordinates.long)
            },
            bestRoom: newRoom.bestRooms || false
        };

        try {
            await addRoom(roomData);
            navigate(-1);
        } catch (error) {
            console.error('Error adding room:', error);
            setError('Error adding room. Please check your connection and try again.');
        }
    };

    const handleImageClick = (image) => {
        setFullscreenImage(image);
    };

    const closeFullscreen = () => {
        setFullscreenImage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-16">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-white/10 backdrop-blur-lg border border-white/20 text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200"
                    >
                        <IoArrowBack size={20} />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Add New Room</h1>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6" aria-labelledby="add-room-form">

                        <div className="space-y-2">
                            <label className="text-white font-medium">Room Title *</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter room title"
                                value={newRoom.title}
                                onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-white font-medium">Room Description</label>
                            <textarea
                                name="description"
                                placeholder="Describe the room features and details"
                                value={newRoom.description}
                                onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                                rows={4}
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-white font-medium">Monthly Price (R) *</label>
                            <input
                                type="number"
                                name="price"
                                placeholder="0"
                                value={newRoom.price || ''}
                                onChange={(e) => setNewRoom({ ...newRoom, price: Math.max(0, parseInt(e.target.value) || 0) })}
                                required
                                min="0"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-white font-medium">Closest Gate</label>
                                {gateName ? (
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                        {gateName}
                                    </div>
                                ) : (
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="ml-2 text-gray-400">Calculating...</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-white font-medium">Distance to Campus</label>
                                {timeToCampus ? (
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {timeToCampus} min away
                                    </div>
                                ) : (
                                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-center">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span className="ml-2 text-gray-400">Calculating...</span>
                                    </div>
                                )}
                            </div>
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

                        <div className="space-y-4">
                            <label className="text-white font-medium">Amenities</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {Object.keys(newRoom.amenities).map((amenity) => (
                                    <label key={amenity} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer">
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
                                            className="w-4 h-4 text-blue-600 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
                                        />
                                        <span className="text-white text-sm capitalize">{amenity}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-white font-medium">Contact Information</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={newRoom.contact.phone}
                                    onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, phone: e.target.value } })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    placeholder="WhatsApp Number"
                                    value={newRoom.contact.whatsapp}
                                    onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, whatsapp: e.target.value } })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={newRoom.contact.email}
                                    onChange={(e) => setNewRoom({ ...newRoom, contact: { ...newRoom.contact, email: e.target.value } })}
                                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-white font-medium">Room Images (Max 5) *</label>
                            <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-white/40 transition-all duration-200">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center gap-2">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <span className="text-gray-400">Click to upload images</span>
                                        <span className="text-gray-500 text-sm">PNG, JPG up to 10MB each</span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-xl cursor-pointer group-hover:opacity-80 transition-opacity duration-200"
                                            onClick={() => handleImageClick(preview)}
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {fullscreenImage && (
                            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-50" onClick={closeFullscreen}>
                                <img src={fullscreenImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                                <button className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-200" onClick={closeFullscreen}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-white font-medium">Available Rooms *</label>
                            <input
                                type="number"
                                name="availableRooms"
                                placeholder="0"
                                value={newRoom.availableRooms || ''}
                                onChange={(e) => setNewRoom({ ...newRoom, availableRooms: Math.max(0, parseInt(e.target.value) || 0) })}
                                required
                                min="0"
                                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-red-400">{error}</span>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="flex-1 bg-white/10 border border-white/20 text-white font-semibold py-3 px-6 rounded-xl hover:bg-white/20 transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`flex-1 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                                    isAddingRoom ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
                                }`}
                                disabled={isAddingRoom}
                            >
                                {isAddingRoom ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Adding Room...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Add Room
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

export default AddRoomForm;
