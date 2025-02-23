import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import Dropdown from '@/components/ui/Dropdown';
import { IoChevronDown, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { useCandidates } from '@/hooks/useCandidates';
import { useHRByUserId } from '@/hooks/useHR';
import { Roles } from '@/types';

interface NavbarProps {
  color?: 'green' | 'yellow';
}

export default function Navbar({ color = 'green' }: NavbarProps) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { profile } = useCandidates();
  const { data: hrProfile } = useHRByUserId(user?.id || 0);

  // Get full name for dropdown based on role
  const fullName =
    user?.role === Roles.HR && hrProfile
      ? `${hrProfile.userDTO.lastName} ${hrProfile.userDTO.firstName}`
      : profile
      ? `${profile.userDTO.lastName} ${profile.userDTO.firstName}`
      : '';

  const renderNavLinks = () => {
    if (!isAuthenticated) return null;

    if (user?.role === Roles.HR) {
      return (
        <div className='flex items-center gap-8'>
          <Link
            to='/hr/jobs'
            className='text-gray-600 hover:text-[#00B074] transition-colors'
          >
            Quản lý tin tuyển dụng
          </Link>
          <Link
            to='/hr/applications'
            className='text-gray-600 hover:text-[#00B074] transition-colors'
          >
            Quản lý đơn ứng tuyển
          </Link>
        </div>
      );
    }

    if (user?.role === Roles.CANDIDATE) {
      return (
        <div className='flex items-center gap-8'>
          <Link
            to='/'
            className='text-gray-600 hover:text-[#00B074] transition-colors'
          >
            Tìm việc làm
          </Link>
          <Link
            to='/candidate/applications'
            className='text-gray-600 hover:text-[#00B074] transition-colors'
          >
            Việc làm đã ứng tuyển
          </Link>
          <Link
            to='/candidate/saved-jobs'
            className='text-gray-600 hover:text-[#00B074] transition-colors'
          >
            Việc làm đã lưu
          </Link>
        </div>
      );
    }

    return null;
  };

  return (
    <nav className='bg-white border-b border-[#DEDEDE] h-[72px] sticky top-0 z-50'>
      <div className='container mx-auto h-full px-4'>
        <div className='flex items-center justify-between h-full'>
          {/* Logo */}
          <div className='flex items-center gap-8'>
            <Link to='/' className='flex items-center'>
              <img
                src={color === 'green' ? '/logo.svg' : '/logo_yellow.svg'}
                alt='IT Jobs'
                className='max-h-14'
              />
            </Link>
            {renderNavLinks()}
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-6'>
            {/* Language Selector */}
            <button className='flex items-center gap-2 text-gray-600 hover:text-gray-900'>
              <img
                src='/vn_flag.svg'
                alt='VN'
                className='w-6 h-6 rounded-full object-cover'
              />
              <IoChevronDown className='w-4 h-4' />
            </button>

            {isAuthenticated ? (
              /* User Dropdown */
              <Dropdown
                userName={fullName}
                userImage={
                  user?.role === Roles.HR
                    ? hrProfile?.userDTO?.avatar
                    : profile?.userDTO?.avatar
                }
              />
            ) : (
              /* Auth Buttons */
              <div className='flex items-center gap-4'>
                <Link
                  to='/auth/verify'
                  className='text-gray-600 hover:text-[#00B074] transition-colors'
                  aria-label='Xác thực tài khoản'
                >
                  <IoShieldCheckmarkOutline className='w-6 h-6' />
                </Link>
                <Link
                  to='/auth/candidate'
                  className='text-gray-800 font-bold hover:text-[#00B074] transition-colors'
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/auth/candidate/register'
                  className='text-gray-800 font-bold hover:text-[#00B074] transition-colors'
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
