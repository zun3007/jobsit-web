import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// import Navbar from '@/components/navigation/Navbar';
// import Footer from '@/components/navigation/Footer';
// import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function MainLayout() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow container mx-auto px-4 py-8'>
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
