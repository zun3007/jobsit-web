import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import ExcelJobUpload from '@/components/job/ExcelJobUpload';

export default function ExcelJobUploadPage() {
  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Link
          to='/hr/jobs'
          className='flex items-center gap-1 text-gray-600 hover:text-gray-900'
        >
          <IoArrowBack className='w-4 h-4' />
          <span>Quay lại danh sách tin tuyển dụng</span>
        </Link>
      </div>

      <ExcelJobUpload />
    </div>
  );
}
