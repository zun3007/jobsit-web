import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import { useSaveJob } from '@/hooks/useSaveJob';
import { useToast } from '@/hooks/useToast';
import { queryKeys } from '@/lib/react-query';
import {
  IoLocationOutline,
  IoPersonOutline,
  IoChevronBack,
  IoChevronForward,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function SavedJobs() {
  const { showError } = useToast();
  const { saveJob, unsaveJob, isSaving } = useSaveJob();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: queryKeys.jobs.saved(),
    queryFn: jobService.getSavedJobs,
  });

  const handleSaveJob = async (jobId: number, isSaved: boolean) => {
    try {
      if (isSaved) {
        await saveJob(jobId);
      } else {
        await unsaveJob(jobId);
      }
      // Invalidate and refetch saved jobs after successful save/unsave
      await queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    } catch {
      showError('Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalPages = Math.ceil((savedJobs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = savedJobs?.slice(startIndex, endIndex) || [];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex gap-8'>
        {/* Main Content */}
        <div className='flex-1'>
          {/* Info Box */}
          <div className='bg-[#00B074] text-white rounded-lg p-6 mb-8'>
            <h1 className='text-2xl font-bold mb-2'>
              Danh sách việc làm đã lưu
            </h1>
            <p>
              Xem lại danh sách những việc làm mà bạn đã lưu trước đó. Ứng tuyển
              ngay để không bỏ lỡ cơ hội nghề nghiệp dành cho bạn.
            </p>
          </div>

          {/* Saved Jobs Count */}
          <p className='text-gray-600 mb-6'>
            Bạn đã quan tâm{' '}
            <span className='font-bold'>{savedJobs?.length || 0}</span> việc làm
          </p>

          {/* Empty State or Job List */}
          {!savedJobs?.length ? (
            <div className='bg-white rounded-lg p-8'>
              <div className='text-center'>
                <img
                  src='/empty_box.svg'
                  alt='No saved jobs'
                  className='w-48 h-48 mx-auto mb-4'
                />
                <p className='text-lg font-medium mb-2'>
                  Bạn chưa quan tâm công việc nào!
                </p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              {currentJobs.map((job) => (
                <div
                  key={job.id}
                  className='bg-white rounded-lg p-6 border border-[#DEDEDE] hover:border-[#00B074] transition-colors'
                >
                  <div className='flex gap-6'>
                    {/* Company Logo */}
                    <Link
                      to={`/companies/${job.companyDTO.id}`}
                      className='w-[100px] h-[100px] border rounded-lg overflow-hidden flex-shrink-0'
                    >
                      <img
                        src={job.companyDTO.logo || '/company_logo_temp.svg'}
                        alt={job.companyDTO.name}
                        className='w-full h-full object-contain p-2'
                      />
                    </Link>

                    {/* Job Info */}
                    <div className='flex-1'>
                      <Link
                        to={`/jobs/${job.id}`}
                        className='text-lg font-bold text-[#00B074] transition-colors'
                      >
                        {job.name}
                      </Link>
                      <Link
                        to={`/companies/${job.companyDTO.id}`}
                        className='block text-gray-600 hover:text-[#00B074] transition-colors'
                      >
                        {job.companyDTO.name}
                      </Link>
                      <div className='flex items-center gap-2 mt-2'>
                        <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                        <span className='text-sm text-gray-500'>
                          {job.location}
                        </span>
                        <span className='text-sm text-gray-500'>
                          {job.scheduleDTOs.map((s) => s.name).join(', ')}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {job.majorDTOs.map((major) => (
                          <span
                            key={major.id}
                            className='px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded'
                          >
                            {major.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Side Info */}
                    <div className='flex flex-col items-end justify-between'>
                      <SaveButton
                        jobId={job.id}
                        onToggle={(saved) => handleSaveJob(job.id, saved)}
                        isLoading={isSaving}
                      />
                      <div className='text-right'>
                        <div className='flex items-center justify-end text-gray-500 gap-1 text-sm'>
                          <IoPersonOutline className='w-4 h-4 text-[#00B074]' />
                          <span>Số lượng ứng viên: {job.amount}</span>
                        </div>
                        <div className='flex items-center justify-end gap-1 text-sm text-gray-500 mt-1'>
                          <FaRegClock className='w-4 h-4 text-[#00B074]' />
                          <span>
                            {new Date(job.startDate).toLocaleDateString(
                              'vi-VN'
                            )}{' '}
                            -{' '}
                            {new Date(job.endDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center mt-6 gap-2'>
                  <button
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label='Previous page'
                  >
                    <IoChevronBack className='w-4 h-4' />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
                          w-8 h-8 rounded-full text-sm font-medium transition-colors
                          ${
                            page === currentPage
                              ? 'rounded-full border border-[#00B074] text-slate-900'
                              : 'text-slate-700 rounded-full hover:border hover:border-[#00B074] hover:text-slate-900'
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label='Next page'
                  >
                    <IoChevronForward className='w-4 h-4' />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Advertising Section */}
        <div className='w-[300px] bg-gray-200 rounded-lg flex-shrink-0 h-[600px]'>
          {/* Advertising content will go here */}
        </div>
      </div>
    </div>
  );
}
