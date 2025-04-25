import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import DashboardLayout from './app/DashboardLayout';
import Home from './app/Home'; // Asegúrate de tener este componente

import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route path="home" element={<Home />} />
            </Route>
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
