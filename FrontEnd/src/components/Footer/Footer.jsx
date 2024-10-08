import React, { useState, useEffect } from "react";
import FooterLogo from "../../assets/logo.png";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaMobileAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import UniversityVid from "../../assets/video/footer.mp4";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; // Import useUser from Clerk

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "About Us",
    link: "/about",
  },
  {
    title: "Available Rooms",
    link: "/available-rooms",
  },
  {
    title: "Contact",
    link: "/contact",
  },
  {
    title: "Admin",
    link: "/admin",
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Get the logged-in user's details
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if the user has the "admin" role
      const userRole = user.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);

  const handleAdminClick = (e) => {
    if (!isAdmin) {
      e.preventDefault(); // Prevent navigation to the admin page
      setShowMessage(true); // Show the "not admin" message
      setTimeout(() => setShowMessage(false), 3000); // Hide message after 3 seconds
    } else {
      navigate("/admin"); // Navigate to the admin page if the user is an admin
    }
  };

  return (
    <>
      <div className="dark:bg-gray-950 py-10 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute right-0 top-0 h-full overflow-hidden w-full object-cover z-[-1]"
        >
          <source src={UniversityVid} type="video/mp4" />
        </video>
        <div className="container relative">
        
          <div className="grid md:grid-cols-3 py-0 bg-white/80 backdrop-blur-sm rounded-t-xl">
          {showMessage && (
            <div className="text-center bg-primary px-4 shadow-xl py-2 rounded-md shadow-primary absolute top-[50%] translate-x-[-50%] translate-y-[-50%] left-[50%] text-red-500 text-lg font-semibold">
              You are not the admin.
            </div>
          )}
            {/* Contact Information */}
            <div className="pt-8 lg:pb-12 text-xs px-4">
              <h1 className="flex items-center mb-4 gap-3 text-xl sm:text-3xl font-bold text-justify sm:text-left">
                <img src={FooterLogo} alt="logo" className="max-h-[60px]" />
              </h1>
              <p className="text-xs">
                Find the best rooms around the University of Limpopo. We provide affordable, student-friendly accommodation with easy access to campus.
              </p>
              <br />
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt />
                <p>Mankweng, Polokwane</p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <FaMobileAlt />
                <p>+27 79 219 2664</p>
              </div>
              {/* Social handles */}
              <div className="flex items-center gap-3 mt-3">
                <a href="https://wa.me/+2772192664">
                  <FaWhatsapp className="text-[15px]" />
                </a>
                <a href="#">
                  <FaInstagram className="text-[15px]" />
                </a>
                <a href="#">
                  <FaLinkedin className="text-[15px]" />
                </a>
              </div>
            </div>
            {/* Footer Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-[18px] lg:text-lg font-bold text-justify sm:text-left mb-2">
                    Quick Links
                  </h1>
                  <ul className="flex flex-col gap-1">
                    {FooterLinks.map((link) => (
                      <li
                        key={link.title}
                        className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200 text-[12px]"
                      >
                        <Link
                          to={link.link === "/admin" ? "#" : link.link} // Prevent default navigation for admin
                          onClick={
                            link.title === "Admin"
                              ? handleAdminClick
                              : () => window.scrollTo(0, 0)
                          }
                        >
                          <span>&#11162;</span>
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Other Links */}
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-[18px] lg:text-lg font-bold text-justify sm:text-left mb-2">
                    Student Resources
                  </h1>
                  <ul className="flex flex-col gap-1">
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200 text-[12px]">
                      <Link to="/faq" onClick={() => window.scrollTo(0, 0)}>
                        <span>&#11162;</span>
                        <span>FAQs</span>
                      </Link>
                    </li>
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200 text-[12px]">
                      <Link
                        to="/support"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span>&#11162;</span>
                        <span>Support</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* "Not Admin" Message */}
          {/* Footer Bottom Text */}
          <div className="text-center py-2 text-[8px] lg:text-[12px] border-t-2 border-gray-300/50 bg-primary text-white">
            &copy; 2024 All rights reserved || Built for UL Students by Johannes M.
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
