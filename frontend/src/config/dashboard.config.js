import React from 'react';
import { Database, Globe, Shield } from 'lucide-react';

export const dashboardServices = [
  {
    key: 'firebase-emulator',
    name: 'Firebase Emulator',
    urlSeguro: 'https://firebase.autogestionpro.com',
    urlLocal: 'http://localhost:4000',
    icon: <Database size={18} />,
  },
  {
    key: 'n8n',
    name: 'n8n',
    urlSeguro: 'https://n8n.autogestionpro.com',
    urlLocal: 'http://localhost:5678',
    icon: <Globe size={18} />,
  },
  {
    key: 'vaultwarden',
    name: 'Vaultwarden',
    urlSeguro: 'https://vaultwarden.autogestionpro.com',
    urlLocal: 'http://localhost:8080',
    icon: <Shield size={18} />,
  },
];
