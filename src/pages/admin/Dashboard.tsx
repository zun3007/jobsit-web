import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const { profile } = useAuth();

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>
        <p className='text-gray-600'>Welcome back, {profile?.firstName}!</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Stats Cards */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Total Users</h3>
          <p className='text-3xl font-bold text-primary'>1,234</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Active Companies</h3>
          <p className='text-3xl font-bold text-secondary'>56</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Partner Universities</h3>
          <p className='text-3xl font-bold text-accent'>12</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Active Jobs</h3>
          <p className='text-3xl font-bold text-primary'>789</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <button className='btn btn-primary'>Manage Users</button>
          <button className='btn btn-secondary'>Review Companies</button>
          <button className='btn btn-outline'>View Reports</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Recent Activity</h2>
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='p-4 border-b'>
            <p className='text-sm text-gray-600'>New company registration</p>
            <p className='font-medium'>Tech Corp Ltd.</p>
          </div>
          <div className='p-4 border-b'>
            <p className='text-sm text-gray-600'>
              University partnership request
            </p>
            <p className='font-medium'>State University</p>
          </div>
          <div className='p-4'>
            <p className='text-sm text-gray-600'>User report submitted</p>
            <p className='font-medium'>Job posting #1234</p>
          </div>
        </div>
      </div>
    </div>
  );
}
