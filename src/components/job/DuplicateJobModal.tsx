import { IoClose } from 'react-icons/io5';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface DuplicateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  isLoading: boolean;
}

export default function DuplicateJobModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  isLoading,
}: DuplicateJobModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          aria-label='Đóng'
          disabled={isLoading}
        >
          <IoClose className='w-6 h-6' />
        </button>

        <div className='text-center pt-2 pb-4'>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Nhân bản tin tuyển dụng
          </h2>
          <p className='text-gray-600 mb-2'>
            Bạn có chắc chắn muốn nhân bản tin tuyển dụng "{jobTitle}"?
          </p>
          <p className='text-sm text-gray-500'>
            Hành động này sẽ tạo một bản sao của tin tuyển dụng hiện tại với tất
            cả thông tin giống như tin gốc. Bạn có thể chỉnh sửa các thông tin
            của tin mới sau khi nhân bản.
          </p>
        </div>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={onClose}
            className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200'
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className='px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[100px]'
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : 'Nhân bản'}
          </button>
        </div>
      </div>
    </div>
  );
}
