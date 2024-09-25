import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalContext } from './components/GlobalContext'; // Import GlobalContext
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import PlacesRoute from "./pages/PlacesRoute";
import About from "./pages/About";
import AOS from "aos";
import "aos/dist/aos.css";
import AllRooms from "./pages/AllRooms";
import FaqPage from "./pages/FAQ's";
import AdminPanel from "./pages/admin/adminPanel";
import Loader from "./pages/Loader";
import AddRoomForm from "./components/admin/AddRoom";

const App = () => {
  const { globalLoader } = useContext(GlobalContext); // Access globalLoader from context

  React.useEffect(() => {
    AOS.init({
      offset: 40,
      duration: 800,
      easing: "ease-in-sine",
      delay: 40,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <BrowserRouter>
        {globalLoader && <Loader />} {/* Conditionally render Loader */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="best-places" element={<PlacesRoute />} />
            <Route path="about" element={<About />} />
            <Route path="all" element={<AllRooms />} />
            <Route path="frequetly-asked-questions" element={<FaqPage />} />
            <Route path="admin" element={<AdminPanel />} />
            <Route path='add-room' element={<AddRoomForm />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

