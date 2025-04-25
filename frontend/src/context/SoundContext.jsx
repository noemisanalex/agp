import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const SoundContext = createContext();

// Hook personalizado para usar el contexto
export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound debe ser usado dentro de un SoundProvider');
  }
  return context;
};

// Proveedor del contexto
export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // Valor por defecto 50%
  const [audioContext, setAudioContext] = useState(null);
  const [audioBuffers, setAudioBuffers] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Sonidos predefinidos (rutas a archivos de audio)
  const SOUNDS = {
    click: "/sonidos/click.mp3",
    hover: "/sonidos/hover.mp3",
    success: "/sonidos/success.mp3",
    error: "/sonidos/error.mp3",
    notification: "/sonidos/notification.mp3",
    spark: "/sonidos/spark.mp3"
  };

  // Inicializar el contexto de audio
  useEffect(() => {
    try {
      // Cargar preferencias
      const savedMuted = localStorage.getItem('appMuted');
      const savedVolume = localStorage.getItem('appVolume');
      
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }
      
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }

      // Verificar si el navegador soporta Web Audio API
      if (typeof window !== 'undefined' && window.AudioContext) {
        const newAudioContext = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(newAudioContext);
        
        // Precargar sonidos comunes
        const preloadSounds = async () => {
          try {
            const bufferPromises = Object.entries(SOUNDS).map(async ([key, url]) => {
              try {
                const response = await fetch(url);
                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                  console.warn(`No se pudo cargar el sonido ${key} desde ${url}`);
                  return [key, null];
                }
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await newAudioContext.decodeAudioData(arrayBuffer);
                return [key, audioBuffer];
              } catch (err) {
                console.warn(`Error cargando sonido ${key}:`, err);
                return [key, null];
              }
            });
            
            const buffers = await Promise.all(bufferPromises);
            const bufferMap = Object.fromEntries(buffers);
            setAudioBuffers(bufferMap);
            setIsInitialized(true);
          } catch (error) {
            console.error("Error precargando sonidos:", error);
          }
        };
        
        preloadSounds();
      } else {
        console.warn("Web Audio API no soportada en este navegador");
      }
    } catch (error) {
      console.error("Error inicializando Audio Context:", error);
    }
    
    return () => {
      // Limpiar recursos al desmontar
      if (audioContext && audioContext.state !== 'closed') {
        try {
          audioContext.close();
        } catch (error) {
          console.error("Error cerrando Audio Context:", error);
        }
      }
    };
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

  // Función para reproducir un sonido
  const playSound = (soundKey) => {
    try {
      if (isMuted || !audioContext || !isInitialized) {
        return;
      }
      
      // Verificar si el buffer existe
      const buffer = audioBuffers[soundKey];
      if (!buffer) {
        console.warn(`Sonido "${soundKey}" no encontrado o no cargado correctamente`);
        return;
      }
      
      // Reanudar el contexto si está suspendido (políticas de autoplay)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Crear y conectar nodos para reproducir el sonido
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      
      // Ajustar volumen
      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Reproducir y manejar errores
      source.start(0);
      
      // Limpiar después de reproducir
      source.onended = () => {
        source.disconnect();
        gainNode.disconnect();
      };
    } catch (error) {
      console.error(`Error reproduciendo sonido "${soundKey}":`, error);
    }
  };

  // Funciones específicas para cada tipo de sonido
  const playClickSound = () => playSound('click');
  const playHoverSound = () => playSound('hover');
  const playSuccessSound = () => playSound('success');
  const playErrorSound = () => playSound('error');
  
  // Función para sonidos de notificación (puede aceptar diferentes tipos)
  const playNotificationSound = (type = 'notification') => {
    try {
      if (SOUNDS[type]) {
        playSound(type);
      } else {
        playSound('notification');
      }
    } catch (error) {
      console.error(`Error en playNotificationSound (${type}):`, error);
      // Intentar reproducir el sonido de notificación predeterminado como fallback
      try {
        playSound('notification');
      } catch (fallbackError) {
        console.error("Error en fallback de sonido:", fallbackError);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <SoundContext.Provider value={{
      isMuted,
      volume,
      toggleMute,
      setVolume,
      playClickSound,
      playHoverSound,
      playSuccessSound,
      playErrorSound,
      playNotificationSound,
      isInitialized
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export default SoundContext;