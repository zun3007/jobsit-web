import React from 'react';
import { IoClose } from 'react-icons/io5';

interface JobPostingTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegularPost: () => void;
  onExcelPost: () => void;
}

export default function JobPostingTypeModal({
  isOpen,
  onClose,
  onRegularPost,
  onExcelPost,
}: JobPostingTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-gray-700'
          aria-label='Đóng'
        >
          <IoClose className='w-6 h-6' />
        </button>

        {/* Modal header */}
        <div className='text-center pt-8 pb-4'>
          <h2 className='text-2xl font-bold text-gray-900'>
            Đăng tin tuyển dụng
          </h2>
          <p className='mt-2 text-gray-600'>Bạn muốn đăng tin tuyển dụng:</p>
        </div>

        {/* Modal content */}
        <div className='px-6 pb-8 space-y-4'>
          {/* Regular posting button */}
          <button
            onClick={onRegularPost}
            className='w-full py-3 bg-[#F9CA63] hover:bg-[#F0BD4F] text-gray-900 rounded-md font-medium transition-colors duration-200'
          >
            Đăng tin thông thường
          </button>

          {/* Excel posting button */}
          <button
            onClick={onExcelPost}
            className='w-full py-3 bg-[#F9CA63] hover:bg-[#F0BD4F] text-gray-900 rounded-md font-medium transition-colors duration-200'
          >
            Đăng tin sử dụng file Excel
          </button>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className='w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors duration-200 mt-2'
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
