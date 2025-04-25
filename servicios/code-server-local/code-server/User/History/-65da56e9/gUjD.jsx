import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import DashboardLayout from './app/DashboardLayout';

import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          <Routes>
            {/* Landing pública */}
            <Route path="/" element={<Landing />} />

            {/* Rutas privadas dentro del dashboard */}
            <Route path="/dashboard/*" element={<DashboardLayout />} />
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;

