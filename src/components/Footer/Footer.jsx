import React from "react";
import FooterLogo from "../../assets/logo.png"; 
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp, 
  FaMobileAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import UniversityVid from "../../assets/video/footer.mp4";
import { Link } from "react-router-dom";

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
];

const Footer = () => {
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
        <div className="container">
          <div className="grid md:grid-cols-3 py-5 bg-white/80 backdrop-blur-sm rounded-t-xl">
            {/* Contact Information */}
            <div className="py-8 px-4">
              <h1 className="flex items-center  mb-4 gap-3 text-xl sm:text-3xl font-bold text-justify sm:text-left">
                <img src={FooterLogo} alt="logo" className="max-h-[60px]" />
                {/* University Rooms */}
              </h1>
              <p className="text-sm">
                Find the best rooms around the University of Limpopo. We provide affordable, student-friendly accommodation with easy access to campus.
              </p>
              <br />
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt />
                <p>Mankweng, Polokwane</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <FaMobileAlt />
                <p>+27 79 219 2664</p>
              </div>
              {/* Social handles */}
              <div className="flex items-center gap-3 mt-6">
                <a href="https://wa.me/+2772192664">
                  <FaWhatsapp className="text-xl" />
                </a>
                <a href="#">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#">
                  <FaFacebook className="text-xl" />
                </a>
                <a href="#">
                  <FaLinkedin className="text-xl" />
                </a>
              </div>
            </div>
            {/* Footer Links */}
            <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                    Quick Links
                  </h1>
                  <ul className="flex flex-col gap-3">
                    {FooterLinks.map((link) => (
                      <li
                        key={link.title}
                        className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200"
                      >
                        <Link
                          to={link.link}
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          <span>&#11162;</span>
                          <span>{link.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {/* Repeated Links (if needed for other purposes) */}
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-xl font-bold text-justify sm:text-left mb-3">
                    Student Resources
                  </h1>
                  <ul className="flex flex-col gap-3">
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200">
                      <Link to="/faq" onClick={() => window.scrollTo(0, 0)}>
                        <span>&#11162;</span>
                        <span>FAQs</span>
                      </Link>
                    </li>
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-700 dark:text-gray-200">
                      <Link to="/support" onClick={() => window.scrollTo(0, 0)}>
                        <span>&#11162;</span>
                        <span>Support</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          {/* Footer Bottom Text */}
          <div className="text-center py-4 text-sm border-t-2 border-gray-300/50 bg-primary text-white">
            &copy; 2024 All rights reserved || Built for UL Students by Johannes M.
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
