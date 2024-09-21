import React from "react";
import PlaceCard from "./PlaceCard";
import roomsData from "../../assets/RoomsData";
import { Link } from "react-router-dom";

const Places = ({ handleOrderPopup }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 flex items-center justify-between border-l-8 border-primary/50 py-2 pl-2 text-3xl font-bold">
          <span>Best Rooms to Rent</span>
          <span className="bg-gradient-to-r transition-all duration-[1s] hover:cursor-pointer text-[15px] from-primary to-secondary hover:from-secondary hover:bg-primary duration-600 text-white px-3 py-1 rounded-full">
          <Link className="py-4" to="all">View All Rooms</Link>
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {roomsData.map((item, index) => (
            <PlaceCard
              key={index}
              {...item}
              handleOrderPopup={() => handleOrderPopup(item)}  // Pass the selected room data
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Places;
