import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Your existing imports
import 'katex/dist/katex.min.css';
import './index.css';

import CPolicy from './Components/CPolicy';
import PPolicy from './Components/PPolicy';

import Layout from '../Layout';
import AuthPage from './Features/Auth/Pages/AuthPage';
import Signup from './Features/Auth/Pages/Signup';
import Dashboard from './Features/Dashboard/components/Dashboard';
import QuizCBT from './Features/QuizCBT/QuizCBT';
import GPACalculator from './Features/GPA/GPACalculator';
import ScholarisAI from './Features/ScholarisAI/ScholarisAI';
import SmartStudyPlanner from './Features/SmartStudyPlanner/SmartStudyPlanner';
import NotFoundPage from './Pages/NotFoundPage';

import ProtectedLayout from './Hooks/ProtectedLayout';
import { NavigationProvider } from './Context/NavigationContext';
import { UserProvider } from './Context/UserContext'; 

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { StudyPlanProvider } from './Features/SmartStudyPlanner/StudyPlanContext';  // <-- import your provider

const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  { path: '/signup', element: <Signup /> },
  { path: '/cookie-policy', element: <CPolicy /> },
  { path: '/privacy-policy', element: <PPolicy /> },

  {
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Layout />,
        children: [
          { index: true, element: <Dashboard /> },
          { 
            path: 'smart-study-planner', 
            element: (
              <StudyPlanProvider>
                <SmartStudyPlanner />
              </StudyPlanProvider>
            ), 
          },
          { path: 'exam-mode', element: <QuizCBT /> },
          { path: 'cgpa-calculator', element: <GPACalculator /> },
          { path: 'scholaris-ai', element: <ScholarisAI /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider> 
      <NavigationProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          toastClassName="bg-black text-white font-medium rounded shadow-md"
        />
      </NavigationProvider>
    </UserProvider>
  </StrictMode>
);
