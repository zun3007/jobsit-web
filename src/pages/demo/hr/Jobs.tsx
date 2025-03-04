import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  IoLocationOutline,
  IoSearchOutline,
  IoChevronDown,
  IoChevronForward,
  IoChevronBack,
  IoDuplicateOutline,
  IoAddOutline,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import JobActionModal, { JobActionType } from '@/components/job/JobActionModal';
import DuplicateJobModal from '@/components/job/DuplicateJobModal';
import JobPostingTypeModal from '@/components/job/JobPostingTypeModal';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

// Mock data for demo
const DEMO_JOBS = [
  {
    id: 1,
    name: 'Thực tập ReactJS',
    endDate: new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from now
    amount: 5,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [
      { id: 1, name: 'Frontend Developer' },
      { id: 2, name: 'Intern' },
    ],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Web Development' },
    ],
    description: 'Thực tập sinh ReactJS làm việc với team phát triển frontend',
    requirement: 'Biết cơ bản về HTML, CSS, JavaScript và ReactJS',
    otherInfo: 'Trợ cấp, có cơ hội được nhận chính thức sau thực tập',
    salaryMin: 3000000,
    salaryMax: 5000000,
  },
  {
    id: 2,
    name: 'Java Developer',
    endDate: new Date(
      new Date().getTime() + 15 * 24 * 60 * 60 * 1000
    ).toISOString(), // 15 days from now
    amount: 3,
    location: 'Hà Nội',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 3, name: 'Backend Developer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [{ id: 1, name: 'Computer Science' }],
    description: 'Java Developer với kinh nghiệm 1-2 năm',
    requirement: 'Có kinh nghiệm với Java, Spring Boot, và RESTful APIs',
    otherInfo: 'Lương thưởng hấp dẫn, môi trường làm việc năng động',
    salaryMin: 15000000,
    salaryMax: 25000000,
  },
  {
    id: 3,
    name: 'Business Analyst',
    endDate: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(), // 5 days ago (expired)
    amount: 2,
    location: 'Đà Nẵng',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 4, name: 'Business Analyst' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 3, name: 'Business' },
      { id: 4, name: 'IT' },
    ],
    description:
      'Business Analyst với khả năng phân tích yêu cầu từ khách hàng',
    requirement:
      'Có kinh nghiệm trong phân tích nghiệp vụ và làm việc với khách hàng',
    otherInfo: 'Chế độ đãi ngộ tốt, cơ hội thăng tiến cao',
    salaryMin: 12000000,
    salaryMax: 18000000,
  },
  {
    id: 4,
    name: 'Mobile Developer (React Native)',
    endDate: new Date(
      new Date().getTime() + 20 * 24 * 60 * 60 * 1000
    ).toISOString(), // 20 days from now
    amount: 1,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 5, name: 'Mobile Developer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 5, name: 'Mobile Development' },
    ],
    description: 'Phát triển ứng dụng di động sử dụng React Native',
    requirement: 'Có kinh nghiệm với React Native và JavaScript/TypeScript',
    otherInfo:
      'Môi trường làm việc chuyên nghiệp, cơ hội học hỏi công nghệ mới',
    salaryMin: 18000000,
    salaryMax: 30000000,
  },
  {
    id: 5,
    name: 'DevOps Engineer',
    endDate: new Date(
      new Date().getTime() + 25 * 24 * 60 * 60 * 1000
    ).toISOString(), // 25 days from now
    amount: 2,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 6, name: 'DevOps Engineer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 6, name: 'System Administration' },
    ],
    description: 'Tham gia vào quy trình CI/CD và quản lý hạ tầng',
    requirement:
      'Kinh nghiệm với Docker, Kubernetes, AWS/GCP và các công cụ CI/CD',
    otherInfo: 'Cơ hội làm việc với công nghệ hiện đại, chế độ đãi ngộ hấp dẫn',
    salaryMin: 25000000,
    salaryMax: 40000000,
  },
];

export default function DemoHRJobs() {
  // Local state
  const [jobs, setJobs] = useState(DEMO_JOBS);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  // Duplicate modal state
  const [duplicateModalState, setDuplicateModalState] = useState<{
    isOpen: boolean;
    jobId: number | null;
    jobTitle: string;
  }>({
    isOpen: false,
    jobId: null,
    jobTitle: '',
  });

  // Job posting modal state
  const [isPostingModalOpen, setIsPostingModalOpen] = useState(false);

  // Calculate stats
  const totalJobs = jobs.length;
  const currentDate = new Date();
  const openJobs = jobs.filter(
    (job) => new Date(job.endDate) >= currentDate
  ).length;
  const closedJobs = jobs.filter(
    (job) => new Date(job.endDate) < currentDate
  ).length;

  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalJobs / itemsPerPage);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle job search
  const handleSearch = useCallback(() => {
    // Filter jobs based on search criteria
    const filteredJobs = DEMO_JOBS.filter((job) => {
      const matchesName = searchTerm
        ? job.name.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesLocation = selectedLocation
        ? job.location === selectedLocation
        : true;
      return matchesName && matchesLocation;
    });

    setJobs(filteredJobs);
    setCurrentPage(1); // Reset to first page when applying new filters
  }, [searchTerm, selectedLocation]);

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

  // Open duplicate modal
  const openDuplicateModal = (jobId: number, jobTitle: string) => {
    setDuplicateModalState({
      isOpen: true,
      jobId,
      jobTitle,
    });
  };

  // Close duplicate modal
  const closeDuplicateModal = () => {
    setDuplicateModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Close modal
  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // Handle job action confirmation (demo)
  const handleJobAction = async () => {
    if (!modalState.jobId) return;

    setIsLoading(true);

    try {
      const { jobId, actionType } = modalState;

      // Demo actions - just show success messages and update UI accordingly
      switch (actionType) {
        case 'delete':
          setJobs(jobs.filter((job) => job.id !== jobId));
          showSuccess('Xóa tin tuyển dụng thành công');
          break;
        case 'close':
          // Mark job as closed by changing its end date to yesterday
          setJobs(
            jobs.map((job) => {
              if (job.id === jobId) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                return { ...job, endDate: yesterday.toISOString() };
              }
              return job;
            })
          );
          showSuccess('Đóng tin tuyển dụng thành công');
          break;
        case 'reopen':
          // Reopen job by extending end date by 30 days from now
          setJobs(
            jobs.map((job) => {
              if (job.id === jobId) {
                const thirtyDaysLater = new Date();
                thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
                return { ...job, endDate: thirtyDaysLater.toISOString() };
              }
              return job;
            })
          );
          showSuccess('Mở lại tin tuyển dụng thành công');
          break;
        default:
          break;
      }

      closeModal();
    } catch (error) {
      showError(`Thao tác thất bại`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle job duplication (demo)
  const handleDuplicateJob = async () => {
    if (!duplicateModalState.jobId) return;

    setIsLoading(true);

    try {
      // Find the job to duplicate
      const jobToDuplicate = jobs.find(
        (job) => job.id === duplicateModalState.jobId
      );

      if (jobToDuplicate) {
        // Create a new job with incremented ID and "(Copy)" in the name
        const newJobId = Math.max(...jobs.map((job) => job.id)) + 1;
        const newJob = {
          ...jobToDuplicate,
          id: newJobId,
          name: `${jobToDuplicate.name} (Copy)`,
          // Set end date to 30 days from now
          endDate: new Date(
            new Date().getTime() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        setJobs([...jobs, newJob]);
        showSuccess('Nhân bản tin tuyển dụng thành công');
      }

      closeDuplicateModal();
    } catch (error) {
      showError('Nhân bản tin tuyển dụng thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  // Current page jobs
  const currentJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header section */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý tin tuyển dụng</h1>
        <div className='flex gap-4'>
          <Link
            to='/demo/hr/jobs/expired'
            className='px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors'
          >
            Tin hết hạn
          </Link>
          <button
            onClick={() => setIsPostingModalOpen(true)}
            className='px-4 py-2 bg-[#F9CA63] hover:bg-[#F0BD4F] text-gray-900 rounded flex items-center font-medium transition-colors'
          >
            <IoAddOutline className='mr-2' />
            Đăng tin tuyển dụng
          </button>
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
            {currentJobs.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className='px-6 py-10 text-center text-gray-500'
                >
                  Không có tin tuyển dụng nào
                </td>
              </tr>
            ) : (
              currentJobs.map((job, index) => {
                const isExpired = new Date(job.endDate) < currentDate;
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
                            to={`/demo/hr/jobs/${job.id}`}
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
                        Nguyễn Văn Demo
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
                          to={`/demo/hr/jobs/edit/${job.id}`}
                          className='px-2 py-1 text-xs border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'
                        >
                          Chỉnh sửa
                        </Link>

                        <button
                          onClick={() => openDuplicateModal(job.id, job.name)}
                          className='px-2 py-1 text-xs border border-[#6366F1] text-[#6366F1] rounded hover:bg-[#6366F1] hover:text-white transition-colors flex items-center'
                        >
                          <IoDuplicateOutline className='mr-1' />
                          Nhân bản
                        </button>

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
        isLoading={isLoading}
      />

      {/* Duplicate Job Modal */}
      <DuplicateJobModal
        isOpen={duplicateModalState.isOpen}
        onClose={closeDuplicateModal}
        onConfirm={handleDuplicateJob}
        jobTitle={duplicateModalState.jobTitle}
        isLoading={isLoading}
      />

      {/* Job Posting Type Modal */}
      <JobPostingTypeModal
        isOpen={isPostingModalOpen}
        onClose={() => setIsPostingModalOpen(false)}
        onRegularPost={() => {
          setIsPostingModalOpen(false);
          window.location.href = '/demo/hr/jobs/create';
        }}
        onExcelPost={() => {
          setIsPostingModalOpen(false);
          window.location.href = '/demo/hr/jobs/excel-upload';
        }}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
