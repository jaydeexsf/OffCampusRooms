import React from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiFillLinkedin, AiFillTwitterCircle } from 'react-icons/ai';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="gradient-dark bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-12" data-aos="fade-up">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-6 text-white leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-sm sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
            We're here to help! Reach out to us with any questions, concerns, or inquiries you may have. 
            Whether it's about bookings, safety, or general assistance, we've got you covered.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-6xl mx-auto mb-8 sm:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
            {/* Email Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-8 text-center hover:bg-white/15 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlineMail size={16} className="text-white sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-3">Email Us</h3>
              <p className="text-xs sm:text-base text-gray-300 mb-2 sm:mb-4 hidden sm:block">Send us a message anytime</p>
              <a 
                href="mailto:OffCampusRooms@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-xs sm:text-base break-all"
              >
                OffCampusRooms@gmail.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-8 text-center hover:bg-white/15 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-r from-green-600 to-green-500 w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlinePhone size={16} className="text-white sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-3">Call Us</h3>
              <p className="text-xs sm:text-base text-gray-300 mb-2 sm:mb-4 hidden sm:block">Speak with our team directly</p>
              <a 
                href="tel:+27792192664" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium text-xs sm:text-base"
              >
                +27 79 219 2664
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-8 text-center hover:bg-white/15 transition-all duration-300 group col-span-2 md:col-span-1" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 w-8 h-8 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlineEnvironment size={16} className="text-white sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-sm sm:text-xl font-bold text-white mb-1 sm:mb-3">Visit Us</h3>
              <p className="text-xs sm:text-base text-gray-300 mb-2 sm:mb-4 hidden sm:block">Come see us in person</p>
              <p className="text-purple-400 font-medium text-xs sm:text-base">
                173 Uni Road, Mankweng, Polokwane, SA
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-center">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-6">Connect With Us</h3>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-8 max-w-md mx-auto px-2">
              Follow us on social media for the latest updates, student tips, and exclusive offers.
            </p>
            
            <div className="flex justify-center gap-3 sm:gap-6">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/+27792192664" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <FaWhatsapp size={18} className="text-white sm:w-6 sm:h-6" />
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <FaInstagram size={18} className="text-white sm:w-6 sm:h-6" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <AiFillLinkedin size={18} className="text-white sm:w-6 sm:h-6" />
              </a>

              {/* Twitter/X */}
              <a 
                href="https://x.com/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 w-10 h-10 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-white/20"
              >
                <AiFillTwitterCircle size={18} className="text-white sm:w-6 sm:h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="max-w-4xl mx-auto mt-6 sm:mt-12" data-aos="fade-up" data-aos-delay="500">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-8">
            <h3 className="text-lg sm:text-2xl font-bold text-white mb-3 sm:mb-6 text-center">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="text-center">
                <h4 className="text-sm sm:text-lg font-semibold text-blue-400 mb-2 sm:mb-4">Weekdays</h4>
                <p className="text-gray-300 text-xs sm:text-base">Monday - Friday</p>
                <p className="text-white font-medium text-sm sm:text-base">8:00 AM - 6:00 PM</p>
              </div>
              <div className="text-center">
                <h4 className="text-sm sm:text-lg font-semibold text-blue-400 mb-2 sm:mb-4">Weekends</h4>
                <p className="text-gray-300 text-xs sm:text-base">Saturday - Sunday</p>
                <p className="text-white font-medium text-sm sm:text-base">9:00 AM - 4:00 PM</p>
              </div>
            </div>
            <div className="text-center mt-3 sm:mt-6">
              <p className="text-gray-300 text-xs sm:text-base px-2">
                <span className="text-green-400 font-medium">24/7 Emergency Support</span> available for urgent matters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;