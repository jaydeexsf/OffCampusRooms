import React from "react";
import RoomsImg from "../../assets/travelbox.png"; 
import { MdLocationOn, MdAttachMoney } from "react-icons/md";
import { IoIosWifi } from "react-icons/io";
import { FaBed } from "react-icons/fa";

const Banner = () => {
  return (
    <>
      <div className="min-h-[550px] bg-gray-100">
        <div className="min-h-[550px] flex justify-center items-center backdrop-blur-xl py-12 sm:py-0">
          <div className="container">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div data-aos="flip-up">
                <img
                  src={RoomsImg}
                  alt="rooms img"
                  className="max-w-[450px] h-[350px] w-full mx-auto drop-shadow-[5px_5px_12px_rgba(0,0,0,0.7)] object-cover"
                />
              </div>
              <div className="flex flex-col justify-center gap-6 sm:pt-0 lg:px-16">
                <h1 data-aos="fade-up" className="text-2xl sm:text-3xl font-bold">
                  Find the Best Rooms Near University of Limpopo
                </h1>
                <p data-aos="fade-up" className="text-sm text-gray-500 tracking-wide leading-8">
                  Discover affordable and convenient student accommodation options with all the essential amenities. Get rooms close to the University of Limpopo that fit your budget.
                </p>
                <div data-aos="zoom-in" className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <MdLocationOn className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100 dark:bg-violet-400" />
                      <p>Close to Campus</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MdAttachMoney className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100 dark:bg-orange-400" />
                      <p>Affordable Pricing</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <IoIosWifi className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100 dark:bg-green-400" />
                      <p>Free Wi-Fi</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <FaBed className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-yellow-100 dark:bg-yellow-400" />
                      <p>Furnished Rooms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;
