import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import { AxiosError } from 'axios';
import { IoArrowBack } from 'react-icons/io5';

const emailSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

const resetSchema = z
  .object({
    otp: z.string().length(6, 'Mã OTP phải có 6 ký tự'),
    newPassword: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .max(32, 'Mật khẩu không được vượt quá 32 ký tự')
      .regex(
        /^(?=.*[A-Z])(?=.*\d).+$/,
        'Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  });

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      resetForm.reset();
      setStage('reset');
      showSuccess('Vui lòng kiểm tra email của bạn để lấy mã OTP');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message ||
            'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        );
      } else {
        showError(error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetFormData) => {
    setIsLoading(true);
    try {
      await authService.changePasswordByOTP(data.otp, data.newPassword);
      showSuccess('Đổi mật khẩu thành công');
      // Redirect to login page after successful password reset
      window.location.href = '/auth/candidate';
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message ||
            'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        );
      } else {
        showError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      resetForm.reset();
      showSuccess('Mã OTP mới đã được gửi đến email của bạn');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message ||
            'Đã xảy ra lỗi. Vui lòng thử lại sau.'
        );
      } else {
        showError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
      <div className='text-center'>
        <h2 className='text-3xl font-bold text-gray-900 mb-2'>Quên mật khẩu</h2>
        {stage === 'email' ? (
          <>
            <p className='text-gray-600 mb-8'>
              Xin vui lòng nhập địa chỉ email để lấy lại mật khẩu.
            </p>

            <form
              onSubmit={emailForm.handleSubmit(onSubmitEmail)}
              className='space-y-6'
            >
              <div>
                <label
                  htmlFor='email'
                  className='block text-left text-sm font-medium text-gray-700 mb-1'
                >
                  Nhập Email<span className='text-red-500'>*</span>
                </label>
                <input
                  id='email'
                  type='email'
                  {...emailForm.register('email')}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  placeholder='Vui lòng nhập email...'
                />
                {emailForm.formState.errors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
              >
                {isLoading ? (
                  <div className='flex items-center gap-2'>
                    <Spinner size='sm' variant='white' />
                    <span>ĐANG XỬ LÝ...</span>
                  </div>
                ) : (
                  'Lấy lại mật khẩu'
                )}
              </button>
            </form>
          </>
        ) : (
          <>
            <p className='text-gray-600 mb-8'>
              Vui lòng nhập mã OTP đã được gửi đến email của bạn và mật khẩu
              mới.
            </p>

            <form
              onSubmit={resetForm.handleSubmit(onSubmitReset)}
              className='space-y-6'
            >
              <div>
                <label
                  htmlFor='otp'
                  className='block text-left text-sm font-medium text-gray-700 mb-1'
                >
                  Mã OTP<span className='text-red-500'>*</span>
                </label>
                <input
                  id='otp'
                  type='text'
                  {...resetForm.register('otp')}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  placeholder='Nhập mã OTP...'
                />
                {resetForm.formState.errors.otp && (
                  <p className='mt-1 text-sm text-red-600'>
                    {resetForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-left text-sm font-medium text-gray-700 mb-1'
                >
                  Mật khẩu mới<span className='text-red-500'>*</span>
                </label>
                <input
                  id='newPassword'
                  type='password'
                  {...resetForm.register('newPassword')}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  placeholder='Nhập mật khẩu mới...'
                />
                {resetForm.formState.errors.newPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-left text-sm font-medium text-gray-700 mb-1'
                >
                  Nhập lại mật khẩu<span className='text-red-500'>*</span>
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  {...resetForm.register('confirmPassword')}
                  className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
                  placeholder='Nhập lại mật khẩu mới...'
                />
                {resetForm.formState.errors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-3'>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {isLoading ? (
                    <div className='flex items-center gap-2'>
                      <Spinner size='sm' variant='white' />
                      <span>ĐANG XỬ LÝ...</span>
                    </div>
                  ) : (
                    'Đổi mật khẩu'
                  )}
                </button>

                <div className='flex justify-between items-center'>
                  <button
                    type='button'
                    onClick={() => {
                      emailForm.reset();
                      setStage('email');
                    }}
                    className='flex items-center gap-1 text-primary hover:text-primary-hover'
                  >
                    <IoArrowBack className='w-4 h-4' />
                    <span>Quay lại</span>
                  </button>

                  <button
                    type='button'
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className='text-primary hover:text-primary-hover disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    Gửi lại mã OTP
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        <div className='text-center mt-6'>
          <Link
            to='/auth/candidate'
            className='text-primary hover:text-primary-hover font-medium'
          >
            Quay về trang đăng nhập
          </Link>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
