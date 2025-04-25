import React, { useState } from "react";
import LoginModal from "./LoginModal.jsx";
import useSound from "../hooks/useSound";

export default function Header() {
  const [showModal, setShowModal] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const { playClickSound, playHoverSound, playNotificationSound } = useSound();

  const handleLogoClick = () => {
    playClickSound();
    setShowModal(true);
  };

  const handleModalClose = () => {
    playClickSound();
    setShowModal(false);
  };

  const handleLinkClick = (type) => {
    if (type === 'whatsapp') playNotificationSound('success');
    else if (type === 'email') playNotificationSound('notification');
    else playClickSound();
  };

  return (
    <header className="absolute top-0 left-0 w-full z-10 px-4 md:px-6 py-2 md:py-2 backdrop-blur-md">
      <div className="flex items-center justify-between w-full">

        {/* Logo con aura y login */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full blur-xl opacity-60 group-hover:opacity-90 animate-pulse bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 z-0"></div>
          <img
            src="/imagenes/logo.gif"
            alt="Herramientas"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer transition-transform hover:scale-105 duration-300 relative z-10"
            onClick={handleLogoClick}
            onMouseEnter={playHoverSound}
          />
          {showModal && (
            <div className="absolute top-24 left-0 z-50">
              <LoginModal onClose={handleModalClose} />
            </div>
          )}
        </div>

        {/* Íconos de contacto centrados */}
        <div className="flex flex-col md:flex-row items-center justify-center flex-1 gap-4">
          <div className="flex gap-6 md:gap-8 mt-2 md:mt-0">
            {/* WhatsApp */}
            <div
              className="flex flex-col items-center"
              onMouseEnter={() => { playHoverSound(); setHoveredLink('whatsapp'); }}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <a
                href="https://wa.me/618779308"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                onClick={() => handleLinkClick('whatsapp')}
              >
                <i className="fab fa-whatsapp text-green-400 text-4xl md:text-5xl"></i>
              </a>
              {hoveredLink === 'whatsapp' && (
                <div className="text-white text-xs font-sans mt-1">
                  Solicita presupuesto gratis
                </div>
              )}
            </div>

            {/* Email */}
            <div
              className="flex flex-col items-center"
              onMouseEnter={() => { playHoverSound(); setHoveredLink('email'); }}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <a
                href="mailto:contacto@autogestionpro.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Email"
                onClick={() => handleLinkClick('email')}
              >
                <i className="fas fa-envelope text-blue-400 text-4xl md:text-5xl"></i>
              </a>
              {hoveredLink === 'email' && (
                <div className="text-white text-xs font-sans mt-1 text-center">
                  Mándanos un email<br />con tus necesidades
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
