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

    return () => {import React, { useEffect } from 'react';
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
        // Función para forzar el scroll
        const enableScroll = () => {
          // Asegurar que el cuerpo y html permitan scroll
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
          document.body.style.height = 'auto';
          document.documentElement.style.height = 'auto';
          document.body.style.position = 'static'; // Prevenir position:fixed
          document.documentElement.style.position = 'static';
        };
        
        // Aplicar inmediatamente
        enableScroll();
        
        // Desplazar al inicio cuando se monta el componente
        window.scrollTo(0, 0);
        
        // También aplicar después de un pequeño retraso para asegurar 
        // que se ejecuta después de cualquier otra inicialización
        const timeoutId = setTimeout(enableScroll, 500);
    
        // Configurar un intervalo para asegurar que el scroll esté siempre habilitado
        const intervalId = setInterval(enableScroll, 2000);
    
        return () => {
          // Limpiar cuando el componente se desmonta
          clearTimeout(timeoutId);
          clearInterval(intervalId);
        };
      }, []);
    
      return (
        <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-sky-800 to-blue-700 text-white">
          {/* Fondo de partículas */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <ParticulasPremium />
          </div>
      
          {/* Header fijo arriba */}
          <Header />
      
          {/* Contenido principal */}
          <main className="relative z-10 flex-1 overflow-visible">
            <Hero />
            <div id="contacto" className="scroll-mt-20">
              <Features />
            </div>
          </main>
      
          {/* Footer visible abajo */}
          <Footer />
        </div>
      );      
    }