import { IoClose } from 'react-icons/io5';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export type JobActionType = 'delete' | 'close' | 'reopen';

interface JobActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  actionType: JobActionType;
  isLoading: boolean;
}

export default function JobActionModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  actionType,
  isLoading,
}: JobActionModalProps) {
  if (!isOpen) return null;

  const actionText =
    actionType === 'delete'
      ? 'Xóa'
      : actionType === 'close'
      ? 'Đóng'
      : 'Mở lại';
  const actionColor =
    actionType === 'delete'
      ? 'red'
      : actionType === 'close'
      ? 'orange'
      : 'green';
  const actionDescription =
    actionType === 'delete'
      ? 'Hành động này sẽ xóa tin tuyển dụng khỏi hệ thống và không thể hoàn tác.'
      : actionType === 'close'
      ? 'Hành động này sẽ chuyển trạng thái tin tuyển dụng thành "Đã đóng" và không hiển thị cho ứng viên.'
      : 'Hành động này sẽ mở lại tin tuyển dụng đã đóng.';

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
            {actionText} tin tuyển dụng
          </h2>
          <p className='text-gray-600 mb-2'>
            Bạn có chắc chắn muốn {actionText.toLowerCase()} tin tuyển dụng "
            {jobTitle}"?
          </p>
          <p className='text-sm text-gray-500'>{actionDescription}</p>
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
            className={`px-4 py-2 bg-${actionColor}-600 text-white rounded-md font-medium hover:bg-${actionColor}-700 transition-colors duration-200 flex items-center justify-center min-w-[100px]`}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner /> : actionText}
          </button>
        </div>
      </div>
    </div>
  );
}
