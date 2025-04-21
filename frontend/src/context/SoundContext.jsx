import React, { createContext, useContext, useState, useEffect } from 'react';

// Definir los sonidos disponibles y sus rutas
const SOUNDS = {
 // Sonidos de UI básica
 click: '/sonidos/click.mp3',
 hover: '/sonidos/hover.mp3',
 switch: '/sonidos/switch.mp3',
 slide: '/sonidos/slide.mp3',
 
 // Notificaciones
 notification: '/sonidos/notification.mp3',
 success: '/sonidos/success.mp3',
 error: '/sonidos/error.mp3',
 warning: '/sonidos/warning.mp3',
 
 // Transiciones y navegación
 transition: '/sonidos/transition.mp3',
 login: '/sonidos/login.mp3',
 logout: '/sonidos/logout.mp3',
 
 // Otros sonidos
 achievement: '/sonidos/achievement.mp3',
 welcome: '/sonidos/welcome.mp3'
};

const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
 const [enabled, setEnabled] = useState(true);
 const [volume, setVolume] = useState(0.5);
 const [isMuted, setIsMuted] = useState(false);
 const [audioCache, setAudioCache] = useState({});

 // Cargar configuración desde localStorage
 useEffect(() => {
   const stored = JSON.parse(localStorage.getItem('soundSettings'));
   if (stored) {
     setEnabled(stored.enabled !== undefined ? stored.enabled : true);
     setVolume(stored.volume !== undefined ? stored.volume : 0.5);
     setIsMuted(stored.muted !== undefined ? stored.muted : false);
   }
 }, []);

 // Guardar configuración en localStorage
 useEffect(() => {
   localStorage.setItem('soundSettings', JSON.stringify({ 
     enabled, 
     volume,
     muted: isMuted
   }));
 }, [enabled, volume, isMuted]);

 // Inicializar la caché de audio
 useEffect(() => {
   const newCache = {};
   
   // Precargar sonidos
   Object.entries(SOUNDS).forEach(([key, path]) => {
     try {
       const audio = new Audio(path);
       audio.preload = 'auto';
       audio.volume = volume;
       newCache[key] = audio;
     } catch (error) {
       console.warn(`Error al precargar el sonido ${key}:`, error);
     }
   });
   
   setAudioCache(newCache);
   
   // Limpiar al desmontar
   return () => {
     Object.values(newCache).forEach(audio => {
       try {
         audio.pause();
         audio.src = '';
       } catch (e) {
         // Ignorar errores de limpieza
       }
     });
   };
 }, []);

 // Actualizar volumen en todos los sonidos cuando cambia
 useEffect(() => {
   Object.values(audioCache).forEach(audio => {
     audio.volume = volume;
   });
 }, [volume, audioCache]);

 // Función para reproducir sonidos
 const playSound = (soundName) => {
   if (!enabled || isMuted) return;
   
   const audio = audioCache[soundName];
   if (!audio) {
     console.warn(`Sonido "${soundName}" no encontrado`);
     return;
   }
   
   try {
     // Reiniciar el audio para permitir reproducción repetida
     audio.currentTime = 0;
     audio.play().catch(error => {
       console.warn(`Error al reproducir sonido ${soundName}:`, error);
     });
   } catch (error) {
     console.warn(`Error al reproducir sonido ${soundName}:`, error);
   }
 };

 // Función para silenciar/activar sonido
 const toggleMute = () => {
   setIsMuted(prev => !prev);
 };

 // Verificar si existe un sonido
 const hasSound = (soundName) => {
   return !!audioCache[soundName];
 };

 return (
   <SoundContext.Provider value={{ 
     enabled, 
     setEnabled, 
     volume, 
     setVolume,
     isMuted,
     setIsMuted,
     toggleMute,
     playSound,
     hasSound,
     availableSounds: Object.keys(SOUNDS)
   }}>
     {children}
   </SoundContext.Provider>
 );
};

export const useSoundContext = () => useContext(SoundContext);