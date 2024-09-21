import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import PlacesRoute from "./pages/PlacesRoute";
import About from "./pages/About";
// import BlogsDetails from "./pages/BlogsDetails";
import AOS from "aos";
import "aos/dist/aos.css";
import AllRooms from "./pages/AllRooms";
import FaqPage from "./pages/FAQ's";

const App = () => {
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 90,
    });
    AOS.refresh();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* <Route path="blogs/:id" element={<BlogsDetails />} /> */}
            <Route path="best-places" element={<PlacesRoute />} />
            <Route path="about" element={<About />} />
            <Route path="all" element={<AllRooms />} />
            <Route path="frequetly-asked-questions" element={<FaqPage />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
