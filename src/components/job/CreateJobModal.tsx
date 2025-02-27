import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export default function CreateJobModal({
  isOpen,
  onClose,
  jobTitle,
}: CreateJobModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handlePostJob = () => {
    navigate('/hr/jobs/create');
    onClose();
  };

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
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full'>
                <h3 className='text-lg leading-6 font-medium text-gray-900 text-center'>
                  Đăng tin tuyển dụng
                </h3>
                <div className='mt-4 flex flex-col items-center'>
                  <p className='text-sm text-gray-500 text-center'>
                    Bạn có muốn đăng tin tuyển dụng
                  </p>
                  <p className='text-sm font-medium text-gray-700 mt-2 text-center'>
                    {jobTitle}
                  </p>
                  <p className='text-xs text-gray-400 mt-2 text-center italic'>
                    *Tin sẽ được đưa lên sau khi chủ tài khoản hoàn tất thao tác
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-center'>
            <button
              type='button'
              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-6 py-2 bg-[#00B074] text-base font-medium text-white hover:bg-[#00B074]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B074] sm:ml-3 sm:w-auto sm:text-sm'
              onClick={handlePostJob}
            >
              Đồng ý
            </button>
            <button
              type='button'
              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-6 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
              onClick={onClose}
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
