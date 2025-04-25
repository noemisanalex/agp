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