import { Link } from 'react-router-dom';
import { IoClose, IoEye, IoEyeOff } from 'react-icons/io5';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import Spinner from '@/components/ui/Spinner';
import { AxiosError } from 'axios';
import ToastContainer from '@/components/ui/ToastContainer';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface RequireAuthModalProps {
  onClose: () => void;
}

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function RequireAuthModal({ onClose }: RequireAuthModalProps) {
  const { login, isLoggingIn } = useAuth();
  const { toasts, showError, removeToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login({
        email: data.email,
        password: data.password,
      });

      if (result?.token) {
        onClose();
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof AxiosError && error.response?.data?.message) {
        showError(error.response.data.message);
        return;
      }
      showError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <div className='w-[600px] bg-white rounded-lg overflow-hidden'>
        {/* Header */}
        <div className='relative bg-[#00B074] py-4 px-6'>
          <h2 className='text-[24px] font-bold text-white text-center'>
            Đăng nhập Ứng viên để ứng tuyển
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
        <form onSubmit={handleSubmit(onSubmit)} className='p-16 pt-8'>
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
                placeholder='example@email.com'
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-base font-bold mb-2'
              >
                Mật khẩu
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='w-full px-4 py-3 rounded border-2 border-[#00B074] focus:outline-none focus:ring-0 pr-12'
                  placeholder='••••••••'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-[#00B074] hover:text-[#00915F] transition-colors'
                >
                  {showPassword ? (
                    <IoEyeOff className='w-5 h-5' />
                  ) : (
                    <IoEye className='w-5 h-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='remember'
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className='w-5 h-5 appearance-none border-2 border-[#00B074] rounded checked:bg-[#00B074] focus:ring-0'
                />
                <label htmlFor='remember' className='text-sm'>
                  Lưu phiên đăng nhập
                </label>
              </div>

              <a
                href='#'
                className='text-sm text-black hover:underline italic underline'
              >
                Quên mật khẩu?
              </a>
            </div>

            <button
              type='submit'
              disabled={isLoggingIn}
              className='w-full bg-[#00B074] text-white rounded py-3 font-medium hover:bg-[#00915F] transition-colors disabled:opacity-50'
            >
              {isLoggingIn ? (
                <div className='flex items-center justify-center gap-2'>
                  <Spinner size='sm' variant='white' />
                  <span>ĐANG ĐĂNG NHẬP...</span>
                </div>
              ) : (
                'ĐĂNG NHẬP'
              )}
            </button>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-400 uppercase'>
                  HOẶC
                </span>
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <button
                type='button'
                className='w-full flex items-center justify-center gap-3 bg-[#EA4335] text-white rounded py-3 hover:bg-[#EA4335]/90 transition-colors'
              >
                <FaGoogle className='w-5 h-5' />
                <span className='font-medium'>GOOGLE</span>
              </button>
              <button
                type='button'
                className='w-full flex items-center justify-center gap-3 bg-[#4267B2] text-white rounded py-3 hover:bg-[#4267B2]/90 transition-colors'
              >
                <FaFacebook className='w-5 h-5' />
                <span className='font-medium'>FACEBOOK</span>
              </button>
            </div>

            <div className='text-center text-sm'>
              <span className='text-gray-600'>Bạn chưa có tài khoản? </span>
              <Link
                to='/auth/candidate/register'
                className='text-[#00B074] hover:underline font-medium'
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
