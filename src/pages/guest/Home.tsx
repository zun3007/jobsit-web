import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useJobs } from '@/hooks/useJobs';
import { useAppDispatch, useAppSelector } from '@/app/store';
import { setFilters } from '@/features/jobs/jobSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import RequireAuthModal from '@/components/auth/RequireAuthModal';
import { IoSearch } from 'react-icons/io5';
import { IoLocationOutline } from 'react-icons/io5';
import {
  IoChevronUpOutline,
  IoChevronDownOutline,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from 'react-icons/io5';
import { IoPersonOutline } from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import { useSaveJob } from '@/hooks/useSaveJob';

export default function GuestHome() {
  const dispatch = useAppDispatch();
  const { jobs, isLoading, totalJobs } = useJobs();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const filters = useAppSelector((state) => state.filters.jobs);
  const { saveJob, unsaveJob, isSaving } = useSaveJob();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get('search') || ''
  );
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  // Collapse states
  const [workTypeCollapsed, setWorkTypeCollapsed] = useState(false);
  const [positionCollapsed, setPositionCollapsed] = useState(false);
  const [majorCollapsed, setMajorCollapsed] = useState(false);

  // Filter states
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const [selectedPositions, setSelectedPositions] = useState<number[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<number[]>([]);

  // Calculate total pages
  const totalPages = Math.ceil(totalJobs / (filters.limit || 10));

  // Log user role when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('User Information:', {
        email: user.email,
        role: user.role,
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
      });
    }
  }, [isAuthenticated, user]);

  // Update search params when search term or location changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    if (location) {
      params.set('location', location);
    } else {
      params.delete('location');
    }
    setSearchParams(params);
  }, [searchTerm, location, setSearchParams]);

  // Handle search
  const handleSearch = () => {
    // Get the names instead of IDs for the filters
    const scheduleTypes = selectedTypes
      .map((id) => {
        if (id === 1) return 'Full time';
        if (id === 2) return 'Part time';
        if (id === 3) return 'Remote';
        return '';
      })
      .filter(Boolean);

    const positions = selectedPositions
      .map((id) => {
        if (id === 1) return 'Front end';
        if (id === 2) return 'Back end';
        if (id === 3) return 'Full Stack';
        if (id === 7) return 'DevOps';
        return '';
      })
      .filter(Boolean);

    const majors = selectedMajors
      .map((id) => {
        if (id === 1) return 'Khoa học máy tính';
        if (id === 2) return 'Công nghệ phần mềm';
        if (id === 3) return 'Kỹ thuật máy tính';
        if (id === 4) return 'Trí tuệ nhân tạo';
        if (id === 6) return 'Hệ thống quản lý thông tin';
        return '';
      })
      .filter(Boolean);

    // Update filters for job search
    dispatch(
      setFilters({
        name: searchTerm || undefined,
        provinceName: location || undefined,
        schedule:
          scheduleTypes.length > 0 ? scheduleTypes.join(', ') : undefined,
        position: positions.length > 0 ? positions.join(', ') : undefined,
        major: majors.length > 0 ? majors.join(', ') : undefined,
        no: 0, // Reset to first page when searching
        limit: filters.limit, // Preserve the existing limit
      })
    );
  };

  // Add effect to trigger search when location changes
  useEffect(() => {
    handleSearch();
  }, [location, searchTerm]);

  // Perform search when URL parameters change
  useEffect(() => {
    const urlSearchTerm = searchParams.get('search');
    const urlLocation = searchParams.get('location');

    if (urlSearchTerm || urlLocation) {
      setSearchTerm(urlSearchTerm || '');
      setLocation(urlLocation || '');
      dispatch(
        setFilters({
          name: urlSearchTerm || undefined,
          provinceName: urlLocation || undefined,
          schedule:
            selectedTypes.length > 0
              ? selectedTypes
                  .map((id) => {
                    if (id === 1) return 'Full time';
                    if (id === 2) return 'Part time';
                    if (id === 3) return 'Remote';
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
              : undefined,
          position:
            selectedPositions.length > 0
              ? selectedPositions
                  .map((id) => {
                    if (id === 1) return 'Front end';
                    if (id === 2) return 'Back end';
                    if (id === 3) return 'Full Stack';
                    if (id === 7) return 'DevOps';
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
              : undefined,
          major:
            selectedMajors.length > 0
              ? selectedMajors
                  .map((id) => {
                    if (id === 1) return 'Khoa học máy tính';
                    if (id === 2) return 'Công nghệ phần mềm';
                    if (id === 3) return 'Kỹ thuật máy tính';
                    if (id === 4) return 'Trí tuệ nhân tạo';
                    if (id === 6) return 'Hệ thống quản lý thông tin';
                    return '';
                  })
                  .filter(Boolean)
                  .join(', ')
              : undefined,
        })
      );
    }
  }, [searchParams, dispatch]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(
      setFilters({
        ...filters,
        no: page - 1, // API uses 0-based index
      })
    );
  };

  const handleSaveJob = async (jobId: number, isSaved: boolean) => {
    if (!isAuthenticated) {
      navigate('/auth/candidate');
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
    }
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
                      checked={selectedTypes.includes(1)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 1]);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((id) => id !== 1)
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
                      checked={selectedTypes.includes(2)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 2]);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((id) => id !== 2)
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
                      checked={selectedTypes.includes(3)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, 3]);
                        } else {
                          setSelectedTypes(
                            selectedTypes.filter((id) => id !== 3)
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
                      checked={selectedPositions.includes(1)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([...selectedPositions, 1]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter((id) => id !== 1)
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
                      checked={selectedPositions.includes(2)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([...selectedPositions, 2]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter((id) => id !== 2)
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
                      checked={selectedPositions.includes(3)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([...selectedPositions, 3]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter((id) => id !== 3)
                          );
                        }
                      }}
                    />
                    <span>Full Stack</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedPositions.includes(7)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPositions([...selectedPositions, 7]);
                        } else {
                          setSelectedPositions(
                            selectedPositions.filter((id) => id !== 7)
                          );
                        }
                      }}
                    />
                    <span>DevOps</span>
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
                      checked={selectedMajors.includes(1)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([...selectedMajors, 1]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter((id) => id !== 1)
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
                      checked={selectedMajors.includes(2)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([...selectedMajors, 2]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter((id) => id !== 2)
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
                      checked={selectedMajors.includes(3)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([...selectedMajors, 3]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter((id) => id !== 3)
                          );
                        }
                      }}
                    />
                    <span>Kỹ thuật máy tính</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedMajors.includes(4)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([...selectedMajors, 4]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter((id) => id !== 4)
                          );
                        }
                      }}
                    />
                    <span>Trí tuệ nhân tạo</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 appearance-none rounded-md border border-[#00B074] accent-[#00B074] checked:text-white focus:ring-[#00B074] checked:bg-[#00B074] checked:before:content-["✔"] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm checked:before:font-bold checked:before:scale-x-125'
                      checked={selectedMajors.includes(6)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMajors([...selectedMajors, 6]);
                        } else {
                          setSelectedMajors(
                            selectedMajors.filter((id) => id !== 6)
                          );
                        }
                      }}
                    />
                    <span>Hệ thống quản lý thông tin</span>
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
                  <IoLocationOutline className='absolute left-3 top-1/2 -translate-y-1/2 text-[#00B074] w-5 h-5 pointer-events-none z-10' />
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className='w-full pl-10 pr-4 py-2 border text-slate-400 font-light border-[#DEDEDE] rounded focus:outline-none focus:border-[#00B074] appearance-none bg-white cursor-pointer'
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
                      <a className='cursor-pointer block text-gray-600 hover:text-[#00B074] transition-colors'>
                        {job.companyDTO.name}
                      </a>
                      <div className='flex items-center gap-2 mt-2'>
                        <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                        <span className='text-sm text-gray-500'>
                          {job.location}
                        </span>
                        <span className='text-sm text-gray-500'>•</span>
                        <span className='text-sm text-gray-500'>
                          {job.scheduleDTOs.map((s) => s.name).join(', ')}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {job.positionDTOs.map((position) => (
                          <span
                            key={position.id}
                            className='px-3 py-1 text-xs bg-white text-gray-600 border border-gray-200 rounded'
                          >
                            {position.name}
                          </span>
                        ))}
                        {job.majorDTOs.map((major) => (
                          <span
                            key={major.id}
                            className='px-3 py-1 text-xs bg-white text-gray-600 border border-gray-200 rounded'
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
