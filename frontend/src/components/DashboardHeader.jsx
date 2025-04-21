import React, { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useSound from '../hooks/useSound';

export default function DashboardHeader({ height = 70, onHeightChange }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showBackButton, setShowBackButton] = useState(false);
  const { playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    const checkForActiveService = () => {
      const hasActiveService = localStorage.getItem('lastOpenedService') !== null;
      setShowBackButton(hasActiveService);
    };

    checkForActiveService();
    const interval = setInterval(checkForActiveService, 500);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    playClickSound();
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleBackToDashboard = () => {
    playClickSound();
    localStorage.removeItem('lastOpenedService');
    localStorage.removeItem('currentService');
    window.location.href = '/dashboard/home';
  };

  return (
    <header
      className="bg-transparent backdrop-blur-sm px-6 py-4 border-b border-gray-800/30 relative"
      style={{ height: `${height}px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      {/* Izquierda: botón Volver */}
      <div className="w-48 flex items-center">
        {showBackButton && (
          <button
            onClick={handleBackToDashboard}
            onMouseEnter={playHoverSound}
            className="bg-red-500/70 hover:bg-red-600/90 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300"
          >
            Volver
          </button>
        )}
      </div>

      {/* Centro: Título con glow */}
      <div className="flex-1 flex justify-center">
        <h1
          className="text-3xl font-extrabold text-pink-500 text-center tracking-wide uppercase animate-glow cursor-default"
          onMouseEnter={playHoverSound}
        >
          Panel de Control
        </h1>
      </div>

      {/* Derecha: avatar y logout */}
      <div className="flex items-center gap-4 w-48 justify-end">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-600 hover:ring hover:ring-blue-400 transition">
          <img
            src="/imagenes/avatar.png"
            alt="Perfil"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-white">Administrador</p>
          <button
            onClick={handleLogout}
            className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1"
            onMouseEnter={playHoverSound}
          >
            <LogOut className="w-4 h-4" /> Cerrar sesión
          </button>
        </div>
      </div>

      {/* Redimensionar altura si se provee función */}
      {onHeightChange && (
        <div
          className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-blue-500/20"
          style={{ zIndex: 30 }}
          onMouseDown={(e) => {
            e.preventDefault();
            document.body.classList.add('resizing-header');
            const startY = e.clientY;
            const startHeight = height;
            const handleMouseMove = (moveEvent) => {
              const newHeight = startHeight + (moveEvent.clientY - startY);
              if (newHeight >= 50 && newHeight <= 120) {
                onHeightChange(newHeight);
              }
            };
            const handleMouseUp = () => {
              document.body.classList.remove('resizing-header');
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
        />
      )}
    </header>
  );
}
