import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useJobs } from '@/hooks/useJobs';
import { setJobFilters } from '@/features/filters/filterSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoPersonOutline } from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';

export default function HRJobs() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const filters = useAppSelector((state) => state.filters.jobs);
  const { jobs, isLoading, totalJobs } = useJobs();

  useEffect(() => {
    // Reset filters when component mounts
    dispatch(setJobFilters({ no: 0, limit: 10 }));
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý tin tuyển dụng</h1>
        <button className='px-4 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors'>
          Đăng tin mới
        </button>
      </div>

      <div className='space-y-4'>
        {jobs.map((job) => (
          <div
            key={job.id}
            className='bg-white rounded-lg p-6 border border-[#DEDEDE] hover:border-[#00B074] transition-colors'
          >
            <div className='flex gap-6'>
              {/* Company Logo */}
              <div className='w-[100px] h-[100px] border rounded-lg overflow-hidden flex-shrink-0'>
                <img
                  src={job.companyDTO.logo || '/company_logo_temp.svg'}
                  alt={job.companyDTO.name}
                  className='w-full h-full object-contain p-2'
                />
              </div>

              {/* Job Info */}
              <div className='flex-1'>
                <Link
                  to={`/jobs/${job.id}`}
                  className='text-lg font-bold text-[#00B074] transition-colors'
                >
                  {job.name}
                </Link>
                <div className='flex items-center gap-2 mt-2'>
                  <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                  <span className='text-sm text-gray-500'>{job.location}</span>
                  <span className='text-sm text-gray-500'>•</span>
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
                <div className='flex gap-2'>
                  <button className='px-3 py-1 text-sm border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'>
                    Chỉnh sửa
                  </button>
                  <button className='px-3 py-1 text-sm border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors'>
                    Xóa
                  </button>
                </div>
                <div className='text-right'>
                  <div className='flex items-center justify-end text-gray-500 gap-1 text-sm'>
                    <IoPersonOutline className='w-4 h-4 text-[#00B074]' />
                    <span>Số lượng ứng viên: {job.amount}</span>
                  </div>
                  <div className='flex items-center justify-end gap-1 text-sm text-gray-500 mt-1'>
                    <FaRegClock className='w-4 h-4 text-[#00B074]' />
                    <span>
                      {new Date(job.startDate).toLocaleDateString('vi-VN')} -{' '}
                      {new Date(job.endDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
