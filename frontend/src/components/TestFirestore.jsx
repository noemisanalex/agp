import React, { useState, useEffect } from 'react';

// Simulación de datos de Firestore
const mockEmpresas = [
  { id: '1', nombre: 'TechSolutions', sector: 'Tecnología', email: 'info@techsolutions.com' },
  { id: '2', nombre: 'EcoEnergy', sector: 'Energía Renovable', email: 'contact@ecoenergy.org' },
  { id: '3', nombre: 'MediCare', sector: 'Salud', email: 'support@medicare.health' },
];

export default function TestFirestore() {
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresa, setNewEmpresa] = useState({ nombre: '', sector: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga desde Firestore
    const timer = setTimeout(() => {
      setEmpresas(mockEmpresas);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmpresa((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newEmpresa.nombre || !newEmpresa.sector || !newEmpresa.email) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const nuevaEmpresa = {
      id: Date.now().toString(),
      ...newEmpresa
    };
    
    setEmpresas([...empresas, nuevaEmpresa]);
    setNewEmpresa({ nombre: '', sector: '', email: '' });
  };

  const handleDelete = (id) => {
    setEmpresas(empresas.filter(empresa => empresa.id !== id));
  };

  return (
    <section className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 mb-6 transition-all duration-300 border border-blue-900/20 hover:border-blue-700/30 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 border-b border-blue-900/30 pb-2 pl-1 flex items-center">
        <span role="img" aria-label="base de datos" className="mr-2">🔥</span>
        Empresas en Firestore
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Nombre"
          name="nombre"
          value={newEmpresa.nombre}
          onChange={handleInputChange}
          className="bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        
        <input
          type="text"
          placeholder="Sector"
          name="sector"
          value={newEmpresa.sector}
          onChange={handleInputChange}
          className="bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={newEmpresa.email}
          onChange={handleInputChange}
          className="bg-gray-700/50 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        />
        
        <button 
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
        >
          <span role="img" aria-label="añadir" className="mr-2">➕</span>
          Añadir
        </button>
      </div>

      <div className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800">
        <div className="grid grid-cols-4 bg-gray-800 text-gray-300 font-medium py-3 px-4">
          <div>Nombre</div>
          <div>Sector</div>
          <div>Email</div>
          <div className="text-right">Acciones</div>
        </div>
        
        {loading ? (
          <div className="py-20 text-center text-gray-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 border-r-2 border-gray-700 mb-4"></div>
            <p>Cargando datos...</p>
          </div>
        ) : empresas.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-xl mb-2">No hay empresas registradas</p>
            <p className="text-sm">Agrega una empresa utilizando el formulario de arriba</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {empresas.map((empresa) => (
              <div key={empresa.id} className="grid grid-cols-4 py-3 px-4 hover:bg-gray-800/40 transition-colors duration-200">
                <div className="font-medium text-white">{empresa.nombre}</div>
                <div className="text-gray-300">{empresa.sector}</div>
                <div className="text-gray-300 truncate">{empresa.email}</div>
                <div className="text-right">
                  <button 
                    onClick={() => handleDelete(empresa.id)}
                    className="bg-red-600/70 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm transition-colors duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}