import React, { useState } from 'react';
import Header from './Header';
import SidebarLink from './SidebarLinks';

import plus from '../assets/icons/plus.svg';
import minus from '../assets/icons/minus.svg';


const Sidebar = ({ isSidebarOpen, handleSidebarToggle, handleCloseSidebar }) => {
  const handleLogout = () => {
    // Placeholder for logout logic (e.g., clear auth token, redirect to login)
    console.log('User logged out');
    // Example: window.location.href = '/login';
  };

  // State to manage dropdown visibility
  const [isCourseOutlineOpen, setIsCourseOutlineOpen] = useState(false);
  const [isPastQuestionsOpen, setIsPastQuestionsOpen] = useState(false);

  return (
    <>
      <Header handleSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />

      {/* Sidebar */}
      <div id="containerSidebar" className="z-30">
        <div className="navbar-menu relative z-30">
          <nav
            id="sidebar"
            className={`fixed left-0 top-[var(--header-height,64px)] h-[calc(100vh-var(--header-height,64px))] w-64 -translate-x-full flex flex-col overflow-y-auto bg-[#222831] border-r border-gray-500 pt-6 pb-8 transition-all duration-300 cubic-bezier(0, 0.77, 0.58, 1) ${
              isSidebarOpen ? 'translate-x-0' : ''
            }`}
          >
            {/* Links Section */}
            <div className="px-2 pb-6 border-b border-[#213448] flex-1">
              <ul className="mb-8 text-white text-sm font-medium space-y-4">
                <li>
                  <SidebarLink to="/dashboard" onClick={handleCloseSidebar} className="block py-1 transition-colors">
                    Dashboard
                  </SidebarLink>
                </li>
                <li>
                  <button
                    onClick={() => setIsCourseOutlineOpen(!isCourseOutlineOpen)}
                    className="text-white font-bold py-2 px-4 w-full text-left transition-colors focus:outline-none flex items-center justify-between"
                  >
                    <span>Course Outlines</span>
                    {isCourseOutlineOpen ? (
                      <img src={minus} alt="right-arrow" className='w-5' />
                    ) : (
                      <img src={plus} alt='down-arrow' className='w-5' />
                    )}
                  </button>
                  {isCourseOutlineOpen && (
                    <ul className="pl-4 space-y-2 mt-2 animate-fade-in text-gray-500">
                      <li>
                        <SidebarLink to="/dashboard/course-outline/100" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          100 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/course-outline/200" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          200 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/course-outline/300" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          300 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/course-outline/400" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          400 Level
                        </SidebarLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setIsPastQuestionsOpen(!isPastQuestionsOpen)}
                    className="text-white font-bold py-2 px-4 w-full text-left transition-colors focus:outline-none flex items-center justify-between"
                  >
                    <span>Past Questions</span>
                    {isPastQuestionsOpen ? (
                      <img src={minus} alt='down-arrow' className='w-5' />
                    ) : (
                      <img src={plus} alt='down-arrow' className='w-5' />
                    )}
                  </button>
                  {isPastQuestionsOpen && (
                    <ul className="pl-4 space-y-2 mt-2 animate-fade-in text-gray-500">
                      <li>
                        <SidebarLink to="/dashboard/past-question/100" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          100 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/past-question/200" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          200 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/past-question/300" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          300 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink to="/dashboard/past-question/400" onClick={handleCloseSidebar} className="block py-1 transition-colors text-sm">
                          400 Level
                        </SidebarLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <SidebarLink to="/dashboard/exam-mode" onClick={handleCloseSidebar} className="block py-1 transition-colors">
                    Exam Mode
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink to="/dashboard/cgpa-calculator" onClick={handleCloseSidebar} className="block py-1 transition-colors">
                    CGPA Calculator
                  </SidebarLink>
                </li>
              </ul>
            </div>

            {/* Profile and Logout Section */}
            <div className="px-4 pt-4 border-t border-gray-500">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <span className="text-white text-sm">John Doe</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-red-500 text-white hover:bg-red-700 px-3 py-3 rounded-md transition duration-300 text-sm"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;