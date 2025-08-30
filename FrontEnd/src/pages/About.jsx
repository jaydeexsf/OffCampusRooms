import React from "react";
import Location from "../components/Location/Location";
import { FiPhone, FiMail, FiMapPin, FiGlobe } from "react-icons/fi";

const About = () => {
  return (
    <>
      <div className="container pt-4 gradient-dark" >
        <div className="py-10">
          <h1 className="my-8 text-3xl font-bold text-white mb-3">
            About Us
          </h1>
          <div className="w-12 md:w-20 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-300 leading-relaxed mb-4">
                Welcome to StudentRooms! Our mission is to assist students at the University of Limpopo 
                in finding the perfect accommodation near campus. We understand that finding suitable, 
                affordable, and safe student accommodation can be a significant challenge, especially for 
                new students.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our platform provides students with easy access to verified room listings, detailed 
                information about each property, and direct contact with landlords. We believe that 
                every student deserves to feel at home and supported as they pursue their education.
              </p>
              <p className="text-gray-300 leading-relaxed">
                With features like location-based search, detailed amenities listings, and verified 
                property information, we aim to enhance the overall student accommodation experience. 
                Our platform is designed to empower students with the information they need to make 
                informed decisions about their living arrangements.
              </p>
            </div>

            {/* University Contact Information */}
            <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">University of Limpopo Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="text-blue-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-gray-400 text-sm">+27 15 268 9111</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FiMail className="text-green-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-400 text-sm">info@ul.ac.za</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FiMapPin className="text-red-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-medium">Address</p>
                    <p className="text-gray-400 text-sm">University of Limpopo<br />Private Bag X1106<br />Sovenga, 0727<br />South Africa</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-purple-400 w-5 h-5" />
                  <div>
                    <p className="text-white font-medium">Website</p>
                    <a href="https://www.ul.ac.za" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm">
                      www.ul.ac.za
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Location />
    </>
  );
};

export default About;
