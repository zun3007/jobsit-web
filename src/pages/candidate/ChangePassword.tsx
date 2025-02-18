import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authService } from '@/services/authService';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import { AxiosError } from 'axios';
import { IoEye, IoEyeOff } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const schema = z
  .object({
    oldPassword: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
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

type FormData = z.infer<typeof schema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await authService.changePassword(data.oldPassword, data.newPassword);
      showSuccess('Đổi mật khẩu thành công');
      reset();
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
    <div className='mt-8 bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-[500px] w-full space-y-8 bg-white p-16 rounded-2xl shadow-lg'>
        <h2 className='text-2xl font-bold text-center mb-8'>Đổi mật khẩu</h2>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div>
            <label
              htmlFor='oldPassword'
              className='block text-base font-medium mb-2'
            >
              Mật khẩu hiện tại <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='oldPassword'
                type={showOldPassword ? 'text' : 'password'}
                {...register('oldPassword')}
                className='w-full px-4 py-3 rounded border-2 border-[#00B074] focus:outline-none focus:ring-0 placeholder:text-gray-400 placeholder:italic'
                placeholder='Nhập mật khẩu hiện tại'
              />
              <button
                type='button'
                onClick={() => setShowOldPassword(!showOldPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-[#00B074]'
              >
                {showOldPassword ? (
                  <IoEyeOff className='w-5 h-5' />
                ) : (
                  <IoEye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.oldPassword && (
              <p className='mt-1 text-sm text-red-600 italic'>
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='newPassword'
              className='block text-base font-medium mb-2'
            >
              Mật khẩu mới <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='newPassword'
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword')}
                className='w-full px-4 py-3 rounded border-2 border-[#00B074] focus:outline-none focus:ring-0 placeholder:text-gray-400 placeholder:italic'
                placeholder='6-32 ký tự, chứa ít nhất 1 chữ hoa và 1 số'
              />
              <button
                type='button'
                onClick={() => setShowNewPassword(!showNewPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-[#00B074]'
              >
                {showNewPassword ? (
                  <IoEyeOff className='w-5 h-5' />
                ) : (
                  <IoEye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className='mt-1 text-sm text-red-600 italic'>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-base font-medium mb-2'
            >
              Xác nhận mật khẩu mới <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                className='w-full px-4 py-3 rounded border-2 border-[#00B074] focus:outline-none focus:ring-0 placeholder:text-gray-400 placeholder:italic'
                placeholder='Xác nhận mật khẩu phải trùng với mật khẩu mới vừa nhập'
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-[#00B074]'
              >
                {showConfirmPassword ? (
                  <IoEyeOff className='w-5 h-5' />
                ) : (
                  <IoEye className='w-5 h-5' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600 italic'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className='flex justify-end pt-2 mt-8'>
            <div className='flex gap-4 w-2/3'>
              <button
                type='submit'
                disabled={isLoading}
                className='flex-1 bg-[#00B074] text-white rounded py-3 text-sm font-bold hover:bg-[#00B074]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Spinner size='sm' variant='white' />
                    <span>ĐANG XỬ LÝ...</span>
                  </div>
                ) : (
                  'Thay đổi'
                )}
              </button>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 bg-white text-gray-700 rounded py-3 text-sm font-bold border border-gray-300 hover:bg-gray-50 transition-colors uppercase'
              >
                Hủy
              </button>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
