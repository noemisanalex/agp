import React, { useState, useEffect } from 'react';
import useSound from '../hooks/useSound';

export default function ServiceCard({ title, url, icon: Icon, description, onClick }) {
  const { playClickSound, playHoverSound } = useSound();

  const cardId = title.toLowerCase().replace(/\s+/g, '-');

  const [size, setSize] = useState({
    width: 250,
    height: 150
  });

  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  // Cargar tamaño guardado
  useEffect(() => {
    try {
      const savedSizes = localStorage.getItem('cardSizes');
      if (savedSizes) {
        const sizes = JSON.parse(savedSizes);
        if (sizes[cardId]) {
          setSize(sizes[cardId]);
        }
      }
    } catch (error) {
      console.error("Error al cargar tamaño de tarjeta:", error);
    }
  }, [cardId]);

  // Guardar nuevo tamaño
  useEffect(() => {
    if (!isResizing) {
      try {
        const savedSizes = localStorage.getItem('cardSizes');
        const sizes = savedSizes ? JSON.parse(savedSizes) : {};
        sizes[cardId] = size;
        localStorage.setItem('cardSizes', JSON.stringify(sizes));
      } catch (error) {
        console.error("Error al guardar tamaño:", error);
      }
    }
  }, [size, isResizing, cardId]);

  // Redimensionar
  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setStartSize({ ...size });

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = 'nwse-resize';
    document.body.classList.add('no-select');
  };

  const handleResize = (e) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;

    setSize({
      width: Math.max(200, startSize.width + deltaX),
      height: Math.max(100, startSize.height + deltaY)
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
    document.body.style.cursor = '';
    document.body.classList.remove('no-select');
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, []);

  const handleCardClick = () => {
    if (!isResizing && typeof onClick === 'function') {
      playClickSound();
      onClick(title, url);
    }
  };

  return (
    <div
      className={`bg-blue-900/20 hover:bg-blue-900/30 backdrop-blur-sm rounded-lg p-4 relative transition-all border border-blue-700/30 shadow-md group`}
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        cursor: isResizing ? 'nwse-resize' : 'pointer'
      }}
      onClick={handleCardClick}
      onMouseEnter={playHoverSound}
    >
      <div className="flex justify-between items-start mb-2">
        <Icon className="text-blue-400 w-8 h-8 group-hover:scale-110 transition-transform" />
        <div className="text-xs text-gray-400">{cardId}</div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-gray-300">{description}</p>
        )}
      </div>

      {/* Esquina para redimensionar */}
      <div
        className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize flex items-center justify-center"
        onMouseDown={handleResizeStart}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M0 7L7 0M0 4L4 0M4 7L7 4" stroke="currentColor" strokeWidth="1" className="text-blue-400 opacity-70" />
        </svg>
      </div>
    </div>
  );
}
