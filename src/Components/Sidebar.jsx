import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SidebarLink from './SidebarLinks';
import { handleLogoutLogic } from '../Hooks/logout.js';

import plus from '../assets/icons/plus.svg';
import minus from '../assets/icons/minus.svg';

const Sidebar = ({ 
  isSidebarOpen, 
  handleSidebarToggle, 
  handleCloseSidebar, 
  isNavigationDisabled = false 
}) => {
  // Navigation hook
  const navigate = useNavigate();

  // State to manage dropdown visibility
  const [isCourseOutlineOpen, setIsCourseOutlineOpen] = useState(false);
  const [isPastQuestionsOpen, setIsPastQuestionsOpen] = useState(false);

  const handleDropdownToggle = (dropdownType) => {
    if (isNavigationDisabled) {
      alert('Navigation is disabled during the exam. Please complete or submit your exam first.');
      return;
    }
    
    if (dropdownType === 'courseOutline') {
      setIsCourseOutlineOpen(!isCourseOutlineOpen);
    } else if (dropdownType === 'pastQuestions') {
      setIsPastQuestionsOpen(!isPastQuestionsOpen);
    }
  };

  const handleSidebarLinkClick = (originalOnClick) => {
    if (isNavigationDisabled) {
      alert('Navigation is disabled during the exam. Please complete or submit your exam first.');
      return;
    }
    if (originalOnClick) {
      originalOnClick();
    }
  };

  return (
    <>
      <Header 
        handleSidebarToggle={handleSidebarToggle} 
        isSidebarOpen={isSidebarOpen} 
        isNavigationDisabled={isNavigationDisabled}
        showExamWarning={isNavigationDisabled}
      />

      {/* Sidebar */}
      <div id="containerSidebar" className="z-30">
        <div className="navbar-menu relative z-30">
          <nav
            id="sidebar"
            className={`fixed left-0 top-[var(--header-height,64px)] h-[calc(100vh-var(--header-height,64px))] w-64 -translate-x-full flex flex-col overflow-y-auto bg-[#222831] border-r border-gray-500 pt-6 pb-8 transition-all duration-300 cubic-bezier(0, 0.77, 0.58, 1) ${
              isSidebarOpen ? 'translate-x-0' : ''
            }`}
          >
            {/* Exam Warning in Sidebar */}
            {isNavigationDisabled && (
              <div className="px-4 mb-4 mx-2 py-3 bg-red-900 bg-opacity-50 border border-red-500 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-xs text-red-300">
                    Navigation disabled during exam
                  </p>
                </div>
              </div>
            )}

            {/* Links Section */}
            <div className="px-2 pb-6 border-b border-[#213448] flex-1">
              <ul className="mb-8 text-white text-sm font-medium space-y-4">
                <li>
                  <SidebarLink 
                    to="/dashboard" 
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    className={`block py-1 transition-colors ${
                      isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                    }`}
                    disabled={isNavigationDisabled}
                  >
                    Dashboard
                  </SidebarLink>
                </li>
                <li>
                  <button
                    onClick={() => handleDropdownToggle('courseOutline')}
                    className={`font-bold py-2 px-4 w-full text-left transition-colors focus:outline-none flex items-center justify-between ${
                      isNavigationDisabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-white'
                    }`}
                    disabled={isNavigationDisabled}
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
                        <SidebarLink 
                          to="/dashboard/course-outline/100" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          100 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/course-outline/200" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          200 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/course-outline/300" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          300 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/course-outline/400" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          400 Level
                        </SidebarLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => handleDropdownToggle('pastQuestions')}
                    className={`font-bold py-2 px-4 w-full text-left transition-colors focus:outline-none flex items-center justify-between ${
                      isNavigationDisabled 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-white'
                    }`}
                    disabled={isNavigationDisabled}
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
                        <SidebarLink 
                          to="/dashboard/past-question/100" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          100 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/past-question/200" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          200 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/past-question/300" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          300 Level
                        </SidebarLink>
                      </li>
                      <li>
                        <SidebarLink 
                          to="/dashboard/past-question/400" 
                          onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                          className={`block py-1 transition-colors text-sm ${
                            isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                          }`}
                          disabled={isNavigationDisabled}
                        >
                          400 Level
                        </SidebarLink>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <SidebarLink 
                    to="/dashboard/exam-mode" 
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    className={`block py-1 transition-colors ${
                      isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                    }`}
                    disabled={isNavigationDisabled}
                  >
                    Exam Mode
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink 
                    to="/dashboard/cgpa-calculator" 
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    className={`block py-1 transition-colors ${
                      isNavigationDisabled ? 'text-gray-400 cursor-not-allowed' : ''
                    }`}
                    disabled={isNavigationDisabled}
                  >
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
                <span className={`text-sm ${
                  isNavigationDisabled ? 'text-gray-400' : 'text-white'
                }`}>
                  John Doe
                </span>
              </div>
              <button
                type="button"
                onClick={()=> handleLogoutLogic(navigate)}
                className={`w-full px-3 py-3 rounded-md transition duration-300 text-sm ${
                  isNavigationDisabled 
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                    : 'bg-red-500 text-white hover:bg-red-700'
                }`}
                aria-label="Logout"
                disabled={isNavigationDisabled}
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