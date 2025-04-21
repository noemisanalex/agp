import React from 'react';
import useSound from '../hooks/useSound';

const VolumenSlider = ({ value, onChange }) => {
  const { playSlideSound } = useSound();

  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);

    // Solo reproducir el sonido si el cambio es significativo
    if (Math.abs(newValue - value) > 0.05) {
      playSlideSound();
    }

    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={handleChange}
        className="w-full accent-indigo-500"
      />
      <span className="text-sm text-white font-mono w-12 text-center">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
};

export default VolumenSlider;

