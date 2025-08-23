import React from 'react';
import { FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FeaturedLocations = () => {
  const locations = [
    {
      name: "Gate 1",
      description: "Closest to main campus entrance",
      avgPrice: 2500,
      avgDistance: 5,
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: ["Walking distance", "Student-friendly", "Safe area"]
    },
    {
      name: "Gate 2",
      description: "Popular student accommodation area",
      avgPrice: 2200,
      avgDistance: 8,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: ["Affordable", "Community feel", "Transport access"]
    },
    {
      name: "Gate 3",
      description: "Quiet residential neighborhood",
      avgPrice: 2800,
      avgDistance: 12,
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: ["Peaceful", "Family area", "Good amenities"]
    },
    {
      name: "Ga-motintane",
      description: "Traditional community area",
      avgPrice: 1800,
      avgDistance: 15,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      features: ["Most affordable", "Local culture", "Community support"]
    }
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Popular <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Locations
              </span> Near UL
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the best areas around University of Limpopo for student accommodation
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {locations.map((location, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl hover:scale-105 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={location.image} 
                    alt={location.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Location Name */}
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white mb-1">{location.name}</h3>
                    <p className="text-gray-300 text-sm">{location.description}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FiDollarSign className="text-green-400" />
                      <span className="text-white font-semibold">R{location.avgPrice}</span>
                      <span className="text-gray-400 text-sm">avg/month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock className="text-blue-400" />
                      <span className="text-white font-semibold">{location.avgDistance}min</span>
                      <span className="text-gray-400 text-sm">to UL</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {location.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* View Rooms Button */}
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 text-sm">
                    View Rooms
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Can't Decide on a Location?
              </h3>
              <p className="text-gray-300 mb-6">
                Use our advanced search filters to find the perfect room in your preferred area
              </p>
              <Link 
                to="/all-rooms"
                className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore All Areas
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLocations;
