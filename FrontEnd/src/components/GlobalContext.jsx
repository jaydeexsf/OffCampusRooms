import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useUser, useAuth } from "@clerk/clerk-react";
import { API_ENDPOINTS, getRoomUrl, getFaqUrl } from '../config/api';

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


     const fetchAllRooms = async () => {
        setGolbalLoader(true);
            try {
                const response = await axios.get(API_ENDPOINTS.ALL_ROOMS);
                setAllRooms(response.data.rooms);
            } catch (error) {
                console.error('Error fetching all rooms:', error);
            } finally {
                setGolbalLoader(false);
            }
        };
       
        const fetchFAQs = async () => {
            setIsFaqLoading(true);
            try {
                const response = await axios.get(API_ENDPOINTS.GET_FAQS);
                setFaqs(response.data);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setIsFaqLoading(false);
            }
        };
    
    const addRoom = async (newRoom) => {
        setIsAddingRoom(true);
        try {
            const response = await axios.post(API_ENDPOINTS.ADD_ROOM, newRoom);
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
            const response = await axios.put(getRoomUrl(roomId, 'update'), updatedRoom);
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
            await axios.delete(getRoomUrl(roomId, 'delete'));
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
            const response = await axios.post(API_ENDPOINTS.ADD_FAQ, newFaq);
            setFaqs((prevFaqs) => [...prevFaqs, response.data]);
        } catch (error) {
            console.error('Error adding FAQ:', error);
        } finally {
            setIsPostingFaq(false);
        }
    };

    const deleteFaq = async (faqId) => {
        try {
            await axios.delete(getFaqUrl(faqId, 'delete'));
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
                fetchAllRooms,
                isLoggedIn: isSignedIn,
                isAdmin,

            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};