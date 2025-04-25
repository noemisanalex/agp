import React, { createContext, useContext, useState } from 'react';
// Corregido: importamos VisitaModal en lugar de SimpleVisitaForm
import VisitaModal from '../components/VisitaModal';

// Crear el contexto
const VisitaContext = createContext();

// Hook personalizado para usar el contexto
export const useVisita = () => {
  const context = useContext(VisitaContext);
  if (!context) {
    throw new Error('useVisita debe ser usado dentro de un VisitaProvider');
  }
  return context;
};

// Proveedor del contexto
export const VisitaProvider = ({ children }) => {
  const [isVisitaOpen, setIsVisitaOpen] = useState(false);

  // Función para abrir el formulario de visita
  const openVisita = () => {
    try {
      setIsVisitaOpen(true);
    } catch (error) {
      console.error("Error al abrir formulario de visita:", error);
      alert("Error al abrir el formulario. Por favor, intente más tarde.");
    }
  };

  // Función para cerrar el formulario de visita
  const closeVisita = () => {
    try {
      setIsVisitaOpen(false);
    } catch (error) {
      console.error("Error al cerrar formulario de visita:", error);
      // Forzar cierre aunque haya error
      setIsVisitaOpen(false);
    }
  };

  return (
    <VisitaContext.Provider value={{ isVisitaOpen, openVisita, closeVisita }}>
      {children}
      {isVisitaOpen && <VisitaModal visible={isVisitaOpen} onClose={closeVisita} />}
    </VisitaContext.Provider>
  );
};

export default VisitaContext;