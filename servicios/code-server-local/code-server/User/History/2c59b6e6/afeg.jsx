import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ParticulasPremium from './ParticulasPremium';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

export default function Landing() {
  const navigate = useNavigate();

  // Asegurar que la página se pueda desplazar
  useEffect(() => {
    // Asegurar que el cuerpo y html permitan scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.height = 'auto';
    
    // Desplazar al inicio cuando se monta el componente
    window.scrollTo(0, 0);

    return () => {
      // Limpiar cuando el componente se desmonta
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.height = '';
      document.documentElement.style.height = '';
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-blue-700 text-white overflow-y-auto">
      {/* Fondo de partículas */}
      <ParticulasPremium className="absolute inset-0 z-0" />

      {/* Header funcional */}
      <Header />

      {/* Contenido principal - Asegurar que tenga overflow-y-auto para permitir scroll */}
      <main className="relative z-10 pb-20 overflow-x-hidden overflow-y-auto">
        <Hero />
        <div id="contacto" className="scroll-mt-20">
          <Features />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}