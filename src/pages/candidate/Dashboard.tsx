import { useCandidates } from '@/hooks/useCandidates';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import { IoCreateOutline } from 'react-icons/io5';
import Switch from '@/components/ui/Switch';

export default function CandidateDashboard() {
  const { profile, isLoadingApplications, isLoadingRecommendedJobs } =
    useCandidates();

  if (isLoadingApplications || isLoadingRecommendedJobs) {
    return <LoadingSpinner />;
  }

  return (
    <div className='bg-gray-50 py-8'>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Left Sidebar - Profile Card */}
          <div className='lg:w-[450px]'>
            <div className='bg-white rounded-lg p-6 text-center border-2 border-[#00B074] shadow-[0_0_4px_rgba(0,0,0,0.1)]'>
              {/* Avatar Section */}
              <div className='my-16'>
                <div className='relative max-w-44 max-h-44 mx-auto rounded-full border-2 border-[#00B074]'>
                  <img
                    src={profile?.userDTO?.avatar || '/default-avatar.svg'}
                    alt={profile?.userDTO?.firstName}
                    className='w-full h-full rounded-full object-cover'
                  />
                </div>
                <h2 className='text-3xl font-bold text-[#00B074] mt-16'>
                  {profile?.userDTO?.lastName} {profile?.userDTO?.firstName}
                </h2>
              </div>

              {/* Divider */}
              <div className='border-t border-gray-200 my-6'></div>

              {/* Toggle Switches */}
              <div className='space-y-6 p-3'>
                <div>
                  <div className='flex items-center justify-between mb-2 text-start'>
                    <p className='text-base font-medium text-[#00B074]'>
                      Cho phép nhà tuyển dụng tìm kiếm hồ sơ trực tuyến của bạn
                    </p>
                    <Switch
                      checked={
                        profile?.candidateOtherInfoDTO?.searchable || false
                      }
                      onChange={() => {}}
                    />
                  </div>
                  <p className='text-sm text-gray-500 italic text-start'>
                    Cho phép nhà tuyển dụng chủ động tìm kiếm hồ sơ của bạn để
                    có thêm nhiều cơ hội việc làm tốt từ IT Jobs.
                  </p>
                </div>

                <div>
                  <div className='flex items-center justify-between mb-2 text-start'>
                    <p className='text-base font-medium text-[#00B074]'>
                      Nhận thông báo về email
                    </p>
                    <Switch
                      checked={profile?.userDTO?.mailReceive || false}
                      onChange={() => {}}
                    />
                  </div>
                  <p className='text-sm text-gray-500 italic text-start'>
                    Hãy bật thông báo để bạn không bỏ lỡ bất kỳ thông tin nào.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className='flex-1 space-y-8'>
            {/* Personal Information */}
            <div className='bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]'>
              <div className='bg-[#00B074] py-4 px-6 flex items-center justify-between rounded-t-lg'>
                <h2 className='text-xl font-semibold text-white'>
                  Thông tin cá nhân
                </h2>
                <Link
                  to='/candidate/profile'
                  className='text-white hover:text-white/80 transition-colors'
                >
                  <IoCreateOutline className='w-6 h-6' />
                </Link>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-2 gap-6'>
                  {/* First Row */}
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Họ và tên lót</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.lastName || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Tên</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.firstName || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>

                  {/* Second Row */}
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Email</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.email || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Ngày sinh</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.birthDay ? (
                        new Date(profile.userDTO.birthDay).toLocaleDateString(
                          'vi-VN'
                        )
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>

                  {/* Third Row */}
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Số điện thoại</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.phone || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Giới tính</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.gender === 1 ? (
                        'Nam'
                      ) : profile?.userDTO?.gender === 0 ? (
                        'Nữ'
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>

                  {/* Fourth Row */}
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Tỉnh/Thành phố</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.location ? (
                        profile.userDTO.location.split(',').pop()?.trim() || (
                          <i>(chưa có dữ liệu)</i>
                        )
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>
                  <div className='flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Quận/Huyện</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.location ? (
                        profile.userDTO.location.split(',')[1]?.trim() || (
                          <i>(chưa có dữ liệu)</i>
                        )
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>

                  {/* Full Width Rows */}
                  <div className='col-span-2 flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Địa chỉ</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.userDTO?.location ? (
                        profile.userDTO.location.split(',')[0]?.trim() || (
                          <i>(chưa có dữ liệu)</i>
                        )
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>
                  <div className='col-span-2 flex justify-between items-start gap-8'>
                    <p className='text-[#333] font-bold w-32'>Trường học</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.universityDTO?.name || (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Application Information */}
            <div className='bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]'>
              <div className='flex items-center gap-2 bg-[#00B074] text-white p-4 rounded-t-lg'>
                <h2 className='text-xl font-semibold'>
                  Thông tin việc muốn ứng tuyển
                </h2>
                <Link
                  to='/candidate/profile'
                  className='text-white hover:text-white/80 transition-colors ml-auto'
                >
                  <IoCreateOutline className='w-6 h-6' />
                </Link>
              </div>
              <div className='p-6'>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>
                      Công việc mong muốn
                    </p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.desiredJob || (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </p>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>
                      Vị trí làm việc
                    </p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.positionDTOs
                        ?.map((pos) => pos.name)
                        .join('/ ') || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>Chuyên ngành</p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.majorDTOs
                        ?.map((major) => major.name)
                        .join('/ ') || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>
                      Hình thức làm việc
                    </p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.scheduleDTOs
                        ?.map((schedule) => schedule.name)
                        .join('/ ') || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>
                      Địa điểm làm việc
                    </p>
                    <p className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO
                        ?.desiredWorkingProvince || <i>(chưa có dữ liệu)</i>}
                    </p>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>CV đính kèm</p>
                    <div className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.cv ? (
                        <div className='flex items-center gap-2'>
                          <span className='text-[#00B074]'>
                            CV_Nguyen Thi Hoa.pdf
                          </span>
                          <span className='text-gray-500 text-sm italic'>
                            (Click để xem)
                          </span>
                        </div>
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </div>
                  </div>
                  <div className='flex'>
                    <p className='text-[#333] font-bold w-48'>Thư xin việc</p>
                    <div className='text-[#666] flex-1'>
                      {profile?.candidateOtherInfoDTO?.referenceLetter ? (
                        <div className='whitespace-pre-line'>
                          <p>Dear employer,</p>
                          <p className='mt-2'>
                            {profile.candidateOtherInfoDTO.referenceLetter}
                          </p>
                          <p className='mt-2'>Scelerisque rutrum,</p>
                          <p>Hoa Nguyen.</p>
                        </div>
                      ) : (
                        <i>(chưa có dữ liệu)</i>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
