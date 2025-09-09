import React, { useState, useEffect, useRef } from 'react';
import { FiHome, FiUsers, FiStar, FiMapPin } from 'react-icons/fi';
import { API_ENDPOINTS, apiClient } from '../../config/api';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalRatings: 0,
    averageRating: 0,
    averageDistance: 0
  });

  // Use a ref to track if stats have been fetched
  const statsFetchedRef = useRef(false);

  const fetchStats = async () => {
    console.log('[Statistics] Fetching stats...');
    try {
      const response = await apiClient.get(API_ENDPOINTS.GET_STATISTICS);
      const data = response.data;
      
      setStats({
        totalRooms: data.totalRooms || 0,
        totalRatings: data.totalRatings || 0,
        averageRating: data.averageRating || 0,
        averageDistance: data.averageDistance || 0
      });
      
      // Mark stats as fetched
      statsFetchedRef.current = true;
      console.log('[Statistics] Stats fetched successfully');
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Fallback to basic room count
      try {
        const roomsResponse = await apiClient.get(API_ENDPOINTS.ALL_ROOMS);
        const rooms = roomsResponse.data.rooms || [];
        const avgDistance = rooms.length > 0 
          ? Math.round(rooms.reduce((sum, room) => sum + (room.minutesAway || 0), 0) / rooms.length)
          : 0;

        setStats({
          totalRooms: rooms.length,
          totalRatings: 0,
          averageRating: 0,
          averageDistance: avgDistance
        });
        
        // Mark stats as fetched even for fallback
        statsFetchedRef.current = true;
      } catch (fallbackError) {
        console.error('Error fetching fallback statistics:', fallbackError);
      }
    }
  };

  useEffect(() => {
    // Only fetch stats if they haven't been fetched before
    if (statsFetchedRef.current) {
      console.log('[Statistics] Stats already fetched, skipping...');
      return;
    }

    console.log('[Statistics] Initial stats fetch...');
    fetchStats();
  }, []);

  // Function to manually refresh stats (for admin purposes)
  const refreshStats = () => {
    console.log('[Statistics] Manually refreshing stats...');
    statsFetchedRef.current = false;
    fetchStats();
  };

  const statItems = [
    {
      icon: <FiHome className="w-6 h-6" />,
      value: stats.totalRooms,
      label: "Total Rooms",
      description: "Available listings",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      value: stats.totalRatings,
      label: "Total Ratings",
      description: "Student reviews",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: <FiStar className="w-6 h-6" />,
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : 'N/A',
      label: "Average Rating",
      description: "Student satisfaction",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/30"
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      value: `${stats.averageDistance}min`,
      label: "Avg. Distance",
      description: "From campus",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30"
    }
  ];

  return (
    <section className="py-20 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  University of Limpopo
                </span> Students
              </h2>
              {/* Refresh button for admin purposes */}
              <button
                onClick={refreshStats}
                className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200 hover:scale-110"
                title="Refresh Statistics"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Join thousands of students who have found their perfect accommodation through our platform
            </p>
          </div>

         {/* Statistics Grid */}
          <div 
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" 
            data-aos="fade-up" 
            data-aos-delay="200"
          >
            {statItems.map((item, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${item.bgColor} border ${item.borderColor} rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center group hover:scale-105 transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={300 + (index * 100)}
              >
                {/* Icon wrapper */}
                <div 
                  className={`inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r ${item.color} rounded-lg sm:rounded-xl md:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white text-2xl sm:text-3xl md:text-4xl">
                    {item.icon}
                  </div>
                </div>
                
                {/* Value */}
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                  {item.value}
                </div>
                
                {/* Label */}
                <div className="text-sm sm:text-base md:text-lg font-semibold text-white mb-1">
                  {item.label}
                </div>
                
                {/* Description */}
                <div className="text-xs sm:text-sm md:text-base text-gray-300 leading-snug">
                  {item.description}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Statistics;
