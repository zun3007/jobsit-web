import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className='bg-white border-b border-[#DEDEDE]'>
      <div className='container mx-auto px-4 h-[72px] flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='flex items-center gap-2'>
          <img src='/logo.png' alt='IT Jobs' className='h-8' />
        </Link>

        {/* Navigation */}
        <nav className='flex items-center gap-8'>
          <Link
            to='/'
            className='text-gray-600 hover:text-primary transition-colors'
          >
            Việc làm IT
          </Link>
          <Link
            to='/companies'
            className='text-gray-600 hover:text-primary transition-colors'
          >
            Công ty
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className='flex items-center gap-4'>
          <Link
            to='/auth/candidate'
            className='text-gray-600 hover:text-primary transition-colors'
          >
            Đăng nhập
          </Link>
          <Link
            to='/auth/candidate/register'
            className='px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors'
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </header>
  );
}
