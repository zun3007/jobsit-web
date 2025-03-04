import { useState } from 'react';
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

export default function DemoExpiredJobs() {
  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [reopenModal, setReopenModal] = useState({
    isOpen: false,
    jobId: 0,
    jobTitle: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Mock data for expired jobs
  const MOCK_EXPIRED_JOBS = [
    {
      id: 1,
      name: 'Web Developer (ReactJS)',
      endDate: new Date(
        new Date().getTime() - 5 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 3,
      location: 'Hồ Chí Minh',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 1, name: 'Frontend Developer' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 1, name: 'Web Development' }],
    },
    {
      id: 2,
      name: 'Java Backend Developer',
      endDate: new Date(
        new Date().getTime() - 10 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 2,
      location: 'Hà Nội',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 2, name: 'Backend Developer' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 2, name: 'Java' }],
    },
    {
      id: 3,
      name: 'Mobile App Developer (Flutter)',
      endDate: new Date(
        new Date().getTime() - 15 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 1,
      location: 'Đà Nẵng',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 3, name: 'Mobile Developer' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 3, name: 'Mobile Development' }],
    },
    {
      id: 4,
      name: 'DevOps Engineer',
      endDate: new Date(
        new Date().getTime() - 20 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 2,
      location: 'Hồ Chí Minh',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 4, name: 'DevOps' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 4, name: 'System Administration' }],
    },
    {
      id: 5,
      name: 'UI/UX Designer',
      endDate: new Date(
        new Date().getTime() - 25 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 1,
      location: 'Hồ Chí Minh',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 5, name: 'Designer' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 5, name: 'Design' }],
    },
    {
      id: 6,
      name: 'Business Analyst',
      endDate: new Date(
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 2,
      location: 'Hà Nội',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 6, name: 'Business Analyst' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 6, name: 'Business Administration' }],
    },
    {
      id: 7,
      name: 'QA Engineer',
      endDate: new Date(
        new Date().getTime() - 35 * 24 * 60 * 60 * 1000
      ).toISOString(),
      amount: 3,
      location: 'Hồ Chí Minh',
      companyDTO: {
        id: 1,
        name: 'R2S Academy',
        logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
      },
      positionDTOs: [{ id: 7, name: 'QA Engineer' }],
      scheduleDTOs: [{ id: 1, name: 'Full-time' }],
      majorDTOs: [{ id: 7, name: 'Software Testing' }],
    },
  ];

  // Filter expired jobs based on search term and location
  const filteredJobs = MOCK_EXPIRED_JOBS.filter((job) => {
    const matchesSearch = job.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      selectedLocation === '' || job.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  // Get unique locations for filter
  const locations = [...new Set(MOCK_EXPIRED_JOBS.map((job) => job.location))];

  // Pagination handlers
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Open reopen modal
  const openReopenModal = (jobId: number, jobTitle: string) => {
    setReopenModal({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  // Close modal
  const closeModal = () => {
    setReopenModal({
      isOpen: false,
      jobId: 0,
      jobTitle: '',
    });
  };

  // Handle reopen job
  const handleReopenJob = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSuccess('Đã mở lại tin tuyển dụng thành công!');
      closeModal();
    } catch (err) {
      console.error('Error reopening job:', err);
      showError('Không thể mở lại tin tuyển dụng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Tin tuyển dụng đã hết hạn</h1>
        <Link
          to='/demo/hr/jobs'
          className='inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-500 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        >
          Quay lại danh sách
        </Link>
      </div>

      <div className='bg-white rounded-lg p-6 shadow-sm'>
        {/* Search and filter */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='relative flex-grow'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IoSearchOutline className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm'
              placeholder='Tìm kiếm tin tuyển dụng...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IoLocationOutline className='h-5 w-5 text-gray-400' />
            </div>
            <select
              className='block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              aria-label='Chọn địa điểm'
            >
              <option value=''>Tất cả địa điểm</option>
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Job list */}
        <div className='space-y-4'>
          {currentJobs.length > 0 ? (
            currentJobs.map((job) => (
              <div
                key={job.id}
                className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex flex-col md:flex-row md:items-center'>
                  <div className='flex-grow'>
                    <h3 className='text-lg font-semibold text-gray-900'>
                      <Link
                        to={`/demo/hr/jobs/${job.id}`}
                        className='hover:text-blue-600'
                      >
                        {job.name}
                      </Link>
                    </h3>
                    <div className='mt-2 flex flex-wrap gap-2 items-center text-sm text-gray-500'>
                      <div className='flex items-center'>
                        <IoLocationOutline className='mr-1' />
                        {job.location}
                      </div>
                      <div className='flex items-center'>
                        <FaRegClock className='mr-1' />
                        Hết hạn:{' '}
                        {new Date(job.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                    <div className='mt-2 flex flex-wrap gap-2'>
                      {job.positionDTOs.map((position) => (
                        <span
                          key={position.id}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
                        >
                          {position.name}
                        </span>
                      ))}
                      {job.majorDTOs.map((major) => (
                        <span
                          key={major.id}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'
                        >
                          {major.name}
                        </span>
                      ))}
                      {job.scheduleDTOs.map((schedule) => (
                        <span
                          key={schedule.id}
                          className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
                        >
                          {schedule.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className='mt-4 md:mt-0 flex items-center space-x-2'>
                    <button
                      type='button'
                      onClick={() => openReopenModal(job.id, job.name)}
                      className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Mở lại
                    </button>
                    <Link
                      to={`/demo/hr/jobs/${job.id}`}
                      className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-8 text-gray-500'>
              Không tìm thấy tin tuyển dụng nào đã hết hạn.
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredJobs.length > 0 && (
          <div className='flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4'>
            <div className='flex-1 flex justify-between sm:hidden'>
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Trước
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Sau
              </button>
            </div>
            <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm text-gray-700'>
                  Hiển thị{' '}
                  <span className='font-medium'>{indexOfFirstItem + 1}</span>{' '}
                  đến{' '}
                  <span className='font-medium'>
                    {Math.min(indexOfLastItem, filteredJobs.length)}
                  </span>{' '}
                  trong tổng số{' '}
                  <span className='font-medium'>{filteredJobs.length}</span> kết
                  quả
                </p>
              </div>
              <div>
                <nav
                  className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                  aria-label='Pagination'
                >
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <span className='sr-only'>Previous</span>
                    <IoChevronBack className='h-5 w-5' aria-hidden='true' />
                  </button>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    <span className='sr-only'>Next</span>
                    <IoChevronForward className='h-5 w-5' aria-hidden='true' />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reopen job modal */}
      <ReopenJobModal
        isOpen={reopenModal.isOpen}
        onClose={closeModal}
        jobTitle={reopenModal.jobTitle}
        onConfirm={handleReopenJob}
        isLoading={isLoading}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
