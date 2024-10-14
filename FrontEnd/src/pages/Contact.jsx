import React from 'react';
import { AiOutlineMail, AiOutlinePhone, AiOutlineEnvironment, AiFillLinkedin, AiFillTwitterCircle } from 'react-icons/ai';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-100 mt-8 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Get in Touch</h1>
        <p className="text-gray-600 text-center mb-8">
          We're here to help! Reach out to us with any questions, concerns, or inquiries you may have. Whether it's about bookings, safety, or general assistance, we’ve got you covered.
        </p>

        {/* Contact Info Section */}
        <div className="flex flex-col md:flex-row justify-between mb-8 space-y-6 md:space-y-0">
          {/* Email */}
          <div className="flex items-center space-x-4">
            <AiOutlineMail size={28} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Email Us</h2>
              <p className="text-gray-600 text-xs">OffCampusRooms@gmail.com</p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-center space-x-4">
            <AiOutlinePhone size={28} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Call Us</h2>
              <p className="text-gray-600 text-xs">+27 79 219 2664</p>
            </div>
          </div>
          {/* Address */}
          <div className="flex items-center space-x-4">
            <AiOutlineEnvironment size={28} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Visit Us</h2>
              <p className="text-gray-600 text-sm">173 Uni Road, Mankweng, Polokwane, SA</p>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-8 text-cente flex flex-col items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow us on</h3>
          <div className='flex gap-4 justify-center'>
          <a href="https://linkedin.com/in/offcampusrooms" className="text-gray-600 hover:text-primary transition duration-300">
            <AiFillLinkedin size={32} />
          </a>
          <a href="https://x.com/offcampusrooms" className="text-gray-600 hover:text-primary transition duration-300">
            <AiFillTwitterCircle size={32} />
          </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;