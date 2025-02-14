import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';

// Lazy load pages
const CandidateLogin = lazy(() => import('@/pages/auth/CandidateLogin'));
const RecruiterLogin = lazy(() => import('@/pages/auth/RecruiterLogin'));
const AdminLogin = lazy(() => import('@/pages/auth/AdminLogin'));
const GuestHome = lazy(() => import('@/pages/guest/Home'));
const JobDetails = lazy(() => import('@/pages/guest/JobDetails'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <GuestHome /> },
      { path: 'jobs/:id', element: <JobDetails /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'candidate', element: <CandidateLogin /> },
      { path: 'recruiter', element: <RecruiterLogin /> },
      { path: 'admin', element: <AdminLogin /> },
    ],
  },
]);
