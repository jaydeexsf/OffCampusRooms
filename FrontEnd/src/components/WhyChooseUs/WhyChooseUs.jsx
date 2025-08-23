import React from 'react';
import { FiShield, FiClock, FiDollarSign, FiUsers, FiMapPin, FiCheck } from 'react-icons/fi';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FiShield className="w-8 h-8" />,
      title: "Verified Listings",
      description: "All rooms are personally verified by our team for quality, safety, and accuracy. No fake listings or scams.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: "24/7 Student Support",
      description: "Our dedicated student support team is available round the clock to help you with any questions or concerns.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <FiDollarSign className="w-8 h-8" />,
      title: "No Booking Fees",
      description: "We don't charge any booking fees or hidden costs. What you see is what you pay - transparent pricing.",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Student Discounts",
      description: "Exclusive discounts and special offers for University of Limpopo students. Save money on your accommodation.",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30"
    },
    {
      icon: <FiMapPin className="w-8 h-8" />,
      title: "Campus Proximity",
      description: "All rooms are strategically located near University of Limpopo with easy access to campus facilities.",
      color: "from-red-500 to-red-600",
      bgColor: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30"
    },
         {
       icon: <FiCheck className="w-8 h-8" />,
       title: "Quality Guarantee",
       description: "We guarantee the quality of all our listings. If you're not satisfied, we'll help you find a better option.",
       color: "from-teal-500 to-teal-600",
       bgColor: "from-teal-500/20 to-teal-600/20",
       borderColor: "border-teal-500/30"
     }
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                StudentRooms
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              We're committed to making your student accommodation search easy, safe, and affordable
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-gradient-to-br ${feature.bgColor} border ${feature.borderColor} rounded-2xl p-6 group hover:scale-105 transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-white font-semibold mb-1">Verified Listings</div>
              <div className="text-gray-400 text-sm">Every room is personally checked</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-white font-semibold mb-1">Student Support</div>
              <div className="text-gray-400 text-sm">Always here when you need us</div>
            </div>
            
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">0%</div>
              <div className="text-white font-semibold mb-1">Booking Fees</div>
              <div className="text-gray-400 text-sm">No hidden costs or charges</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="700">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Find Your Perfect Student Accommodation?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of University of Limpopo students who have found their ideal accommodation through our platform
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                  Start Your Search
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 border border-white/20">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
