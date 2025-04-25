// Importaciones existentes
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Añadir esta línea para importar los estilos de arreglo de scroll
import './styles/scroll-fix.css';  
import App from './App';
// Resto del archivo se mantiene igual..
import { SoundProvider } from './context/SoundContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SoundProvider>
    <App />
  </SoundProvider>
);

.