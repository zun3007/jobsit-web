import React from 'react';

export type JobActionType = 'create' | 'edit' | 'close' | 'delete' | 'reopen';

interface JobActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  actionType: JobActionType;
  isLoading?: boolean;
}

export default function JobActionModal({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  actionType,
  isLoading = false,
}: JobActionModalProps) {
  if (!isOpen) return null;

  // Configure modal based on action type
  const getModalConfig = () => {
    switch (actionType) {
      case 'create':
        return {
          title: 'Đăng tin tuyển dụng',
          message: 'Bạn có muốn đăng tin tuyển dụng',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-[#00B074] hover:bg-[#00B074]/90',
        };
      case 'edit':
        return {
          title: 'Chỉnh sửa tin tuyển dụng',
          message: 'Bạn có muốn chỉnh sửa tin tuyển dụng',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-[#00B074] hover:bg-[#00B074]/90',
        };
      case 'close':
        return {
          title: 'Đóng tin tuyển dụng',
          message: 'Bạn có muốn đóng tin tuyển dụng',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-[#FFB800] hover:bg-[#F0AE00]',
        };
      case 'delete':
        return {
          title: 'Xóa tin tuyển dụng',
          message: 'Bạn có muốn xóa tin tuyển dụng',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-red-500 hover:bg-red-600',
        };
      case 'reopen':
        return {
          title: 'Mở lại tin tuyển dụng',
          message: 'Bạn có muốn mở lại tin tuyển dụng',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-[#00B074] hover:bg-[#00B074]/90',
        };
      default:
        return {
          title: 'Xác nhận',
          message: 'Bạn có chắc chắn muốn thực hiện thao tác này',
          confirmText: 'Đồng ý',
          confirmClass: 'bg-[#00B074] hover:bg-[#00B074]/90',
        };
    }
  };

  const config = getModalConfig();

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
          aria-hidden='true'
          onClick={onClose}
        ></div>

        <span
          className='hidden sm:inline-block sm:align-middle sm:h-screen'
          aria-hidden='true'
        >
          &#8203;
        </span>

        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
          <div className='px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3 className='text-lg leading-6 font-medium text-gray-900'>
                  {config.title}
                </h3>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>
                    {config.message} <strong>{jobTitle}</strong>?
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
            <button
              type='button'
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${config.confirmClass}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : config.confirmText}
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
