import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  IoPersonOutline,
  IoSettingsOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { useAuth } from '@/hooks/useAuth';

interface DropdownProps {
  userName: string;
  userImage?: string;
}

export default function Dropdown({ userName, userImage }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className='relative' ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative flex items-center justify-start rounded-full bg-white border border-[#C5C5C5]
          pl-3 sm:pl-5 pr-10 sm:pr-14
          min-w-[120px] sm:min-w-[150px]
          h-[35px] sm:h-[40px]'
      >
        <span className='text-xs sm:text-base font-bold truncate'>
          {userName}
        </span>
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className='absolute right-[-1px] top-[-1px] w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] rounded-full object-cover border border-[#C5C5C5]'
          />
        ) : (
          <div
            className='absolute right-[-1px] top-[-1px] 
            scale-110
            w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] 
            rounded-full bg-[#F3F3F3] border border-[#C5C5C5] 
            flex items-center justify-center'
          >
            <IoPersonOutline className='w-4 h-4 sm:w-5 sm:h-5 text-gray-600' />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className='absolute right-3 sm:right-7 mt-2 sm:mt-3 
          w-[200px] sm:w-[220px] bg-white shadow-lg py-1 z-50'
        >
          {/* Arrow */}
          <div className='absolute -top-2 right-4 w-3 sm:w-4 h-3 sm:h-4 rotate-45 bg-white border-l border-t border-gray-200' />

          {/* Header */}
          <div className='px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200'>
            <p className='text-[12px] sm:text-[13px] text-gray-600'>
              Đã đăng nhập với
            </p>
            <p className='font-medium text-[13px] sm:text-[15px]'>{userName}</p>
          </div>

          {/* Menu Items */}
          <div className='py-1'>
            <Link
              to='/candidate/dashboard'
              onClick={() => setIsOpen(false)}
              className='w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3'
            >
              <div className='w-5 h-5 sm:w-6 sm:h-6 rounded bg-secondary flex items-center justify-center'>
                <IoPersonOutline className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
              </div>
              <span className='text-[13px] sm:text-[15px]'>
                Bảng điều khiển
              </span>
            </Link>
            <Link
              to='/candidate/change-password'
              onClick={() => setIsOpen(false)}
              className='w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3'
            >
              <div className='w-5 h-5 sm:w-6 sm:h-6 rounded bg-secondary flex items-center justify-center'>
                <IoSettingsOutline className='w-3 h-3 sm:w-4 sm:h-4 text-white' />
              </div>
              <span className='text-[13px] sm:text-[15px]'>
                Thay đổi mật khẩu
              </span>
            </Link>
            <div className='h-[1px] bg-gray-200 my-1' />
            <button
              onClick={handleLogout}
              className='w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left hover:bg-gray-50 flex items-center gap-2 sm:gap-3 text-gray-700'
            >
              <IoLogOutOutline className='w-5 h-5 sm:w-6 sm:h-6' />
              <span className='text-[13px] sm:text-[15px]'>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
