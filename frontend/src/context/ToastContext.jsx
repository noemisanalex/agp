import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

let id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const newToast = { id: ++id, message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, duration);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'error':
        return <XCircle className="text-red-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Contenedor de notificaciones flotantes */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg bg-gray-800 border-l-4 animate-fade-in
              ${
                toast.type === 'success'
                  ? 'border-green-500'
                  : toast.type === 'error'
                  ? 'border-red-500'
                  : toast.type === 'warning'
                  ? 'border-yellow-500'
                  : 'border-blue-500'
              }
            `}
          >
            {getIcon(toast.type)}
            <span className="text-white text-sm">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
