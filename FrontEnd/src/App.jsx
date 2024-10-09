import React, { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalContext } from './components/GlobalContext'; 
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import PlacesRoute from "./pages/PlacesRoute";
import About from "./pages/About";
import AOS from "aos";
import "aos/dist/aos.css";
import AllRooms from "./pages/AllRooms";
import FaqPage from "./pages/FAQ's";
import Loader from "./pages/Loader";
import AddRoomForm from "./components/admin/AddRoom";
import BookingInfo from "./pages/BookingInfo";
import AdminPanel from "./pages/admin/AdminPanel";
import Tips from "./pages/Tips";
import Contact from "./pages/Contact";
// import ProtectedRoute from "./components/Authentication/ProtectedRoute"; 
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

const App = () => {
  const { globalLoader } = useContext(GlobalContext);

  React.useEffect(() => {
    AOS.init({
      offset: 40,
      duration: 8,
      easing: "ease-in-sine",
      delay: 20,
    });
    AOS.refresh();
  }, []);

  return (
    <>
      <BrowserRouter>
        {globalLoader && <Loader />}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="best-places" element={<PlacesRoute />} />
            <Route path="about" element={<About />} />
            <Route path="all" element={<AllRooms />} />
            <Route path="frequetly-asked-questions" element={<FaqPage />} />
            <Route path="bookinginfo" element={<BookingInfo />} />
            <Route path="tips" element={<Tips />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<LoginPage />} />
            
            {/* Protect the /admin and /add-room routes */}
            <Route path="admin" element={
              <ProtectedRoute adminOnly={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="add-room" element={
              <ProtectedRoute adminOnly={true}>
                <AddRoomForm />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
