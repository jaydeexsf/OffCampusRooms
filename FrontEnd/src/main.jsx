// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GlobalProvider } from "./components/GlobalContext"; // Import GlobalProvider
import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalProvider> {/* Wrap App with GlobalProvider */}
      <App />
    </GlobalProvider>
  </React.StrictMode>
);
