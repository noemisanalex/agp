import React, { useEffect, useState } from 'react';
import {
  HardDrive,
  Thermometer,
  Clock,
  Server,
  Activity
} from 'lucide-react';

// Componente de Panel compacto
const Panel = ({ icon: Icon, label, value, color }) => {
  // Determinar el color de fondo y clases según el valor
  const getValueClass = () => {
    if (label === "Uso de RAM") {
      const num = parseInt(value);
      if (!isNaN(num)) {
        if (num < 50) return 'text-green-400';
        if (num < 80) return 'text-yellow-400';
        return 'text-red-400';
      }
    }
    
    if (value === 'Activo') return 'text-green-400';
    if (value === 'Inactivo') return 'text-red-400';
    return 'text-white';
  };

  return (
    <div className={`bg-gray-900/70 rounded-lg p-3 flex flex-col justify-center items-center shadow-md border border-gray-800 hover:border-${color.split('-')[1]}-600/30 transition-all duration-300`}>
      <div className={`text-xs text-gray-400 flex items-center gap-1 mb-1`}>
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </div>
      <div className={`${getValueClass()} text-xl font-bold`}>
        {value}
      </div>
      
      {/* Indicador visual para RAM (más compacto) */}
      {label === "Uso de RAM" && value !== 'N/A' && (
        <div className="w-full bg-gray-700/50 h-1.5 rounded-full mt-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              parseInt(value) < 50 ? 'bg-green-500' : 
              parseInt(value) < 80 ? 'bg-yellow-500' : 
              'bg-red-500'
            }`}
            style={{ width: value !== 'N/A' ? value : '0%' }}
          ></div>
        </div>
      )}
      
      {/* Indicador visual compacto para Backend */}
      {label === "Backend" && (
        <div className="flex items-center gap-1 mt-1">
          <div className={`w-2 h-2 rounded-full ${value === 'Activo' ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-xs text-gray-400">
            {value === 'Activo' ? 'Online' : 'Offline'}
          </span>
        </div>
      )}
    </div>
  );
};

export default function InfoPanels() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/system-status");
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Error al obtener estado del sistema:", err);
        
        // Datos de fallback para desarrollo
        setData({
          ram: { used: '61%', total: '16GB', free: '6.24GB' },
          disk: { used: 'N/A', total: 'N/A', free: 'N/A' },
          temperature: 'N/A',
          uptime: '76h 0m',
          backend: 'Activo'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Renderizar skeleton loader mientras carga
  if (loading) {
    return (
      <div className="grid grid-cols-5 gap-3 animate-fade-in">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-800/60 rounded-lg h-16 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-3 animate-fade-in">
      <Panel
        icon={Activity}
        label="Uso de RAM"
        value={data?.ram?.used || 'N/A'}
        color="text-cyan-400"
      />
      <Panel
        icon={HardDrive}
        label="Uso de Disco"
        value={data?.disk?.used || 'N/A'}
        color="text-yellow-400"
      />
      <Panel
        icon={Thermometer}
        label="Temperatura"
        value={data?.temperature || 'N/A'}
        color="text-red-400"
      />
      <Panel
        icon={Clock}
        label="Uptime"
        value={data?.uptime || 'N/A'}
        color="text-green-400"
      />
      <Panel
        icon={Server}
        label="Backend"
        value={data?.backend || 'Inactivo'}
        color="text-blue-400"
      />
    </div>
  );
}