import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './src/Components/Header'
import Sidebar from './src/Components/Sidebar'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout