import React, { useState, useRef, useEffect } from "react"; 
import Hero from "../components/Hero/Hero";
import NatureVid from "../assets/video/main.mp4";
import Places from "../components/Places/Places";
import Testimonial from "../components/Testimonial/Testimonial";
import Banner from "../components/Banner/Banner";
import OrderPopup from "../components/OrderPopup/OrderPopup";
// import roomsData from "../assets/RoomsData"; 

const Home = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const videoRef = useRef(null); // Use useRef to reference the video element

  const handleOrderPopup = (room) => {
    setSelectedRoom(room);
    setOrderPopup(true);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <>
      <div className="mt-">
        <div className="h-[500px] lg:h-[520px] 2xl:h-[600px] relative">
          <video
            ref={videoRef} 
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-[500px] lg:h-[520px] 2xl:h-[600px] w-full object-cover z-[-1]"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero handleOrderPopup={handleOrderPopup} />
        </div>
        <div>
          <Places handleOrderPopup={handleOrderPopup} />
          <Banner />
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
