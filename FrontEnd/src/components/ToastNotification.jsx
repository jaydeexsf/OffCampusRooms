import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const ToastNotification = ({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose, 
  showProgress = true,
  allowCancel = true 
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!duration || duration <= 0) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100));
        if (newProgress <= 0) {
          handleClose();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheck className="w-5 h-5" />;
      case 'error':
        return <FiAlertCircle className="w-5 h-5" />;
      case 'warning':
        return <FiAlertCircle className="w-5 h-5" />;
      default:
        return <FiInfo className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500/20 border-green-500/30',
          text: 'text-green-400',
          progress: 'bg-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-500/20 border-red-500/30',
          text: 'text-red-400',
          progress: 'bg-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-500/20 border-yellow-500/30',
          text: 'text-yellow-400',
          progress: 'bg-yellow-500'
        };
      default:
        return {
          bg: 'bg-blue-500/20 border-blue-500/30',
          text: 'text-blue-400',
          progress: 'bg-blue-500'
        };
    }
  };

  const colors = getColors();

  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${colors.bg} border rounded-xl p-4 min-w-[300px] max-w-[400px] backdrop-blur-sm shadow-lg`}>
        <div className="flex items-start gap-3">
          <div className={colors.text}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <p className={`${colors.text} font-medium text-sm`}>
              {message}
            </p>
          </div>
          {allowCancel && (
            <button
              onClick={handleClose}
              className={`${colors.text} hover:opacity-70 transition-opacity`}
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {showProgress && duration > 0 && (
          <div className="mt-3">
            <div className="w-full bg-white/10 rounded-full h-1">
              <div 
                className={`${colors.progress} h-1 rounded-full transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToastNotification;
