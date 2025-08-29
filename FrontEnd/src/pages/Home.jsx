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
import DriversShowcase from "../components/DriversShowcase/DriversShowcase";
import OrderPopup from "../components/OrderPopup/OrderPopup";
import MapTest from "../components/Location/MapTest"; // Temporary import for debugging
// import roomsData from "../assets/RoomsData"; 

const Home = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showMapTest, setShowMapTest] = useState(false); // Temporary state for debugging

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

        {/* Drivers Showcase Section */}
        <DriversShowcase />

        {/* Student Testimonials Section */}
        <StudentTestimonials />

        {/* Temporary Map Test Section for Debugging */}
        <div className="py-16">
          <section data-aos="fade-up" className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  🗺️ <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Google Maps Debug
                  </span>
                </h2>
                <p className="text-gray-400">Test your Google Maps API key configuration</p>
                <button
                  onClick={() => setShowMapTest(!showMapTest)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  {showMapTest ? 'Hide' : 'Show'} Map Test
                </button>
              </div>
              
              {showMapTest && (
                <div data-aos="fade-up">
                  <MapTest />
                </div>
              )}
            </div>
          </section>
        </div>

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
