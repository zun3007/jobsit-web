import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import { Roles } from '@/types';

interface ProtectedRouteProps {
  roles?: Roles[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to='/auth/candidate' replace />;
  }

  if (roles && (!user?.role || !roles.includes(user.role as Roles))) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
}
