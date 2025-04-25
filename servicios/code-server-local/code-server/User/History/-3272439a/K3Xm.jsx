import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ParticulasPremium from '../components/ParticulasPremium';
import DashboardHeader from '../components/DashboardHeader';

// Lazy load de páginas
const Home = lazy(() => import('./Home'));
const Settings = lazy(() => import('../pages/Settings'));
const TestFirestore = lazy(() => import('../components/TestFirestore'));

// Configuración de tamaños
const DEFAULT_SIDEBAR_WIDTH = 220;
const MIN_SIDEBAR_WIDTH = 180;
const MAX_SIDEBAR_WIDTH = 400;
const DEFAULT_HEADER_HEIGHT = 70;
const MIN_HEADER_HEIGHT = 50;
const MAX_HEADER_HEIGHT = 120;

export default function DashboardLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(
    parseInt(localStorage.getItem('sidebarWidth')) || DEFAULT_SIDEBAR_WIDTH
  );
  const [headerHeight, setHeaderHeight] = useState(
    parseInt(localStorage.getItem('headerHeight')) || DEFAULT_HEADER_HEIGHT
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const location = useLocation();
  const sidebarRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('sidebarWidth', sidebarWidth.toString());
  }, [sidebarWidth]);

  useEffect(() => {
    localStorage.setItem('headerHeight', headerHeight.toString());
  }, [headerHeight]);

  useEffect(() => {
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100vh';
    document.getElementById('root').style.height = '100vh';

    return () => {
      document.body.style.height = '';
      document.body.style.margin = '';
      document.body.style.overflow = '';
      document.documentElement.style.height = '';
      document.getElementById('root').style.height = '';
    };
  }, []);

  const startResizingSidebar = (e) => {
    e.preventDefault();
    setIsResizingSidebar(true);
    document.addEventListener('mousemove', resizeSidebar);
    document.addEventListener('mouseup', stopResizingSidebar);
    document.body.classList.add('resizing');
  };

  const resizeSidebar = (e) => {
    if (isResizingSidebar) {
      const newWidth = e.clientX;
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const stopResizingSidebar = () => {
    setIsResizingSidebar(false);
    document.removeEventListener('mousemove', resizeSidebar);
    document.removeEventListener('mouseup', stopResizingSidebar);
    document.body.classList.remove('resizing');
  };

  const handleHeaderHeightChange = (newHeight) => {
    if (newHeight >= MIN_HEADER_HEIGHT && newHeight <= MAX_HEADER_HEIGHT) {
      setHeaderHeight(newHeight);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resizeSidebar);
      document.removeEventListener('mouseup', stopResizingSidebar);
      document.body.classList.remove('resizing');
    };
  }, []);

  return (
    <div className="flex h-screen w-full font-sans text-white bg-transparent overflow-hidden relative">
      <ParticulasPremium />

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        style={{
          width: sidebarCollapsed ? '70px' : `${sidebarWidth}px`,
          position: 'relative',
          transition: isResizingSidebar ? 'none' : 'width 0.3s ease',
          height: '100vh',
        }}
      >
        <Sidebar
          onCollapsedChange={setSidebarCollapsed}
          width={sidebarCollapsed ? 70 : sidebarWidth}
        />
        {!sidebarCollapsed && (
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-500/20"
            style={{ zIndex: 30 }}
            onMouseDown={startResizingSidebar}
          />
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col h-screen">
        <DashboardHeader
          onSidebar
