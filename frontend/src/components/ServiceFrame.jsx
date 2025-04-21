import React, { useEffect, useRef, useState } from 'react';
import useSound from '../hooks/useSound';

export default function ServiceFrame({ title, url }) {
  const { playTransitionSound } = useSound();
  const [error, setError] = useState(false);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!hasPlayed.current) {
      playTransitionSound();
      hasPlayed.current = true;
    }
    document.title = `${title} - AutogestiónPro`;
    setError(false);
  }, [title, playTransitionSound]);

  const handleError = () => {
    console.warn("❌ Error al cargar iframe:", url);
    setError(true);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900/70 p-8 rounded-xl text-center">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error de conexión</h2>
        <p className="text-white mb-2">No se pudo acceder a:</p>
        <p className="text-blue-300 font-mono mb-6">{url}</p>
        <div className="flex gap-4">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Abrir en nueva pestaña
          </a>
          <button
            onClick={() => window.location.href = "/dashboard/home"}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={url}
        title={title}
        className="w-full h-[calc(100vh-4rem)] border-none"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        allowFullScreen
        onError={handleError}
      />
    </div>
  );
}
