import React from 'react'
import { NavLink } from 'react-router-dom'

function SidebarLink({to, children, onClick }) {
  return (
    <>
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>`flex items-center rounded py-3 pl-3 pr-4 text-gray-50 transition-all duration-200 ease-in-out hover:bg-[#29333d]/60 hover:backdrop-blur-md hover:scale-[1.02] hover:shadow-md 
      ${isActive ? 'border-l-4 border-yellow-600 bg-[#262f38]/80 backdrop-blur-md' : ''}`
        }
    >
      <span className="select-none">{children}</span>
    </NavLink>
    </>
  )
}

export default SidebarLink