import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import { Roles } from '@/types';

export default function GuestOrCandidateRoute() {
  const { user } = useAppSelector((state) => state.auth);

  // Allow if user is not authenticated (guest)
  if (!user) {
    return <Outlet />;
  }

  // Allow if user is a candidate
  if (user.role === Roles.CANDIDATE) {
    return <Outlet />;
  }

  // Redirect other authenticated users to their dashboards
  switch (user.role) {
    case Roles.HR:
      return <Navigate to='/hr/dashboard' replace />;
    case Roles.PARTNER:
      return <Navigate to='/partner/dashboard' replace />;
    case Roles.ADMIN:
      return <Navigate to='/admin/dashboard' replace />;
    default:
      return <Navigate to='/404' replace />;
  }
}
