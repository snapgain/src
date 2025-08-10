import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toast, onDismiss }) => {
  const getIcon = () => {
    switch (toast.variant) {
      case 'default':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'destructive':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.variant) {
      case 'destructive':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={`relative flex items-start p-4 border rounded-lg shadow-lg ${getBgColor()} max-w-md`}
    >
      <div className="flex items-start space-x-3 flex-1">
        {getIcon()}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="text-sm text-gray-600 mt-1">
              {toast.description}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

// Toast Container
export const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={onDismiss}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toast;