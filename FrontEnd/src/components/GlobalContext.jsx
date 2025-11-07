import React, { createContext, useEffect, useState } from 'react';
import { useUser, useAuth } from "@clerk/clerk-react";
import { apiClient, API_ENDPOINTS, getRoomUrl, getFaqUrl } from '../config/api';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const { isSignedIn } = useAuth(); 
    const { user } = useUser(); 
  
    const isAdmin = user?.publicMetadata?.role === "admin"; 


    // Room States
    const [bestRooms, setBestRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    // const [isRoomLoading, setIsRoomLoading] = useState(false);

    const [faqs, setFaqs] = useState([]);
    const [isFaqLoading, setIsFaqLoading] = useState(false);
    const [isPostingFaq, setIsPostingFaq] = useState(false);
    const [isUsingDummyRooms, setIsUsingDummyRooms] = useState(false);

    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
    const [isDeletingRoom, setIsDeletingRoom] = useState(false);
    //global loader
    const [globalLoader, setGolbalLoader] = useState(false)
    const [Cloc, setCloc]  =  useState()

    // const fetchBestRooms = async () => {
    //     try {
    //         const response = await axios.get("https://offcampusrooms.onrender.com/api/rooms/best-rooms");
    //         setBestRooms(response.data);
    //     } catch (error) {
    //         console.error('Error fetching best rooms:', error);
    //     } finally {
    //         setGolbalLoader(false);
    //     }
    // };

    // useEffect(()=>{
    //     fetchBestRooms()
    // }, [])


    const dummyRooms = [
        {
            _id: 'dummy-room-1',
            title: 'XXXXX Test Residence - Not Real',
            description: 'Dummy listing for testing the rooms page. This is not a real property.',
            location: 'gate 1',
            price: 1500,
            minutesAway: 8,
            images: ['https://via.placeholder.com/800x600.png?text=Dummy+Room+1'],
            amenities: {
                wifi: true,
                shower: true,
                bathtub: false,
                table: true,
                bed: true,
                electricity: true,
            },
            averageRating: 0,
            totalRatings: 0,
            contact: {
                phone: '000-XXX-ROOM',
                whatsapp: '000-XXX-ROOM',
                email: 'dummy-room1@placeholder.xxx',
            },
            coordinates: { lat: -23.8962, long: 29.4473 },
        },
        {
            _id: 'dummy-room-2',
            title: 'XXXXX Sample Apartment - Testing',
            description: 'This dummy data entry appears when the API request fails.',
            location: 'gate 2',
            price: 1800,
            minutesAway: 12,
            images: ['https://via.placeholder.com/800x600.png?text=Dummy+Room+2'],
            amenities: {
                wifi: true,
                shower: true,
                bathtub: true,
                table: true,
                bed: true,
                electricity: true,
            },
            averageRating: 0,
            totalRatings: 0,
            contact: {
                phone: '000-TEST-DATA',
                whatsapp: '000-TEST-DATA',
                email: 'dummy-room2@placeholder.xxx',
            },
            coordinates: { lat: -23.9001, long: 29.4487 },
        },
        {
            _id: 'dummy-room-3',
            title: 'XXXXX Demo Lodge - Placeholder',
            description: 'Placeholder accommodation used for testing purposes only.',
            location: 'motintane',
            price: 1600,
            minutesAway: 15,
            images: ['https://via.placeholder.com/800x600.png?text=Dummy+Room+3'],
            amenities: {
                wifi: false,
                shower: true,
                bathtub: false,
                table: true,
                bed: true,
                electricity: true,
            },
            averageRating: 0,
            totalRatings: 0,
            contact: {
                phone: '000-FAKE-LINE',
                whatsapp: '000-FAKE-LINE',
                email: 'dummy-room3@placeholder.xxx',
            },
            coordinates: { lat: -23.9045, long: 29.4502 },
        },
    ];

     const fetchAllRooms = async () => {
        setGolbalLoader(true);
            try {
                const response = await apiClient.get(API_ENDPOINTS.ALL_ROOMS);
                const rooms = Array.isArray(response?.data?.rooms) ? response.data.rooms : [];
                if (rooms.length === 0) {
                    setAllRooms(dummyRooms);
                    setIsUsingDummyRooms(true);
                } else {
                    setAllRooms(rooms);
                    setIsUsingDummyRooms(false);
                }
            } catch (error) {
                console.error('Error fetching all rooms:', error);
                setAllRooms(dummyRooms);
                setIsUsingDummyRooms(true);
            } finally {
                setGolbalLoader(false);
            }
        };
       
        const fetchFAQs = async (retryCount = 0) => {
            // Prevent multiple simultaneous calls
            if (isFaqLoading) {
                return;
            }
            
            setIsFaqLoading(true);
            try {
                const response = await apiClient.get(API_ENDPOINTS.GET_FAQS);
                setFaqs(response.data.faqs || []);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
                
                // Retry logic for network errors
                if (retryCount < 2 && (error.code === 'ECONNABORTED' || error.code === 'NETWORK_ERROR')) {
                    console.warn(`FAQ fetch failed, retrying... (attempt ${retryCount + 1}/3)`);
                    setTimeout(() => {
                        fetchFAQs(retryCount + 1);
                    }, 2000); // Wait 2 seconds before retry
                    return;
                }
                
                // Don't clear existing FAQs on error, just keep what we have
                if (error.code === 'ECONNABORTED') {
                    console.warn('FAQ fetch timed out after retries, keeping existing data');
                }
            } finally {
                setIsFaqLoading(false);
            }
        };
    
    const addRoom = async (newRoom) => {
        setIsAddingRoom(true);
        try {
            const response = await apiClient.post(API_ENDPOINTS.ADD_ROOM, newRoom);
            console.log(newRoom)
            console.log('ss')
            setAllRooms((prevRooms) => [...prevRooms, response.data]);
        } catch (error) {
            console.error('Error adding room jjjj:', error);
        } finally {
            setIsAddingRoom(false);
        }
    };

    const updateRoom = async (roomId, updatedRoom) => {
        setIsUpdatingRoom(true);
        try {
            const response = await apiClient.put(getRoomUrl(roomId, 'update'), updatedRoom);
            setAllRooms((prevRooms) =>
                prevRooms.map((room) => (room._id === roomId ? response.data : room))
            );
        } catch (error) {
            console.error('Error updating room:', error);
        } finally {
            setIsUpdatingRoom(false);
        }
    };

    const deleteRoom = async (roomId) => {
        setIsDeletingRoom(true);
        try {
            await apiClient.delete(getRoomUrl(roomId, 'delete'));
            setAllRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        } finally {
            setIsDeletingRoom(false);
        }
    };


    const addFaq = async (newFaq) => {
        setIsPostingFaq(true);
        try {
            const response = await apiClient.post(API_ENDPOINTS.ADD_FAQ, newFaq);
            // Append the newly created FAQ to the end (under existing ones)
            setFaqs((prevFaqs) => [...prevFaqs, response.data]);
        } catch (error) {
            console.error('Error adding FAQ:', error);
        } finally {
            setIsPostingFaq(false);
        }
    };

    const deleteFaq = async (faqId) => {
        try {
            await apiClient.delete(`${API_ENDPOINTS.DELETE_FAQ}/${faqId}`);
            setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };

    // Rating functions
    const addRating = async (ratingData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ADD_RATING, ratingData);
            return response.data;
        } catch (error) {
            console.error('Error adding rating:', error);
            throw error;
        }
    };

    const getRoomRatings = async (roomId) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.GET_ROOM_RATINGS}/${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room ratings:', error);
            throw error;
        }
    };

    // Comment functions
    const addComment = async (commentData) => {
        try {
            const response = await apiClient.post(API_ENDPOINTS.ADD_COMMENT, commentData);
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    };

    const getRoomComments = async (roomId) => {
        try {
            const response = await apiClient.get(`${API_ENDPOINTS.GET_ROOM_COMMENTS}/${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room comments:', error);
            throw error;
        }
    };

    // Statistics function
    const getStatistics = async () => {
        try {
            const response = await apiClient.get(API_ENDPOINTS.GET_STATISTICS);
            return response.data;
        } catch (error) {
            console.error('Error fetching statistics:', error);
            throw error;
        }
    };

    // FAQs will be fetched only when needed (e.g., on FAQ page)
    // Removed automatic fetching to improve performance

    return (
        <GlobalContext.Provider
            value={{
                bestRooms,
                allRooms,
                faqs,
                isFaqLoading,
                isAddingRoom,
                isUpdatingRoom,
                isDeletingRoom,
                isPostingFaq,
                addRoom,
                updateRoom,
                deleteRoom,
                addFaq,
                deleteFaq,
                fetchFAQs,
                globalLoader,
                fetchAllRooms,
                isLoggedIn: isSignedIn,
                isAdmin,
                addRating,
                getRoomRatings,
                addComment,
                getRoomComments,
                getStatistics,
                isUsingDummyRooms,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};