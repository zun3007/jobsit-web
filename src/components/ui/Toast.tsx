import { useEffect } from 'react';
import {
  IoMdCheckmarkCircle,
  IoMdInformationCircle,
  IoMdClose,
} from 'react-icons/io';
import { MdError } from 'react-icons/md';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const toastStyles = {
  success: 'bg-[#DEF2ED] text-[#00B074] border border-[#00B074] rounded-lg',
  info: 'bg-[#D7F1FD] border text-[#509AF8] border-[#509AF8] rounded-lg',
  error: 'bg-[#FCE8DB] border text-[#EF665B] border-[#EF665B] rounded-lg',
};

const progressBarColors = {
  success: 'bg-[#00B074]',
  info: 'bg-[#509AF8]',
  error: 'bg-[#EF665B]',
};

const iconColors = {
  success: 'text-[#00B074]',
  info: 'text-[#509AF8]',
  error: 'text-[#EF665B]',
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <IoMdCheckmarkCircle className={`w-7 h-7 ${iconColors[type]}`} />;
    case 'info':
      return (
        <IoMdInformationCircle className={`w-7 h-7 ${iconColors[type]}`} />
      );
    case 'error':
      return <MdError className={`w-7 h-7 ${iconColors[type]}`} />;
  }
};

export default function Toast({
  type,
  message,
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className='relative overflow-hidden'>
      <div
        className={`${toastStyles[type]} shadow-lg animate-slide-in`}
        role='alert'
      >
        <div className='flex items-center justify-between p-2'>
          <div className='flex items-center space-x-2'>
            <ToastIcon type={type} />
            <p className='text-sm font-medium'>{message}</p>
          </div>
          <button
            onClick={onClose}
            className='pl-5 rounded-full hover:bg-gray-100 transition-colors'
            aria-label='Close notification'
          >
            <IoMdClose className='w-6 h-6' />
          </button>
        </div>

        {/* Progress Bar */}
        <div className='h-1 w-full overflow-hidden rounded-b-lg'>
          <div
            className={`h-full ${progressBarColors[type]} rounded-b-lg`}
            style={{
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
