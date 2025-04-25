import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticulasPremium from './ParticulasPremium';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    const enableScroll = () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      document.body.style.height = 'auto';
      document.documentElement.style.height = 'auto';
      document.body.style.position = 'relative';
      document.documentElement.style.position = 'relative';
    };

    enableScroll();
    const timeoutId = setTimeout(enableScroll, 500);
    const intervalId = setInterval(enableScroll, 2000);
    window.scrollTo(0, 0);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-sky-800 to-blue-700 text-white overflow-x-hidden">
      {/* Fondo de partículas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ParticulasPremium />
      </div>

      {/* Header */}
      <div className="z-10 relative">
        <Header />
      </div>

      {/* Contenido principal */}
      <main className="relative z-10 flex-grow">
        <Hero />
        <div id="contacto" className="scroll-mt-20">
          <Features />
        </div>
      </main>

      {/* Footer al fondo */}
      <footer className="relative z-10">
        <Footer />
      </footer>
    </div>
  );
}
