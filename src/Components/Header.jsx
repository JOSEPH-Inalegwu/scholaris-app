import React from 'react';

const Header = ({ 
  handleSidebarToggle, 
  isSidebarOpen, 
  isNavigationDisabled = false, 
  showExamWarning = false 
}) => {
  
  const handleToggleClick = () => {
    if (isNavigationDisabled) {
      // Show warning or do nothing when exam is active
      alert('Navigation is disabled during the exam. Please complete or submit your exam first.');
      return;
    }
    handleSidebarToggle();
  };

  const handleLogoClick = (e) => {
    if (isNavigationDisabled) {
      e.preventDefault();
      alert('Navigation is disabled during the exam. Please complete or submit your exam first.');
      return;
    }
    // Normal logo click logic here if needed
  };

  return (
    <>
      <nav id="navbar" className="fixed top-0 z-40 flex w-full flex-row justify-between bg-[#222831] px-4 md:px-6 border border-x-0 border-t-0 border-b-gray-500">
        <ul className="breadcrumb flex flex-row items-center justify-between py-4 space-x-3 text-lg text-[#222831] sm:flex">
          <li className="inline">
            <a 
              href="#" 
              className={`font-semibold sm:text-xl md:text-2xl transition duration-300 ${
                isNavigationDisabled 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-white hover:text-gray-400'
              }`}
              aria-label="Scholaris Home"
              onClick={handleLogoClick}
            >
              Sch🎓laris
            </a>
          </li>
        </ul>
        
        <button
          id="btnSidebarToggler"
          type="button"
          className={`py-4 text-2xl transition duration-300 ${
            isNavigationDisabled 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-white hover:text-gray-400 cursor-pointer'
          }`}
          onClick={handleToggleClick}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar"
          disabled={isNavigationDisabled}
        >
          <svg
            id="navClosed"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`h-8 w-8 ${isSidebarOpen ? 'hidden' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
          <svg
            id="navOpen"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className={`h-8 w-8 ${!isSidebarOpen ? 'hidden' : ''}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      {/* Exam Warning Banner - positioned below the fixed header */}
      {showExamWarning && (
        <div className="hidden sm:block fixed top-[60px] left-0 right-0 z-30 bg-red-50 border-l-4 border-red-400 p-3">
          <div className="flex items-center px-4 md:px-6">
            <svg 
              className="h-5 w-5 text-red-400 mr-3" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm text-red-700">
              <strong>Exam in Progress:</strong> Navigation is disabled until you complete or submit your exam.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;