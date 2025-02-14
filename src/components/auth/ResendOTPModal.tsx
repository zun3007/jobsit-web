import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';
import { AxiosError } from 'axios';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface ResendOTPModalProps {
  onClose: () => void;
}

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

type FormData = z.infer<typeof schema>;

export default function ResendOTPModal({ onClose }: ResendOTPModalProps) {
  const { toasts, showError, showSuccess, removeToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.resendOTP(data.email);
      showSuccess('Mã OTP đã được gửi lại. Vui lòng kiểm tra email của bạn.');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message || 'Đã xảy ra lỗi khi gửi lại mã OTP'
        );
      } else {
        showError('Đã xảy ra lỗi khi gửi lại mã OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='w-[500px] bg-white rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='relative bg-[#00B074] py-4 px-6'>
          <h2 className='text-[24px] font-bold text-white text-center'>
            Gửi lại mã OTP
          </h2>
          <button
            onClick={onClose}
            className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors'
            aria-label='Đóng'
          >
            <IoClose className='w-7 h-7' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='p-8'>
          <div className='space-y-6'>
            <div>
              <label htmlFor='email' className='block text-base font-bold mb-2'>
                Email
              </label>
              <input
                id='email'
                type='email'
                {...register('email')}
                className='w-full px-4 py-3 rounded border-2 border-[#00B074] focus:outline-none focus:ring-0'
                placeholder='Nhập email đã đăng ký'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#00B074] hover:bg-[#00915F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00B074] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <div className='flex items-center gap-2'>
                  <Spinner size='sm' variant='white' />
                  <span>ĐANG GỬI...</span>
                </div>
              ) : (
                'GỬI LẠI MÃ OTP'
              )}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
