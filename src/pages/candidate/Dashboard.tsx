import { useAuth } from '@/hooks/useAuth';
import { useCandidates } from '@/hooks/useCandidates';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';

export default function CandidateDashboard() {
  const { profile } = useAuth();
  const {
    applications,
    recommendedJobs,
    isLoadingApplications,
    isLoadingRecommendedJobs,
  } = useCandidates();

  if (isLoadingApplications || isLoadingRecommendedJobs) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Candidate Dashboard</h1>
        <p className='text-gray-600'>Welcome back, {profile?.firstName}!</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Stats Cards */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Applications</h3>
          <p className='text-3xl font-bold text-primary'>
            {applications?.length || 0}
          </p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Interviews</h3>
          <p className='text-3xl font-bold text-secondary'>3</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Profile Views</h3>
          <p className='text-3xl font-bold text-accent'>45</p>
        </div>
        <div className='bg-white p-6 rounded-lg shadow'>
          <h3 className='text-lg font-semibold mb-2'>Saved Jobs</h3>
          <p className='text-3xl font-bold text-primary'>12</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Quick Actions</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <button className='btn btn-primary'>Update Profile</button>
          <button className='btn btn-secondary'>Browse Jobs</button>
          <button className='btn btn-outline'>View Applications</button>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Recommended for You</h2>
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {recommendedJobs?.slice(0, 3).map((job) => (
            <div key={job.id} className='p-4 border-b'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-medium'>{job.name}</h3>
                  <p className='text-sm text-gray-600'>
                    {job.companyDTO.name} • {job.location}
                  </p>
                </div>
                <SaveButton />
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

      {/* Recent Applications */}
      <div className='mt-8'>
        <h2 className='text-xl font-bold mb-4'>Recent Applications</h2>
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          {applications?.slice(0, 3).map((application) => (
            <div key={application.id} className='p-4 border-b'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-medium'>{application.job.name}</h3>
                  <p className='text-sm text-gray-600'>
                    {application.job.companyDTO.name}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    application.status === 'PENDING'
                      ? 'bg-primary-light text-primary'
                      : application.status === 'ACCEPTED'
                      ? 'bg-secondary-light text-secondary'
                      : 'bg-red-100 text-red-600'
                  }`}
                >
                  {application.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
