import React from "react";
import { Link } from "react-router-dom";
import { NavbarLinks } from "./Navbar";
import { SignedIn, UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { FaUserCircle } from "react-icons/fa";

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  const { user, isLoaded } = useUser()

  return (
    <div className={`${showMenu ? "left-0" : "-left-[100%]"} fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-300 md:hidden rounded-r-xl shadow-md`}>
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          <div>
            {user ?
            <SignedIn>
              <UserButton size={36}  className="border-red-700" />
            </SignedIn>
            :
             <FaUserCircle size={34} /> }
          </div>
          <div className="text-xs">
            <h1>Welcome!</h1>
            <h1 className="text- text-slate-500">
              {!isLoaded ? (
                <div className="border-gray-600 border-4 border-t-black animate-spin rounded-full w-4 h-4"></div>
              ) : user ? (
                `${user.firstName} ${user.lastName ? user.lastName  : ''}`
              ) : (
                "User"
              )}
            </h1>
          </div>
        </div>
        <nav className="mt-4">
          <ul className="space-y-4 text-xl">
            {NavbarLinks.map((data, index) => (
              <li key={index}>
                <Link to={data.link} onClick={() => setShowMenu(false)} className="mb-2 text-sm inline-block hover:text-primary transition-all">
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="footer">
        <h1 className="text-center">
          Made with ❤ by <a href="https://github.com/jaydeexsf" target="_blank" rel="noopener noreferrer">Moloantoa J.</a>
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
