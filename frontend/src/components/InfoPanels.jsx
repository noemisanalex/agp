// src/components/InfoPanels.jsx
import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  Server,
  Settings,
  BarChart4,
} from 'lucide-react';
import StatusCard from './dashboard/StatusCard';

const InfoPanels = () => {
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  const services = [
    { key: 'vaultwarden', title: 'Vaultwarden', icon: ShieldCheck, color: 'text-green-400' },
    { key: 'n8n', title: 'n8n', icon: Cpu, color: 'text-blue-400' },
    { key: 'portainer', title: 'Portainer', icon: Server, color: 'text-purple-400' },
    { key: 'homeassistant', title: 'Home Assistant', icon: Settings, color: 'text-orange-400' },
    { key: 'influxdb', title: 'InfluxDB', icon: BarChart4, color: 'text-cyan-400' },
  ];

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/system-status');
        const json = await res.json();
        setStatuses(json.services || {});
      } catch (err) {
        console.error('Error obteniendo estado del sistema:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-gray-800/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      {services.map((svc) => (
        <StatusCard
          key={svc.key}
          title={svc.title}
          status={statuses[svc.key] || 'unknown'}
          icon={svc.icon}
          color={svc.color}
        />
      ))}
    </div>
  );
};

export default InfoPanels;
