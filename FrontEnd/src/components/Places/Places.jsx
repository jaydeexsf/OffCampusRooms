import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import { Link } from "react-router-dom";
import axios from "axios";
import Loader from "../../pages/Loader";

const Places = ({ handleOrderPopup }) => {
  const [bestRooms, setBestRooms] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://offcampusrooms.onrender.com/api/rooms/best-rooms');
        const rooms = response.data.bestRooms; 
        setBestRooms(rooms); 

      } catch (error) {
        console.error("Error fetching room data:", error);

      } finally {
        setLoading(false); 
      }
    };

    fetchRooms();
  }, []);

  // if (loading) {
  //   return <div className="dark:bg-gray-900 w-full justify-center flex gap-2 dark:text-white items-center bg-gray-50 py-10"> <span className="border-2 rounded-full w-4 h-4 border-black border-t-gray-500 animate-spin"></span> Loading...</div>;
  // }

  return (
    <div className="mainclassless dark:bg-gray-900 dark:text-white bg-gray-950 py-12 pt-[320px] xl:pt-[17vw] xxl:pt-[400px]">
      <section data-aos="fade-up" className="container">
        <div className="max-w-6xl mx-auto">
          <h1 className="my-6 flex flex sm:flex-row items-start sm:items-center justify-between py-2 text-2xl md:text-3xl font-bold">
            <span className="md:border-l-8 border-l-[6px] border-primary-500/40 pl-4 mb-4 sm:mb-0">Best Rooms</span>
            <span className="hover:bg-gradient-to-r transition-all duration-[0.2s] hover:cursor-pointer text-xs lg:text-[13px] bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 duration-600 hover:text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl">
              <Link to="all-rooms">View All Rooms</Link>
            </span>
          </h1>
          {loading
          ?
          <div 
                className="loader flex flex-col items-center"
            >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <span className="mt-3 text-white font-medium">Loading...</span>
            </div>  
          :
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {bestRooms ? (
              bestRooms.map((item, index) => (
                <PlaceCard
                  key={index}
                  {...item}
                  handleOrderPopup={() => handleOrderPopup(item)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">No Best Rooms Go To All Rooms Page.</p>
              </div>
            )}
          </div> }
        </div>
        </section>
      </div>
    );
  };

export default Places;