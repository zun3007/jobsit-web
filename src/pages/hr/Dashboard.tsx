import { useHRByUserId } from '@/hooks/useHR';
import { useAppSelector } from '@/app/store';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HRDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { data: hr, isLoading } = useHRByUserId(user?.id || 0);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='bg-white rounded-lg p-6 shadow-sm'>
        <h1 className='text-2xl font-bold mb-6'>HR Dashboard</h1>
        {hr && (
          <div className='space-y-4'>
            <div>
              <h2 className='text-lg font-semibold text-[#00B074] mb-2'>
                Thông tin cá nhân
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-gray-600'>Họ và tên</p>
                  <p className='font-medium'>
                    {hr.userDTO.lastName} {hr.userDTO.firstName}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600'>Email</p>
                  <p className='font-medium'>{hr.userDTO.email}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Số điện thoại</p>
                  <p className='font-medium'>{hr.userDTO.phone}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Vị trí</p>
                  <p className='font-medium'>{hr.position}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className='text-lg font-semibold text-[#00B074] mb-2'>
                Thông tin công ty
              </h2>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-gray-600'>Tên công ty</p>
                  <p className='font-medium'>{hr.companyDTO.name}</p>
                </div>
                <div>
                  <p className='text-gray-600'>Mã số thuế</p>
                  <p className='font-medium'>{hr.companyDTO.tax}</p>
                </div>
                {hr.companyDTO.website && (
                  <div>
                    <p className='text-gray-600'>Website</p>
                    <p className='font-medium'>{hr.companyDTO.website}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
