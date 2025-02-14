import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/store';
import { companyService } from '@/services/companyService';
import { jobService } from '@/services/jobService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';
import {
  IoLocationOutline,
  IoGlobeOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoSearchOutline,
  IoLocationSharp,
  IoChevronBack,
  IoChevronForward,
  IoTime,
} from 'react-icons/io5';
import { useSaveJob } from '@/hooks/useSaveJob';
import { useToast } from '@/hooks/useToast';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { saveJob, unsaveJob } = useSaveJob();
  const { showError } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'overview'>('details');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(Number(id)),
    enabled: !!id,
  });

  const { data: savedJobs } = useQuery({
    queryKey: ['saved-jobs'],
    queryFn: () => jobService.getSavedJobs(),
    enabled: isAuthenticated,
  });

  // Update to use the real jobs data with pagination
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['company-jobs', id, currentPage],
    queryFn: async () => {
      const response = await jobService.getActiveJobsByCompany(Number(id));
      return {
        jobs: response.contents,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / ITEMS_PER_PAGE),
      };
    },
    enabled: !!id,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document
      .getElementById('available-jobs')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApplyJob = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    // Handle job application for authenticated users
  };

  const handleSaveJob = async (jobId: number, isSaved: boolean) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    try {
      if (isSaved) {
        await saveJob(jobId);
      } else {
        await unsaveJob(jobId);
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const extractCity = (location: string) => {
    const parts = location.split(',').map((part) => part.trim());
    // Get the last part which should be the city
    return parts[parts.length - 1];
  };

  if (isLoadingCompany || !company) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Search Bar */}
      <div className='bg-white border-b border-[#DEDEDE] py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex gap-4 items-center'>
            <div className='flex-1 flex gap-4'>
              {/* Job Search Input */}
              <div className='relative w-full'>
                <IoSearchOutline className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B074]' />
                <input
                  type='text'
                  placeholder='Tìm kiếm việc làm'
                  className='w-full pl-12 pr-4 py-2.5 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
                />
              </div>
              {/* Location Input */}
              <div className='relative w-full'>
                <IoLocationSharp className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B074]' />
                <input
                  type='text'
                  placeholder='Địa điểm'
                  className='w-full pl-12 pr-4 py-2.5 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
                />
              </div>
            </div>
            {/* Search Button */}
            <button className='px-8 py-2.5 bg-[#00B074] text-white rounded hover:bg-[#00915F] font-medium min-w-[120px]'>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <div className='border border-[#00B074] rounded-lg p-6'>
          {/* Company Card */}
          <div className='bg-white rounded-lg border border-[#DEDEDE] p-6 mb-6'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
              {/* Logo */}
              <div className='w-[140px] h-[140px] flex-shrink-0'>
                <img
                  src={company.logo || '/company-placeholder.png'}
                  alt={company.name}
                  className='w-full h-full object-contain rounded'
                />
              </div>

              {/* Info */}
              <div className='flex-1'>
                <h1 className='text-2xl md:text-3xl font-bold mb-2'>
                  {company.name}
                </h1>
                <div className='flex items-center gap-2 text-gray-700 mb-4'>
                  <IoLocationOutline className='w-5 h-5 text-[#00B074]' />
                  <span className='text-sm md:text-base'>
                    {company.location}
                  </span>
                </div>

                {/* Tags */}
                <div className='flex flex-wrap gap-2'>
                  {jobsData?.jobs.reduce(
                    (tags, job) => {
                      // Collect unique positions
                      job.positionDTOs.forEach((pos) => {
                        if (!tags.positions.has(pos.name)) {
                          tags.positions.add(pos.name);
                        }
                      });
                      // Collect unique schedules
                      job.scheduleDTOs.forEach((schedule) => {
                        if (!tags.schedules.has(schedule.name)) {
                          tags.schedules.add(schedule.name);
                        }
                      });
                      // Collect unique majors
                      job.majorDTOs.forEach((major) => {
                        if (!tags.majors.has(major.name)) {
                          tags.majors.add(major.name);
                        }
                      });
                      return tags;
                    },
                    {
                      positions: new Set<string>(),
                      schedules: new Set<string>(),
                      majors: new Set<string>(),
                    }
                  )?.positions &&
                    [
                      ...jobsData.jobs.reduce((tags, job) => {
                        job.positionDTOs.forEach((pos) => tags.add(pos.name));
                        job.scheduleDTOs.forEach((schedule) =>
                          tags.add(schedule.name)
                        );
                        job.majorDTOs.forEach((major) => tags.add(major.name));
                        return tags;
                      }, new Set<string>()),
                    ].map((tag) => (
                      <span
                        key={tag}
                        className='px-3 py-1 bg-gray-100 rounded text-sm text-gray-600'
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              {/* Actions */}
              <div className='flex flex-col gap-2 w-full md:w-auto'>
                <button
                  onClick={handleApplyJob}
                  className='px-8 py-2 bg-[#00B074] text-white rounded hover:bg-[#00915F] font-medium'
                >
                  ỨNG TUYỂN NGAY
                </button>
                <SaveButton
                  defaultSaved={savedJobs?.some(
                    (saved) => saved.id === Number(id)
                  )}
                  onToggle={(isSaved) => handleSaveJob(Number(id), isSaved)}
                  className='w-full md:w-auto'
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className='border-b border-[#DEDEDE] mb-6'>
            <div className='flex gap-8'>
              <button
                className={`pb-4 font-medium relative ${
                  activeTab === 'details'
                    ? 'text-[#00B074] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00B074]'
                    : 'text-gray-600 hover:text-[#00B074]'
                }`}
                onClick={() => setActiveTab('details')}
              >
                CHI TIẾT
              </button>
              <button
                className={`pb-4 font-medium relative ${
                  activeTab === 'overview'
                    ? 'text-[#00B074] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#00B074]'
                    : 'text-gray-600 hover:text-[#00B074]'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                TỔNG QUAN CÔNG TY
              </button>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'details' ? (
            <div className='space-y-6'>
              {/* Description and Info */}
              <div className='flex gap-6'>
                {/* Left Column - Company Description */}
                <div className='flex-1'>
                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Giới thiệu về {company.name}
                    </h2>
                    <div
                      className='prose max-w-none text-gray-700'
                      dangerouslySetInnerHTML={{ __html: company.description }}
                    />
                  </div>
                </div>

                {/* Right Column - Company Info & Image */}
                <div className='w-[400px] flex-shrink-0'>
                  <div className='border border-[#00B074] rounded-lg'>
                    {/* Company Image */}
                    <div className='p-6 border-b border-[#DEDEDE]'>
                      <img
                        src={company.logo || '/company-placeholder.png'}
                        alt={company.name}
                        className='w-full aspect-square object-contain'
                      />
                      <div className='text-center text-gray-500 mt-2'>
                        Resource Software Solution
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className='divide-y divide-[#DEDEDE]'>
                      <div className='px-6 py-4 flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoGlobeOutline className='w-5 h-5 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-gray-500'>Website</div>
                          <a
                            href={company.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-[#00B074] hover:underline'
                          >
                            r2s.com.vn
                          </a>
                        </div>
                      </div>
                      <div className='px-6 py-4 flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoMailOutline className='w-5 h-5 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-gray-500'>Email</div>
                          <div>tuyendung@r2s.com</div>
                        </div>
                      </div>
                      <div className='px-6 py-4 flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoPeopleOutline className='w-5 h-5 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-gray-500'>Quy mô</div>
                          <div>30 - 100 người</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Location */}
              <div>
                <h2 className='text-xl font-bold mb-4'>Địa điểm công ty</h2>
                <div className='flex items-center gap-2 text-gray-700'>
                  <IoLocationOutline className='w-5 h-5 text-[#00B074]' />
                  <span>
                    1164 đường Phạm Văn Đồng, P.Linh Đông, TP. Thủ Đức, TP. HCM
                  </span>
                </div>
              </div>

              {/* Jobs Available */}
              <div id='available-jobs'>
                <h2 className='text-xl font-bold mb-4'>
                  Việc làm khác đang tuyển ({jobsData?.totalItems || 0})
                </h2>
                {isLoadingJobs ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <div className='grid grid-cols-2 gap-4'>
                      {jobsData?.jobs.map((job) => (
                        <div
                          key={job.id}
                          className='bg-white rounded border border-[#DEDEDE] p-4 hover:shadow-sm transition-shadow'
                        >
                          <div className='flex gap-4'>
                            {/* Company Logo */}
                            <div className='w-[60px] h-[60px] flex-shrink-0'>
                              <img
                                src={company.logo || '/company-placeholder.png'}
                                alt={company.name}
                                className='w-full h-full object-contain'
                              />
                            </div>

                            {/* Job Info */}
                            <div className='flex-1 min-w-0'>
                              {/* Title and Save Button */}
                              <div className='flex justify-between items-start gap-2'>
                                <div className='min-w-0'>
                                  <h3 className='text-[#00B074] font-medium hover:text-[#00915F] truncate'>
                                    {job.name}
                                  </h3>
                                  <p className='text-sm text-gray-500 mt-0.5'>
                                    {job.companyDTO.name}
                                  </p>
                                </div>
                                <SaveButton
                                  defaultSaved={savedJobs?.some(
                                    (saved) => saved.id === job.id
                                  )}
                                  onToggle={(isSaved) =>
                                    handleSaveJob(job.id, isSaved)
                                  }
                                  className='flex-shrink-0'
                                />
                              </div>

                              {/* Tags */}
                              <div className='flex flex-wrap gap-1.5 mt-2'>
                                {job.positionDTOs.map((position) => (
                                  <span
                                    key={position.id}
                                    className='px-3 py-1 bg-[#F8F9FA] text-gray-600 text-xs rounded'
                                  >
                                    {position.name}
                                  </span>
                                ))}
                                {job.scheduleDTOs.map((schedule) => (
                                  <span
                                    key={schedule.id}
                                    className='px-3 py-1 bg-[#F8F9FA] text-gray-600 text-xs rounded'
                                  >
                                    {schedule.name}
                                  </span>
                                ))}
                                {job.majorDTOs.map((major) => (
                                  <span
                                    key={major.id}
                                    className='px-3 py-1 bg-[#F8F9FA] text-gray-600 text-xs rounded'
                                  >
                                    {major.name}
                                  </span>
                                ))}
                              </div>

                              {/* Bottom Info */}
                              <div className='flex items-center justify-between gap-4 mt-3'>
                                <div className='flex items-center gap-1 text-xs text-gray-500'>
                                  <IoPeopleOutline className='w-4 h-4 text-[#00B074]' />
                                  <span>Số lượng: {job.amount}</span>
                                </div>
                                <div>
                                  <div className='flex items-center gap-1 text-xs text-gray-500'>
                                    <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                                    <span>{extractCity(job.location)}</span>
                                  </div>
                                  <div className='flex items-center gap-1 mt-1 text-xs text-gray-500'>
                                    <IoTime className='w-4 h-4 text-[#00B074]' />
                                    <span>
                                      {new Date(
                                        job.startDate
                                      ).toLocaleDateString('vi-VN')}{' '}
                                      -{' '}
                                      {new Date(job.endDate).toLocaleDateString(
                                        'vi-VN'
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {(jobsData?.totalPages || 0) >= 1 && (
                      <div className='flex justify-center mt-6 gap-2'>
                        <button
                          className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          aria-label='Previous page'
                        >
                          <IoChevronBack className='w-4 h-4' />
                        </button>
                        {Array.from(
                          { length: jobsData?.totalPages || 0 },
                          (_, i) => i + 1
                        ).map((page) => (
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
                        ))}
                        <button
                          className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                          disabled={currentPage === (jobsData?.totalPages || 0)}
                          onClick={() => handlePageChange(currentPage + 1)}
                          aria-label='Next page'
                        >
                          <IoChevronForward className='w-4 h-4' />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
              <h2 className='text-xl font-bold mb-4'>
                Tổng quan về {company.name}
              </h2>
              <div
                className='prose max-w-none text-gray-700'
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <RequireAuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
