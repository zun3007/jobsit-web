import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-white border-t border-[#DEDEDE] py-12'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-4 gap-8'>
          {/* Company Info */}
          <div>
            <Link to='/' className='flex items-center gap-2 mb-4'>
              <img src='/logo.png' alt='IT Jobs' className='h-8' />
            </Link>
            <p className='text-gray-600 mb-4'>
              Nền tảng kết nối nhân tài IT với doanh nghiệp
            </p>
            <div className='flex items-center gap-4'>
              <a
                href='#'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary transition-colors'
              >
                <FaFacebook className='w-6 h-6' />
              </a>
              <a
                href='#'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary transition-colors'
              >
                <FaLinkedin className='w-6 h-6' />
              </a>
              <a
                href='#'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-primary transition-colors'
              >
                <FaYoutube className='w-6 h-6' />
              </a>
            </div>
          </div>

          {/* For Candidates */}
          <div>
            <h3 className='font-bold mb-4'>Dành cho ứng viên</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Việc làm IT
                </Link>
              </li>
              <li>
                <Link
                  to='/companies'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Công ty IT
                </Link>
              </li>
              <li>
                <Link
                  to='/blog'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Blog IT
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className='font-bold mb-4'>Dành cho nhà tuyển dụng</h3>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/auth/recruiter'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Đăng tin tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to='/pricing'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Bảng giá dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-gray-600 hover:text-primary transition-colors'
                >
                  Liên hệ tư vấn
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='font-bold mb-4'>Liên hệ</h3>
            <ul className='space-y-2 text-gray-600'>
              <li>Email: contact@itjobs.com</li>
              <li>Hotline: 1900 1111</li>
              <li>
                Địa chỉ: Tầng 3, Tòa nhà ABC,
                <br />
                Quận 1, TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 pt-8 border-t border-gray-200 text-center text-gray-600'>
          <p>© 2024 IT Jobs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
