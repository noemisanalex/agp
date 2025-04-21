import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import { SoundProvider } from "./context/SoundContext";
import { VisitaProvider } from "./context/VisitaContext";
import "./styles/resize-styles.css";

// Lazy load de vistas
const Landing = lazy(() => import("./components/Landing"));
const DashboardLayout = lazy(() => import("./app/DashboardLayout"));

export default function App() {
  return (
    <SoundProvider>
      <VisitaProvider>
        <div className="min-h-screen bg-gradient-to-r from-blue-200 to-blue-900 text-white font-sans">
          <Suspense fallback={<div className="p-10 text-white text-xl">⚙️ Cargando interfaz...</div>}>
            <Routes>
              {/* Landing pública */}
              <Route path="/" element={<Landing />} />

              {/* Panel privado */}
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Suspense>
        </div>
      </VisitaProvider>
    </SoundProvider>
  );
}

