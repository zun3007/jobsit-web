import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';
import {
  IoSearchOutline,
  IoLocationOutline,
  IoGlobeOutline,
  IoMailOutline,
  IoPeopleOutline,
  IoChevronBack,
  IoChevronForward,
  IoTime,
  IoChevronDown,
} from 'react-icons/io5';
import { useSaveJob } from '@/hooks/useSaveJob';
import { useAppSelector } from '@/app/store';
import { useToast } from '@/hooks/useToast';
import { AxiosError } from 'axios';
import ApplicationModal from '@/components/application/ApplicationModal';
import { useCandidates } from '@/hooks/useCandidates';

export default function JobDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'overview'>('details');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const { saveJob, unsaveJob, isSaving } = useSaveJob();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { showError } = useToast();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const { profile } = useCandidates();

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJob(Number(id)),
    enabled: !!id,
  });

  // Get active jobs for the company
  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['company-jobs', job?.companyDTO.id, currentPage],
    queryFn: async () => {
      const response = await jobService.getActiveJobsByCompany(
        Number(job?.companyDTO.id)
      );
      return {
        jobs: response.contents,
        totalItems: response.totalItems,
        totalPages: Math.ceil(response.totalItems / ITEMS_PER_PAGE),
      };
    },
    enabled: !!job?.companyDTO.id,
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
    setShowApplicationModal(true);
  };

  const formatBulletPoints = (text: string) => {
    if (!text) return '';
    // Split by bullet points and filter out empty strings
    const points = text.split('•').filter((point) => point.trim());
    // If no bullet points found, return original text
    if (points.length <= 1) return text;

    // Create HTML with line breaks and bullet points
    return points.map((point) => `• ${point.trim()}`).join('\n');
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (searchTerm) searchParams.set('search', searchTerm);
    if (searchLocation) searchParams.set('location', searchLocation);
    navigate(`/?${searchParams.toString()}`);
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
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message || 'Đã xảy ra lỗi khi lưu công việc'
        );
      } else {
        showError('Đã xảy ra lỗi khi lưu công việc');
      }
    }
  };

  if (isLoading || !job) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Search Bar */}
      <div className='py-4'>
        <div className='container mx-auto px-4'>
          <div className='flex gap-4 items-center'>
            <div className='flex-1 flex gap-4'>
              {/* Job Search Input */}
              <div className='relative w-full'>
                <IoSearchOutline className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B074]' />
                <input
                  type='text'
                  placeholder='Tìm kiếm việc làm'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full pl-12 pr-4 py-2.5 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
                />
              </div>
              {/* Location Input */}
              <div className='relative w-full'>
                <IoLocationOutline className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00B074] pointer-events-none z-10' />
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className='w-full pl-12 pr-4 py-2.5 border text-slate-400 font-light border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074] appearance-none bg-white cursor-pointer'
                  aria-label='Chọn khu vực'
                >
                  <option value=''>Khu vực</option>
                  <option value='Hà Nội'>Hà Nội</option>
                  <option value='Hồ Chí Minh'>Hồ Chí Minh</option>
                  <option value='Đà Nẵng'>Đà Nẵng</option>
                  <option value='An Giang'>An Giang</option>
                  <option value='Bà Rịa - Vũng Tàu'>Bà Rịa - Vũng Tàu</option>
                  <option value='Bắc Giang'>Bắc Giang</option>
                  <option value='Bắc Kạn'>Bắc Kạn</option>
                  <option value='Bạc Liêu'>Bạc Liêu</option>
                  <option value='Bắc Ninh'>Bắc Ninh</option>
                  <option value='Bến Tre'>Bến Tre</option>
                  <option value='Bình Định'>Bình Định</option>
                  <option value='Bình Dương'>Bình Dương</option>
                  <option value='Bình Phước'>Bình Phước</option>
                  <option value='Bình Thuận'>Bình Thuận</option>
                  <option value='Cà Mau'>Cà Mau</option>
                  <option value='Cần Thơ'>Cần Thơ</option>
                  <option value='Cao Bằng'>Cao Bằng</option>
                  <option value='Đắk Lắk'>Đắk Lắk</option>
                  <option value='Đắk Nông'>Đắk Nông</option>
                  <option value='Điện Biên'>Điện Biên</option>
                  <option value='Đồng Nai'>Đồng Nai</option>
                  <option value='Đồng Tháp'>Đồng Tháp</option>
                  <option value='Gia Lai'>Gia Lai</option>
                  <option value='Hà Giang'>Hà Giang</option>
                  <option value='Hà Nam'>Hà Nam</option>
                  <option value='Hà Tĩnh'>Hà Tĩnh</option>
                  <option value='Hải Dương'>Hải Dương</option>
                  <option value='Hải Phòng'>Hải Phòng</option>
                  <option value='Hậu Giang'>Hậu Giang</option>
                  <option value='Hòa Bình'>Hòa Bình</option>
                  <option value='Hưng Yên'>Hưng Yên</option>
                  <option value='Khánh Hòa'>Khánh Hòa</option>
                  <option value='Kiên Giang'>Kiên Giang</option>
                  <option value='Kon Tum'>Kon Tum</option>
                  <option value='Lai Châu'>Lai Châu</option>
                  <option value='Lâm Đồng'>Lâm Đồng</option>
                  <option value='Lạng Sơn'>Lạng Sơn</option>
                  <option value='Lào Cai'>Lào Cai</option>
                  <option value='Long An'>Long An</option>
                  <option value='Nam Định'>Nam Định</option>
                  <option value='Nghệ An'>Nghệ An</option>
                  <option value='Ninh Bình'>Ninh Bình</option>
                  <option value='Ninh Thuận'>Ninh Thuận</option>
                  <option value='Phú Thọ'>Phú Thọ</option>
                  <option value='Phú Yên'>Phú Yên</option>
                  <option value='Quảng Bình'>Quảng Bình</option>
                  <option value='Quảng Nam'>Quảng Nam</option>
                  <option value='Quảng Ngãi'>Quảng Ngãi</option>
                  <option value='Quảng Ninh'>Quảng Ninh</option>
                  <option value='Quảng Trị'>Quảng Trị</option>
                  <option value='Sóc Trăng'>Sóc Trăng</option>
                  <option value='Sơn La'>Sơn La</option>
                  <option value='Tây Ninh'>Tây Ninh</option>
                  <option value='Thái Bình'>Thái Bình</option>
                  <option value='Thái Nguyên'>Thái Nguyên</option>
                  <option value='Thanh Hóa'>Thanh Hóa</option>
                  <option value='Thừa Thiên Huế'>Thừa Thiên Huế</option>
                  <option value='Tiền Giang'>Tiền Giang</option>
                  <option value='Trà Vinh'>Trà Vinh</option>
                  <option value='Tuyên Quang'>Tuyên Quang</option>
                  <option value='Vĩnh Long'>Vĩnh Long</option>
                  <option value='Vĩnh Phúc'>Vĩnh Phúc</option>
                  <option value='Yên Bái'>Yên Bái</option>
                </select>
                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <IoChevronDown className='w-4 h-4 text-gray-400' />
                </div>
              </div>
            </div>
            {/* Search Button */}
            <button
              onClick={handleSearch}
              className='px-8 py-2.5 bg-[#00B074] text-white rounded hover:bg-[#00915F] font-medium min-w-[120px]'
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      <div className='py-8'>
        <div className='container mx-auto px-4'>
          <div className='border border-[#00B074] rounded-lg'>
            {/* Job Header */}
            <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] mb-6'>
              <div className='flex justify-between'>
                {/* Left Side - Job Info */}
                <div className='flex gap-6'>
                  {/* Company Logo */}
                  <Link
                    to={`/companies/${job.companyDTO.id}`}
                    className='w-[92px] h-[92px] border border-[#DEDEDE] rounded-lg overflow-hidden flex-shrink-0'
                  >
                    <img
                      src={job.companyDTO.logo || '/company_logo_temp.svg'}
                      alt={job.companyDTO.name}
                      className='w-full h-full object-contain p-2'
                    />
                  </Link>

                  {/* Job Info */}
                  <div>
                    <h1 className='text-xl font-semibold text-[#00B074] mb-1'>
                      {job.name}
                    </h1>
                    <a className='text-base text-gray-900 block mb-2'>
                      {job.companyDTO.name}
                    </a>
                    <div className='flex items-center gap-1 text-gray-500'>
                      <IoLocationOutline className='w-4 h-4' />
                      <span className='text-sm'>
                        {job.location.split(',').pop()?.trim()}
                      </span>
                    </div>
                    <div className='flex gap-2 mt-3'>
                      {job.positionDTOs.map((pos) => (
                        <span
                          key={pos.id}
                          className='px-3 py-1 bg-gray-100 rounded text-sm text-gray-600'
                        >
                          {pos.name}
                        </span>
                      ))}
                      {job.scheduleDTOs.map((schedule) => (
                        <span
                          key={schedule.id}
                          className='px-3 py-1 bg-gray-100 rounded text-sm text-gray-600'
                        >
                          {schedule.name}
                        </span>
                      ))}
                      {job.majorDTOs.map((major) => (
                        <span
                          key={major.id}
                          className='px-3 py-1 bg-gray-100 rounded text-sm text-gray-600'
                        >
                          {major.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Buttons */}
                <div className='flex flex-col gap-2'>
                  <button
                    onClick={handleApplyJob}
                    className='px-8 py-2 bg-[#00B074] text-white rounded hover:bg-[#00915F] font-medium whitespace-nowrap'
                  >
                    ỨNG TUYỂN NGAY
                  </button>
                  <SaveButton
                    jobId={job.id}
                    onToggle={(saved) => handleSaveJob(job.id, saved)}
                    isLoading={isSaving}
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className='border-b border-[#DEDEDE] mb-6'>
              <div className='flex gap-8 px-6'>
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

            {/* Content based on active tab */}
            {activeTab === 'details' ? (
              <div className='mx-6 mb-6 flex flex-col lg:flex-row gap-6'>
                {/* Left Column - Job Details */}
                <div className='flex-1 space-y-6'>
                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>Mô tả công việc</h2>
                    <div
                      className='prose max-w-none text-gray-700 whitespace-pre-line'
                      dangerouslySetInnerHTML={{
                        __html: formatBulletPoints(job.description),
                      }}
                    />
                  </div>

                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Yêu cầu công việc
                    </h2>
                    <div
                      className='prose max-w-none text-gray-700 whitespace-pre-line'
                      dangerouslySetInnerHTML={{
                        __html: formatBulletPoints(job.requirement),
                      }}
                    />
                  </div>

                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>Chế độ phúc lợi</h2>
                    <div
                      className='prose max-w-none text-gray-700 whitespace-pre-line'
                      dangerouslySetInnerHTML={{
                        __html: formatBulletPoints(job.otherInfo),
                      }}
                    />
                  </div>

                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Địa điểm làm việc
                    </h2>
                    <div className='flex items-center gap-2 text-gray-700'>
                      <IoLocationOutline className='w-5 h-5 text-[#00B074]' />
                      <span>{job.location}</span>
                    </div>
                  </div>

                  <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                    <h2 className='text-xl font-bold mb-4'>
                      Cách thức ứng tuyển
                    </h2>
                    <div className='space-y-4'>
                      <p className='text-gray-700'>
                        Ứng viên nộp hồ sơ trực tuyến bằng cách bấm nút{' '}
                        <span className='text-[#00B074] font-medium'>
                          ỨNG TUYỂN NGAY
                        </span>{' '}
                        dưới đây.
                      </p>
                      <div className='flex max-w-[60%] gap-4'>
                        <button
                          onClick={handleApplyJob}
                          className='flex-1 px-1 sm:px-1 py-1.5 sm:py-2 bg-[#00B074] text-white rounded hover:bg-[#00915F] font-medium text-sm sm:text-base w-[50%]'
                        >
                          ỨNG TUYỂN NGAY
                        </button>
                        <SaveButton
                          jobId={job.id}
                          onToggle={(saved) => handleSaveJob(job.id, saved)}
                          isLoading={isSaving}
                        />
                      </div>
                      <div className='text-slate-900'>
                        Hạn nộp hồ sơ:{' '}
                        {new Date(job.endDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Application Info Card */}
                <div className='w-full lg:w-[400px] flex-shrink-0'>
                  <div className='bg-[#88D498]/[0.16] border border-[#00B074] rounded-[3px] lg:sticky lg:top-24'>
                    <div className='space-y-6 p-6'>
                      {/* Position */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoPeopleOutline className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>
                            Vị trí làm việc
                          </div>
                          <div className='font-medium text-[15px]'>
                            {job.positionDTOs[0]?.name || 'Front end'}
                          </div>
                        </div>
                      </div>

                      {/* Schedule */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoTime className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>
                            Hình thức làm việc
                          </div>
                          <div className='font-medium text-[15px]'>
                            {job.scheduleDTOs[0]?.name ||
                              'Full time / Part time'}
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoPeopleOutline className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>
                            Số lượng cần tuyển
                          </div>
                          <div className='font-medium text-[15px]'>
                            {job.amount} người
                          </div>
                        </div>
                      </div>

                      {/* Salary */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoLocationOutline className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>Trợ cấp</div>
                          <div className='font-medium text-[15px]'>
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                              maximumFractionDigits: 0,
                            }).format(job.salaryMin)}{' '}
                            -{' '}
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                              maximumFractionDigits: 0,
                            }).format(job.salaryMax)}
                          </div>
                        </div>
                      </div>

                      {/* Post Date */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoTime className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>
                            Ngày đăng tuyển
                          </div>
                          <div className='font-medium text-[15px]'>
                            {new Date(job.startDate).toLocaleDateString(
                              'vi-VN'
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Deadline */}
                      <div className='flex items-center gap-4'>
                        <div className='w-12 h-12 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                          <IoTime className='w-6 h-6 text-[#00B074]' />
                        </div>
                        <div>
                          <div className='text-[#7D7D7D] text-sm'>
                            Hạn nộp hồ sơ
                          </div>
                          <div className='font-medium text-[15px]'>
                            {new Date(job.endDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-6 mx-6 mb-6'>
                {/* Description and Info */}
                <div className='flex gap-6'>
                  {/* Left Column - Company Description */}
                  <div className='flex-1'>
                    <div className='bg-white rounded-lg border border-[#DEDEDE] p-6'>
                      <h2 className='text-xl font-bold mb-4'>
                        Giới thiệu về {job.companyDTO.name}
                      </h2>
                      <div
                        className='prose max-w-none text-gray-700'
                        dangerouslySetInnerHTML={{
                          __html: job.companyDTO.description,
                        }}
                      />
                    </div>
                  </div>

                  {/* Right Column - Company Info */}
                  <div className='w-[400px] flex-shrink-0'>
                    <div className='border border-[#00B074] rounded-lg'>
                      {/* Company Image */}
                      <div className='p-6 border-b border-[#DEDEDE]'>
                        <img
                          src={job.companyDTO.logo || '/company_logo_temp.svg'}
                          alt={job.companyDTO.name}
                          className='w-full aspect-square object-contain'
                        />
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
                              href={job.companyDTO.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-[#00B074] hover:underline'
                            >
                              {job.companyDTO.website?.replace(
                                /^https?:\/\//,
                                ''
                              )}
                            </a>
                          </div>
                        </div>
                        <div className='px-6 py-4 flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                            <IoMailOutline className='w-5 h-5 text-[#00B074]' />
                          </div>
                          <div>
                            <div className='text-gray-500'>Email</div>
                            <div>{job.companyDTO.email}</div>
                          </div>
                        </div>
                        <div className='px-6 py-4 flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-[#E6F6F1] flex items-center justify-center flex-shrink-0'>
                            <IoPeopleOutline className='w-5 h-5 text-[#00B074]' />
                          </div>
                          <div>
                            <div className='text-gray-500'>Quy mô</div>
                            <div>{job.companyDTO.personnelSize}</div>
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
                    <span>{job.companyDTO.location}</span>
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
                        {jobsData?.jobs.map((otherJob) => (
                          <div
                            key={otherJob.id}
                            className='bg-white rounded border border-[#DEDEDE] p-4 hover:shadow-sm transition-shadow'
                          >
                            <div className='flex gap-4'>
                              {/* Company Logo */}
                              <div className='w-[60px] h-[60px] flex-shrink-0'>
                                <img
                                  src={
                                    job.companyDTO.logo ||
                                    '/company_logo_temp.svg'
                                  }
                                  alt={job.companyDTO.name}
                                  className='w-full h-full object-contain'
                                />
                              </div>

                              {/* Job Info */}
                              <div className='flex-1 min-w-0'>
                                {/* Title and Save Button */}
                                <div className='flex justify-between items-start gap-2'>
                                  <div className='min-w-0'>
                                    <h3 className='text-[#00B074] font-medium hover:text-[#00915F] truncate'>
                                      {otherJob.name}
                                    </h3>
                                    <p className='text-sm text-gray-500 mt-0.5'>
                                      {otherJob.companyDTO.name}
                                    </p>
                                  </div>
                                  <SaveButton
                                    jobId={otherJob.id}
                                    onToggle={(saved) =>
                                      handleSaveJob(otherJob.id, saved)
                                    }
                                    isLoading={isSaving}
                                  />
                                </div>

                                {/* Tags */}
                                <div className='flex flex-wrap gap-1.5 mt-2'>
                                  {otherJob.positionDTOs.map((position) => (
                                    <span
                                      key={position.id}
                                      className='px-3 py-1 bg-[#F8F9FA] text-gray-600 text-xs rounded'
                                    >
                                      {position.name}
                                    </span>
                                  ))}
                                  {otherJob.scheduleDTOs.map((schedule) => (
                                    <span
                                      key={schedule.id}
                                      className='px-3 py-1 bg-[#F8F9FA] text-gray-600 text-xs rounded'
                                    >
                                      {schedule.name}
                                    </span>
                                  ))}
                                  {otherJob.majorDTOs.map((major) => (
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
                                    <span>Số lượng: {otherJob.amount}</span>
                                  </div>
                                  <div>
                                    <div className='flex items-center gap-1 text-xs text-gray-500'>
                                      <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                                      <span>
                                        {otherJob.location
                                          .split(',')
                                          .pop()
                                          ?.trim()}
                                      </span>
                                    </div>
                                    <div className='flex items-center gap-1 mt-1 text-xs text-gray-500'>
                                      <IoTime className='w-4 h-4 text-[#00B074]' />
                                      <span>
                                        {new Date(
                                          otherJob.startDate
                                        ).toLocaleDateString('vi-VN')}{' '}
                                        -{' '}
                                        {new Date(
                                          otherJob.endDate
                                        ).toLocaleDateString('vi-VN')}
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
                      {(jobsData?.totalPages || 0) > 1 && (
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
                            disabled={
                              currentPage === (jobsData?.totalPages || 0)
                            }
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
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <RequireAuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          jobId={Number(id)}
          onClose={() => setShowApplicationModal(false)}
          defaultCV={profile?.candidateOtherInfoDTO?.cv}
          defaultReferenceLetter={
            profile?.candidateOtherInfoDTO?.referenceLetter
          }
        />
      )}
    </div>
  );
}
