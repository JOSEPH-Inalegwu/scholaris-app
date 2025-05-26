import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Layout from '../Layout'
import AuthPage from './Features/Auth/Pages/AuthPage'
import Dashboard from './Features/Dashboard/components/Dashboard'
import Signup from './Features/Auth/Pages/Signup'
import QuizCBT from './Features/QuizCBT/QuizCBT'
import GPACalculator from './Features/GPA/GPACalculator'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  { path: 'signup', element: <Signup /> },

  {
    path: '/dashboard',
    element: <Layout />,
    children: [
      { index: true, element: <Dashboard /> },
      {  path: 'exam-mode', element: <QuizCBT /> },
      {  path: 'cgpa-calculator', element: <GPACalculator /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
