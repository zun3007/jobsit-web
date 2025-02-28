import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import AuthLayout from '@/layouts/AuthLayout';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import GuestOrCandidateRoute from '@/components/auth/GuestOrCandidateRoute';
import { Roles } from '@/types';
import VerifyOTP from '@/pages/auth/VerifyOTP';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import Applications from '@/pages/candidate/Applications';
import ChangePassword from '@/pages/candidate/ChangePassword';

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

// HR Pages
const HRDashboard = lazy(() => import('@/pages/hr/Dashboard'));
const HRJobs = lazy(() => import('@/pages/hr/Jobs'));
const HRApplications = lazy(() => import('@/pages/hr/Applications'));
const HRProfile = lazy(() => import('@/pages/hr/Profile'));
const CreateJob = lazy(() => import('@/pages/hr/CreateJob'));
const ExpiredJobs = lazy(() => import('@/pages/hr/ExpiredJobs'));
const ExcelJobUpload = lazy(() => import('@/pages/hr/ExcelJobUpload'));
const HRJobDetails = lazy(() => import('@/pages/hr/JobDetails'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        element: <GuestOrCandidateRoute />,
        children: [
          { index: true, element: <GuestHome /> },
          { path: 'jobs/:id', element: <JobDetails /> },
        ],
      },
      {
        path: 'candidate',
        element: <ProtectedRoute roles={[Roles.CANDIDATE]} />,
        children: [
          { path: 'dashboard', element: <CandidateDashboard /> },
          { path: 'applications', element: <Applications /> },
          { path: 'saved-jobs', element: <SavedJobs /> },
          { path: 'profile', element: <CandidateDashboard /> },
          { path: 'update-profile', element: <UpdateProfile /> },
          { path: 'change-password', element: <ChangePassword /> },
        ],
      },
      {
        path: 'hr',
        element: <ProtectedRoute roles={[Roles.HR]} />,
        children: [
          { path: 'dashboard', element: <HRDashboard /> },
          {
            path: 'jobs',
            children: [
              {
                index: true,
                element: <HRJobs />,
              },
              {
                path: 'create',
                element: <CreateJob />,
              },
              {
                path: 'excel-upload',
                element: <ExcelJobUpload />,
              },
              {
                path: ':id',
                element: <HRJobDetails />,
              },
              {
                path: 'edit/:id',
                element: <CreateJob />,
              },
            ],
          },
          { path: 'jobs/expired', element: <ExpiredJobs /> },
          { path: 'applications', element: <HRApplications /> },
          { path: 'profile', element: <HRProfile /> },
          { path: 'change-password', element: <ChangePassword /> },
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
      { path: 'candidate/forgot-password', element: <ForgotPassword /> },
      { path: 'verify', element: <VerifyOTP /> },
      { path: 'recruiter', element: <RecruiterLogin /> },
      { path: 'admin', element: <AdminLogin /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
