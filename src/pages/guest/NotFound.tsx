import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50'>
      <div className='text-center px-4'>
        <h1 className='text-9xl font-bold text-primary mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
          Trang không tồn tại
        </h2>
        <p className='text-gray-600 mb-8 max-w-md mx-auto'>
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không
          truy cập được.
        </p>
        <Link
          to='/'
          className='inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-secondary hover:bg-secondary-hover transition-colors duration-200'
        >
          Trở về trang chủ
        </Link>
      </div>
    </div>
  );
}
