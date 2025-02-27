import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useJobs } from '@/hooks/useJobs';
import { setJobFilters } from '@/features/filters/filterSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  IoLocationOutline,
  IoSearchOutline,
  IoChevronForward,
  IoChevronBack,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';
import ReopenJobModal from '@/components/job/ReopenJobModal';
import { Job } from '@/features/jobs/jobSlice';

export default function ExpiredJobs() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, isLoading } = useJobs();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [expiredJobs, setExpiredJobs] = useState<Job[]>([]);
  const [totalExpiredJobs, setTotalExpiredJobs] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading2, setIsLoading2] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    jobId: number | null;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: null,
    jobTitle: '',
  });

  // Fetch jobs when component mounts
  useEffect(() => {
    dispatch(setJobFilters({ no: currentPage - 1, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // Filter expired jobs
  useEffect(() => {
    if (jobs) {
      const currentDate = new Date();
      const expired = jobs.filter((job) => new Date(job.endDate) < currentDate);
      setExpiredJobs(expired);
      setTotalExpiredJobs(expired.length);
    }
  }, [jobs]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalExpiredJobs / itemsPerPage);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      dispatch(setJobFilters({ no: page - 1, limit: itemsPerPage }));
    },
    [dispatch, itemsPerPage]
  );

  // Handle job search
  const handleSearch = useCallback(() => {
    dispatch(
      setJobFilters({
        name: searchTerm || undefined,
        provinceName: selectedLocation || undefined,
        no: 0,
        limit: itemsPerPage,
      })
    );
    setCurrentPage(1);
  }, [dispatch, searchTerm, selectedLocation, itemsPerPage]);

  // Open modal for job reopening
  const openReopenModal = (jobId: number, jobTitle: string) => {
    setModalState({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  // Close modal
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle job reopening confirmation
  const handleReopenJob = async () => {
    if (!modalState.jobId) return;

    setIsLoading2(true);

    try {
      // In a real implementation, this would call an API to extend the endDate of the job
      // and change its status to active

      // For our current implementation, we'll simulate this by refreshing the job list
      await dispatch(setJobFilters({}));
      showSuccess('Mở lại tin tuyển dụng thành công');
      closeModal();
    } catch {
      showError('Mở lại tin tuyển dụng thất bại');
    } finally {
      setIsLoading2(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý tin hết hạn</h1>
        <Link
          to='/hr/jobs'
          className='px-4 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors font-medium'
        >
          Quay lại danh sách
        </Link>
      </div>

      {/* Search section */}
      <div className='mb-8 p-6 bg-white rounded-lg shadow-sm'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IoSearchOutline className='text-gray-400' />
            </div>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Tìm kiếm theo tên công việc'
              className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]'
            />
          </div>

          <div className='relative flex-1'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IoLocationOutline className='text-gray-400' />
            </div>
            <input
              type='text'
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder='Địa điểm'
              className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] focus:border-[#00B074]'
            />
          </div>

          <button
            onClick={handleSearch}
            className='bg-[#00B074] text-white px-4 py-2 rounded hover:bg-[#00B074]/90 transition-colors'
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Jobs table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <h2 className='text-lg font-semibold p-6 border-b border-gray-200'>
          Danh sách tin hết hạn ({totalExpiredJobs})
        </h2>

        <table className='w-full table-auto'>
          <thead className='bg-gray-50 text-xs text-gray-500 uppercase'>
            <tr>
              <th className='px-6 py-3 text-left'>Tin tuyển dụng</th>
              <th className='px-6 py-3 text-left'>Hết hạn</th>
              <th className='px-6 py-3 text-left'>Ứng viên</th>
              <th className='px-6 py-3 text-left'>Người đăng</th>
              <th className='px-6 py-3 text-left'>Trạng thái</th>
              <th className='px-6 py-3 text-left'>Thao tác</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {expiredJobs.length === 0 ? (
              <tr>
                <td colSpan={6} className='px-6 py-4 text-center text-gray-500'>
                  Không có tin tuyển dụng hết hạn
                </td>
              </tr>
            ) : (
              expiredJobs.map((job, index) => (
                <tr
                  key={job.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-6 py-4'>
                    <div className='flex flex-col'>
                      <Link
                        to={`/hr/jobs/edit/${job.id}`}
                        className='text-[#00B074] hover:underline font-medium'
                      >
                        {job.name}
                      </Link>
                      <div className='flex items-center text-xs text-gray-500 mt-1'>
                        <IoLocationOutline className='mr-1' />
                        <span>
                          {job.location.length > 30
                            ? `${job.location.substring(0, 30)}...`
                            : job.location}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center text-sm text-gray-500'>
                      <FaRegClock className='mr-2' />
                      <span>
                        {new Date(job.endDate).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-1'>
                      <span className='bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium'>
                        {job.amount || 0}
                      </span>
                      <span className='text-gray-400'>/</span>
                      <span className='bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded-full text-xs font-medium'>
                        0
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='text-sm text-gray-600'>
                      {user ? `${user.firstName} ${user.lastName}` : 'N/A'}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <span className='px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>
                      Đã hết hạn
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => openReopenModal(job.id, job.name)}
                        className='px-2 py-1 text-xs border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'
                      >
                        Mở lại
                      </button>

                      <Link
                        to={`/hr/jobs/edit/${job.id}`}
                        className='px-2 py-1 text-xs border border-[#FFB800] text-[#FFB800] rounded hover:bg-[#FFB800] hover:text-white transition-colors'
                      >
                        Chỉnh sửa
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center py-4 bg-white border-t border-gray-200'>
            <nav className='flex items-center gap-1'>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='Trang trước'
              >
                <IoChevronBack className='w-4 h-4' />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded text-sm ${
                      page === currentPage
                        ? 'bg-[#00B074] text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                    aria-label={`Trang ${page}`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                aria-label='Trang sau'
              >
                <IoChevronForward className='w-4 h-4' />
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Reopen Job Modal */}
      <ReopenJobModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleReopenJob}
        jobTitle={modalState.jobTitle}
        isLoading={isLoading2}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
