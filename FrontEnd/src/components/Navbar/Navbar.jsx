import React, { useState } from "react";
import Logo from "../../assets/logo.png";
import { NavLink, Link } from "react-router-dom";
import { FaCaretDown } from "react-icons/fa";
import ResponsiveMenu from "./ResponsiveMenu";
import { HiMenuAlt3, HiMenuAlt1 } from "react-icons/hi";

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
    name: "Student Tips",
    link: "/tips",
  },
  {
    name: "Contact Us",
    link: "/contact",
  },
];

const Navbar = ({ handleBookRoomPopup }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <nav className="fixed top-0 right-0 w-full z-50 bg-white dark:bg-gray-900 backdrop-blur-sm text-black dark:text-white shadow-md">
        <div className="bg-gradient-to-r from-primary to-dark text-white">
          <div className="container py-[3px] sm:block hidden">
            <div className="flex text-[12px] items-center justify-between">
              <p className="">Exclusive student deals on room bookings!</p>
              <p>Call us at: +27 79 219 2664</p>
            </div>
          </div>
        </div>
        <div className="container py-2 md:py-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 font-bold text-6xl">
              <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                <img src={Logo} alt="StudentRooms Logo" className="h-[50px]" />
              </Link>
            </div>
            <div className="hidden md:block">
              <ul className="flex items-center gap-6">
                {NavbarLinks.map((link) => (
                  <li key={link.name} className="py-4">
                    <NavLink to={link.link} activeClassName="active" className="hover:text-dark focus:text-dark transition-all">
                      {link.name}
                    </NavLink>
                  </li>
                ))}
                <li className="group relative cursor-pointer">
                  <a href="/#home" className="flex h-[72px] items-center gap-[2px]">
                    More{" "}
                    <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                  </a>
                  <div className="absolute left-0 z-[9999] hidden w-[150px] rounded-md bg-white dark:bg-gray-900 text-black dark:text-white p-2 group-hover:block shadow-md">
                    <ul className="space-y-3">
                      {DropdownLinks.map((data) => (
                        <li key={data.name}>
                          <a
                            className="inline-block w-full rounded-md p-2 hover:bg-primary/20"
                            href={data.link}
                          >
                            {data.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex items-center gap-4">
              <NavLink to="/bookinginfo"><button
                className="bg-gradient-to-r text-[12px] from-primary to-dark hover:from-dark hover:bg-primary transition-all duration-600 text-white px-3 py-1 rounded-full"
                onClick={() => {
                  handleBookRoomPopup();
                }}
              >
                Book a Room
              </button> </NavLink>
              <div className="md:hidden block">
                {showMenu ? (
                  <HiMenuAlt1 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
                ) : (
                  <HiMenuAlt3 onClick={toggleMenu} className="cursor-pointer transition-all" size={30} />
                )}
              </div>
            </div>
          </div>
        </div>
        <ResponsiveMenu setShowMenu={setShowMenu} showMenu={showMenu} />
      </nav>
    </>
  );
};

export default Navbar;