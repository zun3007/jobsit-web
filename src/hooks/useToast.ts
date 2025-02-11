import { useState, useCallback } from 'react';
import { ToastData } from '../components/ui/ToastContainer';
import { ToastType } from '../components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (type: ToastType, message: string, duration?: number) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, duration }]);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message: string, duration?: number) =>
      addToast('success', message, duration),
    [addToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) =>
      addToast('error', message, duration),
    [addToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => addToast('info', message, duration),
    [addToast]
  );

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  };
}
