import React from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { FiX, FiStar, FiMessageCircle } from 'react-icons/fi';

const LoginPopup = ({ isOpen, onClose, action = 'rate' }) => {
  if (!isOpen) return null;

  const getActionText = () => {
    switch (action) {
      case 'rate':
        return {
          title: 'Login to Rate',
          description: 'Please sign in to rate this room and share your experience.',
          icon: FiStar
        };
      case 'comment':
        return {
          title: 'Login to Comment',
          description: 'Please sign in to leave a comment and share your thoughts.',
          icon: FiMessageCircle
        };
      default:
        return {
          title: 'Login Required',
          description: 'Please sign in to continue.',
          icon: FiStar
        };
    }
  };

  const { title, description, icon: Icon } = getActionText();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <FiX size={24} />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center mb-6">
            <Icon className="text-white text-2xl" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>

          {/* Description */}
          <p className="text-gray-300 mb-8 leading-relaxed">
            {description}
          </p>

          {/* Sign In Button */}
          <SignInButton mode="modal">
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              Sign In to Continue
            </button>
          </SignInButton>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:bg-white/5"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
