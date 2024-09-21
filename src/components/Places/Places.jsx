import React from "react";
import PlaceCard from "./PlaceCard";
import roomsData from "../../assets/RoomsData";
import { Link } from "react-router-dom";

const Places = ({ handleOrderPopup }) => {
  return (
    <div className="dark:bg-gray-900 dark:text-white bg-gray-50 py-10">
      <section data-aos="fade-up" className="container">
        <h1 className="my-8 flex items-center justify-between  py-2 pl-2 text-2xl md:text-3xl font-bold">
          <span className="md:border-l-8 border-l-[6px] border-primary/50">Best Rooms to Rent</span>
          <span className="hover:bg-gradient-to-r transition-all duration-[0.2s] hover:cursor-pointer text-xs lg:text-[13px] from-primary to-secondary bg-sky-100 border border-primary  hover:from-secondary hover:bg-primary duration-600 hover:text-white px-3 py-2 md:py-3 rounded-full">
          <Link className="py-12 md:py-4" to="all">View All Rooms</Link>
          </span>
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
