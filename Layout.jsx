import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './src/Components/Header';
import Sidebar from './src/Components/Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSidebarToggle = () => setIsSidebarOpen(prev => !prev);
  const handleCloseSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex flex-col">
      <Header handleSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          handleSidebarToggle={handleSidebarToggle}
          handleCloseSidebar={handleCloseSidebar}
        />

        <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
