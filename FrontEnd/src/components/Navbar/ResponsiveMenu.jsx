import React from "react";
import { Link } from "react-router-dom";
import { NavbarLinks } from "./Navbar";
import { SignedIn, UserButton, useAuth, useUser, SignedOut, SignInButton } from "@clerk/clerk-react";
import { FiUser, FiGithub, FiHeart } from "react-icons/fi";

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  const { user, isLoaded } = useUser()

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`${showMenu ? "opacity-100 visible" : "opacity-0 invisible"} fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-all duration-300 md:hidden`}
        onClick={() => setShowMenu(false)}
      />
      
      {/* Menu Panel */}
      <div className={`${showMenu ? "translate-x-0" : "-translate-x-full"} fixed left-0 top-0 z-50 h-screen w-80 bg-black/95 backdrop-blur-xl border-r border-white/20 transition-transform duration-300 md:hidden`}>
        {/* Close Button */}
        <button
          onClick={() => setShowMenu(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 transition-all duration-200 z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                {user ? (
                  <SignedIn>
                    <div className="p-1 rounded-lg bg-white/10 border border-white/20">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "w-10 h-10",
                          }
                        }}
                      />
                    </div>
                  </SignedIn>
                ) : (
                  <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                    <FiUser size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">Welcome!</p>
                <p className="text-xs text-gray-400">
                  {!isLoaded ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                  ) : user ? (
                    `${user.firstName} ${user.lastName || ''}`
                  ) : (
                    "Guest User"
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {NavbarLinks.map((data, index) => (
                <li key={index}>
                  <Link 
                    to={data.link} 
                    onClick={() => setShowMenu(false)} 
                    className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    {data.name}
                  </Link>
                </li>
              ))}
              
              {/* Additional Links */}
              <li className="pt-4 border-t border-white/20 mt-4">
                <Link 
                  to="/resources" 
                  onClick={() => setShowMenu(false)} 
                  className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Student Resources
                </Link>
              </li>
              <li>
                <Link 
                  to="/feedback" 
                  onClick={() => setShowMenu(false)} 
                  className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Share Feedback
                </Link>
              </li>
              <li>
                <Link 
                  to="/ride-booking" 
                  onClick={() => setShowMenu(false)} 
                  className="flex items-center px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600/20 to-blue-500/20 border border-blue-500/30 text-blue-400 hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-blue-500/30 transition-all duration-200 font-medium"
                >
                  🚗 Book a Ride
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={() => setShowMenu(false)} 
                  className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                >
                  Contact Us
                </Link>
              </li>
              {user && (
                <li>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setShowMenu(false)} 
                    className="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            {!user && (
              <div className="mb-4">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium px-4 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            )}
            <div className="text-center">
              <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                Made with <FiHeart className="text-red-400 text-xs" /> by{" "}
                <a 
                  href="https://github.com/jaydeexsf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                >
                  <FiGithub className="text-xs" />
                  Moloantoa J.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
