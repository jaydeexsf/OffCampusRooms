import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { FiChevronDown, FiMenu, FiX, FiPhone, FiGift } from "react-icons/fi";
import ResponsiveMenu from "./ResponsiveMenu";
import { SignedIn, UserButton, useAuth, useUser, SignedOut, SignInButton } from "@clerk/clerk-react";

export const NavbarLinks = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "About Us",
    link: "/about",
  },
  {
    name: "Browse Rooms",
    link: "/all-rooms",
  },
  {
    name: "FAQs",
    link: "/frequetly-asked-questions",
  },
];

const DropdownLinks = [
  {
    name: "Student Resources",
    link: "/resources",
  },
  {
    name: "Book a Ride",
    link: "/ride-booking",
  },
  {
    name: "Share Feedback",
    link: "/feedback",
  },
  {
    name: "Contact Us",
    link: "/contact",
  },
];

const Navbar = ({ handleBookRoomPopup }) => {
  const [showMenu, setShowMenu] = useState(false);
  const { user, isLoaded } = useUser()

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        {/* Top banner with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500">
          <div className="container py-2 sm:block hidden">
            <div className="flex text-sm items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FiGift className="text-white" />
                <span className="font-medium">Exclusive student deals on room bookings!</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-white" />
                <span className="font-mono">+27 79 219 2664</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="container py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                onClick={() => window.scrollTo(0, 0)}
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <img 
                    src={Logo} 
                    alt="StudentRooms Logo" 
                    className="h-10 w-auto transition-transform duration-200 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent hidden sm:block">
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <ul className="flex items-center gap-1">
                {NavbarLinks.map((link) => (
                  <li key={link.name}>
                    <NavLink 
                      to={link.link} 
                      className={({ isActive }) =>
                        `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isActive 
                            ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                
                {/* Dropdown Menu */}
                <li className="group relative">
                  <button className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                    More
                    <FiChevronDown className="text-sm transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-2">
                      {DropdownLinks.map((data) => (
                        <Link
                          key={data.name}
                          to={data.link}
                          className="flex items-center px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 text-sm font-medium"
                        >
                          {data.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <SignedIn>
                    <Link 
                      to="/dashboard"
                      className="hidden md:block text-gray-300 hover:text-white font-medium transition-colors duration-200"
                    >
                      Dashboard
                    </Link>
                    <div className="p-1 rounded-lg bg-white/10 border border-white/20">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-7 h-7 md:w-8 md:h-8",
                          }
                        }}
                      />
                    </div>
                  </SignedIn> 
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <SignedOut>
                    {isLoaded ? (
                      <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-sm md:text-base px-4 py-2 md:px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                        <SignInButton />
                      </button>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </SignedOut>     
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200"
              >
                {showMenu ? (
                  <FiX size={18} />
                ) : (
                  <FiMenu size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
        
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

export default Navbar;
