import React, { useState } from "react";
import Hero from "../components/Hero/Hero";
import NatureVid from "../assets/video/main.mp4";
import Places from "../components/Places/Places";
import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import BannerPic from "../components/BannerPic/BannerPic";
import BannerImg from "../assets/cover-women.jpg";
import Banner2 from "../assets/travel-cover2.jpg";
import OrderPopup from "../components/OrderPopup/OrderPopup";
// import roomsData from "../assets/RoomsData"; 

const Home = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleOrderPopup = (room) => {
    setSelectedRoom(room);
    setOrderPopup(true);
  };

  return (
    <>
      <div  className="mt-">
        <div className="h-[500px] lg:h-[500px] relative">
          <video
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-[500px] lg:h-[500px] w-full object-cover z-[-1]"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero />
        </div>
        <div>
          <Places handleOrderPopup={handleOrderPopup} />
          <Banner />
          <BannerPic img={Banner2} />
          <Testimonial />
          <OrderPopup
            orderPopup={orderPopup}
            setOrderPopup={setOrderPopup}
            roomDetails={selectedRoom}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
