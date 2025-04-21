import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Componente que protege rutas privadas comprobando si hay token válido.
 * Si no existe token, redirige a la ruta principal "/" (landing).
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Se redirige al inicio y se guarda la ubicación actual para posible redirección posterior
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}
