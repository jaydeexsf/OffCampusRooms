import React from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiFillLinkedin, AiFillTwitterCircle } from 'react-icons/ai';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  return (
    <div className="gradient-dark bg-gray-950 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            We're here to help! Reach out to us with any questions, concerns, or inquiries you may have. 
            Whether it's about bookings, safety, or general assistance, we've got you covered.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Email Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlineMail size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Email Us</h3>
              <p className="text-gray-300 mb-4">Send us a message anytime</p>
              <a 
                href="mailto:OffCampusRooms@gmail.com" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                OffCampusRooms@gmail.com
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="200">
              <div className="bg-gradient-to-r from-green-600 to-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlinePhone size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Call Us</h3>
              <p className="text-gray-300 mb-4">Speak with our team directly</p>
              <a 
                href="tel:+27792192664" 
                className="text-green-400 hover:text-green-300 transition-colors duration-200 font-medium"
              >
                +27 79 219 2664
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 group" data-aos="fade-up" data-aos-delay="300">
              <div className="bg-gradient-to-r from-purple-600 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <AiOutlineEnvironment size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Visit Us</h3>
              <p className="text-gray-300 mb-4">Come see us in person</p>
              <p className="text-purple-400 font-medium">
                173 Uni Road, Mankweng, Polokwane, SA
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="400">
          <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/20 backdrop-blur-lg border border-blue-500/30 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
            <p className="text-gray-300 mb-8 max-w-md mx-auto">
              Follow us on social media for the latest updates, student tips, and exclusive offers.
            </p>
            
            <div className="flex justify-center gap-6">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/+27792192664" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-500 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <FaWhatsapp size={24} className="text-white" />
              </a>

              {/* Instagram */}
              <a 
                href="https://instagram.com/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <FaInstagram size={24} className="text-white" />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/in/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <AiFillLinkedin size={24} className="text-white" />
              </a>

              {/* Twitter/X */}
              <a 
                href="https://x.com/offcampusrooms" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-black hover:bg-gray-800 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-white/20"
              >
                <AiFillTwitterCircle size={24} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="max-w-4xl mx-auto mt-12" data-aos="fade-up" data-aos-delay="500">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Weekdays</h4>
                <p className="text-gray-300">Monday - Friday</p>
                <p className="text-white font-medium">8:00 AM - 6:00 PM</p>
              </div>
              <div className="text-center">
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Weekends</h4>
                <p className="text-gray-300">Saturday - Sunday</p>
                <p className="text-white font-medium">9:00 AM - 4:00 PM</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-gray-300">
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