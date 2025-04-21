// SoundSettingsPanel.jsx
import React from 'react';
import { useSoundContext } from '../context/SoundContext';
import SoundToggle from './SoundToggle';

const SoundSettingsPanel = () => {
  const { enabled, isMuted } = useSoundContext();

  return (
    <div className="p-4 rounded-2xl bg-zinc-800 border border-zinc-600 shadow-xl w-full max-w-md">
      <h2 className="text-lg font-semibold text-white mb-3">🎧 Configuración de Sonido</h2>

      <div className="flex items-center justify-center mb-4">
        <SoundToggle />
      </div>

      <div className="mt-4 text-sm text-zinc-400 italic">
        Sonido {enabled ? (isMuted ? 'activado (silenciado)' : 'activado') : 'desactivado'}.
      </div>
    </div>
  );
};

export default SoundSettingsPanel;