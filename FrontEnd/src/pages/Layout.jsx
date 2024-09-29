import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import OrderPopup from "../components/OrderPopup/OrderPopup";

const Layout = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const location = useLocation(); // useLocation hook from react-router-dom to track pathname

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <>
      {/* <Navbar handleOrderPopup={handleOrderPopup} /> */}
      {location.pathname === "/admin" ? null : <Navbar handleOrderPopup={handleOrderPopup} />}
      <div className="pt-8">
        <Outlet />
      </div>
      {/* Conditional rendering based on the current pathname */}
      {location.pathname === "/admin" ? null : <Footer />}
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </>
  );
};

export default Layout;