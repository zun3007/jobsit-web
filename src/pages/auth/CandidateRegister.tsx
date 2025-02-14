import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import { candidateService } from '@/services/candidateService';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z
  .object({
    lastName: z.string().min(1, 'Vui lòng nhập họ và tên lót'),
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa')
      .regex(/[0-9]/, 'Mật khẩu phải chứa ít nhất 1 số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    phone: z
      .string()
      .regex(/^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function CandidateRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const navigate = useNavigate();

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
      await candidateService.register({
        userCreationDTO: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        },
        candidateOtherInfoDTO: null,
      });

      await axios.get(
        `http://localhost:8085/api/mail/active-user?email=${data.email}`
      );

      showSuccess(
        'Đăng ký tài khoản thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.'
      );
      navigate('/auth/candidate');
    } catch (error: any) {
      if (error?.message) {
        showError(error.message);
      } else {
        showError('Đã xảy ra lỗi khi đăng ký tài khoản');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='h-full flex rounded-xl'>
        {/* Left side - Image */}
        <div className='hidden lg:flex lg:flex-1 bg-primary items-center justify-center rounded-tl-xl rounded-bl-xl max-w-[441px]'>
          <div className='max-w-2xl text-center'>
            <h1 className='text-4xl font-bold text-white mb-8'>
              ĐĂNG KÝ ỨNG VIÊN
            </h1>
            <img
              src='/candidate_register.svg'
              alt='Candidate Registration'
              className='max-w-md mx-auto'
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className='flex-1 flex flex-col justify-center px-4 sm:px-6 py-4 lg:flex-[1.5] bg-white rounded-tr-xl rounded-br-xl'>
          <div className='w-full max-w-3xl mx-auto px-8'>
            <h2 className='text-lg font-bold text-center text-primary mb-8'>
              ĐĂNG KÝ TÀI KHOẢN ỨNG VIÊN
            </h2>

            {/* Social Login Buttons */}
            <div className='flex flex-row gap-3 mb-8'>
              <button className='w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium rounded-[4px] text-white bg-[#DB4437] hover:bg-[#c13b2f] focus:outline-none'>
                <FaGoogle className='w-5 h-5' />
                <span className='font-bold'>TIẾP TỤC VỚI GOOGLE</span>
              </button>
              <button className='w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium rounded-[4px] text-white bg-[#4267B2] hover:bg-[#375593] focus:outline-none'>
                <FaFacebook className='w-5 h-5' />
                <span className='font-bold'>TIẾP TỤC VỚI FACEBOOK</span>
              </button>
            </div>

            <div className='relative mb-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center'>
                <span className='px-6 text-sm font-medium bg-white text-[#7D7D7D]'>
                  HOẶC
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-base font-bold text-gray-900 mb-1'
                  >
                    Họ và tên lót <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    {...register('lastName')}
                    placeholder='Nhập họ và tên lót'
                    className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic'
                  />
                  {errors.lastName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-base font-bold text-gray-900 mb-1'
                  >
                    Tên <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    {...register('firstName')}
                    placeholder='Nhập tên'
                    className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic'
                  />
                  {errors.firstName && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-base font-bold text-gray-900 mb-1'
                >
                  Email <span className='text-red-500'>*</span>
                </label>
                <input
                  type='email'
                  id='email'
                  {...register('email')}
                  placeholder='Sử dụng email có thật để xác thực'
                  className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic'
                />
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='password'
                    className='block text-base font-bold text-gray-900 mb-1'
                  >
                    Mật khẩu <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id='password'
                      {...register('password')}
                      placeholder='6-32 ký tự, chứa ít nhất 1 chữ hoa và 1 số'
                      className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic pr-12'
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute right-4 top-1/2 -translate-y-1/2'
                    >
                      {showPassword ? (
                        <IoEyeOffOutline className='w-5 h-5 text-[#FFB13B]' />
                      ) : (
                        <IoEyeOutline className='w-5 h-5 text-[#FFB13B]' />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor='confirmPassword'
                    className='block text-base font-bold text-gray-900 mb-1'
                  >
                    Xác nhận mật khẩu <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id='confirmPassword'
                      {...register('confirmPassword')}
                      className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic pr-12'
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute right-4 top-1/2 -translate-y-1/2'
                    >
                      {showConfirmPassword ? (
                        <IoEyeOffOutline className='w-5 h-5 text-[#FFB13B]' />
                      ) : (
                        <IoEyeOutline className='w-5 h-5 text-[#FFB13B]' />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className='mt-1 text-sm text-red-600'>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-base font-bold text-gray-900 mb-1'
                >
                  Số điện thoại <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  id='phone'
                  {...register('phone')}
                  placeholder='Có thể bắt đầu với đầu số 03, 05, 07, 08, 09, 84, +84'
                  className='w-full px-4 py-3 rounded border-[1px] border-[#FFB13B] focus:outline-none focus:ring-0 text-base placeholder:text-[#7D7D7D] placeholder:italic'
                />
                {errors.phone && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className='text-sm text-[#7D7D7D]'>
                Bằng việc ấn vào nút "Đăng ký", tôi đồng ý với{' '}
                <Link to='/terms' className='text-primary hover:underline'>
                  Thỏa thuận sử dụng
                </Link>{' '}
                và{' '}
                <Link to='/privacy' className='text-primary hover:underline'>
                  Quy định bảo mật
                </Link>{' '}
                của Jobsit.vn
              </div>

              <button
                type='submit'
                disabled={isLoading}
                className='w-full bg-primary text-white rounded-lg py-4 font-bold text-base hover:bg-primary/90 transition-colors'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Spinner size='sm' variant='white' />
                    <span>ĐANG ĐĂNG KÝ...</span>
                  </div>
                ) : (
                  'ĐĂNG KÝ'
                )}
              </button>

              <div className='text-center text-[#7D7D7D]'>
                Bạn đã có tài khoản?{' '}
                <Link
                  to='/auth/candidate'
                  className='text-primary hover:underline font-bold'
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
