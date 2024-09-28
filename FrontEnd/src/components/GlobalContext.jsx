import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the context
export const GlobalContext = createContext();

// Provider component to wrap the app
export const GlobalProvider = ({ children }) => {
    // Room State
    const [bestRooms, setBestRooms] = useState([]);
    const [allRooms, setAllRooms] = useState([]);
    // const [isRoomLoading, setIsRoomLoading] = useState(false);

    // FAQ State
    const [faqs, setFaqs] = useState([]);
    const [isFaqLoading, setIsFaqLoading] = useState(false);
    const [isPostingFaq, setIsPostingFaq] = useState(false);

    // Loader
    const [isAddingRoom, setIsAddingRoom] = useState(false);
    const [isUpdatingRoom, setIsUpdatingRoom] = useState(false);
    const [isDeletingRoom, setIsDeletingRoom] = useState(false);
    //global loader
    const [globalLoader, setGolbalLoader] = useState(false)
    const [Cloc, setCloc]  =  useState()

    // Fetch Best Rooms on default or when user visits /best-rooms
    const fetchBestRooms = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/rooms/best-rooms");
            setBestRooms(response.data[0]);
        } catch (error) {
            console.error('Error fetching best rooms:', error);
        } finally {
            setGolbalLoader(false);
        }
    };

    // const fetchAllRooms = async () => {
    //     setIsRoomLoading(true);
    //     try {
    //         const response = await axios.get("http://localhost:5000/api/rooms/all");
    //         const rooms = response.data.rooms; 
    //         setAllRooms(rooms); 
    //     } catch (error) {
    //         console.error('Error fetching all rooms:', error);
    //     } finally {
    //         setGolbalLoader(false);
    //     }
    // };

    ///////////////////////////////////////////
    // useEffect(() => {
    //     const fetchAllRooms = async () => {
    //       try {
    //         const response = await axios.get('http://localhost:5000/api/rooms/all'); // Specify the full URL
    //         const rooms = response.data.rooms; 
    //         setAllRooms(rooms); // Set the fetched rooms data
    //       } catch (error) {
    //         console.error("Error fetching room data:", error);
    //       } finally {
    //         setLoading(false); // Ensure loading is set to false whether the fetch was successful or not
    //       }
    //     };
    
    //     fetchAllRooms();
    //   }, []);



    ////////////////////////////////

     const fetchAllRooms = async () => {
        setGolbalLoader(true);
            try {
                const response = await axios.get("http://localhost:5000/api/rooms/all");
                setAllRooms(response.data.rooms);
                console.log(response.data.rooms)
                console.log('dd')
            } catch (error) {
                console.error('Error fetching all rooms:', error);
            } finally {
                setGolbalLoader(false);
            }
        };
        // useEffect(()=>{
        //     fetchAllRooms()
        // }, [])

        // useEffect(()=>{
        //     if(allRooms) {
        //         console.log(allRooms)
        //     }
        // }, [allRooms])

        // Fetching FAQs on /faqs route
        const fetchFAQs = async () => {
            setIsFaqLoading(true);
            try {
                const response = await axios.get("http://localhost:5000/api/faq/questions");
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setIsFaqLoading(false);
            }
        };

    // useEffect(()=> {
    //    setCloc(location.pathname)

    //     if (Cloc === '/all') {
    //         setGolbalLoader(true)
    //         fetchAllRooms()
    //         console.log('wors ss s  king')
    //     } else if (Cloc === '/frequetly-asked-questions') {
    //         fetchFAQs()
    //         console.log('jhjh jhjh')
    //     }
    // }, [location.path])
    // console.log(Cloc)
    
    // Add Room
    const addRoom = async (newRoom) => {
        setIsAddingRoom(true);
        try {
            const response = await axios.post("http://localhost:5000/api/rooms/add-room", newRoom);
            console.log(newRoom)
            console.log('ss')
            setAllRooms((prevRooms) => [...prevRooms, response.data]);
        } catch (error) {
            console.error('Error adding room jjjj:', error);
        } finally {
            setIsAddingRoom(false);
        }
    };

    // Update Room
    const updateRoom = async (roomId, updatedRoom) => {
        setIsUpdatingRoom(true);
        try {
            const response = await axios.put(`http://localhost:5000/api/rooms/update-room/${roomId}`, updatedRoom);
            setAllRooms((prevRooms) =>
                prevRooms.map((room) => (room._id === roomId ? response.data : room))
            );
        } catch (error) {
            console.error('Error updating room:', error);
        } finally {
            setIsUpdatingRoom(false);
        }
    };

    // Delete Room
    const deleteRoom = async (roomId) => {
        setIsDeletingRoom(true);
        try {
            await axios.delete(`http://localhost:5000/api/rooms/delete-room/${roomId}`);
            setAllRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        } finally {
            setIsDeletingRoom(false);
        }
    };


    // Add FAQ
    const addFaq = async (newFaq) => {
        setIsPostingFaq(true);
        try {
            const response = await axios.post("http://localhost:5000/api/faq/add-qanda", newFaq);
            setFaqs((prevFaqs) => [...prevFaqs, response.data]);
        } catch (error) {
            console.error('Error adding FAQ:', error);
        } finally {
            setIsPostingFaq(false);
        }
    };

    // Delete FAQ
    const deleteFaq = async (faqId) => {
        try {
            await axios.delete(`http://localhost:5000/api/rooms/del-faq/${faqId}`);
            setFaqs((prevFaqs) => prevFaqs.filter((faq) => faq._id !== faqId));
        } catch (error) {
            console.error('Error deleting FAQ:', error);
        }
    };

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
                globalLoader,
                fetchAllRooms
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
