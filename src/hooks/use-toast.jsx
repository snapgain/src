import { useState, useCallback } from 'react';

// Simple toast implementation
let toastCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = ++toastCounter;
    
    const newToast = {
      id,
      title,
      description,
      variant,
      duration
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    // Show browser notification (simple fallback)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: description,
        icon: '/favicon.ico'
      });
    } else {
      // Console log as fallback
      console.log(`Toast: ${title}${description ? ` - ${description}` : ''}`);
    }

    return { id };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toast,
    dismiss,
    toasts
  };
}

// Export default for compatibility
export default useToast;