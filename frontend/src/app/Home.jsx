import React, { useState, useEffect, useRef } from 'react';
import InfoPanels from '../components/InfoPanels';
import useSound from '../hooks/useSound';

function ServiceFrame({ title, url }) {
  const { playTransitionSound } = useSound();
  const hasPlayedSound = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!hasPlayedSound.current) {
      playTransitionSound();
      hasPlayedSound.current = true;
    }
    document.title = `${title} - AutogestiónPro`;
    setError(false);
  }, [playTransitionSound, title]);

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-800/50 backdrop-blur-sm">
        <div className="text-center p-8 bg-gray-900/70 rounded-xl max-w-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-400 mb-3">Error de conexión</h2>
          <p className="text-white mb-4">
            No se pudo conectar con <strong>{title}</strong>.
          </p>
          <p className="text-gray-400 text-sm mb-6">{url}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.href = '/dashboard/home'}
              className="bg-gray-600 px-6 py-3 rounded-lg text-white hover:bg-gray-700"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <iframe
        src={url}
        title={title}
        className="w-full h-full border-0"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        allowFullScreen
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function Home() {
  const [selectedService, setSelectedService] = useState(null);
  const hasCheckedStorage = useRef(false);
  const { playClickSound } = useSound();

  useEffect(() => {
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    const stored = localStorage.getItem('currentService') || localStorage.getItem('lastOpenedService');
    if (stored) {
      try {
        const service = JSON.parse(stored);
        if (service?.url && service?.title) {
          setSelectedService(service);
          localStorage.setItem('lastOpenedService', JSON.stringify(service));
        }
      } catch (err) {
        console.error("Error procesando servicio almacenado:", err);
      }
    }
  }, []);

  // Verificar la URL para ver si hay un iframe solicitado
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const iframeUrl = queryParams.get('iframe');
    
    if (iframeUrl) {
      // Extraer un título tentativo del URL
      const url = new URL(iframeUrl);
      const title = url.hostname.split('.')[0].charAt(0).toUpperCase() + url.hostname.split('.')[0].slice(1);
      
      setSelectedService({
        title: title,
        url: iframeUrl
      });
      
      // Guardar en localStorage para futuras visitas
      localStorage.setItem('lastOpenedService', JSON.stringify({
        title: title,
        url: iframeUrl
      }));
    }
  }, []);

  if (selectedService?.url) {
    return <ServiceFrame title={selectedService.title} url={selectedService.url} />;
  }

  return (
    <div className="p-4 h-full overflow-auto text-white animate-fade-in bg-transparent">
      <div className="flex flex-col h-full">
        {/* Solo mostrar los paneles de información en la parte superior */}
        <div className="mb-6">
          <InfoPanels />
        </div>
        
        {/* Espacio restante para futuros componentes */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-lg">
            <h2 className="text-2xl font-bold text-blue-400 mb-4">Panel Principal</h2>
            <p className="text-gray-300 mb-4">
              Seleccione un servicio del menú lateral para comenzar.
            </p>
            <p className="text-sm text-gray-400">
              Monitoreo de sistema activo. Todos los servicios están funcionando correctamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}