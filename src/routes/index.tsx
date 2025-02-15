import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Roles } from '@/types';
import VerifyOTP from '@/pages/auth/VerifyOTP';

// Lazy load pages
const CandidateLogin = lazy(() => import('@/pages/auth/CandidateLogin'));
const CandidateRegister = lazy(() => import('@/pages/auth/CandidateRegister'));
const RecruiterLogin = lazy(() => import('@/pages/auth/RecruiterLogin'));
const AdminLogin = lazy(() => import('@/pages/auth/AdminLogin'));
const GuestHome = lazy(() => import('@/pages/guest/Home'));
const JobDetails = lazy(() => import('@/pages/guest/JobDetails'));
const NotFound = lazy(() => import('@/pages/guest/NotFound'));
const CandidateDashboard = lazy(() => import('@/pages/candidate/Dashboard'));
const SavedJobs = lazy(() => import('@/pages/candidate/SavedJobs'));
const UpdateProfile = lazy(() => import('@/pages/candidate/UpdateProfile'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <GuestHome /> },
      { path: 'jobs/:id', element: <JobDetails /> },
      {
        path: 'candidate',
        element: <ProtectedRoute roles={[Roles.CANDIDATE]} />,
        children: [
          { path: 'dashboard', element: <CandidateDashboard /> },
          { path: 'applications', element: <CandidateDashboard /> },
          { path: 'saved-jobs', element: <SavedJobs /> },
          { path: 'profile', element: <CandidateDashboard /> },
          { path: 'update-profile', element: <UpdateProfile /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'candidate', element: <CandidateLogin /> },
      { path: 'candidate/register', element: <CandidateRegister /> },
      { path: 'verify', element: <VerifyOTP /> },
      { path: 'recruiter', element: <RecruiterLogin /> },
      { path: 'admin', element: <AdminLogin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
