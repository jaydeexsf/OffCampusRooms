import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate(); 

  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/'); 
    }
  }, [isSignedIn, navigate]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="bg-white rounded-lg shadow-dark shadow- p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-primary text-center mb-4">Hello</h1>
        <p className="text-gray-600 text-center mb-6">Please sign in to continue.</p>
        <SignedOut>
          {isLoaded ? (
            <div className="flex hover:cursor-pointer hover:bg-primary transition-all duration-300 bg-dark/90 text-white font-semibold py-[4px] rounded-md justify-center">
              <SignInButton />
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="border-gray-600 border-t-black border-2 animate-spin w-6 h-6 rounded-full"></div>
            </div>
          )}
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default LoginPage;
