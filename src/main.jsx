import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Layout from '../Layout'
import AuthPage from './Features/Auth/Pages/AuthPage'
// import Dashboard from './Pages/Dashboard'
import Home from './Pages/Home'
// import Login from './Features/Auth/Pages/Login'
import Signup from './Features/Auth/Pages/Signup'


import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  { path: 'signup', element: <Signup /> },

  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
