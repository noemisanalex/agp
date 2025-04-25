import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import DashboardLayout from './pages/DashboardLayout'; // Tu layout de dashboard
import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';
import SoundModal from './components/SoundModal'; // Componente global de sonido

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          {/* SoundModal disponible en toda la aplicación */}
          <SoundModal />
          
          <Routes>
            {/* Ruta principal sin layout específico */}
            <Route path="/" element={<Landing />} />
            
            {/* Rutas de dashboard con su propio layout */}
            <Route path="/dashboard/*" element={<DashboardLayout />} />
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;