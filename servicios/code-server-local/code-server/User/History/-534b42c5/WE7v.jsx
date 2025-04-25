import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import DashboardLayout from './pages/DashboardLayout';
import { VisitaProvider } from './context/VisitaContext';

function App() {
  return (
    <Router>
      <VisitaProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard/*" element={<DashboardLayout />} />
        </Routes>
      </VisitaProvider>
    </Router>
  );
}

export default App;