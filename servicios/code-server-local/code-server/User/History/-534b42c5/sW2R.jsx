import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import Dashboard from './pages/Dashboard';
import { VisitaProvider } from './context/VisitaContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <ToastProvider>
        <VisitaProvider>
          <Routes>
            <Route path="/" element={
              <Layout>
                <Landing />
              </Layout>
            } />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </VisitaProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;