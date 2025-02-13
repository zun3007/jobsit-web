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

export default function RecruiterLogin() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const { toasts, showError, removeToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showError('Vui lòng nhập đầy đủ thông tin đăng nhập.');
      return;
    }

    try {
      const result = await login({
        email,
        password,
      });

      if (result?.token) {
        navigate('/hr/dashboard');
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
    <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow'>
      {/* Logo */}
      <div className='flex justify-center'>
        <img src='/logo.png' alt='IT Jobs' className='h-12' />
      </div>

      {/* Header */}
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900'>ĐĂNG NHẬP</h2>
        <p className='mt-2 text-sm text-gray-600'>NHÀ TUYỂN DỤNG</p>
      </div>

      {/* Login Form */}
      <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
        <div className='rounded-md shadow-sm space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='form-input mt-1'
              placeholder='example@email.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Mật khẩu
            </label>
            <div className='relative'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='form-input mt-1 pr-10'
                placeholder='••••••••'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute inset-y-0 right-0 pr-3 flex items-center'
              >
                {showPassword ? (
                  <IoEyeOffOutline className='h-5 w-5 text-gray-400' />
                ) : (
                  <IoEyeOutline className='h-5 w-5 text-gray-400' />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-900'
            >
              Lưu phiên đăng nhập
            </label>
          </div>

          <div className='text-sm'>
            <a
              href='#'
              className='font-medium text-primary hover:text-primary-hover'
            >
              Quên mật khẩu?
            </a>
          </div>
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
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>HOẶC</span>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <button
            type='button'
            className='btn btn-outline flex items-center justify-center gap-2'
          >
            <FcGoogle className='w-5 h-5' />
            <span>Google</span>
          </button>
          <button
            type='button'
            className='btn btn-outline flex items-center justify-center gap-2 text-[#4267B2]'
          >
            <FaFacebook className='w-5 h-5' />
            <span>Facebook</span>
          </button>
        </div>

        <p className='text-center text-sm text-gray-600'>
          Bạn chưa có tài khoản?{' '}
          <a
            href='/auth/register'
            className='font-medium text-primary hover:text-primary-hover'
          >
            Đăng ký
          </a>
        </p>
      </form>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
