import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const SoundModal = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Valor por defecto 50%
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar preferencias al inicio
  useEffect(() => {
    try {
      const savedMuted = localStorage.getItem('appMuted');
      const savedVolume = localStorage.getItem('appVolume');
      
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }
      
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
    } catch (error) {
      console.error("Error cargando preferencias de audio:", error);
    }
  }, []);

  // Guardar preferencias cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('appMuted', isMuted.toString());
      localStorage.setItem('appVolume', volume.toString());
      
      // Aplicar a todos los elementos de audio en la página
      const audioElements = document.querySelectorAll('audio, video');
      audioElements.forEach(el => {
        el.muted = isMuted;
        el.volume = volume;
      });
    } catch (error) {
      console.error("Error guardando preferencias de audio:", error);
    }
  }, [isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Botón de sonido */}
      <button
        onClick={toggleModal}
        className="bg-gray-900/80 hover:bg-gray-800/90 border border-blue-500/30 rounded-full p-3 text-white transition-all hover:scale-105 shadow-lg"
        title={isMuted ? "Activar sonido" : "Configurar sonido"}
      >
        {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
      </button>

      {/* Modal de configuración de sonido */}
      {isModalOpen && (
        <div className="absolute bottom-16 left-0 bg-gray-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 shadow-xl w-64 animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Configuración de Audio</h3>
            <button 
              onClick={toggleModal}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            {/* Control de Mute */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-200">Silenciar</span>
              <button
                onClick={toggleMute}
                className={`w-12 h-6 rounded-full transition-colors ${
                  isMuted ? "bg-gray-600" : "bg-blue-500"
                } relative`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    isMuted ? "left-1" : "left-7"
                  }`}
                />
              </button>
            </div>
            
            {/* Control de Volumen */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-gray-300">
                <span>Volumen</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-blue-500 bg-gray-700 h-2 rounded-full appearance-none cursor-pointer"
                disabled={isMuted}
              />
            </div>
            
            {/* Info */}
            <p className="text-xs text-gray-400 mt-2">
              Estas configuraciones se aplicarán a todos los sonidos de la aplicación.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundModal;