import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavbarLinks } from "./Navbar";

const ResponsiveMenu = ({ showMenu, setShowMenu }) => {
  return (
    <div
      className={`${
        showMenu ? "left-0" : "-left-[100%]"
      } fixed bottom-0 top-0 z-20 flex h-screen w-[75%] flex-col justify-between bg-white dark:bg-gray-900 dark:text-white px-8 pb-6 pt-16 text-black transition-all duration-300 md:hidden rounded-r-xl shadow-md`}
    >
      <div className="card">
        <div className="flex items-center justify-start gap-3">
          <FaUserCircle size={50} />
          <div>
            <h1>Welcome, Student!</h1>
            <h1 className="text-sm text-slate-500">Find your perfect room</h1>
          </div>
        </div>
        <nav className="mt-12">
          <ul className="space-y-4 text-xl">
            {NavbarLinks.map((data, index) => (
              <li key={index}>
                <Link
                  to={data.link}
                  onClick={() => setShowMenu(false)}
                  className="mb-5 inline-block hover:text-primary transition-all"
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="footer">
        <h1 className="text-center">
          Made with ❤ by <a href="https://github.com/jaydeexsf" target="_blank" rel="noopener noreferrer">Moloantoa J.</a>{" "}
        </h1>
      </div>
    </div>
  );
};

export default ResponsiveMenu;