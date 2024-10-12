import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { Outlet, Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import OrderPopup from "../components/OrderPopup/OrderPopup";

const Layout = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const location = useLocation(); 

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  return (
    <div className={location.pathname === "/admin" || location.pathname === "/add-room" || location.pathname === "/login" ? 'pb-36 mt-[-32px]' : '' }>
      {location.pathname === "/admin" || location.pathname === "/add-room" || location.pathname === "/login" ? null : <Navbar />}
      <div className="pt-8">
        <Outlet />
      </div>
      {location.pathname === "/admin" || location.pathname === "/add-room" || location.pathname === "/login" ? null : <Footer />}
      <OrderPopup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  );
};

export default Layout;