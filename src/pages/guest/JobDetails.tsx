import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJob(Number(id)),
    enabled: !!id,
  });

  const handleApplyJob = () => {
    setShowAuthModal(true);
  };

  if (isLoading || !job) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Job Header */}
          <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] mb-6'>
            <div className='flex gap-6'>
              {/* Company Logo */}
              <Link
                to={`/companies/${job.companyDTO.id}`}
                className='w-[120px] h-[120px] border rounded-lg overflow-hidden flex-shrink-0'
              >
                <img
                  src={job.companyDTO.logo || '/company-placeholder.png'}
                  alt={job.companyDTO.name}
                  className='w-full h-full object-contain p-2'
                />
              </Link>

              {/* Job Info */}
              <div className='flex-1'>
                <h1 className='text-2xl font-bold'>{job.name}</h1>
                <Link
                  to={`/companies/${job.companyDTO.id}`}
                  className='text-lg text-gray-600 hover:text-primary'
                >
                  {job.companyDTO.name}
                </Link>

                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>Địa điểm:</span>
                    <span>{job.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>Hình thức:</span>
                    <span>
                      {job.scheduleDTOs.map((s) => s.name).join(', ')}
                    </span>
                  </div>
                </div>

                <div className='flex gap-4 mt-6'>
                  <button
                    onClick={handleApplyJob}
                    className='px-8 py-2 bg-primary text-white rounded hover:bg-primary-hover'
                  >
                    ỨNG TUYỂN NGAY
                  </button>
                  <SaveButton onToggle={() => setShowAuthModal(true)} />
                </div>
              </div>
            </div>
          </div>

          {/* Job Content */}
          <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] space-y-6'>
            <div>
              <h2 className='text-xl font-bold mb-4'>Mô tả công việc</h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div>
              <h2 className='text-xl font-bold mb-4'>Yêu cầu công việc</h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: job.requirement }}
              />
            </div>

            <div>
              <h2 className='text-xl font-bold mb-4'>Thông tin khác</h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: job.otherInfo }}
              />
            </div>

            <div>
              <h2 className='text-xl font-bold mb-4'>Thông tin ứng tuyển</h2>
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Số lượng cần tuyển:</span>
                  <span>{job.amount} người</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Mức lương:</span>
                  <span>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(job.salaryMin)}{' '}
                    -{' '}
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(job.salaryMax)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Hạn nộp hồ sơ:</span>
                  <span>
                    {new Date(job.endDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <RequireAuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
