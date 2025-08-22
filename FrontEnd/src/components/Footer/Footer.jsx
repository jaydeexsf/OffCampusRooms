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
import { useUser } from "@clerk/clerk-react"; 

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
    title: "All Rooms",
    link: "/all-rooms",
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
      <div className="dark:bg-gray-950 py-10  relative overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute right-0 top-0 h-full overflow-hidden w-full object-cover z-[-1]"
        >
          <source src={UniversityVid} type="video/mp4" />
        </video>
        <div className="container relative">
          <div className="grid md:grid-cols-3 py-0 bg-gray-950 backdrop-blur-sm rounded-t-xl">
            {showMessage && (
              <div className="text-center bg-primary px-4 shadow-xl py-2 rounded-md shadow-primary absolute top-[50%] translate-x-[-50%] translate-y-[-50%] left-[50%] text-red-500 text-lg font-semibold">
                {showMessage}
              </div>
            )}
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
              <div className="flex items-center gap-3 mt-1 ">
                <FaMobileAlt />
                <p>+27 79 219 2664</p>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <a target="-"  href="https://wa.me/+2772192664">
                  <FaWhatsapp className="text-[15px]  hover:text-dark/80" />
                </a>
                <a target="-"  href="https://instagram.com/offcampusrooms">
                  <FaInstagram className="text-[15px]  hover:text-dark/80" />
                </a>
                <a target="-" href="https://linkedin.com/in/offcampusrooms">
                  <FaLinkedin className="text-[15px] hover:text-dark/80" />
                </a>
              </div>
            </div>
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
                        className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-400 dark:text-gray-200 text-[12px]"
                      >
                        <Link
                          to={link.title === "Admin" ? "#" : link.link}
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
              <div>
                <div className="py-8 px-4">
                  <h1 className="text-[18px] lg:text-lg font-bold text-justify sm:text-left mb-2">
                    Student Resources
                  </h1>
                  <ul className="flex flex-col gap-1">
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-400 dark:text-gray-200 text-[12px]">
                      <Link to="/frequetly-asked-questions" onClick={() => window.scrollTo(0, 0)}>
                        <span>&#11162;</span>
                        <span>FAQs</span>
                      </Link>
                    </li>
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-400 dark:text-gray-200 text-[12px]">
                      <Link
                        to="/contact"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span>&#11162;</span>
                        <span>Support</span>
                      </Link>
                      
                    </li>
                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-400 dark:text-gray-200 text-[12px]">
                      <Link
                        to="/tips"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span>&#11162;</span>
                        <span>Student Tips</span>
                      </Link>
                      
                    </li>

                    <li className="cursor-pointer hover:translate-x-1 duration-300 hover:!text-primary space-x-1 text-gray-400 dark:text-gray-200 text-[12px]">
                      <Link
                        to="/comment"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        <span>&#11162;</span>
                        <span>FeedBack</span>
                      </Link>
                      
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center py-2 text-[8px] lg:text-[12px] border-t-2 border-gray-300/50 bg-primary text-white">
            &copy; 2024 All rights reserved || Built for UL Students by Johannes M.
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;