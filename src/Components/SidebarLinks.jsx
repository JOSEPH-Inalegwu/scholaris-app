import React from 'react'
import { NavLink } from 'react-router-dom'

function SidebarLink({to, children, onClick, disabled = false }) {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault()
      alert('Navigation is disabled during the exam. Please complete or submit your exam first.')
      return
    }
    if (onClick) {
      onClick()
    }
  }

  return (
    <>
    <NavLink
      to={to}
      end
      onClick={handleClick}
      className={({ isActive }) =>`flex items-center rounded py-3 pl-4 pr-0 transition-all duration-200 ease-in-out
      ${disabled 
        ? 'cursor-not-allowed opacity-50 text-gray-400' 
        : 'hover:bg-[#29333d]/60 hover:backdrop-blur-md hover:scale-[1.02] hover:shadow-md hover:text-gray-50'
      }
      ${isActive && !disabled ? 'border-l-4 border-yellow-600 bg-[#262f38]/80 backdrop-blur-md' : ''}`
        }
    >
      <span className="select-none">{children}</span>
    </NavLink>
    </>
  )
}

export default SidebarLink