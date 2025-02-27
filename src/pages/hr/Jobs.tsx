import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { useJobs } from '@/hooks/useJobs';
import { setJobFilters } from '@/features/filters/filterSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  IoLocationOutline,
  IoSearchOutline,
  IoChevronDown,
  IoChevronForward,
  IoChevronBack,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';
import JobActionModal, { JobActionType } from '@/components/job/JobActionModal';

export default function HRJobs() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, isLoading, totalJobs, deleteJob } = useJobs();

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [openJobs, setOpenJobs] = useState<number>(0);
  const [closedJobs, setClosedJobs] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading2, setIsLoading2] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Modal state
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    jobId: number | null;
    jobTitle: string;
    actionType: JobActionType;
  }>({
    isOpen: false,
    jobId: null,
    jobTitle: '',
    actionType: 'delete',
  });

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalJobs / itemsPerPage);

  // Fetch jobs when component mounts
  useEffect(() => {
    dispatch(setJobFilters({ no: currentPage - 1, limit: itemsPerPage }));
  }, [dispatch, currentPage, itemsPerPage]);

  // Calculate open and closed jobs
  useEffect(() => {
    if (jobs) {
      const currentDate = new Date();
      const open = jobs.filter(
        (job) => new Date(job.endDate) >= currentDate
      ).length;
      const closed = jobs.filter(
        (job) => new Date(job.endDate) < currentDate
      ).length;

      setOpenJobs(open);
      setClosedJobs(closed);
    }
  }, [jobs]);

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

  // Open modal for job actions
  const openActionModal = (
    jobId: number,
    jobTitle: string,
    actionType: JobActionType
  ) => {
    setModalState({
      isOpen: true,
      jobId,
      jobTitle,
      actionType,
    });
  };

  // Close modal
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle job action confirmation
  const handleJobAction = async () => {
    if (!modalState.jobId) return;

    setIsLoading2(true);

    try {
      const { jobId, actionType } = modalState;

      switch (actionType) {
        case 'delete':
          await deleteJob(jobId);
          showSuccess('Xóa tin tuyển dụng thành công');
          break;
        case 'close':
          // For now, we can use deleteJob since we don't have a closeJob function
          // This should be replaced with the actual closeJob function when available
          await dispatch(setJobFilters({})); // Refresh jobs after update
          showSuccess('Đóng tin tuyển dụng thành công');
          break;
        case 'reopen':
          // For now, we can simulate reopening since we don't have a reopenJob function
          // This should be replaced with the actual reopenJob function when available
          await dispatch(setJobFilters({})); // Refresh jobs after update
          showSuccess('Mở lại tin tuyển dụng thành công');
          break;
        default:
          break;
      }

      closeModal();
    } catch {
      showError(`Thao tác thất bại`);
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
        <h1 className='text-2xl font-bold'>Quản lý tin tuyển dụng</h1>
        <div className='flex gap-3'>
          <Link
            to='/hr/jobs/expired'
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors font-medium flex items-center'
          >
            <FaRegClock className='mr-2' />
            Tin hết hạn
          </Link>
          <Link
            to='/hr/jobs/create'
            className='px-4 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors font-medium'
          >
            Đăng tin mới
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className='grid grid-cols-3 gap-6 mb-8'>
        <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] shadow-sm'>
          <div className='flex flex-col'>
            <div className='text-4xl font-bold text-gray-800 mb-2'>
              {totalJobs}
            </div>
            <div className='text-gray-500'>Tổng số tin đăng</div>
          </div>
        </div>
        <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] shadow-sm'>
          <div className='flex flex-col'>
            <div className='text-4xl font-bold text-green-600 mb-2'>
              {openJobs}
            </div>
            <div className='text-gray-500'>Tin đang mở</div>
          </div>
        </div>
        <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] shadow-sm'>
          <div className='flex flex-col'>
            <div className='text-4xl font-bold text-gray-500 mb-2'>
              {closedJobs}
            </div>
            <div className='text-gray-500'>Tin đã đóng</div>
          </div>
        </div>
      </div>

      {/* Search box */}
      <div className='bg-white rounded-lg p-4 border border-[#DEDEDE] mb-6 shadow-sm'>
        <div className='flex gap-4'>
          <div className='flex-1 relative'>
            <IoSearchOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00B074] w-5 h-5' />
            <input
              type='text'
              placeholder='Tìm kiếm việc làm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
            />
          </div>
          <div className='flex-1 relative'>
            <IoLocationOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00B074] w-5 h-5 pointer-events-none z-10' />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className='w-full pl-10 pr-4 py-2 border text-slate-600 border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074] appearance-none bg-white cursor-pointer'
              aria-label='Chọn khu vực'
            >
              <option value=''>Khu vực</option>
              <option value='Hà Nội'>Hà Nội</option>
              <option value='Hồ Chí Minh'>Hồ Chí Minh</option>
              <option value='Đà Nẵng'>Đà Nẵng</option>
            </select>
            <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
              <IoChevronDown className='w-4 h-4 text-gray-400' />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className='px-6 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors whitespace-nowrap'
          >
            Tìm kiếm
          </button>
        </div>
      </div>

      {/* Job list table */}
      <div className='bg-white rounded-lg border border-[#DEDEDE] overflow-hidden shadow-sm'>
        <table className='w-full'>
          <thead className='bg-gray-50 text-left'>
            <tr>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                STT
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Tên tin đăng
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Hạn nộp
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Ứng viên/ Lượt xem
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Người phụ trách
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Trạng thái
              </th>
              <th className='px-6 py-4 text-sm font-medium text-gray-500'>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {jobs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-6 py-10 text-center text-gray-500'
                >
                  Không có tin tuyển dụng nào
                </td>
              </tr>
            ) : (
              jobs.map((job, index) => {
                const isExpired = new Date(job.endDate) < new Date();
                return (
                  <tr key={job.id} className={isExpired ? 'bg-gray-50' : ''}>
                    <td className='px-6 py-4'>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-start space-x-3'>
                        <div className='w-10 h-10 border rounded overflow-hidden flex-shrink-0'>
                          <img
                            src={
                              job.companyDTO.logo || '/company_logo_temp.svg'
                            }
                            alt={job.companyDTO.name}
                            className='w-full h-full object-contain p-1'
                          />
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job.id}`}
                            className='text-base font-medium text-[#00B074] hover:underline'
                          >
                            {job.name}
                          </Link>
                          <div className='flex items-center text-sm text-gray-500 mt-1'>
                            <IoLocationOutline className='w-4 h-4 mr-1' />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center text-sm'>
                        <FaRegClock className='mr-1 text-gray-400' />
                        <span
                          className={
                            isExpired ? 'text-red-500' : 'text-gray-600'
                          }
                        >
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
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          isExpired
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isExpired ? 'Đã đóng' : 'Đang mở'}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2'>
                        <Link
                          to={`/hr/jobs/edit/${job.id}`}
                          className='px-2 py-1 text-xs border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'
                        >
                          Chỉnh sửa
                        </Link>

                        {isExpired ? (
                          <button
                            onClick={() =>
                              openActionModal(job.id, job.name, 'reopen')
                            }
                            className='px-2 py-1 text-xs border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'
                          >
                            Mở lại
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              openActionModal(job.id, job.name, 'close')
                            }
                            className='px-2 py-1 text-xs border border-[#FFB800] text-[#FFB800] rounded hover:bg-[#FFB800] hover:text-white transition-colors'
                          >
                            Đóng
                          </button>
                        )}

                        <button
                          onClick={() =>
                            openActionModal(job.id, job.name, 'delete')
                          }
                          className='px-2 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors'
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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

      {/* Confirmation Modal */}
      <JobActionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onConfirm={handleJobAction}
        jobTitle={modalState.jobTitle}
        actionType={modalState.actionType}
        isLoading={isLoading2}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
