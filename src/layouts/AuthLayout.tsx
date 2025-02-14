import { Suspense } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Navbar from '@/components/navigation/Navbar';

export default function AuthLayout() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  return (
    <>
      <Navbar color='yellow' />
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl space-x-8 w-full flex justify-center'>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
}
