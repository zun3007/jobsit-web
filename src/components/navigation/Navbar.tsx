import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/store';
import Dropdown from '@/components/ui/Dropdown';
import { IoChevronDown } from 'react-icons/io5';

export default function Navbar({ color = 'green' }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

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
            {isAuthenticated && (
              <div className='flex items-center gap-8'>
                <Link
                  to='/'
                  className='text-gray-600 hover:text-[#00B074] transition-colors'
                >
                  Tìm việc làm
                </Link>
                <Link
                  to='/applications'
                  className='text-gray-600 hover:text-[#00B074] transition-colors'
                >
                  Việc làm đã ứng tuyển
                </Link>
                <Link
                  to='/saved-jobs'
                  className='text-gray-600 hover:text-[#00B074] transition-colors'
                >
                  Việc làm đã lưu
                </Link>
              </div>
            )}
          </div>

          {/* Right Section */}
          <div className='flex items-center gap-6'>
            {/* Language Selector */}
            <button className='flex items-center gap-2 text-gray-600 hover:text-gray-900'>
              <img
                src='/vn-flag.png'
                alt='VN'
                className='w-6 h-6 rounded-full object-cover'
              />
              <IoChevronDown className='w-4 h-4' />
            </button>

            {isAuthenticated ? (
              /* User Dropdown */
              <Dropdown
                userName={`${user?.firstName} ${user?.lastName}`}
                userImage={user?.avatar}
              />
            ) : (
              /* Auth Buttons */
              <div className='flex items-center gap-4'>
                <Link
                  to='/auth/candidate'
                  className='text-gray-800 font-bold hover:text-[#00B074] transition-colors'
                >
                  Đăng nhập
                </Link>
                <Link
                  to='/auth/register'
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
