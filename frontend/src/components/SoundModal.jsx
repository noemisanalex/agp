import React from 'react';
import Header from './Header';
import Footer from './Footer';
import FondoParticulas from './FondoParticulas';
import SoundModal from './SoundModal';

const Layout = ({ children }) => {
  return (
    <div className="relative bg-black text-white min-h-screen overflow-x-hidden font-sans">
      {/* Fondo animado de partículas */}
      <FondoParticulas />

      {/* Contenido encima del fondo */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>

      {/* Botón de audio en la esquina inferior izquierda */}
      <SoundModal />
    </div>
  );
};

export default Layout;