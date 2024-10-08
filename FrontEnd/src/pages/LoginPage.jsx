import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/clerk-react";

const LoginPage = () => {
  const { isSignedIn, isLoaded } = useAuth(); // Use the useAuth hook to get the authentication state

  const goBack = () => {
    window.location.href = '/'; // Redirect to the homepage
  };

  // Automatically redirect if the user is signed in
  React.useEffect(() => {
    if (isSignedIn) {
      goBack(); // Redirect to the homepage
    }
  }, [isSignedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="bg-white  rounded-lg shadow-dark shadow- p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-primary text-center mb-4">Welcome Back!</h1>
        <p className="text-gray-600 text-center mb-6">Please sign in to continue.</p>
        <SignedOut>
          {isLoaded ? <div className="flex hover:cursor-pointer hover:from-primary hover:bg-dark transition-all duration-300 bg-dark/90 text-white font-semibold py-[4px] rounded-md justify-center">
            <SignInButton />
          </div> : '<div className="border-gray-600 border-t-black border-2 animate-spin"></div>'}
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
