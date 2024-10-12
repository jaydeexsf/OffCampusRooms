import React, { useState, useEffect } from "react";
import PlaceCard from "./PlaceCard";
import { Link } from "react-router-dom";
import axios from "axios";

const Places = ({ handleOrderPopup }) => {
  const [bestRooms, setBestRooms] = useState([]); // State to store the fetched room data
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch rooms from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('https://offcampusrooms.onrender.com/api/rooms/best-rooms'); // Specify the full URL
        const rooms = response.data.bestRooms; 
        setBestRooms(rooms); // Set the fetched rooms data
        console.log(response); 

      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false whether the fetch was successful or not
      }
    };

    fetchRooms();
  }, []);

  if (bestRooms) {
    console.log(bestRooms)
  }

  if (loading) {
    return <div className="dark:bg-gray-900 flex gap-2 dark:text-white items-center bg-gray-50 py-10"> <span className="border-2 rounded-full w-4 h-4 border-black border-t-gray-500 animate-spin"></span> Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-900 dark:text-white mt-8 bg-gray-50 py-0 pt-6">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 flex items-center justify-between py-2 pl-2 text-2xl md:text-3xl font-bold">
          <span className="md:border-l-8 border-l-[6px] border-primary/40 ">   Best Rooms to Rent</span>
          <span className="hover:bg-gradient-to-r transition-all duration-[0.2s] hover:cursor-pointer text-xs lg:text-[13px] bg-gradient-r from-primary to-secondary bg-dark/10 border border-primary hover:from-secondary hover:bg-primary duration-600 hover:text-white px-3 py-2 md:py- rounded-full">
            <Link className="py-12 md:py-4" to="all-rooms">View All Rooms</Link>
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestRooms ? ( // Check if there are any rooms to display
            bestRooms.map((item, index) => (
              <PlaceCard
                key={index}
                {...item} // Spread the room data into PlaceCard props
                handleOrderPopup={() => handleOrderPopup(item)} // Pass the selected room data
              />
            ))
          ) : (
            <div>No Best Rooms Go To All Rooms Page.</div> // Message if no rooms are found
          )}
        </div>
      </section>
    </div>
  );
};

export default Places;