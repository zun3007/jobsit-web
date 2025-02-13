import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useAppDispatch } from '@/app/store';
import { setFilters } from '@/features/jobs/jobSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';
import { IoSearch } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';
import { IoChevronUpOutline, IoChevronDownOutline } from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';

export default function GuestHome() {
  const dispatch = useAppDispatch();
  const { jobs, isLoading } = useJobs();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Collapse states
  const [workTypeCollapsed, setWorkTypeCollapsed] = useState(false);
  const [positionCollapsed, setPositionCollapsed] = useState(false);
  const [majorCollapsed, setMajorCollapsed] = useState(false);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);

  const handleSearch = () => {
    dispatch(
      setFilters({
        name: searchTerm,
        provinceName: location,
        schedule:
          selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
        position:
          selectedPositions.length > 0
            ? selectedPositions.join(',')
            : undefined,
        major: selectedMajors.length > 0 ? selectedMajors.join(',') : undefined,
      })
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Main Content */}
      <div className='container mx-auto py-8 px-4'>
        <div className='flex gap-8'>
          {/* Filters */}
          <div className='w-[300px] space-y-4'>
            {/* Work Type Filter */}
            <div className='bg-white rounded-lg border border-[#DEDEDE]'>
              <button
                onClick={() => setWorkTypeCollapsed(!workTypeCollapsed)}
                className='w-full px-6 py-4 flex items-center justify-between text-left'
              >
                <span className='font-medium text-[#00B074]'>
                  Hình thức làm việc
                </span>
                {workTypeCollapsed ? (
                  <IoChevronDownOutline className='w-5 h-5 text-[#00B074]' />
                ) : (
                  <IoChevronUpOutline className='w-5 h-5 text-[#00B074]' />
                )}
              </button>
              {!workTypeCollapsed && (
                <div className='px-6 pb-4 space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedTypes.includes('Full time')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 'Full time']);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((type) => type !== 'Full time')
                          );
                        }
                      }}
                    />
                    <span>Full time</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedTypes.includes('Part time')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 'Part time']);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((type) => type !== 'Part time')
                          );
                        }
                      }}
                    />
                    <span>Part time</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedTypes.includes('Remote')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 'Remote']);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((type) => type !== 'Remote')
                          );
                        }
                      }}
                    />
                    <span>Remote</span>
                  </label>
                </div>
              )}
            </div>

            {/* Position Filter */}
            <div className='bg-white rounded-lg border border-[#DEDEDE]'>
              <button
                onClick={() => setPositionCollapsed(!positionCollapsed)}
                className='w-full px-6 py-4 flex items-center justify-between text-left'
              >
                <span className='font-medium text-[#00B074]'>
                  Vị trí làm việc
                </span>
                {positionCollapsed ? (
                  <IoChevronDownOutline className='w-5 h-5 text-[#00B074]' />
                ) : (
                  <IoChevronUpOutline className='w-5 h-5 text-[#00B074]' />
                )}
              </button>
              {!positionCollapsed && (
                <div className='px-6 pb-4 space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedPositions.includes('Front end')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([
                            ...selectedPositions,
                            'Front end',
                          ]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter(
                              (pos) => pos !== 'Front end'
                            )
                          );
                        }
                      }}
                    />
                    <span>Front end</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedPositions.includes('Back end')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([
                            ...selectedPositions,
                            'Back end',
                          ]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter(
                              (pos) => pos !== 'Back end'
                            )
                          );
                        }
                      }}
                    />
                    <span>Back end</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedPositions.includes('Fullstack')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([
                            ...selectedPositions,
                            'Fullstack',
                          ]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter(
                              (pos) => pos !== 'Fullstack'
                            )
                          );
                        }
                      }}
                    />
                    <span>Fullstack</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedPositions.includes('Mobile')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([
                            ...selectedPositions,
                            'Mobile',
                          ]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter((pos) => pos !== 'Mobile')
                          );
                        }
                      }}
                    />
                    <span>Mobile</span>
                  </label>
                </div>
              )}
            </div>

            {/* Major Filter */}
            <div className='bg-white rounded-lg border border-[#DEDEDE]'>
              <button
                onClick={() => setMajorCollapsed(!majorCollapsed)}
                className='w-full px-6 py-4 flex items-center justify-between text-left'
              >
                <span className='font-medium text-[#00B074]'>Chuyên ngành</span>
                {majorCollapsed ? (
                  <IoChevronDownOutline className='w-5 h-5 text-[#00B074]' />
                ) : (
                  <IoChevronUpOutline className='w-5 h-5 text-[#00B074]' />
                )}
              </button>
              {!majorCollapsed && (
                <div className='px-6 pb-4 space-y-2'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedMajors.includes('Khoa học máy tính')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([
                            ...selectedMajors,
                            'Khoa học máy tính',
                          ]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter(
                              (major) => major !== 'Khoa học máy tính'
                            )
                          );
                        }
                      }}
                    />
                    <span>Khoa học máy tính</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedMajors.includes('Công nghệ phần mềm')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([
                            ...selectedMajors,
                            'Công nghệ phần mềm',
                          ]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter(
                              (major) => major !== 'Công nghệ phần mềm'
                            )
                          );
                        }
                      }}
                    />
                    <span>Công nghệ phần mềm</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedMajors.includes('Kỹ thuật máy tính')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([
                            ...selectedMajors,
                            'Kỹ thuật máy tính',
                          ]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter(
                              (major) => major !== 'Kỹ thuật máy tính'
                            )
                          );
                        }
                      }}
                    />
                    <span>Kỹ thuật máy tính</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Jobs List with Search */}
          <div className='flex-1'>
            {/* Search Box */}
            <div className='bg-white rounded-lg p-4 border border-[#DEDEDE] mb-6'>
              <div className='flex gap-4'>
                <div className='flex-1 relative'>
                  <IoSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00B074] w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Tìm kiếm việc làm'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
                  />
                </div>
                <div className='flex-1 relative'>
                  <IoLocationOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00B074] w-5 h-5' />
                  <input
                    type='text'
                    placeholder='Khu vực'
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074]'
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className='px-8 py-2 bg-[#FFB800] text-white rounded hover:bg-[#F0AE00] transition-colors whitespace-nowrap font-medium'
                >
                  Tìm kiếm
                </button>
              </div>
            </div>

            {/* Jobs List */}
            <div className='space-y-4'>
              {jobs.map((job) => (
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
                        src={job.companyDTO.logo || '/company-placeholder.png'}
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
                        {/* <span className='text-sm text-gray-500'>•</span> */}
                        <span className='text-sm text-gray-500'>
                          {job.scheduleDTOs.map((s) => s.name).join(', ')}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {job.majorDTOs.map((major) => (
                          <span
                            key={major.id}
                            className='px-3 py-1 text-xs bg-[#E6F6F1] text-[#00B074] rounded'
                          >
                            {major.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Side Info */}
                    <div className='flex flex-col items-end justify-between'>
                      <SaveButton onToggle={() => setShowAuthModal(true)} />
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
