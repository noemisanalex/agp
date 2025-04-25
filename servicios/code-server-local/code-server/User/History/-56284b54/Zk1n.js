import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@fortawesome/fontawesome-free/css/all.css';
import './styles/resize-styles.css';
import { SoundProvider } from './context/SoundContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SoundProvider>
    <App />
  </SoundProvider>
);

// Importaciones existentes
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// Añadir esta línea para importar los estilos de arreglo de scroll
import './styles/scroll-fix.css';  
import App from './App';
// Resto del archivo se mantiene igual...