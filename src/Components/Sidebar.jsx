import React from 'react';
import Header from './Header';
import SidebarLink from './SidebarLinks';

const Sidebar = ({ isSidebarOpen, handleSidebarToggle, handleCloseSidebar }) => {
  return (
    <>
      <Header handleSidebarToggle={handleSidebarToggle} isSidebarOpen={isSidebarOpen} />

      {/* Sidebar */}
      <div id="containerSidebar" className="z-30">
        <div className="navbar-menu relative z-30">
          <nav
            id="sidebar"
            className={`fixed left-0 top-[var(--header-height,64px)] h-[calc(100vh-var(--header-height,64px))] w-64 -translate-x-full flex flex-col overflow-y-auto bg-[#222831] pt-6 pb-8 transition-all duration-300 cubic-bezier(0, 0.77, 0.58, 1) ${
              isSidebarOpen ? 'translate-x-0' : ''
            }`}
          >
            <div className="px-4 pb-6 border-b border-[#213448]">
              <h3 className="mb-4 text-xs font-medium uppercase text-[#213448] tracking-wide">
                LINKS
              </h3>
              <ul className="mb-8 text-sm font-medium space-y-4">
                <li>
                  <SidebarLink to="/dashboard" onClick={handleCloseSidebar} className="text-[#222831] hover:text-[#213448] block py-1 transition-colors">
                    Dashboard
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink to="/dashboard/course-outline" onClick={handleCloseSidebar} className="text-[#222831] hover:text-[#213448] block py-1 transition-colors">
                    Course Outlines
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink to="/dashboard/past-question" onClick={handleCloseSidebar} className="text-[#222831] hover:text-[#213448] block py-1 transition-colors">
                    Past Questions
                  </SidebarLink>
                </li>
                <li>
                  <SidebarLink to="/dashboard/exam-mode" onClick={handleCloseSidebar} className="text-[#222831] hover:text-[#213448] block py-1 transition-colors">
                    Exam Mode
                  </SidebarLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;