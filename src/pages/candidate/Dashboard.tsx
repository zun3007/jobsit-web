import { useAuth } from '@/hooks/useAuth';
import { useCandidates } from '@/hooks/useCandidates';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import SaveButton from '@/components/ui/SaveButton';
import { IoCreateOutline } from 'react-icons/io5';

export default function CandidateDashboard() {
  const { profile } = useAuth();
  const {
    applications,
    recommendedJobs,
    isLoadingApplications,
    isLoadingRecommendedJobs,
  } = useCandidates();

  if (isLoadingApplications || isLoadingRecommendedJobs) {
    return <LoadingSpinner />;
  }

  // Check if profile is complete
  const isProfileComplete = Boolean(
    profile?.firstName &&
      profile?.lastName &&
      profile?.email &&
      profile?.phone &&
      profile?.gender !== undefined &&
      profile?.avatar
  );

  // Dynamic styles based on profile completion
  const themeColor = isProfileComplete ? 'secondary' : 'primary';
  const headerBgColor = isProfileComplete ? 'bg-[#00B074]' : 'bg-[#FFB13B]';
  const cardBorderColor = isProfileComplete
    ? 'border-[#00B074]'
    : 'border-[#FFB13B]';

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Profile Header */}
      <div className={`${headerBgColor} text-white py-8`}>
        <div className='container mx-auto px-4'>
          <div className='flex items-center gap-6'>
            <div className='relative'>
              <img
                src={profile?.avatar || '/default-avatar.png'}
                alt={profile?.firstName}
                className='w-32 h-32 rounded-full object-cover border-4 border-white'
              />
              {!isProfileComplete && (
                <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-[#FFB13B] px-3 py-1 rounded-full text-sm font-medium shadow-md'>
                  Chưa hoàn thiện
                </div>
              )}
            </div>
            <div>
              <h1 className='text-2xl font-bold mb-2'>
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className='text-white/90 mb-4'>{profile?.email}</p>
              <button
                className={`inline-flex items-center gap-2 px-4 py-2 bg-white ${
                  isProfileComplete ? 'text-[#00B074]' : 'text-[#FFB13B]'
                } rounded-lg font-medium hover:bg-gray-50 transition-colors`}
              >
                <IoCreateOutline className='w-5 h-5' />
                Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 py-8'>
        {/* Profile Information */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div
            className={`bg-white rounded-lg shadow-sm border ${cardBorderColor}`}
          >
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold'>Thông tin cá nhân</h2>
                <button
                  className={`text-${themeColor} hover:underline`}
                  aria-label='Chỉnh sửa thông tin cá nhân'
                >
                  <IoCreateOutline className='w-5 h-5' />
                </button>
              </div>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <p className='text-gray-600 mb-1'>Họ và tên lót</p>
                  <p className='font-medium'>
                    {profile?.lastName || '(chưa có dữ liệu)'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Tên</p>
                  <p className='font-medium'>
                    {profile?.firstName || '(chưa có dữ liệu)'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Email</p>
                  <p className='font-medium'>{profile?.email}</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Số điện thoại</p>
                  <p className='font-medium'>
                    {profile?.phone || '(chưa có dữ liệu)'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Giới tính</p>
                  <p className='font-medium'>
                    {profile?.gender === 1
                      ? 'Nam'
                      : profile?.gender === 0
                      ? 'Nữ'
                      : '(chưa có dữ liệu)'}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Ngày sinh</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`bg-white rounded-lg shadow-sm border ${cardBorderColor}`}
          >
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-bold'>
                  Thông tin việc muốn ứng tuyển
                </h2>
                <button
                  className={`text-${themeColor} hover:underline`}
                  aria-label='Chỉnh sửa thông tin ứng tuyển'
                >
                  <IoCreateOutline className='w-5 h-5' />
                </button>
              </div>
              <div className='space-y-4'>
                <div>
                  <p className='text-gray-600 mb-1'>Công việc mong muốn</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Vị trí làm việc</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Chuyên ngành</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>Hình thức làm việc</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
                <div>
                  <p className='text-gray-600 mb-1'>CV đính kèm</p>
                  <p className='font-medium'>(chưa có dữ liệu)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-8'>
          <div className='p-6'>
            <h2 className='text-xl font-bold mb-6'>
              Việc làm đã ứng tuyển gần đây
            </h2>
            {applications?.length > 0 ? (
              <div className='space-y-4'>
                {applications.slice(0, 3).map((application) => (
                  <div key={application.id} className='p-4 border rounded-lg'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-medium'>{application.job.name}</h3>
                        <p className='text-sm text-gray-600'>
                          {application.job.companyDTO.name}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          application.status === 'PENDING'
                            ? 'bg-primary-light text-primary'
                            : application.status === 'ACCEPTED'
                            ? 'bg-secondary-light text-secondary'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                Bạn chưa ứng tuyển công việc nào
              </p>
            )}
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
          <div className='p-6'>
            <h2 className='text-xl font-bold mb-6'>Việc làm phù hợp với bạn</h2>
            {recommendedJobs?.length > 0 ? (
              <div className='space-y-4'>
                {recommendedJobs.slice(0, 3).map((job) => (
                  <div key={job.id} className='p-4 border rounded-lg'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <h3 className='font-medium'>{job.name}</h3>
                        <p className='text-sm text-gray-600'>
                          {job.companyDTO.name} • {job.location}
                        </p>
                      </div>
                      <SaveButton />
                    </div>
                    <div className='mt-2 flex gap-2'>
                      {job.positionDTOs.map((position) => (
                        <span
                          key={position.id}
                          className='text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded'
                        >
                          {position.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-8'>
                Chưa có việc làm phù hợp
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
