import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HRDashboard() {
  const { profile } = useAuth();
  const { jobs, totalJobs, isLoading } = useJobs();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>HR Dashboard</h1>
        <p className='text-gray-600'>Welcome back, {profile?.firstName}!</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Stats Cards */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Active Jobs</h3>
          <p className='text-3xl font-bold text-primary'>{totalJobs}</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Total Applications</h3>
          <p className='text-3xl font-bold text-secondary'>128</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Pending Reviews</h3>
          <p className='text-3xl font-bold text-accent'>45</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Hired Candidates</h3>
          <p className='text-3xl font-bold text-primary'>23</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <button className='btn btn-primary'>Post New Job</button>
          <button className='btn btn-secondary'>Review Applications</button>
          <button className='btn btn-outline'>Schedule Interviews</button>
        </div>
      </div>

      {/* Recent Job Postings */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Recent Job Postings</h2>
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {jobs.slice(0, 3).map((job) => (
            <div key={job.id} className='p-4 border-b'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-medium'>{job.name}</h3>
                  <p className='text-sm text-gray-600'>{job.location}</p>
                </div>
                <span className='text-sm text-secondary'>
                  {job.amount} positions
                </span>
              </div>
              <div className='mt-2 flex gap-2'>
                <span className='text-xs bg-primary-light text-primary px-2 py-1 rounded'>
                  {job.positionDTOs[0]?.name || 'Not specified'}
                </span>
                <span className='text-xs bg-secondary-light text-secondary px-2 py-1 rounded'>
                  {job.majorDTOs[0]?.name || 'Not specified'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
