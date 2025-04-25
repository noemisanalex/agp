import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
// Corregido: importamos desde la ruta correcta o comentamos si no existe
// import DashboardLayout from './pages/DashboardLayout';
import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            {/* Comentado hasta que se solucione la ruta */}
            {/* <Route path="/dashboard/*" element={<DashboardLayout />} /> */}
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;