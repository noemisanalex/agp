import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // o donde esté tu sidebar
import DashboardHeader from '../components/DashboardHeader';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-slate-900 text-white">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-auto">
        <DashboardHeader />

        <main className="p-4 overflow-y-auto flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
