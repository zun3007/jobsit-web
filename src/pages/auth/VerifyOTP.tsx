import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { authService } from '@/services/authService';
import { AxiosError } from 'axios';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
import ResendOTPModal from '@/components/auth/ResendOTPModal';

export default function VerifyOTP() {
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showResendModal, setShowResendModal] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    // Focus first input on mount
    inputRefs[0].current?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or first empty input
    const lastIndex = Math.min(pastedData.length - 1, 5);
    inputRefs[lastIndex].current?.focus();
  };

  const handleVerify = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      showError('Vui lòng nhập đủ 6 số OTP');
      return;
    }

    try {
      setIsLoading(true);
      await authService.verifyOTP(otpValue);
      showSuccess('Xác thực email thành công');
      navigate('/auth/candidate');
    } catch (error) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message ||
            'Xác thực không thành công. Vui lòng thử lại.'
        );
      } else {
        showError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md'>
        <div className='text-center'>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>
            Xác thực Email
          </h2>
          <p className='text-gray-600 mb-8'>
            Vui lòng nhập mã OTP đã được gửi đến email của bạn
          </p>

          {/* OTP Input */}
          <div className='flex justify-center gap-2 mb-8'>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type='text'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${index + 1}`}
                className='w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors'
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={isLoading}
            className='w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <Spinner size='sm' variant='white' />
                <span>ĐANG XÁC THỰC...</span>
              </div>
            ) : (
              'XÁC THỰC EMAIL'
            )}
          </button>

          <p className='mt-4 text-sm text-gray-600'>
            Không nhận được mã?{' '}
            <button
              onClick={() => setShowResendModal(true)}
              className='text-primary hover:underline font-medium'
            >
              Gửi lại mã
            </button>
          </p>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {showResendModal && (
        <ResendOTPModal onClose={() => setShowResendModal(false)} />
      )}
    </>
  );
}
