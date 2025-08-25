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

  return (
    <div className="bg-gray-950 py-16">
      <section data-aos="fade-up" className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Best <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  Rooms
                </span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
            </div>
            
            <Link 
              to="/all-rooms"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              View All Rooms
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/30"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 absolute top-0 left-0"></div>
              </div>
              <p className="mt-6 text-gray-300 font-medium">Loading best rooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bestRooms && bestRooms.length > 0 ? (
                bestRooms.map((item, index) => (
                  <div
                    key={index}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <PlaceCard
                      {...item}
                      handleOrderPopup={() => handleOrderPopup(item)}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 rounded-2xl p-12 text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Best Rooms Available</h3>
                    <p className="text-gray-400 mb-6">
                      We're currently updating our best rooms selection. Check out all available rooms instead!
                    </p>
                    <Link 
                      to="/all-rooms"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Browse All Rooms
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Places;