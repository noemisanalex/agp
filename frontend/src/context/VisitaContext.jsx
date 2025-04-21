import React, { createContext, useContext, useState } from 'react';
import SimpleVisitaForm from '../components/SimpleVisitaForm';

// Crear el contexto
const VisitaContext = createContext();

// Hook personalizado para usar el contexto
export const useVisita = () => useContext(VisitaContext);

// Proveedor del contexto
export const VisitaProvider = ({ children }) => {
  const [isVisitaOpen, setIsVisitaOpen] = useState(false);

  const openVisita = () => setIsVisitaOpen(true);
  const closeVisita = () => setIsVisitaOpen(false);

  return (
    <VisitaContext.Provider value={{ openVisita, closeVisita }}>
      {children}
      {isVisitaOpen && <SimpleVisitaForm onClose={closeVisita} />}
    </VisitaContext.Provider>
  );
};

export default VisitaContext;