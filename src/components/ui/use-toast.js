// components/ui/use-toast.js
import { useState } from 'react';

export const useToast = () => {
  const [toastQueue, setToastQueue] = useState([]);

  const toast = ({ title, description, variant = 'default' }) => {
    setToastQueue((prev) => [...prev, { title, description, variant }]);
  };

  return { toast, toastQueue };
};
