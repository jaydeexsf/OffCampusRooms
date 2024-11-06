import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-primary text-center mb-4">Welcome</h1>
        <p className="text-gray-600 text-center mb-6">Please sign in to continue.</p>
        <SignedOut>
          {isLoaded ? (
            <div className="flex justify-center">
              {/* Use SignInButton directly */}
              <SignInButton mode="redirect">
                <button className="bg-dark/90 text-white font-semibold py-2 px-4 rounded-md hover:bg-primary transition duration-300">
                  Sign In
                </button>
              </SignInButton>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-dark rounded-full animate-spin"></div>
            </div>
          )}
        </SignedOut>
        <SignedIn>
          <div className="flex justify-center mt-4">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </div>
  );
};

export default LoginPage;
