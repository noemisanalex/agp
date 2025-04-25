import React, { useEffect, useRef, useState } from "react";
import useSound from "../hooks/useSound";
import { useVisita } from "../context/VisitaContext";

export default function Hero() {
  const logo = "/imagenes/logo.png";
  const videoRef = useRef(null);
  const logoRef = useRef(null);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [sparkPlayed, setSparkPlayed] = useState(false);
  const [nearMouse, setNearMouse] = useState(false);
  const [videoErrorHandled, setVideoErrorHandled] = useState(false);

  const { playNotificationSound } = useSound();
  const { openVisita } = useVisita();

  // Función segura para reproducir sonidos
  const safePlaySound = (soundFunction, soundType = null) => {
    try {
      if (soundType) {
        soundFunction(soundType);
      } else {
        soundFunction();
      }
      return true;
    } catch (error) {
      console.error(`Error reproduciendo sonido:`, error);
      return false;
    }
  };

  // Función para abrir formulario de visita de forma segura
  const handleSolicitudVisita = (e) => {
    try {
      e.preventDefault();
      safePlaySound(playNotificationSound, "notification");
      
      if (typeof openVisita === 'function') {
        openVisita();
      } else {
        console.error("La función openVisita no está disponible");
        // Fallback: scroll hasta la sección de contacto
        document
          .getElementById("contacto")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    } catch (error) {
      console.error("Error al solicitar visita:", error);
      // Fallback
      try {
        document
          .getElementById("contacto")
          ?.scrollIntoView({ behavior: "smooth" });
      } catch (scrollError) {
        console.error("Error al hacer scroll:", scrollError);
      }
    }
  };

  // Seguimiento del ratón para el logo flotante - Optimizado para rendimiento
  useEffect(() => {
    const handleMouseMove = (e) => {
      try {
        const { clientX, clientY } = e;
        const baseX = window.innerWidth - 100;
        const baseY = 80;
        const dx = clientX - baseX;
        const dy = clientY - baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          setNearMouse(true);
          // Reducir la frecuencia de actualizaciones para mejor rendimiento
          requestAnimationFrame(() => {
            setLogoPos({ x: dx * 0.2, y: dy * 0.2 });
          });
          
          if (!sparkPlayed) {
            safePlaySound(playNotificationSound, "spark");
            setSparkPlayed(true);
          }
        } else {
          setNearMouse(false);
          // Solo resetear posición si está fuera del radio
          if (logoPos.x !== 0 || logoPos.y !== 0) {
            setLogoPos({ x: 0, y: 0 });
          }
          setSparkPlayed(false);
        }
      } catch (error) {
        console.error("Error en seguimiento del ratón:", error);
      }
    };

    // Optimizar el evento para mejor rendimiento
    const throttledMouseMove = (e) => {
      // Throttling básico para mejorar rendimiento
      if (!throttledMouseMove.timeout) {
        throttledMouseMove.timeout = setTimeout(() => {
          handleMouseMove(e);
          throttledMouseMove.timeout = null;
        }, 50);
      }
    };
    throttledMouseMove.timeout = null;

    window.addEventListener("mousemove", throttledMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      if (throttledMouseMove.timeout) {
        clearTimeout(throttledMouseMove.timeout);
      }
    };
  }, [sparkPlayed, playNotificationSound, logoPos]);

  // Reproducir el video con sonido 8 segundos después de montar
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const video = videoRef.current;
        if (video) {
          video.muted = false;
          video.play().catch((err) => {
            console.warn("⚠️ El navegador bloqueó la reproducción automática:", err);
            setVideoErrorHandled(true);
            // No interrumpir la experiencia del usuario si el video no puede reproducirse
          });
        }
      } catch (error) {
        console.error("Error al reproducir video:", error);
        setVideoErrorHandled(true);
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center px-4 pt-40 pb-16 z-10 animate-fade-in">
      {/* VIDEO CON ESTILO VISUAL */}
      <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
        <div className="rounded-xl overflow-hidden shadow-2xl transition-all duration-500 hover:brightness-110 hover:scale-105">
          <video
            ref={videoRef}
            className="w-full h-auto"
            src="/imagenes/alexo.mp4"
            playsInline
            controls
            poster="/imagenes/video-poster.jpg"
            onError={(e) => {
              console.error("Error en la carga del video:", e);
              if (!videoErrorHandled) {
                setVideoErrorHandled(true);
              }
            }}
          />
        </div>
      </div>

      {/* CONTENIDO DERECHA */}
      <div className="w-full md:w-1/2 text-center md:text-left px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 mb-4">
          Auto<span className="text-yellow-400">Gestion</span>
          <span className="text-pink-500">Pro</span>
        </h1>

        <p className="text-lg sm:text-xl font-medium text-white mb-4">
          ¡No esperes más!! No hay nada más valioso que TU tiempo!!
        </p>

        <div className="max-w-xl text-white mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Lleva tu Empresa al Siguiente Nivel con Inteligencia Artificial
          </h2>
          <p className="text-sm sm:text-base leading-relaxed">
            Optimiza procesos, automatiza tareas y gestiona a tus clientes de
            manera más eficiente que nunca. Con nuestra plataforma de
            inteligencia artificial, el futuro de tu negocio es ahora. Libera a
            tu equipo de lo repetitivo y enfócate en lo que realmente importa:
            crecimiento e innovación.
          </p>
        </div>

        <a
          href="#contacto"
          className="bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold py-2 px-6 rounded-full hover:scale-105 transition-transform"
          onClick={handleSolicitudVisita}
        >
          Solicitar Visita
        </a>
      </div>

      {/* LOGO flotante con aura y movimiento - Asegurar que no bloquee interacciones */}
      <div
        ref={logoRef}
        className={`absolute top-2 right-6 z-20 hidden md:block pointer-events-none transition-all duration-300 ease-out ${
          !nearMouse ? "animate-bounce-slow" : ""
        } ${
          logoPos.x !== 0 || logoPos.y !== 0
            ? "brightness-125 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105"
            : ""
        }`}
        style={{
          transform: `translate(${logoPos.x}px, ${logoPos.y}px)`,
        }}
      >
        <img
          src={logo}
          alt="AutogestiónPro Logo"
          className="w-40 md:w-52 lg:w-60 transition-all duration-500"
          onError={(e) => {
            console.error("Error cargando el logo:", e);
            e.target.src = "/imagenes/logo-fallback.png";
            e.target.onerror = null;
          }}
        />
      </div>
    </section>
  );
}