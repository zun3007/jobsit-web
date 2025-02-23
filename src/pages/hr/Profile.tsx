import { useHRByUserId } from '@/hooks/useHR';
import { useAppSelector } from '@/app/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function HRProfile() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: hr, isLoading } = useHRByUserId(user?.id || 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg p-8 shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>Thông tin cá nhân</h1>
            <Link
              to='/hr/change-password'
              className='text-[#00B074] hover:text-[#00B074]/80 transition-colors'
            >
              Đổi mật khẩu
            </Link>
          </div>

          {hr && (
            <div className='space-y-6'>
              {/* Personal Information */}
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Họ
                  </label>
                  <input
                    type='text'
                    value={hr.userDTO.lastName}
                    readOnly
                    aria-label='Họ'
                    className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Tên
                  </label>
                  <input
                    type='text'
                    value={hr.userDTO.firstName}
                    readOnly
                    aria-label='Tên'
                    className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Email
                  </label>
                  <input
                    type='email'
                    value={hr.userDTO.email}
                    readOnly
                    aria-label='Email'
                    className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Số điện thoại
                  </label>
                  <input
                    type='tel'
                    value={hr.userDTO.phone}
                    readOnly
                    aria-label='Số điện thoại'
                    className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Vị trí
                  </label>
                  <input
                    type='text'
                    value={hr.position}
                    readOnly
                    aria-label='Vị trí'
                    className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className='border-t pt-6 mt-8'>
                <h2 className='text-xl font-semibold mb-4'>
                  Thông tin công ty
                </h2>
                <div className='grid grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Tên công ty
                    </label>
                    <input
                      type='text'
                      value={hr.companyDTO.name}
                      readOnly
                      aria-label='Tên công ty'
                      className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Mã số thuế
                    </label>
                    <input
                      type='text'
                      value={hr.companyDTO.tax}
                      readOnly
                      aria-label='Mã số thuế'
                      className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                    />
                  </div>
                  {hr.companyDTO.website && (
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Website
                      </label>
                      <input
                        type='text'
                        value={hr.companyDTO.website}
                        readOnly
                        aria-label='Website'
                        className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] bg-gray-50'
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
