import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const ToastContext = createContext();

// Hook para usar el contexto
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

// Componente Toast
const Toast = ({ message, type, onClose }) => {
  // Estilo basado en el tipo
  let bgColor = 'bg-gray-800';
  let borderColor = 'border-gray-600';
  let icon = '💬';

  if (type === 'success') {
    bgColor = 'bg-green-900/80';
    borderColor = 'border-green-500';
    icon = '✅';
  } else if (type === 'error') {
    bgColor = 'bg-red-900/80';
    borderColor = 'border-red-500';
    icon = '❌';
  } else if (type === 'warning') {
    bgColor = 'bg-yellow-900/80';
    borderColor = 'border-yellow-500';
    icon = '⚠️';
  } else if (type === 'info') {
    bgColor = 'bg-blue-900/80';
    borderColor = 'border-blue-500';
    icon = 'ℹ️';
  }

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} backdrop-blur-sm border ${borderColor} text-white rounded-lg shadow-lg px-4 py-3 z-50 flex items-center min-w-[300px] max-w-md animate-fade-in-up`}>
      <span className="mr-2 text-xl">{icon}</span>
      <p className="flex-grow">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-2 text-white/80 hover:text-white transition-colors"
      >
        ×
      </button>
    </div>
  );
};

// Proveedor del contexto
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    
    // Auto-cerrar después de la duración
    if (duration > 0) {
      setTimeout(() => {
        setToast(null);
      }, duration);
    }
  };

  const hideToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext;