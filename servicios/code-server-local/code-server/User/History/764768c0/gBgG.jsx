import React, { useState } from "react";
import LoginModal from "./LoginModal";
import useSound from "../hooks/useSound";
import { useVisita } from "../context/VisitaContext";

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { openVisita } = useVisita();
  const { playClickSound, playHoverSound, playNotificationSound } = useSound();

  const handleLogoClick = () => {
    try {
      playClickSound();
      setShowLoginModal(true);
    } catch (error) {
      console.error("Error en click de logo:", error);
    }
  };

  const handleLoginModalClose = () => {
    try {
      playClickSound();
      setShowLoginModal(false);
    } catch (error) {
      console.error("Error al cerrar modal:", error);
    }
  };

  const handleEmailClick = (e) => {
    try {
      e.preventDefault();
      playNotificationSound("notification");
      openVisita();
    } catch (error) {
      console.error("Error en click de email:", error);
    }
  };

  const handleLinkClick = (type) => {
    try {
      if (type === "whatsapp") playNotificationSound("success");
      else if (type === "email") playNotificationSound("notification");
      else playClickSound();
    } catch (error) {
      console.error("Error en click de enlace:", error);
    }
  };

  // Función para acceso directo al dashboard
  const accessDashboard = () => {
    try {
      localStorage.setItem('token', 'ok');
      window.location.href = '/dashboard/home';
    } catch (error) {
      console.error("Error accediendo al dashboard:", error);
      alert("Error al acceder. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      {/* RUEDA GIF + Login */}
      <div
        className="fixed top-6 left-6 z-[9999] flex items-center gap-2 cursor-pointer transition-transform hover:scale-110"
        onClick={handleLogoClick}
        onMouseEnter={() => {
          try {
            playHoverSound();
          } catch (error) {
            console.error("Error en hover:", error);
          }
        }}
      >
        <div className="relative w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
          {/* AURA */}
          <div className="absolute inset-0 rounded-full blur-xl opacity-50 bg-white animate-pulse-slow pointer-events-none" />
          {/* IMAGEN */}
          <img
            src="/imagenes/rueda.gif"
            alt="Login"
            className="relative w-full h-full drop-shadow-[0_0_10px_white]"
          />
        </div>

        {/* TEXTO LOGIN */}
        <span className="text-sm text-white font-light select-none mt-2 hidden sm:inline">
          Login
        </span>
      </div>

      {/* ICONOS: WhatsApp y Email */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9998] flex gap-10 items-center pointer-events-auto bg-transparent">
        {/* WhatsApp */}
        <div
          className="relative flex flex-col items-center cursor-pointer"
          onMouseEnter={() => {
            try {
              playHoverSound();
              setHoveredLink("whatsapp");
            } catch (error) {
              console.error("Error en hover:", error);
            }
          }}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <a
            href="https://wa.me/618779308"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleLinkClick("whatsapp")}
            title="WhatsApp"
            className="text-green-400 text-5xl outline-none focus:outline-none transition-all duration-300 hover:drop-shadow-[0_0_12px_#22c55e]"
          >
            <i className="fab fa-whatsapp" />
          </a>
          {hoveredLink === "whatsapp" && (
            <span className="absolute top-full mt-1 text-xs bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap">
              Solicita presupuesto
            </span>
          )}
        </div>

        {/* Email */}
        <div
          className="relative flex flex-col items-center cursor-pointer"
          onMouseEnter={() => {
            try {
              playHoverSound();
              setHoveredLink("email");
            } catch (error) {
              console.error("Error en hover:", error);
            }
          }}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <a
            href="#"
            onClick={handleEmailClick}
            title="Correo"
            className="text-blue-400 text-5xl outline-none focus:outline-none transition-all duration-300 hover:drop-shadow-[0_0_12px_#3b82f6]"
          >
            <i className="fas fa-envelope" />
          </a>
          {hoveredLink === "email" && (
            <span className="absolute top-full mt-1 text-xs bg-black/80 px-2 py-1 rounded text-white whitespace-nowrap">
              Solicitar visita
            </span>
          )}
        </div>
      </div>

      {/* BOTÓN DE ACCESO DIRECTO AL DASHBOARD */}
      <div
        className="fixed top-20 left-6 z-[9999] cursor-pointer"
        onClick={accessDashboard}
        onMouseEnter={() => {
          try {
            playHoverSound();
          } catch (error) {
            console.error("Error en hover:", error);
          }
        }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl">
          Acceso Directo
        </div>
      </div>

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <LoginModal onClose={handleLoginModalClose} />
        </div>
      )}
    </>
  );
}