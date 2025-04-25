import { useContext } from 'react';
import SoundContext from '../context/SoundContext';

// Hook personalizado para facilitar el uso del contexto de sonido
const useSound = () => {
  const sound = useContext(SoundContext);
  
  if (!sound) {
    // Proporcionar una implementación de fallback si el contexto no está disponible
    console.warn('useSound debe ser usado dentro de un SoundProvider. Usando versión silenciosa.');
    
    // Versión silenciosa que no produce errores cuando se llama
    return {
      isMuted: true,
      volume: 0,
      toggleMute: () => {},
      setVolume: () => {},
      playClickSound: () => {},
      playHoverSound: () => {},
      playSuccessSound: () => {},
      playErrorSound: () => {},
      playNotificationSound: () => {},
      isInitialized: false
    };
  }
  
  return sound;
};

export default useSound;