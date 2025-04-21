import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook personalizado para manejar efectos de sonido en la aplicación
 */
const useSound = () => {
  // Referencias a los elementos de audio para evitar recreación
  const clickSoundRef = useRef(null);
  const hoverSoundRef = useRef(null);
  const transitionSoundRef = useRef(null);
  const errorSoundRef = useRef(null);
  const successSoundRef = useRef(null);
  
  // Inicializar los elementos de audio una vez
  useEffect(() => {
    // Crear elementos de audio si no existen
    if (!clickSoundRef.current) {
      clickSoundRef.current = new Audio('/sonidos/click.mp3');
      clickSoundRef.current.volume = 0.3;
    }
    
    if (!hoverSoundRef.current) {
      hoverSoundRef.current = new Audio('/sonidos/hover.mp3');
      hoverSoundRef.current.volume = 0.1;
    }
    
    if (!transitionSoundRef.current) {
      transitionSoundRef.current = new Audio('/sonidos/transition.mp3');
      transitionSoundRef.current.volume = 0.4;
    }
    
    if (!errorSoundRef.current) {
      errorSoundRef.current = new Audio('/sonidos/error.mp3');
      errorSoundRef.current.volume = 0.5;
    }
    
    if (!successSoundRef.current) {
      successSoundRef.current = new Audio('/sonidos/success.mp3');
      successSoundRef.current.volume = 0.4;
    }
    
    // Precarga para mejor rendimiento
    const preloadAudio = (audio) => {
      audio.load();
    };
    
    preloadAudio(clickSoundRef.current);
    preloadAudio(hoverSoundRef.current);
    preloadAudio(transitionSoundRef.current);
    preloadAudio(errorSoundRef.current);
    preloadAudio(successSoundRef.current);
    
    // Verificar si los sonidos están desactivados en localStorage
    const soundsDisabled = localStorage.getItem('soundsDisabled') === 'true';
    if (soundsDisabled) {
      muteAllSounds();
    }
    
    // Limpiar al desmontar
    return () => {
      clickSoundRef.current = null;
      hoverSoundRef.current = null;
      transitionSoundRef.current = null;
      errorSoundRef.current = null;
      successSoundRef.current = null;
    };
  }, []);
  
  // Función para reproducir sonido de click
  const playClickSound = useCallback(() => {
    if (clickSoundRef.current) {
      // Reiniciar el sonido si ya está reproduciéndose
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(err => console.error("Error reproduciendo sonido:", err));
    }
  }, []);
  
  // Función para reproducir sonido al pasar el cursor
  const playHoverSound = useCallback(() => {
    if (hoverSoundRef.current) {
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(err => {});
    }
  }, []);
  
  // Función para reproducir sonido de transición
  const playTransitionSound = useCallback(() => {
    if (transitionSoundRef.current) {
      transitionSoundRef.current.currentTime = 0;
      transitionSoundRef.current.play().catch(err => console.error("Error reproduciendo sonido:", err));
    }
  }, []);
  
  // Función para reproducir sonido de error
  const playErrorSound = useCallback(() => {
    if (errorSoundRef.current) {
      errorSoundRef.current.currentTime = 0;
      errorSoundRef.current.play().catch(err => console.error("Error reproduciendo sonido:", err));
    }
  }, []);
  
  // Función para reproducir sonido de éxito
  const playSuccessSound = useCallback(() => {
    if (successSoundRef.current) {
      successSoundRef.current.currentTime = 0;
      successSoundRef.current.play().catch(err => console.error("Error reproduciendo sonido:", err));
    }
  }, []);
  
  // Función para activar/desactivar todos los sonidos
  const toggleSounds = useCallback(() => {
    const soundsDisabled = localStorage.getItem('soundsDisabled') === 'true';
    
    if (soundsDisabled) {
      // Activar sonidos
      localStorage.setItem('soundsDisabled', 'false');
      unmuteAllSounds();
    } else {
      // Desactivar sonidos
      localStorage.setItem('soundsDisabled', 'true');
      muteAllSounds();
    }
    
    return !soundsDisabled;
  }, []);
  
  // Función para silenciar todos los sonidos
  const muteAllSounds = useCallback(() => {
    if (clickSoundRef.current) clickSoundRef.current.volume = 0;
    if (hoverSoundRef.current) hoverSoundRef.current.volume = 0;
    if (transitionSoundRef.current) transitionSoundRef.current.volume = 0;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0;
    if (successSoundRef.current) successSoundRef.current.volume = 0;
  }, []);
  
  // Función para quitar silencio a todos los sonidos
  const unmuteAllSounds = useCallback(() => {
    if (clickSoundRef.current) clickSoundRef.current.volume = 0.3;
    if (hoverSoundRef.current) hoverSoundRef.current.volume = 0.1;
    if (transitionSoundRef.current) transitionSoundRef.current.volume = 0.4;
    if (errorSoundRef.current) errorSoundRef.current.volume = 0.5;
    if (successSoundRef.current) successSoundRef.current.volume = 0.4;
  }, []);
  
  // Verificar si los sonidos están activados
  const areSoundsEnabled = useCallback(() => {
    return localStorage.getItem('soundsDisabled') !== 'true';
  }, []);
  
  return {
    playClickSound,
    playHoverSound,
    playTransitionSound,
    playErrorSound,
    playSuccessSound,
    toggleSounds,
    areSoundsEnabled
  };
};

export default useSound;