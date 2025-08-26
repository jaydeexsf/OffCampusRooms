import React, { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiStar, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalRatings: 0,
    averageRating: 0,
    averageDistance: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.GET_STATISTICS);
        const data = response.data;
        
        setStats({
          totalRooms: data.totalRooms || 0,
          totalRatings: data.totalRatings || 0,
          averageRating: data.averageRating || 0,
          averageDistance: data.averageDistance || 0
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Fallback to basic room count
        try {
          const roomsResponse = await axios.get(API_ENDPOINTS.ALL_ROOMS);
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
        } catch (fallbackError) {
          console.error('Error fetching fallback statistics:', fallbackError);
        }
      }
    };

    fetchStats();
  }, []);

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
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trusted by <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                University of Limpopo
              </span> Students
            </h2>
            <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto">
              Join thousands of students who have found their perfect accommodation through our platform
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
            {statItems.map((item, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${item.bgColor} border ${item.borderColor} rounded-2xl p-6 text-center group hover:scale-105 transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={300 + (index * 100)}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {item.icon}
                  </div>
                </div>
                
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {item.value}
                </div>
                
                <div className="text-base md:text-lg font-semibold text-white mb-1">
                  {item.label}
                </div>
                
                <div className="text-xs md:text-sm text-gray-300">
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
