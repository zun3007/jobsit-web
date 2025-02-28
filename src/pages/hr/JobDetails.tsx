import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import { useJobs } from '@/hooks/useJobs';
import { useToast } from '@/hooks/useToast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import JobDetailsMenu from '@/components/job/JobDetailsMenu';
import JobActionModal, { JobActionType } from '@/components/job/JobActionModal';
import DuplicateJobModal from '@/components/job/DuplicateJobModal';
import ToastContainer from '@/components/ui/ToastContainer';

export default function HRJobDetails() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();
  const { showSuccess, showError, toasts, removeToast } = useToast();
  const { deleteJob, duplicateJob } = useJobs();

  // Modal states
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: JobActionType;
  }>({
    isOpen: false,
    actionType: 'delete',
  });

  const [duplicateModal, setDuplicateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch job details
  const {
    data: job,
    isLoading: jobLoading,
    error: jobError,
  } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobService.getJob(jobId),
    enabled: !!jobId,
  });

  // Check if job is expired
  const isExpired = job ? new Date(job.endDate) < new Date() : false;

  // Handle close job
  const handleCloseJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'close',
    });
  };

  // Handle reopen job
  const handleReopenJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'reopen',
    });
  };

  // Handle duplicate job
  const handleDuplicateJob = () => {
    setDuplicateModal(true);
  };

  // Handle delete job
  const handleDeleteJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'delete',
    });
  };

  // Confirm action (close or delete)
  const confirmAction = async () => {
    setIsLoading(true);
    try {
      if (actionModal.actionType === 'delete') {
        await deleteJob(jobId);
        showSuccess('Xóa tin tuyển dụng thành công');
        navigate('/hr/jobs');
      } else if (actionModal.actionType === 'close') {
        // Implement close job logic here
        showSuccess('Đóng tin tuyển dụng thành công');
      } else if (actionModal.actionType === 'reopen') {
        // Implement reopen job logic here
        showSuccess('Mở lại tin tuyển dụng thành công');
      }
      setActionModal({ isOpen: false, actionType: 'delete' });
    } catch (_) {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      if (actionModal.actionType === 'delete') {
        errorMessage = 'Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.';
      } else if (actionModal.actionType === 'close') {
        errorMessage = 'Không thể đóng tin tuyển dụng. Vui lòng thử lại sau.';
      } else if (actionModal.actionType === 'reopen') {
        errorMessage = 'Không thể mở lại tin tuyển dụng. Vui lòng thử lại sau.';
      }
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm duplicate job
  const confirmDuplicate = async () => {
    setIsLoading(true);
    try {
      await duplicateJob(jobId);
      showSuccess('Nhân bản tin tuyển dụng thành công');
      setDuplicateModal(false);
      navigate('/hr/jobs');
    } catch (_) {
      showError('Không thể nhân bản tin tuyển dụng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close modals
  const closeModal = () => {
    setActionModal({ isOpen: false, actionType: 'delete' });
  };

  const closeDuplicateModal = () => {
    setDuplicateModal(false);
  };

  if (jobLoading) {
    return <LoadingSpinner />;
  }

  if (jobError || !job) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 text-lg'>
          Không thể tải thông tin công việc. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Header section with job title and action menu */}
        <div className='flex justify-between items-start p-6 border-b'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{job.name}</h1>
            <p className='text-gray-600 mt-1'>Công ty {job.companyDTO.name}</p>
            <div className='flex flex-wrap gap-2 mt-3'>
              {job.positionDTOs.map((position) => (
                <span
                  key={position.id}
                  className='bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full'
                >
                  {position.name}
                </span>
              ))}
              {job.scheduleDTOs.map((schedule) => (
                <span
                  key={schedule.id}
                  className='bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full'
                >
                  {schedule.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action menu */}
          <JobDetailsMenu
            jobId={jobId}
            onClose={isExpired ? handleReopenJob : handleCloseJob}
            onDuplicate={handleDuplicateJob}
            onDelete={handleDeleteJob}
            isExpired={isExpired}
          />
        </div>

        {/* Job details section */}
        <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left column: Job description */}
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Mô tả công việc
              </h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{
                  __html: job.description.replace(/\n/g, '<br>'),
                }}
              />
            </div>

            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Yêu cầu công việc
              </h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{
                  __html: job.requirement.replace(/\n/g, '<br>'),
                }}
              />
            </div>

            {job.otherInfo && (
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                  Quyền lợi
                </h2>
                <div
                  className='prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: job.otherInfo.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            )}
          </div>

          {/* Right column: Job details */}
          <div className='lg:col-span-1 bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Thông tin công việc
            </h2>

            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <IoLocationOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Địa điểm làm việc</p>
                  <p className='font-medium'>{job.location}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <IoPersonOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Số lượng cần tuyển</p>
                  <p className='font-medium'>{job.amount} ứng viên</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <IoCalendarOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Hạn nộp hồ sơ</p>
                  <p className='font-medium'>
                    {new Date(job.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <FaRegClock className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Trợ cấp</p>
                  <p className='font-medium'>
                    {job.salaryMin.toLocaleString('vi-VN')} -{' '}
                    {job.salaryMax.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <p className='text-sm text-gray-600 mb-2'>Chuyên ngành</p>
                <div className='flex flex-wrap gap-2'>
                  {job.majorDTOs.map((major) => (
                    <span
                      key={major.id}
                      className='bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full'
                    >
                      {major.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action modals */}
      <JobActionModal
        isOpen={actionModal.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        jobTitle={job.name}
        actionType={actionModal.actionType}
        isLoading={isLoading}
      />

      <DuplicateJobModal
        isOpen={duplicateModal}
        onClose={closeDuplicateModal}
        onConfirm={confirmDuplicate}
        jobTitle={job.name}
        isLoading={isLoading}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
