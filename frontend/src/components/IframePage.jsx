import React, { useEffect } from 'react';
import useSound from '../hooks/useSound';

export default function IframePage({ title, src }) {
  const { playTransitionSound, playClickSound, playHoverSound } = useSound();

  useEffect(() => {
    playTransitionSound();
  }, [playTransitionSound]);

  const handleOpenClick = () => {
    playClickSound();
  };

  return (
    <div className="h-full flex flex-col bg-gray-800/50 backdrop-blur-md animate-fade-in">
      {/* Cabecera del iframe */}
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-blue-400">{title}</h1>
      </div>

      {/* Mensaje de apertura en nueva pestaña */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-gray-900/70 rounded-xl p-8 shadow-lg">
          <svg className="w-24 h-24 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>

          <p className="text-lg mb-6 text-gray-300">
            El servicio <span className="font-semibold text-blue-400">{title}</span> se abrirá en una nueva pestaña para una mejor experiencia.
          </p>

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center transition-all shadow-lg hover:scale-105"
            onClick={handleOpenClick}
            onMouseEnter={playHoverSound}
          >
            <span className="font-medium">Abrir {title}</span>
            <svg className="w-5 h-5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
