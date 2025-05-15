// components/ui/ToastContainer.js
import React from 'react';

export const ToastContainer = ({ toastQueue }) => {
  return (
    <div>
      {toastQueue.map((toast, index) => (
        <div key={index} className={`toast ${toast.variant}`}>
          <h4>{toast.title}</h4>
          <p>{toast.description}</p>
        </div>
      ))}
    </div>
  );
};
