import { useState } from 'react';
import { useActiveCompanyJobs } from '@/features/jobs/useActiveCompanyJobs';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Toast from '@/components/ui/Toast';
import ToastContainer from '@/components/ui/ToastContainer';
import SaveButton from '@/components/ui/SaveButton';
import Switch from '@/components/ui/Switch';
import Dropdown from '@/components/ui/Dropdown';

export default function CompanyJobsDemo() {
  const { jobs, totalJobs, isLoading } = useActiveCompanyJobs(1); // Company ID 1 for demo
  const { toasts, removeToast, showSuccess, showError } = useToast();
  const [showDetails, setShowDetails] = useState<number | null>(null);

  const handleSaveJob = (jobId: number, saved: boolean) => {
    if (saved) {
      showSuccess(`Job #${jobId} has been saved!`);
    } else {
      showError(`Job #${jobId} has been unsaved.`);
    }
  };

  const formatSalary = (min: number, max: number) => {
    const formatter = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    });
    return `${formatter.format(min)} - ${formatter.format(max)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-8'>
        <LoadingSpinner text='Loading jobs' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto space-y-8'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Active Company Jobs</h1>
          <div className='flex items-center gap-4'>
            <Switch label='Show All' />
            <Dropdown userName='John Doe' />
          </div>
        </div>

        {/* Stats */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h2 className='text-xl font-semibold mb-4'>Overview</h2>
          <div className='grid grid-cols-3 gap-4'>
            <div className='p-4 border rounded-lg'>
              <p className='text-sm text-gray-600'>Total Active Jobs</p>
              <p className='text-2xl font-bold text-secondary'>{totalJobs}</p>
            </div>
            <div className='p-4 border rounded-lg'>
              <p className='text-sm text-gray-600'>Total Positions</p>
              <p className='text-2xl font-bold text-primary'>
                {jobs.reduce((acc, job) => acc + job.amount, 0)}
              </p>
            </div>
            <div className='p-4 border rounded-lg'>
              <p className='text-sm text-gray-600'>Average Salary</p>
              <p className='text-2xl font-bold text-accent'>
                {formatSalary(
                  jobs.reduce((acc, job) => acc + job.salaryMin, 0) /
                    jobs.length,
                  jobs.reduce((acc, job) => acc + job.salaryMax, 0) /
                    jobs.length
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className='space-y-4'>
          {jobs.map((job) => (
            <div key={job.id} className='bg-white rounded-lg shadow p-6'>
              <div className='flex items-start justify-between'>
                <div>
                  <h3 className='text-xl font-semibold'>{job.name}</h3>
                  <p className='text-gray-600'>{job.location}</p>
                </div>
                <SaveButton
                  onToggle={(saved) => handleSaveJob(job.id, saved)}
                />
              </div>

              <div className='mt-4 grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-gray-600'>Salary Range</p>
                  <p className='font-medium'>
                    {formatSalary(job.salaryMin, job.salaryMax)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Positions Available</p>
                  <p className='font-medium'>{job.amount}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Start Date</p>
                  <p className='font-medium'>{formatDate(job.startDate)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>End Date</p>
                  <p className='font-medium'>{formatDate(job.endDate)}</p>
                </div>
              </div>

              {showDetails === job.id ? (
                <div className='mt-4 space-y-4 border-t pt-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Description</h4>
                    <p className='text-gray-600'>{job.description}</p>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Requirements</h4>
                    <p className='text-gray-600'>{job.requirement}</p>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>Other Information</h4>
                    <p className='text-gray-600'>{job.otherInfo}</p>
                  </div>
                </div>
              ) : null}

              <button
                onClick={() =>
                  setShowDetails(showDetails === job.id ? null : job.id)
                }
                className='mt-4 text-sm text-secondary font-medium hover:text-secondary-hover'
              >
                {showDetails === job.id ? 'Show Less' : 'Show More'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
