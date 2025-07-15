import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';

import Layout from '../Layout';
import AuthPage from './Features/Auth/Pages/AuthPage';
import Signup from './Features/Auth/Pages/Signup';
import Dashboard from './Features/Dashboard/components/Dashboard';
import QuizCBT from './Features/QuizCBT/QuizCBT';
import GPACalculator from './Features/GPA/GPACalculator';

import ProtectedLayout from './Hooks/ProtectedLayout';
import { NavigationProvider } from './Context/NavigationContext';
import { UserProvider } from './Context/UserContext'; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  { path: '/signup', element: <Signup /> },

  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'exam-mode', element: <QuizCBT /> },
          { path: 'cgpa-calculator', element: <GPACalculator /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> 
      <NavigationProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          toastClassName="bg-black text-white font-medium rounded shadow-md"
        />
      </NavigationProvider>
    </UserProvider>
  </StrictMode>
);
