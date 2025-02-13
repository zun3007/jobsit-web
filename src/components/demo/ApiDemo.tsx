import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useJobs } from '@/hooks/useJobs';
import { useAppDispatch } from '@/app/store';
import { setFilters } from '@/features/jobs/jobSlice';
import { Job } from '@/services/jobService';
import Spinner from '@/components/ui/Spinner';
import Toast from '@/components/ui/Toast';

export default function ApiDemo() {
  const dispatch = useAppDispatch();
  const { login, register, logout, profile, isLoggingIn } = useAuth();
  const { jobs, totalJobs, isLoading, createJob, updateJob, deleteJob } =
    useJobs();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleLogin = async () => {
    try {
      await login({ email, password });
      showSuccessToast('Login successful!');
    } catch (error) {
      showErrorToast('Login failed. Please try again.');
    }
  };

  const handleCreateJob = async () => {
    try {
      await createJob({
        name: 'Software Engineer',
        description: 'We are looking for a talented software engineer...',
        requirements: 'At least 2 years of experience...',
        benefits: 'Competitive salary, health insurance...',
        schedule: 'Full-time',
        position: 'Senior',
        major: 'Computer Science',
        salary: '$80,000 - $120,000',
        location: 'Ho Chi Minh City',
      });
      showSuccessToast('Job created successfully!');
    } catch (error) {
      showErrorToast('Failed to create job.');
    }
  };

  const handleUpdateJob = async (job: Job) => {
    try {
      await updateJob({
        id: job.id,
        data: { ...job, name: `${job.name} (Updated)` },
      });
      showSuccessToast('Job updated successfully!');
    } catch (error) {
      showErrorToast('Failed to update job.');
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      await deleteJob(id);
      showSuccessToast('Job deleted successfully!');
    } catch (error) {
      showErrorToast('Failed to delete job.');
    }
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setFilters({ name: searchTerm }));
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

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold'>API Demo</h1>

        {/* Authentication Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Authentication</h2>
          {profile ? (
            <div className='space-y-4'>
              <p>
                Welcome, {profile.firstName} {profile.lastName}!
              </p>
              <button onClick={logout} className='btn btn-primary'>
                Logout
              </button>
            </div>
          ) : (
            <div className='space-y-4'>
              <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='form-input'
              />
              <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-input'
              />
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className='btn btn-primary'
              >
                {isLoggingIn ? (
                  <Spinner size='sm' variant='white' className='mr-2' />
                ) : null}
                Login
              </button>
            </div>
          )}
        </div>

        {/* Jobs Section */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Jobs Management</h2>

          {/* Search */}
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Search jobs...'
              onChange={(e) => handleSearch(e.target.value)}
              className='form-input'
            />
          </div>

          {/* Create Job Button */}
          <button onClick={handleCreateJob} className='btn btn-secondary mb-4'>
            Create New Job
          </button>

          {/* Jobs List */}
          {isLoading ? (
            <div className='flex justify-center p-8'>
              <Spinner size='lg' />
            </div>
          ) : (
            <div className='space-y-4'>
              <p className='text-sm text-gray-600'>Total Jobs: {totalJobs}</p>
              {jobs.map((job) => (
                <div key={job.id} className='border rounded-lg p-4 space-y-2'>
                  <h3 className='font-medium'>{job.name}</h3>
                  <p className='text-sm text-gray-600'>{job.location}</p>
                  <p className='text-sm text-gray-600'>{job.salary}</p>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => handleUpdateJob(job)}
                      className='btn btn-outline'
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className='btn btn-danger'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
