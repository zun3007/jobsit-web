import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Roles } from '@/types';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

// Candidate pages
const CandidateProfile = lazy(() => import('@/pages/candidate/Profile'));
const CandidateApplications = lazy(
  () => import('@/pages/candidate/Applications')
);
const CandidateSavedJobs = lazy(() => import('@/pages/candidate/SavedJobs'));

// HR pages
const HRDashboard = lazy(() => import('@/pages/hr/Dashboard'));
const HRJobPostings = lazy(() => import('@/pages/hr/JobPostings'));
const HRApplications = lazy(() => import('@/pages/hr/Applications'));

// University pages
const UniversityDashboard = lazy(() => import('@/pages/university/Dashboard'));
const UniversityDemands = lazy(() => import('@/pages/university/Demands'));

// Job pages
const JobSearch = lazy(() => import('@/pages/jobs/Search'));
const JobDetails = lazy(() => import('@/pages/jobs/Details'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'jobs', element: <JobSearch /> },
      { path: 'jobs/:id', element: <JobDetails /> },

      // Protected Candidate Routes
      {
        path: 'candidate',
        element: <ProtectedRoute roles={[Roles.CANDIDATE]} />,
        children: [
          { path: 'profile', element: <CandidateProfile /> },
          { path: 'applications', element: <CandidateApplications /> },
          { path: 'saved-jobs', element: <CandidateSavedJobs /> },
        ],
      },

      // Protected HR Routes
      {
        path: 'hr',
        element: <ProtectedRoute roles={[Roles.HR]} />,
        children: [
          { path: 'dashboard', element: <HRDashboard /> },
          { path: 'jobs', element: <HRJobPostings /> },
          { path: 'applications', element: <HRApplications /> },
        ],
      },

      // Protected University Routes
      {
        path: 'university',
        element: <ProtectedRoute roles={[Roles.PARTNER]} />,
        children: [
          { path: 'dashboard', element: <UniversityDashboard /> },
          { path: 'demands', element: <UniversityDemands /> },
        ],
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
    ],
  },
]);
