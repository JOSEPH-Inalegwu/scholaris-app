import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './src/Components/Sidebar';
import { useNavigation } from './src/Context/NavigationContext';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const { isNavigationDisabled } = useNavigation();

  // Check screen size and manage sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 1024; // lg breakpoint
      setIsLargeScreen(isLarge);
      
      // Always open sidebar on large screens, unless navigation is disabled
      if (isLarge && !isNavigationDisabled) {
        setIsSidebarOpen(true);
      } else if (!isLarge) {
        setIsSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [isNavigationDisabled]);

  // Handle sidebar toggle - only allow on small screens or when navigation is disabled
  const handleSidebarToggle = () => {
    if (isLargeScreen && !isNavigationDisabled) {
      return; // Don't allow toggle on large screens unless navigation is disabled
    }
    setIsSidebarOpen(prev => !prev);
  };

  // Handle close sidebar - only allow on small screens
  const handleCloseSidebar = () => {
    if (isLargeScreen && !isNavigationDisabled) {
      return; // Don't allow close on large screens unless navigation is disabled
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        handleSidebarToggle={handleSidebarToggle}
        handleCloseSidebar={handleCloseSidebar}
        isNavigationDisabled={isNavigationDisabled}
        isLargeScreen={isLargeScreen}
      />

      {/* Main content with dynamic margin based on sidebar state and screen size */}
      <main 
        className={`flex-1 p-4 overflow-y-auto bg-gray-100 transition-all duration-300 ${
          isSidebarOpen && isLargeScreen 
            ? 'ml-64' // Push content right by sidebar width (256px = w-64)
            : 'ml-0'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;