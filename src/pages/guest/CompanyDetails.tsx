import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '@/services/companyService';
import { jobService } from '@/services/jobService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';
import { IoSearch } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(Number(id)),
    enabled: !!id,
  });

  const { data: jobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['company-jobs', id],
    queryFn: () => jobService.getCompanyJobs(Number(id)),
    enabled: !!id,
  });

  const handleApplyJob = () => {
    setShowAuthModal(true);
  };

  if (isLoadingCompany || isLoadingJobs || !company) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Company Header */}
      <div className='bg-white border-b border-[#DEDEDE]'>
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='flex gap-6'>
              {/* Company Logo */}
              <div className='w-[120px] h-[120px] border rounded-lg overflow-hidden flex-shrink-0'>
                <img
                  src={company.logo || '/company-placeholder.png'}
                  alt={company.name}
                  className='w-full h-full object-contain p-2'
                />
              </div>

              {/* Company Info */}
              <div className='flex-1'>
                <h1 className='text-2xl font-bold'>{company.name}</h1>
                <div className='flex items-center gap-4 mt-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>Địa điểm:</span>
                    <span>{company.location}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>Quy mô:</span>
                    <span>{company.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Content */}
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-lg p-6 border border-[#DEDEDE] space-y-6 mb-6'>
            <div>
              <h2 className='text-xl font-bold mb-4'>Giới thiệu công ty</h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            </div>

            <div>
              <h2 className='text-xl font-bold mb-4'>Thông tin liên hệ</h2>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Website:</span>
                  <a
                    href={company.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-primary hover:underline'
                  >
                    {company.website}
                  </a>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-gray-500'>Email:</span>
                  <span>{company.email}</span>
                </div>
                {company.phone && (
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-500'>Điện thoại:</span>
                    <span>{company.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Jobs Section */}
          <div className='flex gap-8'>
            {/* Filters */}
            <div className='w-[300px] space-y-6'>
              <div className='bg-white rounded-lg p-6 border border-[#DEDEDE]'>
                <h3 className='font-bold mb-4'>Hình thức làm việc</h3>
                <div className='space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Full time</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Part time</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Remote</span>
                  </label>
                </div>
              </div>

              <div className='bg-white rounded-lg p-6 border border-[#DEDEDE]'>
                <h3 className='font-bold mb-4'>Vị trí làm việc</h3>
                <div className='space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Front end</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Back end</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Fullstack</span>
                  </label>
                </div>
              </div>

              <div className='bg-white rounded-lg p-6 border border-[#DEDEDE]'>
                <h3 className='font-bold mb-4'>Chuyên ngành</h3>
                <div className='space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Khoa học máy tính</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='rounded border-gray-300'
                    />
                    <span>Công nghệ phần mềm</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Jobs List with Search */}
            <div className='flex-1'>
              {/* Search Box */}
              <div className='bg-white rounded-lg p-4 border border-[#DEDEDE] mb-6'>
                <div className='flex gap-4'>
                  <div className='flex-1 relative'>
                    <IoSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      placeholder='Tìm kiếm theo vị trí làm việc'
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-[#DEDEDE] rounded focus:outline-none focus:border-primary'
                    />
                  </div>
                  <div className='flex-1 relative'>
                    <IoLocationOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
                    <input
                      type='text'
                      placeholder='Khu vực'
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className='w-full pl-10 pr-4 py-2 border border-[#DEDEDE] rounded focus:outline-none focus:border-primary'
                    />
                  </div>
                  <button className='px-8 py-2 bg-primary text-white rounded hover:bg-primary-hover whitespace-nowrap'>
                    Tìm kiếm
                  </button>
                </div>
              </div>

              {/* Jobs List */}
              <div className='space-y-4'>
                <h2 className='text-xl font-bold'>Việc làm đang tuyển</h2>
                {jobs?.map((job) => (
                  <div
                    key={job.id}
                    className='bg-white rounded-lg p-6 border border-[#DEDEDE]'
                  >
                    <div className='flex gap-4'>
                      <div className='flex-1'>
                        <Link
                          to={`/jobs/${job.id}`}
                          className='text-lg font-bold hover:text-primary'
                        >
                          {job.name}
                        </Link>
                        <div className='flex items-center gap-2 mt-2'>
                          <span className='text-sm text-gray-500'>
                            {job.location}
                          </span>
                          <span className='text-sm text-gray-500'>•</span>
                          <span className='text-sm text-gray-500'>
                            {job.scheduleDTOs.map((s) => s.name).join(', ')}
                          </span>
                        </div>
                        <div className='flex gap-2 mt-2'>
                          {job.majorDTOs.map((major) => (
                            <span
                              key={major.id}
                              className='px-2 py-1 text-xs bg-gray-100 rounded'
                            >
                              {major.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className='flex flex-col gap-2'>
                        <button
                          onClick={handleApplyJob}
                          className='px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover whitespace-nowrap'
                        >
                          ỨNG TUYỂN NGAY
                        </button>
                        <SaveButton onToggle={() => setShowAuthModal(true)} />
                      </div>
                    </div>
                  </div>
                ))}
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
