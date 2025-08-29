import { useState, useCallback } from 'react';

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 5000,
      showProgress: options.showProgress !== false,
      allowCancel: options.allowCancel !== false,
      ...options
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after duration if specified
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration + 500); // Add buffer for animation
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, options) => 
    showToast(message, 'success', options), [showToast]);

  const error = useCallback((message, options) => 
    showToast(message, 'error', options), [showToast]);

  const warning = useCallback((message, options) => 
    showToast(message, 'warning', options), [showToast]);

  const info = useCallback((message, options) => 
    showToast(message, 'info', options), [showToast]);

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  };
};
