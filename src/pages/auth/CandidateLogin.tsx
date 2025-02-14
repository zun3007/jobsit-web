import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { AxiosError } from 'axios';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormData = z.infer<typeof schema>;

export default function CandidateLogin() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const { toasts, showError, removeToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        navigate('/candidate/dashboard');
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
    <div
      className='w-[480px] h-[804px] bg-white rounded-[10px] border border-[#DEDEDE] px-16 py-20 space-x-3'
      style={{ boxShadow: '0 4px 4px rgba(0, 0, 0, 0.2)' }}
    >
      {/* Header */}
      <div className='text-center mb-4'>
        <h2 className='text-[24px] font-bold text-gray-900'>ĐĂNG NHẬP</h2>
        <div className='relative inline-block'>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className='inline-flex items-center gap-2 bg-[#F3BD50] text-white rounded-md px-4 py-1 text-sm font-medium mt-2'
          >
            ỨNG VIÊN
          </button>

          {isDropdownOpen && (
            <div className='absolute left-1/2 transform -translate-x-1/2 z-10 mt-1 w-[220px] bg-white border border-gray-200 rounded-md shadow-lg'>
              <div className='py-1'>
                <a
                  href='/auth/candidate'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                >
                  Ứng viên
                </a>
                <a
                  href='/auth/recruiter'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                >
                  Nhà tuyển dụng/ Cộng tác viên
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Form */}
      <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-5'>
          <div>
            <label htmlFor='email' className='block text-base font-bold mb-2'>
              Email
            </label>
            <input
              id='email'
              type='email'
              {...register('email')}
              className='w-full px-4 py-3 rounded-lg border-2 border-primary focus:outline-none focus:ring-0'
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
                className='w-full px-4 py-3 rounded-lg border-2 border-primary focus:outline-none focus:ring-0'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2'
              >
                {showPassword ? (
                  <IoEyeOffOutline className='w-6 h-6 text-primary' />
                ) : (
                  <IoEyeOutline className='w-6 h-6 text-primary' />
                )}
              </button>
            </div>
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='w-5 h-5 appearance-none border-2 border-primary rounded checked:bg-primary checked:accent-primary focus:ring-0'
            />
            <label htmlFor='remember-me' className='text-sm'>
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
          className='w-full bg-primary text-white rounded-lg py-3 font-medium hover:bg-primary/90 transition-colors'
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
            <div className='w-full border-t-2 border-gray-200' />
          </div>
          <div className='relative flex justify-center text-sm uppercase'>
            <span className='px-4 bg-white text-[#CFD0D4] font-bold'>HOẶC</span>
          </div>
        </div>

        <div className='space-y-3'>
          <button
            type='button'
            className='w-full flex items-center justify-center gap-2 bg-[#EA4335] text-white rounded-lg py-3 font-medium hover:bg-[#EA4335]/90 transition-colors'
          >
            <FcGoogle className='w-6 h-6 bg-white rounded p-1' />
            <span className='uppercase'>Đăng nhập với Google</span>
          </button>
          <button
            type='button'
            className='w-full flex items-center justify-center gap-2 bg-[#4267B2] text-white rounded-lg py-3 font-medium hover:bg-[#4267B2]/90 transition-colors'
          >
            <FaFacebook className='w-6 h-6' />
            <span className='uppercase'>Đăng nhập với Facebook</span>
          </button>
        </div>

        <div className='text-center text-sm'>
          <span className='text-gray-600'>Bạn chưa có tài khoản? </span>
          <br />
          <a
            href='/auth/register'
            className='text-primary hover:underline font-medium'
          >
            Đăng ký
          </a>
        </div>
      </form>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
