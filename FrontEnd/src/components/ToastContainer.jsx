import React from 'react';
import ToastNotification from './ToastNotification';

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ 
            transform: `translateY(${index * 10}px)`,
            zIndex: 1000 - index 
          }}
        >
          <ToastNotification
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            showProgress={toast.showProgress}
            allowCancel={toast.allowCancel}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
