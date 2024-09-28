import React, { useEffect } from 'react';
import { AiOutlinePhone, AiOutlineMail, AiFillLinkedin, AiOutlineTwitter, AiOutlineInstagram } from 'react-icons/ai';

const BookingInfo = () => {
  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen mt-[20px] bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">Room Booking Information</h1>
        <p className="text-gray-700 mb-4">
          To book a room, you must contact the landlord directly and pay a non-refundable <span className="font-bold">booking fee of R100</span>. Please ensure that the landlord's bank account number {'matches'.toUpperCase()} the one provided on our platform.
        </p>
        <p className="text-gray-700 mb-4">
          The landlord will confirm the payment upon receiving it. However, if the landlord does not acknowledge the payment, please Email us at <span className="font-bold">OffCampusRooms@gmail.com</span> with proof of payment.
        </p>
        <p className="text-gray-700 mb-4">
          We will verify the payment details and assist you in resolving any disputes. Make sure to retain proof of all transactions.
        </p>
        <p className="text-gray-700 mb-4">
          If you have any questions, feel free to reach out to our support team.
        </p>
        
        {/* Contact Info */}
        <div className="mt-6">
          <h1 className="font-semibold text-lg">Contact Support:</h1>
          <div className="flex flex-col space-y-2">
            <a href="tel:+2772192664" className="flex items-center space-x-2 text-gray-800 hover:text-primary transition">
              <AiOutlinePhone size={24} />
              <span>+27 7 219 2664</span>
            </a>
            <a href="mailto:mojohannes06@gmail.com" className="flex items-center space-x-2 text-gray-800 hover:text-primary transition">
              <AiOutlineMail size={24} />
              <span>mojohannes06@gmail.com</span>
            </a>
            <a href="https://linkedin.com/in/example" className="flex items-center space-x-2 text-gray-800 hover:text-primary transition">
              <AiFillLinkedin size={24} />
              <span>LinkedIn</span>
            </a>
            <a href="https://twitter.com/example" className="flex items-center space-x-2 text-gray-800 hover:text-primary transition">
              <AiOutlineTwitter size={24} />
              <span>Twitter/X</span>
            </a>
            <a href="https://instagram.com/example" className="flex items-center space-x-2 text-gray-800 hover:text-primary transition">
              <AiOutlineInstagram size={24} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfo;
