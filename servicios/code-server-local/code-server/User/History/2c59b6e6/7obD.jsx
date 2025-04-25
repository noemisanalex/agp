import React from 'react';
import ParticulasPremium from './ParticulasPremium';
import Header from './Header';
import Hero from './Hero';
import Features from './Features';
import Footer from './Footer';

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-blue-700 text-white overflow-hidden">
      <ParticulasPremium className="absolute inset-0 z-0" />
      <Header />
      <main className="relative z-10 min-h-[100vh] overflow-x-hidden overflow-y-auto">
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
