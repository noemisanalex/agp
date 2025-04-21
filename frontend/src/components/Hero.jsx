import React, { useEffect, useRef, useState } from "react";
import useSound from "../hooks/useSound";

export default function Hero() {
  const logo = "/imagenes/logo.png";
  const videoRef = useRef(null);
  const logoRef = useRef(null);
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [sparkPlayed, setSparkPlayed] = useState(false);
  const [nearMouse, setNearMouse] = useState(false);

  const { playNotificationSound } = useSound();

  // Seguimiento del ratón para el logo flotante
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const baseX = window.innerWidth - 100;
      const baseY = 80;
      const dx = clientX - baseX;
      const dy = clientY - baseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        setNearMouse(true);
        setLogoPos({ x: dx * 0.2, y: dy * 0.2 });
        if (!sparkPlayed) {
          playNotificationSound("spark");
          setSparkPlayed(true);
        }
      } else {
        setNearMouse(false);
        setLogoPos({ x: 0, y: 0 });
        setSparkPlayed(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [sparkPlayed, playNotificationSound]);

  // Reproducir el video con sonido 8 segundos después de montar
  useEffect(() => {
    const timeout = setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.play().catch((err) => {
          console.warn("⚠️ El navegador bloqueó la reproducción automática:", err);
        });
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
          href="#"
          className="bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold py-2 px-6 rounded-full hover:scale-105 transition-transform"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contacto")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Solicitar Visita
        </a>
      </div>

      {/* LOGO flotante con aura y movimiento */}
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
        />
      </div>
    </section>
  );
}
