import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import Switch from '@/components/ui/Switch';
import { useCandidates } from '@/hooks/useCandidates';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToast } from '@/hooks/useToast';
import { useGeolocation } from '@/hooks/useGeolocation';
import { AxiosError } from 'axios';
import { fileService } from '@/services/fileService';
import { axiosInstance } from '@/services/api';
import { useVietnameseLocations } from '@/hooks/useVietnameseLocations';

interface PositionDTO {
  id: number;
  name: string;
}

interface MajorDTO {
  id: number;
  name: string;
}

interface ScheduleDTO {
  id: number;
  name: string;
}

interface UpdateProfileForm {
  lastName: string;
  firstName: string;
  email: string;
  birthDay: string;
  phone: string;
  gender: string;
  province: string;
  district: string;
  address: string;
  university: string;
  desiredJob: string;
  positionDTOs: PositionDTO[];
  majorDTOs: MajorDTO[];
  scheduleDTOs: ScheduleDTO[];
  desiredWorkingProvince: string;
  cv: File | null;
  referenceLetter: string;
}

const scheduleOptions = [
  { id: 1, name: 'Full time' },
  { id: 2, name: 'Part time' },
  { id: 3, name: 'Remote' },
];

const positionOptions = [
  { id: 1, name: 'Front end' },
  { id: 2, name: 'Back end' },
  { id: 3, name: 'Full Stack' },
  { id: 7, name: 'DevOps' },
];

const majorOptions = [
  { id: 1, name: 'Khoa học máy tính' },
  { id: 2, name: 'Công nghệ phần mềm' },
  { id: 3, name: 'Kỹ thuật máy tính' },
  { id: 4, name: 'Trí tuệ nhân tạo' },
  { id: 6, name: 'Hệ thống quản lý thông tin' },
];

export default function UpdateProfile() {
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const {
    province: geoProvince,
    district: geoDistrict,
    isLoading: isLoadingLocation,
  } = useGeolocation();

  const {
    profile,
    isLoadingApplications,
    isLoadingRecommendedJobs,
    updateProfile,
    updateSearchableStatus,
    updateReceiveEmailNotification,
    isUpdatingSearchableStatus,
    isUpdatingReceiveEmailNotification,
  } = useCandidates();

  const {
    provinces,
    getDistricts,
    isLoading: isLoadingLocations,
  } = useVietnameseLocations();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCV, setCurrentCV] = useState<string>('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [showMajorDropdown, setShowMajorDropdown] = useState(false);

  const { register, handleSubmit, setValue, reset, control, watch } =
    useForm<UpdateProfileForm>({
      defaultValues: {
        district: profile?.userDTO?.location?.split(',')[1]?.trim() || '',
        positionDTOs: [],
        majorDTOs: [],
        scheduleDTOs: [],
      },
    });

  // Watch the values to keep them in sync
  const positionDTOs = watch('positionDTOs') || [];
  const majorDTOs = watch('majorDTOs') || [];
  const scheduleDTOs = watch('scheduleDTOs') || [];

  // Watch for province changes
  const selectedProvince = useWatch({
    control,
    name: 'province',
  });

  // Update districts when province changes - with memoized getDistricts
  useEffect(() => {
    if (selectedProvince) {
      const provinceDistricts = getDistricts(selectedProvince);
      setDistricts(provinceDistricts);
    }
  }, [selectedProvince, getDistricts]); // Remove getDistricts from dependencies

  // Auto-fill location if user doesn't have it - with memoized getDistricts
  useEffect(() => {
    if (!isLoadingLocation && geoProvince && geoDistrict) {
      const userLocation = profile?.userDTO?.location;
      const hasLocation = userLocation && userLocation.includes(',');

      if (!hasLocation) {
        setValue('province', geoProvince);
        setValue('district', geoDistrict);
        const provinceDistricts = getDistricts(geoProvince);
        setDistricts(provinceDistricts);
      }
    }
  }, [
    isLoadingLocation,
    geoProvince,
    geoDistrict,
    profile,
    setValue,
    getDistricts,
  ]); // Remove getDistricts from dependencies

  useEffect(() => {
    if (profile) {
      const userLocation = profile.userDTO.location;
      const locationParts = userLocation?.split(',').map((part) => part.trim());

      reset({
        lastName: profile.userDTO.lastName || '',
        firstName: profile.userDTO.firstName || '',
        email: profile.userDTO.email || '',
        birthDay: profile.userDTO.birthDay
          ? formatDate(profile.userDTO.birthDay)
          : '',
        phone: profile.userDTO.phone || '',
        gender: profile.userDTO.gender ? '1' : '0',
        province: locationParts?.[2] || '',
        district: locationParts?.[1] || '',
        address: locationParts?.[0] || '',
        university: profile.candidateOtherInfoDTO?.universityDTO?.name || '',
        desiredJob: profile.candidateOtherInfoDTO?.desiredJob || '',
        desiredWorkingProvince:
          profile.candidateOtherInfoDTO?.desiredWorkingProvince || '',
        referenceLetter: profile.candidateOtherInfoDTO?.referenceLetter || '',
        positionDTOs: profile.candidateOtherInfoDTO?.positionDTOs || [],
        majorDTOs: profile.candidateOtherInfoDTO?.majorDTOs || [],
        scheduleDTOs: profile.candidateOtherInfoDTO?.scheduleDTOs || [],
      });

      // Set avatar preview if exists
      if (profile.userDTO.avatar) {
        setAvatarPreview(fileService.getFileDisplayUrl(profile.userDTO.avatar));
      }

      // Set current CV if exists
      if (profile.candidateOtherInfoDTO?.cv) {
        setCurrentCV(
          fileService.getFileDisplayUrl(profile.candidateOtherInfoDTO.cv)
        );
      }
    }
  }, [profile, reset]);

  // Format date from DD-MM-YYYY to YYYY-MM-DD for input type="date"
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('-');
    // Ensure year is 4 digits
    const fullYear = year.length === 2 ? `20${year}` : year.padStart(4, '20');
    return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatar(file);
      const localPreview = URL.createObjectURL(file);
      setAvatarPreview(fileService.getFileDisplayUrl(null, localPreview));
    }
  };

  const handleCvChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleRemoveCv = () => {
    setCvFile(null);
    const input = document.getElementById('cv-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const handleCancel = () => {
    // Reset form to current user data
    if (profile) {
      reset({
        lastName: profile.userDTO.lastName || '',
        firstName: profile.userDTO.firstName || '',
        email: profile.userDTO.email || '',
        birthDay: profile.userDTO.birthDay
          ? formatDate(profile.userDTO.birthDay)
          : '',
        phone: profile.userDTO.phone || '',
        gender: profile.userDTO.gender?.toString() || '',
        province: profile.userDTO.location
          ? profile.userDTO.location.split(',')[2]?.trim()
          : '',
        district: profile.userDTO.location
          ? profile.userDTO.location.split(',')[1]?.trim()
          : '',
        address: profile.userDTO.location
          ? profile.userDTO.location.split(',')[0]?.trim()
          : '',
        university: profile.candidateOtherInfoDTO?.universityDTO?.name || '',
        desiredJob: profile.candidateOtherInfoDTO?.desiredJob || '',
        desiredWorkingProvince:
          profile.candidateOtherInfoDTO?.desiredWorkingProvince || '',
        referenceLetter: profile.candidateOtherInfoDTO?.referenceLetter || '',
        positionDTOs: profile.candidateOtherInfoDTO?.positionDTOs || [],
        majorDTOs: profile.candidateOtherInfoDTO?.majorDTOs || [],
        scheduleDTOs: profile.candidateOtherInfoDTO?.scheduleDTOs || [],
      });

      // Reset avatar preview
      if (profile.userDTO.avatar) {
        setAvatarPreview(profile.userDTO.avatar);
      } else {
        setAvatarPreview('');
      }
      setAvatar(null);
    }
  };

  const handlePositionSelect = (id: number) => {
    const currentPositions = positionDTOs;
    if (!currentPositions.some((pos) => pos.id === id)) {
      const selectedPosition = positionOptions.find((opt) => opt.id === id);
      if (selectedPosition) {
        setValue('positionDTOs', [
          ...currentPositions,
          { id: selectedPosition.id, name: selectedPosition.name },
        ]);
      }
    }
    setShowPositionDropdown(false);
  };

  const handleRemovePosition = (id: number) => {
    setValue(
      'positionDTOs',
      positionDTOs.filter((pos) => pos.id !== id)
    );
  };

  const handleMajorSelect = (id: number) => {
    const currentMajors = majorDTOs;
    if (!currentMajors.some((major) => major.id === id)) {
      const selectedMajor = majorOptions.find((opt) => opt.id === id);
      if (selectedMajor) {
        setValue('majorDTOs', [
          ...currentMajors,
          { id: selectedMajor.id, name: selectedMajor.name },
        ]);
      }
    }
    setShowMajorDropdown(false);
  };

  const handleRemoveMajor = (id: number) => {
    setValue(
      'majorDTOs',
      majorDTOs.filter((major) => major.id !== id)
    );
  };

  const handleScheduleSelect = (id: number) => {
    const currentSchedules = scheduleDTOs;
    if (!currentSchedules.some((schedule) => schedule.id === id)) {
      const selectedSchedule = scheduleOptions.find((opt) => opt.id === id);
      if (selectedSchedule) {
        setValue('scheduleDTOs', [
          ...currentSchedules,
          { id: selectedSchedule.id, name: selectedSchedule.name },
        ]);
      }
    }
    setShowScheduleDropdown(false);
  };

  const handleRemoveSchedule = (id: number) => {
    setValue(
      'scheduleDTOs',
      scheduleDTOs.filter((schedule) => schedule.id !== id)
    );
  };

  const handleSearchableChange = async () => {
    if (!profile?.userDTO?.id) return;

    try {
      await updateSearchableStatus();
    } catch (error) {
      console.error('Failed to update searchable status:', error);
      showError('Failed to update searchable status');
    }
  };

  const handleReceiveEmailNotificationChange = async () => {
    if (!profile?.userDTO?.id) return;

    try {
      await updateReceiveEmailNotification();
    } catch (error) {
      console.error('Failed to update email notification status:', error);
      showError('Đã xảy ra lỗi khi cập nhật trạng thái nhận thông báo');
    }
  };

  const generateHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    // Convert to positive 10-character hex string
    return Math.abs(hash).toString(16).padStart(10, '0').slice(0, 10);
  };

  const onSubmit = async (data: UpdateProfileForm) => {
    const formData = new FormData();

    // Format date from YYYY-MM-DD to DD-MM-YYYY for API
    const formatDateForApi = (dateStr: string) => {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split('-');
      return `${day}-${month}-${year}`;
    };

    // Construct the profile data object
    const profileData = {
      userProfileDTO: {
        lastName: data.lastName,
        firstName: data.firstName,
        email: data.email,
        gender: parseInt(data.gender),
        phone: data.phone,
        birthDay: data.birthDay ? formatDateForApi(data.birthDay) : null,
        location:
          data.address && data.district && data.province
            ? `${data.address}, ${data.district}, ${data.province}`
            : null,
      },
      candidateOtherInfoDTO: {
        universityDTO: data.university
          ? { id: null, name: data.university }
          : null,
        referenceLetter: data.referenceLetter || null,
        desiredJob: data.desiredJob || null,
        desiredWorkingProvince: data.desiredWorkingProvince || null,
        positionDTOs: data.positionDTOs || [],
        majorDTOs: data.majorDTOs || [],
        searchable: profile?.candidateOtherInfoDTO?.searchable,
        scheduleDTOs: data.scheduleDTOs || [],
      },
    };

    try {
      // Append the profile data as JSON string
      formData.append('candidateProfileDTO', JSON.stringify(profileData));

      // Handle avatar file
      if (avatar) {
        // If user selected a new avatar
        const hashedName = generateHash(avatar.name);
        const extension = avatar.name.split('.').pop() || 'jpg';
        const newFile = new File([avatar], `${hashedName}.${extension}`, {
          type: avatar.type,
        });
        formData.append('fileAvatar', newFile);
      } else if (profile?.userDTO?.avatar) {
        // If user has an existing avatar but didn't select a new one
        try {
          const response = await fetch(
            fileService.getFileDisplayUrl(profile.userDTO.avatar)
          );
          const blob = await response.blob();
          const originalName =
            profile.userDTO.avatar.split('/').pop() || 'avatar.jpg';
          const hashedName = generateHash(originalName);
          const extension = originalName.split('.').pop() || 'jpg';
          const file = new File([blob], `${hashedName}.${extension}`, {
            type: blob.type,
          });
          formData.append('fileAvatar', file);
        } catch (error) {
          console.error('Error fetching current avatar:', error);
        }
      }

      if (cvFile) {
        // If user selected a new CV, append it
        const hashedName = generateHash(cvFile.name);
        const extension = cvFile.name.split('.').pop() || 'pdf';
        const newFile = new File([cvFile], `${hashedName}.${extension}`, {
          type: cvFile.type,
        });
        formData.append('fileCV', newFile);
      } else if (profile?.candidateOtherInfoDTO?.cv) {
        // If user has an existing CV but didn't select a new one
        try {
          const response = await axiosInstance.get(
            `/file/display/${profile?.candidateOtherInfoDTO?.cv
              .split('/')
              .pop()}`,
            {
              responseType: 'blob',
              headers: {
                'Content-Type': 'application/pdf',
                Accept: 'application/pdf',
              },
            }
          );

          const originalName =
            profile?.candidateOtherInfoDTO?.cv.split('/').pop() || 'cv.pdf';
          const hashedName = generateHash(originalName);
          const extension = originalName.split('.').pop() || 'pdf';
          const file = new File([response.data], `${hashedName}.${extension}`, {
            type: 'application/pdf',
          });
          formData.append('fileCV', file);
        } catch (error) {
          console.error('Error fetching current CV:', error);
        }
      }

      await updateProfile(formData);
      showSuccess('Cập nhật thông tin thành công');
    } catch (error) {
      if (error instanceof AxiosError) {
        showError(
          error.response?.data?.message ||
            'Đã xảy ra lỗi khi cập nhật thông tin'
        );
      } else if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Đã xảy ra lỗi khi cập nhật thông tin');
      }
    }
  };

  if (isLoadingApplications || isLoadingRecommendedJobs || isLoadingLocations) {
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
                <div className='relative w-44 h-44 mx-auto rounded-full border-2 border-[#00B074]'>
                  <img
                    src={avatarPreview || fileService.getFileDisplayUrl(null)}
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
                      onChange={handleSearchableChange}
                      disabled={isUpdatingSearchableStatus}
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
                      checked={
                        profile?.candidateOtherInfoDTO
                          ?.receiveEmailNotification || false
                      }
                      onChange={handleReceiveEmailNotificationChange}
                      disabled={isUpdatingReceiveEmailNotification}
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
          <div className='flex-1'>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
              {/* Personal Information */}
              <div className='bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]'>
                <div className='bg-[#00B074] py-4 px-6 rounded-t-lg'>
                  <h2 className='text-xl font-semibold text-white'>
                    Thông tin cá nhân
                  </h2>
                </div>
                <div className='p-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      Ảnh cá nhân <span className='text-red-500'>*</span>
                    </label>
                    <div className='w-full border-2 border-[#00B074] rounded-lg p-4'>
                      <div className='flex flex-col items-center gap-4'>
                        <div className='relative w-full h-48 border-2 border-dashed border-[#00B074] rounded-lg overflow-hidden bg-gray-50'>
                          <div className='w-full h-full flex flex-col items-center justify-center'>
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt='Avatar preview'
                                className='w-full h-full object-contain'
                              />
                            ) : (
                              <div className='w-full h-full flex flex-col items-center justify-center'>
                                <img
                                  src='/default-avatar.svg'
                                  alt='Default avatar'
                                  className='w-16 h-16 mb-2'
                                />
                                <p className='text-sm text-gray-500'>
                                  Chọn ảnh để tải lên
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <input
                            type='file'
                            accept='image/*'
                            onChange={handleAvatarChange}
                            className='hidden'
                            id='avatar-upload'
                          />
                          <label
                            htmlFor='avatar-upload'
                            className='px-4 py-2 bg-[#00B074] text-white rounded-lg cursor-pointer hover:bg-[#00B074]/90 transition-colors'
                          >
                            Chọn ảnh
                          </label>
                          <span className='text-xs text-red-500'>
                            *Hỗ trợ file .jpg .png và tối đa 512KB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-6 mt-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Họ và tên lót <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        {...register('lastName', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='Nguyễn'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Tên <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        {...register('firstName', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='Hoa'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='email'
                        {...register('email', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='nguyenhoa123@gmail.com'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Ngày sinh <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='date'
                        {...register('birthDay', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Số điện thoại <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='tel'
                        {...register('phone', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='0982151559'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Giới tính <span className='text-red-500'>*</span>
                      </label>
                      <select
                        {...register('gender', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none appearance-none bg-white'
                      >
                        <option value=''>Chọn giới tính</option>
                        <option value='1'>Nam</option>
                        <option value='0'>Nữ</option>
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Tỉnh/Thành phố <span className='text-red-500'>*</span>
                      </label>
                      <select
                        {...register('province', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none appearance-none bg-white'
                      >
                        <option value=''>Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Quận/Huyện <span className='text-red-500'>*</span>
                      </label>
                      <select
                        {...register('district', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none appearance-none bg-white disabled:bg-gray-100 disabled:border-gray-300'
                        disabled={!selectedProvince}
                      >
                        <option value=''>
                          {selectedProvince
                            ? 'Chọn quận/huyện'
                            : 'Vui lòng chọn tỉnh/thành phố trước'}
                        </option>
                        {districts.map((district) => (
                          <option key={district} value={district.trim()}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Địa chỉ <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        {...register('address', {
                          required: true,
                          setValueAs: (value) => value.replace(/,/g, ''),
                        })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='Nhập địa chỉ của bạn'
                      />
                    </div>
                    <div className='col-span-2'>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Trường học
                      </label>
                      <select
                        {...register('university')}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none appearance-none bg-white'
                      >
                        <option value=''>Chọn trường học</option>
                      </select>
                    </div>
                  </div>
                  <div className='flex justify-end gap-4 p-6'>
                    <button
                      type='submit'
                      className='px-8 py-2.5 bg-[#00B074] text-white font-medium rounded-lg hover:bg-[#00B074]/90 transition-colors'
                    >
                      Cập nhật
                    </button>
                    <button
                      type='button'
                      onClick={handleCancel}
                      className='px-8 py-2.5 border-2 border-[#00B074] text-[#00B074] font-medium rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              </div>

              {/* Job Application Information */}
              <div className='bg-white rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)]'>
                <div className='bg-[#00B074] py-4 px-6 rounded-t-lg'>
                  <h2 className='text-xl font-semibold text-white'>
                    Thông tin việc muốn ứng tuyển
                  </h2>
                </div>
                <div className='p-6'>
                  <div className='grid grid-cols-1 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Công việc mong muốn{' '}
                        <span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        {...register('desiredJob', { required: true })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Vị trí làm việc <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <div
                          className='w-full min-h-[42px] p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none cursor-pointer flex items-center'
                          onClick={() =>
                            setShowPositionDropdown(!showPositionDropdown)
                          }
                        >
                          <div className='flex-1 flex flex-wrap gap-2'>
                            {positionDTOs.map((pos) => {
                              const option = positionOptions.find(
                                (opt) => opt.id === pos.id
                              );
                              return option ? (
                                <div
                                  key={pos.id}
                                  className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1'
                                >
                                  <span className='text-sm'>{option.name}</span>
                                  <button
                                    type='button'
                                    title={`Xóa ${option.name}`}
                                    className='w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemovePosition(pos.id);
                                    }}
                                  >
                                    <svg
                                      className='w-3 h-3'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ) : null;
                            })}
                            {positionDTOs.length === 0 && (
                              <span className='text-gray-500 text-sm'>
                                Chọn vị trí làm việc
                              </span>
                            )}
                          </div>
                          <div className='flex-none ml-2'>
                            <svg
                              className='w-5 h-5 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </div>
                        </div>
                        {showPositionDropdown && (
                          <div className='absolute z-10 w-full mt-1 bg-white border-2 border-[#00B074] rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                            {positionOptions
                              .filter(
                                (option) =>
                                  !(positionDTOs || []).some(
                                    (pos) => pos.id === option.id
                                  )
                              )
                              .map((option) => (
                                <div
                                  key={option.id}
                                  className='px-4 py-2 hover:bg-gray-50 cursor-pointer'
                                  onClick={() => {
                                    handlePositionSelect(option.id);
                                    setShowPositionDropdown(false);
                                  }}
                                >
                                  {option.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Chuyên ngành <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <div
                          className='w-full min-h-[42px] p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none cursor-pointer flex items-center'
                          onClick={() =>
                            setShowMajorDropdown(!showMajorDropdown)
                          }
                        >
                          <div className='flex-1 flex flex-wrap gap-2'>
                            {majorDTOs.map((major) => {
                              const option = majorOptions.find(
                                (opt) => opt.id === major.id
                              );
                              return option ? (
                                <div
                                  key={major.id}
                                  className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1'
                                >
                                  <span className='text-sm'>{option.name}</span>
                                  <button
                                    type='button'
                                    title={`Xóa ${option.name}`}
                                    className='w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveMajor(major.id);
                                    }}
                                  >
                                    <svg
                                      className='w-3 h-3'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                      />
                                    </svg>
                                  </button>
                                </div>
                              ) : null;
                            })}
                            {majorDTOs.length === 0 && (
                              <span className='text-gray-500 text-sm'>
                                Chọn chuyên ngành
                              </span>
                            )}
                          </div>
                          <div className='flex-none ml-2'>
                            <svg
                              className='w-5 h-5 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </div>
                        </div>
                        {showMajorDropdown && (
                          <div className='absolute z-10 w-full mt-1 bg-white border-2 border-[#00B074] rounded-lg shadow-lg max-h-60 overflow-y-auto'>
                            {majorOptions
                              .filter(
                                (option) =>
                                  !(majorDTOs || []).some(
                                    (major) => major.id === option.id
                                  )
                              )
                              .map((option) => (
                                <div
                                  key={option.id}
                                  className='px-4 py-2 hover:bg-gray-50 cursor-pointer'
                                  onClick={() => {
                                    handleMajorSelect(option.id);
                                    setShowMajorDropdown(false);
                                  }}
                                >
                                  {option.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Hình thức làm việc{' '}
                        <span className='text-red-500'>*</span>
                      </label>
                      <div className='relative'>
                        <div
                          className='w-full min-h-[42px] p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none cursor-pointer flex items-center'
                          onClick={() =>
                            setShowScheduleDropdown(!showScheduleDropdown)
                          }
                        >
                          <div className='flex-1 flex flex-wrap gap-2'>
                            {scheduleDTOs.map((schedule) => {
                              const option = scheduleOptions.find(
                                (opt) => opt.id === schedule.id
                              ) || {
                                id: schedule.id,
                                name:
                                  schedule.id === 1
                                    ? 'Full time'
                                    : schedule.id === 2
                                    ? 'Part time'
                                    : 'Remote',
                              };
                              return (
                                <div
                                  key={schedule.id}
                                  className='flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1'
                                >
                                  <span className='text-sm'>{option.name}</span>
                                  <button
                                    type='button'
                                    title={`Xóa ${option.name}`}
                                    className='w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-200'
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleRemoveSchedule(schedule.id);
                                    }}
                                  >
                                    <svg
                                      className='w-3 h-3'
                                      fill='none'
                                      stroke='currentColor'
                                      viewBox='0 0 24 24'
                                      xmlns='http://www.w3.org/2000/svg'
                                    >
                                      <path
                                        strokeLinecap='round'
                                        strokeLinejoin='round'
                                        strokeWidth={2}
                                        d='M6 18L18 6M6 6l12 12'
                                      />
                                    </svg>
                                  </button>
                                </div>
                              );
                            })}
                            {scheduleDTOs.length === 0 && (
                              <span className='text-gray-500 text-sm'>
                                Chọn hình thức làm việc
                              </span>
                            )}
                          </div>
                          <div className='flex-none ml-2'>
                            <svg
                              className='w-5 h-5 text-gray-400'
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          </div>
                        </div>
                        {showScheduleDropdown && scheduleOptions.length > 0 && (
                          <div className='absolute z-10 w-full mt-1 bg-white border-2 border-[#00B074] rounded-lg shadow-lg'>
                            {scheduleOptions
                              .filter(
                                (option) =>
                                  !(scheduleDTOs || []).some(
                                    (schedule) => schedule.id === option.id
                                  )
                              )
                              .map((option) => (
                                <div
                                  key={option.id}
                                  className='px-4 py-2 hover:bg-gray-50 cursor-pointer'
                                  onClick={() =>
                                    handleScheduleSelect(option.id)
                                  }
                                >
                                  {option.name}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Địa điểm làm việc{' '}
                        <span className='text-red-500'>*</span>
                      </label>
                      <select
                        {...register('desiredWorkingProvince', {
                          required: true,
                        })}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none appearance-none bg-white'
                      >
                        <option value=''>Chọn địa điểm làm việc</option>
                        {provinces.map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        CV đính kèm <span className='text-red-500'>*</span>
                      </label>
                      <div className='w-full border-2 border-[#00B074] rounded-lg p-4'>
                        <div className='flex flex-col items-center gap-4'>
                          <div className='relative w-full h-48 border-2 border-dashed border-[#00B074] rounded-lg overflow-hidden bg-gray-50'>
                            <div className='w-full h-full flex flex-col items-center justify-center'>
                              {cvFile ? (
                                <div className='flex flex-col items-center'>
                                  <svg
                                    className='w-16 h-16 mb-2 text-[#00B074]'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                    />
                                  </svg>
                                  <p className='text-sm font-medium text-gray-900 mb-1'>
                                    {cvFile.name}
                                  </p>
                                  <p className='text-xs text-gray-500'>
                                    {(cvFile.size / (1024 * 1024)).toFixed(2)}{' '}
                                    MB
                                  </p>
                                  <button
                                    type='button'
                                    onClick={handleRemoveCv}
                                    className='mt-2 text-sm text-red-500 hover:text-red-700 font-medium'
                                  >
                                    Xóa file
                                  </button>
                                </div>
                              ) : currentCV ? (
                                <div className='flex flex-col items-center'>
                                  <svg
                                    className='w-16 h-16 mb-2 text-[#00B074]'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                    />
                                  </svg>
                                  <p className='text-sm font-medium text-gray-900 mb-1'>
                                    CV hiện tại
                                  </p>
                                  <a
                                    href={currentCV}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='text-sm text-[#00B074] hover:text-[#00B074]/80 transition-colors'
                                  >
                                    Xem CV
                                  </a>
                                </div>
                              ) : (
                                <>
                                  <svg
                                    className='w-16 h-16 mb-2 text-gray-400'
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth={2}
                                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                                    />
                                  </svg>
                                  <p className='text-sm text-gray-500'>
                                    Chọn CV để tải lên
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input
                              type='file'
                              accept='.pdf,.doc,.docx'
                              onChange={handleCvChange}
                              className='hidden'
                              id='cv-upload'
                            />
                            <label
                              htmlFor='cv-upload'
                              className='px-4 py-2 bg-[#00B074] text-white rounded-lg cursor-pointer hover:bg-[#00B074]/90 transition-colors'
                            >
                              Chọn CV
                            </label>
                            <span className='text-xs text-red-500'>
                              *Chỉ chấp nhận file PDF, DOC, DOCX
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Thư xin việc
                      </label>
                      <textarea
                        {...register('referenceLetter')}
                        rows={6}
                        className='w-full p-2 border-2 border-[#00B074] rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
                        placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh và điểm yếu) và nêu rõ mong muốn, lý do làm việc tại công ty này.'
                      />
                    </div>
                  </div>
                </div>
                <div className='flex justify-end gap-4 p-6'>
                  <button
                    type='submit'
                    className='px-8 py-2.5 bg-[#00B074] text-white font-medium rounded-lg hover:bg-[#00B074]/90 transition-colors'
                  >
                    Cập nhật
                  </button>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='px-8 py-2.5 border-2 border-[#00B074] text-[#00B074] font-medium rounded-lg hover:bg-gray-50 transition-colors'
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
