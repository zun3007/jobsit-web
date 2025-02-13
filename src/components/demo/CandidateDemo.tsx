import { useState } from 'react';
import { useCandidates } from '@/hooks/useCandidates';
import { useJobs } from '@/hooks/useJobs';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

export default function CandidateDemo() {
  const {
    profile,
    applications,
    totalApplications,
    recommendedJobs,
    isLoadingProfile,
    isLoadingApplications,
    isLoadingRecommendedJobs,
    updateProfile,
    applyForJob,
    withdrawApplication,
    isUpdatingProfile,
    isApplying,
    isWithdrawing,
  } = useCandidates();

  const { jobs } = useJobs();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        about:
          'Passionate software developer with experience in React and TypeScript',
        education: 'Bachelor in Computer Science',
        experience: '3 years of professional experience',
        skills: 'React, TypeScript, Node.js',
      });
      showSuccessToast('Profile updated successfully!');
    } catch (error) {
      showErrorToast('Failed to update profile.');
    }
  };

  const handleApplyForJob = async (jobId: number) => {
    try {
      await applyForJob(jobId);
      showSuccessToast('Application submitted successfully!');
    } catch (error) {
      showErrorToast('Failed to submit application.');
    }
  };

  const handleWithdrawApplication = async (jobId: number) => {
    try {
      await withdrawApplication(jobId);
      showSuccessToast('Application withdrawn successfully!');
    } catch (error) {
      showErrorToast('Failed to withdraw application.');
    }
  };

  const showSuccessToast = (message: string) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
  };

  if (isLoadingProfile) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='lg' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold'>Candidate Features Demo</h1>

        {/* Profile Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Candidate Profile</h2>
          {profile ? (
            <div className='space-y-4'>
              <div>
                <h3 className='font-medium'>Personal Information</h3>
                <p className='text-sm text-gray-600'>
                  {profile.firstName} {profile.lastName}
                </p>
                <p className='text-sm text-gray-600'>{profile.email}</p>
              </div>
              <div>
                <h3 className='font-medium'>About</h3>
                <p className='text-sm text-gray-600'>
                  {profile.about || 'No information provided'}
                </p>
              </div>
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className='btn btn-primary'
              >
                {isUpdatingProfile ? (
                  <Spinner size='sm' variant='white' className='mr-2' />
                ) : null}
                Update Profile
              </button>
            </div>
          ) : (
            <p>No profile found</p>
          )}
        </div>

        {/* Applications Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>My Applications</h2>
          {isLoadingApplications ? (
            <div className='flex justify-center p-8'>
              <Spinner size='lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>
                Total Applications: {totalApplications}
              </p>
              {applications.map((application) => (
                <div
                  key={application.id}
                  className='border rounded-lg p-4 space-y-2'
                >
                  <h3 className='font-medium'>{application.job.name}</h3>
                  <p className='text-sm text-gray-600'>
                    Status: {application.status}
                  </p>
                  <button
                    onClick={() => handleWithdrawApplication(application.jobId)}
                    disabled={isWithdrawing}
                    className='btn btn-danger'
                  >
                    {isWithdrawing ? (
                      <Spinner size='sm' variant='white' className='mr-2' />
                    ) : null}
                    Withdraw Application
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Jobs Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Recommended Jobs</h2>
          {isLoadingRecommendedJobs ? (
            <div className='flex justify-center p-8'>
              <Spinner size='lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              {recommendedJobs.map((job) => (
                <div key={job.id} className='border rounded-lg p-4 space-y-2'>
                  <h3 className='font-medium'>{job.name}</h3>
                  <p className='text-sm text-gray-600'>{job.location}</p>
                  <p className='text-sm text-gray-600'>{job.salary}</p>
                  <button
                    onClick={() => handleApplyForJob(job.id)}
                    disabled={isApplying}
                    className='btn btn-primary'
                  >
                    {isApplying ? (
                      <Spinner size='sm' variant='white' className='mr-2' />
                    ) : null}
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Jobs Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Available Jobs</h2>
          <div className='space-y-4'>
            {jobs.map((job) => (
              <div key={job.id} className='border rounded-lg p-4 space-y-2'>
                <h3 className='font-medium'>{job.name}</h3>
                <p className='text-sm text-gray-600'>{job.location}</p>
                <p className='text-sm text-gray-600'>{job.salary}</p>
                <button
                  onClick={() => handleApplyForJob(job.id)}
                  disabled={isApplying}
                  className='btn btn-primary'
                >
                  {isApplying ? (
                    <Spinner size='sm' variant='white' className='mr-2' />
                  ) : null}
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <Toast
            type={toastType}
            message={toastMessage}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
}
