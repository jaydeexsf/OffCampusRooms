import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GlobalProvider } from "./components/GlobalContext"; // Import GlobalProvider
import "./index.css";

import { ClerkProvider } from '@clerk/clerk-react'

// Import your publishable key from environment variables
const PUBLISHABLE_KEY = "pk_test_bGliZXJhbC1mb3gtNDEuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/"
        appearance={{
          baseTheme: "dark"
        }}
        localization={{
          signIn: {
            start: {
              title: "Sign in to OffCampusRooms",
              subtitle: "Welcome back! Please sign in to continue"
            }
          }
        }}
      >
       <GlobalProvider> 
          <App />
        </GlobalProvider>
      </ClerkProvider>
    
  </React.StrictMode>
);