import React, { useEffect } from 'react';
import { SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { FiUserPlus, FiHome, FiTruck } from 'react-icons/fi';

const SignUpPage = () => {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if already signed in
    if (isSignedIn) {
      navigate('/');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <FiUserPlus className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Join <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              OffCampusRooms
            </span>
          </h1>
          <p className="text-gray-400">Create your account to get started</p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="bg-black/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <div className="flex justify-center">
            <SignUp 
              appearance={{
                baseTheme: 'dark',
                variables: {
                  colorPrimary: '#3b82f6',
                  colorBackground: 'transparent',
                  colorInputBackground: '#1f2937',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: '#9ca3af',
                  borderRadius: '0.75rem',
                },
                elements: {
                  rootBox: {
                    width: '100%',
                  },
                  card: {
                    backgroundColor: 'transparent',
                    border: 'none',
                    boxShadow: 'none',
                  },
                  headerTitle: {
                    color: '#ffffff',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                  },
                  headerSubtitle: {
                    color: '#9ca3af',
                  },
                  socialButtonsBlockButton: {
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#4b5563',
                    },
                  },
                  formFieldInput: {
                    backgroundColor: '#1f2937',
                    border: '1px solid #374151',
                    color: '#ffffff',
                    '&:focus': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 0 0 1px #3b82f6',
                    },
                  },
                  formFieldLabel: {
                    color: '#ffffff',
                  },
                  formButtonPrimary: {
                    backgroundColor: '#3b82f6',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  },
                  footerActionLink: {
                    color: '#3b82f6',
                    '&:hover': {
                      color: '#2563eb',
                    },
                  },
                }
              }}
              redirectUrl="/"
              signInUrl="/login"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in here
            </button>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 gap-4">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FiHome className="text-green-400 text-xl" />
              <div>
                <h3 className="text-white font-semibold">Find Accommodation</h3>
                <p className="text-gray-400 text-sm">Browse verified off-campus rooms near University of Limpopo</p>
              </div>
            </div>
          </div>
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <FiTruck className="text-blue-400 text-xl" />
              <div>
                <h3 className="text-white font-semibold">Book Rides</h3>
                <p className="text-gray-400 text-sm">Safe and reliable transportation with trusted drivers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
