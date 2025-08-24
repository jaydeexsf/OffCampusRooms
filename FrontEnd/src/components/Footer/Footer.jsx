import React, { useState, useEffect } from "react";
import FooterLogo from "../../assets/logo.png";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaMobileAlt,
  FaMapMarkerAlt,
  FaHome,
  FaInfoCircle,
  FaBed,
  FaEnvelope,
  FaCog,
  FaQuestionCircle,
  FaBook,
  FaLightbulb,
  FaHeadset,
  FaComments
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from "react-icons/fi";
import UniversityVid from "../../assets/video/footer.mp4";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react"; 

const FooterLinks = [
  {
    title: "Home",
    link: "/",
    icon: FaHome
  },
  {
    title: "About Us",
    link: "/about",
    icon: FaInfoCircle
  },
  {
    title: "All Rooms",
    link: "/all-rooms",
    icon: FaBed
  },
  {
    title: "Contact",
    link: "/contact",
    icon: FaEnvelope
  },
  {
    title: "Admin",
    link: "/admin",
    icon: FaCog
  },
];

const ResourceLinks = [
  {
    title: "FAQs",
    link: "/frequetly-asked-questions",
    icon: FaQuestionCircle
  },
  {
    title: "Student Resources",
    link: "/resources",
    icon: FaBook
  },
  {
    title: "Student Tips",
    link: "/tips",
    icon: FaLightbulb
  },
  {
    title: "Support",
    link: "/contact",
    icon: FaHeadset
  },
  {
    title: "Feedback",
    link: "/comment",
    icon: FaComments
  },
];

const Footer = () => {
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMessage, setShowMessage] = useState("");

  useEffect(() => {
    if (user) {
      const userRole = user.publicMetadata?.role;
      setIsAdmin(userRole === "admin");
    }
  }, [user]);

  const handleAdminClick = (e) => {
    e.preventDefault();
    if (!isSignedIn) {
      setShowMessage("Sign in if you are the admin.");
      navigate("/login"); 
    } else if (!isAdmin) {
      setShowMessage("You are not the admin.");
    } else {
      navigate("/admin"); 
    }

    if (showMessage) {
      setTimeout(() => setShowMessage(""), 3000);
    }
  };

  useEffect(()=>{
    setTimeout(() => setShowMessage(""), 3000);
  }, [showMessage])

  return (
    <>
      <div className="gradient-dark bg-gray-950 pt-12 sm:pt-16 lg:pt-20 relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute right-0 top-0 h-full overflow-hidden w-full object-cover z-[-1]"
        >
          <source src={UniversityVid} type="video/mp4" />
        </video>
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 py-8 sm:py-10 lg:py-12 bg-gray-950/85 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-10">
            {showMessage && (
              <div className="text-center bg-red-500/90 backdrop-blur-lg px-4 sm:px-6 py-3 rounded-xl shadow-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm sm:text-lg font-semibold z-50 w-11/12 sm:w-auto">
                {showMessage}
              </div>
            )}
            
            {/* Company Info */}
            <div className="space-y-6 lg:space-y-8">
              <div className="flex items-center gap-3">
                <img src={FooterLogo} alt="OffCampusRooms Logo" className="h-10 sm:h-12 w-auto" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                </h1>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed pr-0 lg:pr-4">
                Find the best rooms around the University of Limpopo. We provide affordable, 
                student-friendly accommodation with easy access to campus.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-white font-semibold text-sm sm:text-base mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-300">
                    <FiMapPin className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-sm sm:text-base">Mankweng, Polokwane</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <FiPhone className="text-green-400 flex-shrink-0" size={16} />
                    <a href="tel:+27792192664" className="text-sm sm:text-base hover:text-green-400 transition-colors">
                      +27 79 219 2664
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <FiMail className="text-purple-400 flex-shrink-0 mt-0.5" size={16} />
                    <a href="mailto:OffCampusRooms@gmail.com" className="text-sm sm:text-base hover:text-purple-400 transition-colors break-all">
                      OffCampusRooms@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="pt-2">
                <h4 className="text-white font-semibold text-sm sm:text-base mb-4">Follow Us</h4>
                <div className="flex gap-3 sm:gap-4">
                  <a 
                    href="https://wa.me/+27792192664" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="Contact us on WhatsApp"
                  >
                    <FaWhatsapp className="text-white text-lg sm:text-xl" />
                  </a>
                  <a 
                    href="https://instagram.com/offcampusrooms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="Follow us on Instagram"
                  >
                    <FaInstagram className="text-white text-lg sm:text-xl" />
                  </a>
                  <a 
                    href="https://linkedin.com/in/offcampusrooms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-500 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    aria-label="Connect with us on LinkedIn"
                  >
                    <FaLinkedin className="text-white text-lg sm:text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                  Quick Links
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {FooterLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.title}>
                        <Link
                          to={link.title === "Admin" ? "#" : link.link}
                          onClick={
                            link.title === "Admin"
                              ? handleAdminClick
                              : () => window.scrollTo(0, 0)
                          }
                          className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-all duration-300 group py-1 px-2 rounded-lg hover:bg-white/5"
                        >
                          <IconComponent className="text-blue-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" size={16} />
                          <span className="text-sm sm:text-base font-medium">{link.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Student Resources */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2 flex-wrap">
                  <span className="break-words">Student Resources</span>
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {ResourceLinks.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <li key={link.title}>
                        <Link
                          to={link.link}
                          onClick={() => window.scrollTo(0, 0)}
                          className="flex items-center gap-3 text-gray-300 hover:text-blue-400 transition-all duration-300 group py-1 px-2 rounded-lg hover:bg-white/5"
                        >
                          <IconComponent className="text-blue-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" size={16} />
                          <span className="text-sm sm:text-base font-medium break-words">{link.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="text-center py-6 sm:py-8 mt-6 sm:mt-8 border-t border-white/10">
            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed px-4">
              &copy; 2024 OffCampusRooms. All rights reserved. Built for UL Students by Johannes M.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;