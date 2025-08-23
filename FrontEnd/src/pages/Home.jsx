import React, { useState, useRef, useEffect } from "react"; 
import Hero from "../components/Hero/Hero";
import NatureVid from "../assets/video/main.mp4";
import Places from "../components/Places/Places";
import Statistics from "../components/Statistics/Statistics";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import FeaturedLocations from "../components/FeaturedLocations/FeaturedLocations";
import Banner from "../components/Banner/Banner";
import WhyChooseUs from "../components/WhyChooseUs/WhyChooseUs";
import StudentTestimonials from "../components/StudentTestimonials/StudentTestimonials";
import LatestNews from "../components/LatestNews/LatestNews";
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
      <div className="gradient-dark bg-gray-950">
        {/* Hero Section with Video Background */}
        <div className="relative">
          <video
            ref={videoRef} 
            autoPlay
            loop
            muted
            className="absolute right-0 top-0 h-full w-full object-cover z-[-1]"
          >
            <source src={NatureVid} type="video/mp4" />
          </video>
          <Hero handleOrderPopup={handleOrderPopup} />
        </div>

        {/* Statistics Section */}
        <Statistics />

        {/* Best Rooms Section */}
        <Places handleOrderPopup={handleOrderPopup} />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Featured Locations Section */}
        <FeaturedLocations />


        {/* Why Choose Us Section */}
        <WhyChooseUs />

        {/* Student Testimonials Section */}
        <StudentTestimonials />

        {/* Latest News Section */}
        <LatestNews />

        {/* Order Popup */}
        <OrderPopup
          orderPopup={orderPopup}
          setOrderPopup={setOrderPopup}
          roomDetails={selectedRoom}
        />
      </div>
    </>
  );
};

export default Home;
