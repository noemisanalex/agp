import React from 'react';
import { useSoundContext } from '../context/SoundContext';

const SoundToggle = () => {
  const { enabled, setEnabled, playSound } = useSoundContext();

  const toggle = () => {
    playSound('switch');
    setEnabled(!enabled);
  };

  return (
    <label className="flex items-center gap-3 text-white">
      <span>Sonido:</span>
      <input
        type="checkbox"
        checked={enabled}
        onChange={toggle}
        className="accent-indigo-500 w-5 h-5"
      />
    </label>
  );
};

export default SoundToggle;
