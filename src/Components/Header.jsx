import React from 'react';

const Header = ({ handleSidebarToggle, isSidebarOpen }) => {
  return (
    <nav id="navbar" className="fixed top-0 z-40 flex w-full flex-row justify-between bg-[#222831] px-4 border border-x-0 border-t-0 border-b-gray-500">
      <ul className="breadcrumb flex flex-row items-center justify-between py-4 space-x-3 text-lg text-[#222831] sm:flex">
        <li className="inline">
          <a 
            href="#" 
            className="text-white font-semibold sm:text-xl md:text-2xl hover:text-gray-400 transition duration-300"
            aria-label="Scholaris Home"
          >
            Sch🎓laris
          </a>
        </li>
      </ul>
      <button
        id="btnSidebarToggler"
        type="button"
        className="py-4 text-2xl text-white hover:text-gray-400 cursor-pointer"
        onClick={handleSidebarToggle}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
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
  );
};

export default Header;