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
        const response = await axios.get('http://localhost:5000/api/rooms/all'); // Specify the full URL
        const rooms = response.data.rooms; 
        setBestRooms(rooms); // Set the fetched rooms data
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false); // Ensure loading is set to false whether the fetch was successful or not
      }
    };

    fetchRooms();
  }, []);

  console.log(bestRooms); 

  if (loading) {
    return <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 pt-0 py-4">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 flex items-center justify-between py-2 pl-2 text-2xl md:text-3xl font-bold">
          <span className="md:border-l-8 border-l-[6px] border-primary/50">Best Rooms to Rent</span>
          <span className="hover:bg-gradient-to-r transition-all duration-[0.2s] hover:cursor-pointer text-xs lg:text-[13px] from-primary to-secondary bg-sky-100 border border-primary hover:from-secondary hover:bg-primary duration-600 hover:text-white px-3 py-2 md:py- rounded-full">
            <Link className="py-12 md:py-4" to="all">View All Rooms</Link>
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bestRooms.length > 0 ? ( // Check if there are any rooms to display
            bestRooms.map((item, index) => (
              <PlaceCard
                key={index}
                {...item} // Spread the room data into PlaceCard props
                handleOrderPopup={() => handleOrderPopup(item)} // Pass the selected room data
              />
            ))
          ) : (
            <div>No rooms available.</div> // Message if no rooms are found
          )}
        </div>
      </section>
    </div>
  );
};

export default Places;