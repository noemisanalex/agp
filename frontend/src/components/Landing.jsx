import React from 'react';
import { useNavigate } from 'react-router-dom';
import ParticulasPremium from './ParticulasPremium';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-blue-700 text-white">
      {/* Fondo de partículas */}
      <ParticulasPremium />
      
      {/* Header */}
      <Header />
      
      {/* Contenido principal */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        
        {/* Features Section */}
        <Features />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}