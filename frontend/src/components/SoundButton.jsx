import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSoundContext } from '../context/SoundContext';

const SoundButton = () => {
  const { isMuted, toggleMute, playSound } = useSoundContext();

  const handleClick = () => {
    playSound('click');
    toggleMute();
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
      title={isMuted ? 'Sonido desactivado' : 'Sonido activado'}
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default SoundButton;
