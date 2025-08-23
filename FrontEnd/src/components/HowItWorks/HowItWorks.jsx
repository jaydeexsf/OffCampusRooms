import React from 'react';
import { FiSearch, FiEye, FiPhone, FiCheck } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiSearch className="w-8 h-8" />,
      title: "Search & Filter",
      description: "Use our advanced search filters to find rooms by location, price, and amenities that match your preferences.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      icon: <FiEye className="w-8 h-8" />,
      title: "View Details",
      description: "Browse detailed room information, photos, amenities, and location details to make an informed decision.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30"
    },
    {
      icon: <FiPhone className="w-8 h-8" />,
      title: "Contact Owner",
      description: "Get in touch with room owners directly through phone, WhatsApp, or email to arrange viewings.",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30"
    },
    {
      icon: <FiCheck className="w-8 h-8" />,
      title: "Book & Move In",
      description: "Complete your booking and move into your new student accommodation hassle-free.",
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30"
    }
  ];

  return (
    <section className="py-16 bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Finding your perfect student accommodation is simple with our streamlined process
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative group"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm z-10">
                  {index + 1}
                </div>

                {/* Step Card */}
                <div className={`bg-gradient-to-br ${step.bgColor} border ${step.borderColor} rounded-2xl p-6 h-full group-hover:scale-105 transition-all duration-300`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${step.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 z-0"></div>
                )}
              </div>
            ))}
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="600">
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Verified Listings</h3>
              <p className="text-gray-400 text-sm">All rooms are verified for quality and safety</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiPhone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm">Get help anytime with our student team</p>
            </div>

            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FiSearch className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Search</h3>
              <p className="text-gray-400 text-sm">Find rooms in seconds with advanced filtering</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
