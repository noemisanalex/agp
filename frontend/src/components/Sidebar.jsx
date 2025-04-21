// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import {
  Database,
  Globe,
  Shield,
  Settings,
  Cpu,
  Server,
  TerminalSquare,
  Package2,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const dashboardServices = {
  Infraestructura: [
    {
      key: 'portainer',
      name: 'Portainer',
      urlSeguro: 'https://portainer.autogestionpro.com',
      urlLocal: 'http://localhost:9000',
      icon: <Server size={18} />,
    },
    {
      key: 'firebase-emulator',
      name: 'Firebase Emulator',
      urlSeguro: 'https://firebase.autogestionpro.com',
      urlLocal: 'http://localhost:4000',
      icon: <Database size={18} />,
    },
  ],
  Automatización: [
    {
      key: 'n8n',
      name: 'n8n',
      urlSeguro: 'https://n8n.autogestionpro.com',
      urlLocal: 'http://localhost:5678',
      icon: <Globe size={18} />,
    },
  ],
  Seguridad: [
    {
      key: 'vaultwarden',
      name: 'Vaultwarden',
      urlSeguro: 'https://vaultwarden.autogestionpro.com',
      urlLocal: 'http://localhost:8080',
      icon: <Shield size={18} />,
    },
  ],
  'IA y Backend': [
    {
      key: 'ia-service',
      name: 'IA Service',
      urlSeguro: 'https://ia.autogestionpro.com',
      urlLocal: 'http://localhost:5005',
      icon: <Cpu size={18} />,
    },
    {
      key: 'code-server',
      name: 'Code Server',
      urlSeguro: 'https://code.autogestionpro.com',
      urlLocal: 'http://localhost:8443',
      icon: <TerminalSquare size={18} />,
    },
  ],
  'Bases de Datos': [
    {
      key: 'postgres',
      name: 'PostgreSQL',
      urlSeguro: 'https://postgres.autogestionpro.com',
      urlLocal: 'http://localhost:5432',
      icon: <Database size={18} />,
    },
    {
      key: 'mysql',
      name: 'MySQL',
      urlSeguro: 'https://mysql.autogestionpro.com',
      urlLocal: 'http://localhost:3306',
      icon: <Database size={18} />,
    },
    {
      key: 'mosquitto',
      name: 'Mosquitto',
      urlSeguro: 'https://mqtt.autogestionpro.com',
      urlLocal: 'http://localhost:1883',
      icon: <Package2 size={18} />,
    },
  ],
};

const Sidebar = ({ onCollapsedChange, width }) => {
  const [collapsed, setCollapsed] = useState(width <= 70);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    onCollapsedChange(collapsed);
  }, [collapsed, onCollapsedChange]);

  const handleNav = (service) => {
    const testUrl = async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        return res.ok;
      } catch {
        return false;
      }
    };

    (async () => {
      const online = await testUrl(service.urlSeguro);
      const finalUrl = online ? service.urlSeguro : service.urlLocal;
      navigate(`/dashboard/home?iframe=${encodeURIComponent(finalUrl)}`);
    })();
  };

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className={`fixed top-0 left-0 h-screen ${collapsed ? 'w-16' : `w-[${width}px]`} bg-gray-900 text-white p-4 flex flex-col z-50 transition-all duration-300 ease-in-out shadow-lg`} style={{ width: collapsed ? '70px' : `${width}px` }}>
      <div className="sidebar-toggle-button animate-float hover:scale-105 absolute top-4 right-4 z-10" onClick={toggleSidebar} title={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
        <img src="/imagenes/rueda.gif" alt="Toggle Sidebar" className="w-8 h-8" />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-20">
        {Object.entries(dashboardServices).map(([categoria, items]) => (
          <div key={categoria} className="mt-4 first:mt-0">
            {!collapsed && (
              <h3 className="text-xs uppercase font-bold text-gray-400 px-4 mt-4 mb-1">
                {categoria}
              </h3>
            )}
            {items.map((item) => (
              <div
                key={item.key}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 hover:text-cyan-400 relative ${
                  location.search.includes(item.key) ? 'bg-blue-600 text-white font-semibold' : ''
                }`}
                onClick={() => handleNav(item)}
              >
                {item.icon}
                {!collapsed && <span>{item.name}</span>}
                {collapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap text-sm bg-black px-2 py-1 rounded shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    {item.name}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        <div className="mt-4">
          <div
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-800 hover:text-cyan-400 relative ${
              location.pathname.includes('/configuracion') ? 'bg-blue-600 text-white font-semibold' : ''
            }`}
            onClick={() => navigate('/dashboard/configuracion')}
          >
            <Settings size={18} />
            {!collapsed && <span>Configuración</span>}
            {collapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 whitespace-nowrap text-sm bg-black px-2 py-1 rounded shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Configuración
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;