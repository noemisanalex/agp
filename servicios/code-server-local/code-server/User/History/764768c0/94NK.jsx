import React, { useState } from "react";
import LoginModal from "./LoginModal";
import useSound from "../hooks/useSound";
import { useVisita } from "../context/VisitaContext";

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { openVisita } = useVisita();
  const { playClickSound, playHoverSound, playNotificationSound } = useSound();

  // Función segura para reproducir sonidos
  const safePlaySound = (soundFunction, soundType = null) => {
    try {
      if (soundType) {
        soundFunction(soundType);
      } else {
        soundFunction();
      }
    } catch (error) {
      console.error(`Error reproduciendo sonido:`, error);
      // No interrumpir la experiencia del usuario si el sonido falla
    }
  };

  const handleLogoClick = () => {
    try {
      safePlaySound(playClickSound);
      setShowLoginModal(true);
    } catch (error) {
      console.error("Error en click de logo:", error);
      // Asegurar que el modal se abre incluso si hay un error con el sonido
      setShowLoginModal(true);
    }
  };

  const handleLoginModalClose = () => {
    try {
      safePlaySound(playClickSound);
      setShowLoginModal(false);
    } catch (error) {
      console.error("Error al cerrar modal:", error);
      // Asegurar que el modal se cierra incluso si hay un error con el sonido
      setShowLoginModal(false);
    }
  };

  const handleEmailClick = (e) => {
    try {
      e.preventDefault();
      safePlaySound(playNotificationSound, "notification");
      
      // Verificar si openVisita está definido antes de llamarlo
      if (typeof openVisita === 'function') {
        openVisita();
      } else {
        console.error("La función openVisita no está disponible");
        alert("Error al abrir el formulario de visita. Por favor, intente de nuevo.");
      }
    } catch (error) {
      console.error("Error en click de email:", error);
      // Implementación alternativa si openVisita falla
      try {
        // Scroll hasta la sección de contacto como fallback
        document
          .getElementById("contacto")
          ?.scrollIntoView({ behavior: "smooth" });
      } catch (scrollError) {
        console.error("Error al hacer scroll:", scrollError);
      }
    }
  };

  const handleLinkClick = (type) => {
    try {
      if (type === "whatsapp") safePlaySound(playNotificationSound, "success");
      else if (type === "email") safePlaySound(playNotificationSound, "notification");
      else safePlaySound(playClickSound);
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
          safePlaySound(playHoverSound);
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
            safePlaySound(playHoverSound);
            setHoveredLink("whatsapp");
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
            safePlaySound(playHoverSound);
            setHoveredLink("email");
          }}
          onMouseLeave={() => setHoveredLink(null)}
        >
          <a
            href="#contacto"
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

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/40">
          <LoginModal onClose={handleLoginModalClose} />
        </div>
      )}
    </>
  );
}