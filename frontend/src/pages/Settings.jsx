import React from 'react';
import { useSoundContext } from '../context/SoundContext';
import useSound from '../hooks/useSound';
import SoundToggle from '../components/SoundToggle';
import VolumenSlider from '../components/VolumenSlider';
import SoundButton from '../components/SoundButton';
import { Volume2, VolumeX } from 'lucide-react';

const Settings = () => {
  const {
    enabled: isEnabled,
    setEnabled: toggleEnabled,
    isMuted,
    toggleMute,
    volume,
    setVolume,
    playSound,
    availableSounds
  } = useSoundContext();

  const { playClick } = useSound();

  // Función para probar un sonido específico
  const handleTestSound = (soundName) => {
    playSound(soundName);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Configuración</h1>

      {/* Panel principal de sonido */}
      <div className="bg-zinc-800 rounded-2xl p-5 mb-8 border border-zinc-600 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">🎧 Configuración de Audio</h2>

        <div className="flex items-center justify-between mb-6">
          <SoundToggle />
          <span className="text-sm text-zinc-400">
            {isEnabled ? 'Activado' : 'Desactivado'}
          </span>
        </div>

        {isEnabled && (
          <>
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => {
                  toggleMute();
                  playClick();
                }}
                className={`p-3 rounded-full transition duration-200 ${
                  isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <span className="text-sm text-zinc-400">
                {isMuted ? 'Silenciado' : 'Con sonido'}
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2 text-zinc-300">Volumen</label>
              <VolumenSlider value={volume} onChange={setVolume} />
            </div>
          </>
        )}
      </div>

      {/* Sección de prueba de sonidos */}
      {isEnabled && !isMuted && (
        <div className="bg-zinc-800 rounded-2xl p-5 mb-8 border border-zinc-600 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">🎵 Prueba de Sonidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableSounds.map((sound) => (
              <button
                key={sound}
                onClick={() => handleTestSound(sound)}
                className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded-md text-sm font-medium transition"
              >
                {sound.charAt(0).toUpperCase() + sound.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sección informativa */}
      <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 text-sm">
        <h3 className="font-medium mb-2">ℹ️ Acerca del Sistema de Sonido</h3>
        <p className="text-zinc-300">
          El sistema de sonido mejora tu experiencia proporcionando feedback
          auditivo para las interacciones. Puedes ajustar el volumen, silenciar
          los sonidos o desactivarlos por completo según tus preferencias.
        </p>
      </div>
    </div>
  );
};

export default Settings;
