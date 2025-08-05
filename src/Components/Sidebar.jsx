import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SidebarLink from './SidebarLinks';
import { handleLogoutLogic } from '../Hooks/logout.js';
import { supabase } from '../supabaseClient';

import plus from '../../public/icons/plus.svg';
import minus from '../../public/icons/minus.svg';

const Sidebar = ({
  isSidebarOpen,
  handleSidebarToggle,
  handleCloseSidebar,
  isNavigationDisabled = false,
  isLargeScreen = false,
}) => {
  const navigate = useNavigate();

  const [isCourseOutlineOpen, setIsCourseOutlineOpen] = useState(false);
  const [isPastQuestionsOpen, setIsPastQuestionsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error('Auth error:', authError?.message || 'User not found');
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Profile fetch error:', profileError.message);
        setLoading(false);
        return;
      }

      if (profile?.username) {
        setUsername(profile.username);
      } else {
        const metadata = user.user_metadata;
        if (metadata?.username) {
          setUsername(metadata.username);
        } else {
          setUsername('');
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, []);

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return 'U';
    return name.slice(0, 2).toUpperCase();
  };
  
  const handleDropdownToggle = (type) => {
    if (isNavigationDisabled) {
      alert('Navigation is disabled during the exam.');
      return;
    }

    if (type === 'courseOutline') {
      setIsCourseOutlineOpen(!isCourseOutlineOpen);
    } else if (type === 'pastQuestions') {
      setIsPastQuestionsOpen(!isPastQuestionsOpen);
    }
  };

  const handleSidebarLinkClick = (originalOnClick) => {
    if (isNavigationDisabled) {
      alert('Navigation is disabled during the exam.');
      return;
    }
    if (originalOnClick) originalOnClick();
  };

  return (
    <>
      {/* Only render Header if not on large screen (since Layout handles it) */}
      {!isLargeScreen && (
        <Header
          handleSidebarToggle={handleSidebarToggle}
          isSidebarOpen={isSidebarOpen}
          isNavigationDisabled={isNavigationDisabled}
          showExamWarning={isNavigationDisabled}
        />
      )}

      <div id="containerSidebar" className="z-30">
        <div className="navbar-menu relative z-30">
          <nav
            id="sidebar"
            className={`fixed left-0 top-0 h-screen w-64 flex flex-col overflow-y-auto bg-[#222831] border-r border-gray-500 transition-all duration-300 ${
              isSidebarOpen 
                ? 'translate-x-0' 
                : isLargeScreen 
                  ? 'translate-x-0' // Always visible on large screens
                  : '-translate-x-full'
            } ${
              isLargeScreen && isSidebarOpen ? 'shadow-none' : 'shadow-lg'
            }`}
          >
            {/* Logo and Toggle Section */}
            <div className="flex items-center justify-between p-4 border-b border-[#213448]">
              <div className="flex items-center space-x-3">
                <div className="text-white font-bold text-xl">
                  Scholaris
                </div>
              </div>
              
              {/* Toggle button - only show on small screens or when navigation is disabled */}
              {(!isLargeScreen || isNavigationDisabled) && (
                <button
                  onClick={handleSidebarToggle}
                  className="text-white hover:bg-gray-700 p-2 rounded-md transition-colors"
                  disabled={isNavigationDisabled}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

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

            <div className="px-2 pb-6 border-b border-[#213448] flex-1 pt-4">
              <ul className="mb-8 text-white text-sm font-medium space-y-4">
                <li>
                  <SidebarLink to="/dashboard" onClick={() => handleSidebarLinkClick(handleCloseSidebar)} disabled={isNavigationDisabled}>
                    Dashboard
                  </SidebarLink>
                </li>
                <li>
                  <button
                    onClick={() => handleDropdownToggle('courseOutline')}
                    className={`font-bold py-2 px-4 w-full text-left flex items-center justify-between ${
                      isNavigationDisabled ? 'text-gray-400' : 'text-white'
                    }`}
                  >
                    <span>Course Outlines</span>
                    <img src={isCourseOutlineOpen ? minus : plus} alt="toggle" className="w-5" />
                  </button>
                  {isCourseOutlineOpen && (
                    <ul className="pl-4 space-y-2 mt-2 text-gray-500">
                      {[100, 200, 300, 400].map((lvl) => (
                        <li key={lvl}>
                          <SidebarLink
                            to={`/dashboard/course-outline/${lvl}`}
                            onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                            disabled={isNavigationDisabled}
                          >
                            {lvl} Level
                          </SidebarLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <button
                    onClick={() => handleDropdownToggle('pastQuestions')}
                    className={`font-bold py-2 px-4 w-full text-left flex items-center justify-between ${
                      isNavigationDisabled ? 'text-gray-400' : 'text-white'
                    }`}
                  >
                    <span>Past Questions</span>
                    <img src={isPastQuestionsOpen ? minus : plus} alt="toggle" className="w-5" />
                  </button>
                  {isPastQuestionsOpen && (
                    <ul className="pl-4 space-y-2 mt-2 text-gray-500">
                      {[100, 200, 300, 400].map((lvl) => (
                        <li key={lvl}>
                          <SidebarLink
                            to={`/dashboard/past-question/${lvl}`}
                            onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                            disabled={isNavigationDisabled}
                          >
                            {lvl} Level
                          </SidebarLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>

                <li>
                  <SidebarLink
                    to="/dashboard/exam-mode"
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    disabled={isNavigationDisabled}
                  >
                    Exam Mode
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink
                    to="/dashboard/cgpa-calculator"
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    disabled={isNavigationDisabled}
                  >
                    CGPA Calculator
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink
                    to="/dashboard/scholaris-ai"
                    onClick={() => handleSidebarLinkClick(handleCloseSidebar)}
                    disabled={isNavigationDisabled}
                  >
                    Scholaris AI
                  </SidebarLink>
                </li>
              </ul>
            </div>

            {/* 👤 Profile & Logout */}
            <div className="px-4 pt-4 border-t border-gray-500">
              <div className="flex items-center space-x-3 mb-6">
                {/* 🧑 DiceBear avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ring-2 ring-white bg-amber-500"
                >
                  {getInitials(username)}
                </div>

                <span className={`text-sm font-bold ${isNavigationDisabled ? 'text-gray-400' : 'text-white'}`}>
                  {loading ? 'Loading...' : username || 'User'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleLogoutLogic(navigate)}
                className={`w-full px-3 py-3 rounded-md text-sm transition ${
                  isNavigationDisabled
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-700'
                }`}
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