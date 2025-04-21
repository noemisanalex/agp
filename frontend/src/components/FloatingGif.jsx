import React from 'react';

export default function FloatingGif() {
  return (
    <img
      src="/imagenes/autocer.png"
      alt="AutogestiónPro Bot"
      className="absolute top-24 left-10 w-36 h-auto z-20 pointer-events-none animate-fade-in"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
