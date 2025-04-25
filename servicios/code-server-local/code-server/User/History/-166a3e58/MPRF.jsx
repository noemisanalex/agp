import React, { createContext, useContext, useState } from 'react';
import VisitaModal from '../components/VisitaModal'; // o SimpleVisitaForm, según lo que prefieras

const VisitaContext = createContext();

export const useVisita = () => {
  const context = useContext(VisitaContext);
  if (!context) {
    throw new Error('useVisita debe ser usado dentro de un VisitaProvider');
  }
  return context;
};

export const VisitaProvider = ({ children }) => {
  const [isVisitaOpen, setIsVisitaOpen] = useState(false);

  const openVisita = () => {
    setIsVisitaOpen(true);
  };

  const closeVisita = () => {
    setIsVisitaOpen(false);
  };

  return (
    <VisitaContext.Provider value={{ isVisitaOpen, openVisita, closeVisita }}>
      {children}
      {isVisitaOpen && <VisitaModal visible={isVisitaOpen} onClose={closeVisita} />}
    </VisitaContext.Provider>
  );
};

export default VisitaContext;