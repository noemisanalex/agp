import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';

// Si tienes un componente DashboardLayout, importalo así:
// import DashboardLayout from './pages/DashboardLayout'; 

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            {/* Descomenta esto si tienes el componente DashboardLayout */}
            {/* <Route path="/dashboard/*" element={<DashboardLayout />} /> */}
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;