import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useJobs } from '@/hooks/useJobs';
import { useAppSelector } from '@/app/store';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';
import Spinner from '@/components/ui/Spinner';
// @ts-expect-error - React-datepicker doesn't have proper TypeScript types
import DatePicker from 'react-datepicker';
// @ts-expect-error - CSS import
import 'react-datepicker/dist/react-datepicker.css';
import { useHRByUserId } from '@/hooks/useHR';
import { CreateJobRequest } from '@/services/jobService';
import { IoChevronDown } from 'react-icons/io5';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignLeft,
  FaAlignCenter,
} from 'react-icons/fa';

// Form validation schema
const createJobSchema = z
  .object({
    name: z
      .string()
      .min(5, { message: 'Tên công việc phải có ít nhất 5 ký tự' }),
    description: z
      .string()
      .min(30, { message: 'Mô tả công việc phải có ít nhất 30 ký tự' }),
    requirement: z
      .string()
      .min(30, { message: 'Yêu cầu công việc phải có ít nhất 30 ký tự' }),
    benefits: z.string().default(''),
    amount: z.number().min(1, { message: 'Số lượng tuyển phải lớn hơn 0' }),
    startDate: z.date(),
    endDate: z.date(),
    salaryMin: z.number().min(0, { message: 'Lương tối thiểu không được âm' }),
    salaryMax: z.number().min(0, { message: 'Lương tối đa không được âm' }),
    country: z.string().default('Việt Nam'),
    province: z.string().min(2, { message: 'Vui lòng chọn tỉnh/thành phố' }),
    district: z.string().min(2, { message: 'Vui lòng chọn quận/huyện' }),
    location: z.string().min(2, { message: 'Vui lòng nhập địa điểm làm việc' }),
    position: z.string().min(2, { message: 'Vui lòng chọn vị trí' }),
    major: z.string().min(2, { message: 'Vui lòng chọn chuyên ngành' }),
    workType: z
      .string()
      .min(2, { message: 'Vui lòng chọn hình thức làm việc' }),
    positionIds: z
      .array(z.number())
      .min(1, { message: 'Chọn ít nhất một vị trí' }),
    majorIds: z
      .array(z.number())
      .min(1, { message: 'Chọn ít nhất một chuyên ngành' }),
    scheduleIds: z
      .array(z.number())
      .min(1, { message: 'Chọn ít nhất một hình thức làm việc' }),
  })
  .refine((data) => data.salaryMax >= data.salaryMin, {
    message: 'Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu',
    path: ['salaryMax'],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['endDate'],
  });

type CreateJobFormData = z.infer<typeof createJobSchema>;

export default function CreateJob() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { data: hr } = useHRByUserId(user?.id || 0);
  const { createJob, isCreating } = useJobs();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Positions, majors, and schedule types
  const [positions] = useState([
    { id: 1, name: 'Front end' },
    { id: 2, name: 'Back end' },
    { id: 3, name: 'Full Stack' },
    { id: 7, name: 'DevOps' },
  ]);

  const [majors] = useState([
    { id: 1, name: 'Khoa học máy tính' },
    { id: 2, name: 'Công nghệ phần mềm' },
    { id: 3, name: 'Kỹ thuật máy tính' },
    { id: 4, name: 'Trí tuệ nhân tạo' },
    { id: 6, name: 'Hệ thống quản lý thông tin' },
  ]);

  const [schedules] = useState([
    { id: 1, name: 'Full time' },
    { id: 2, name: 'Part time' },
    { id: 3, name: 'Remote' },
  ]);

  const [provinces] = useState([
    { id: 1, name: 'Hà Nội' },
    { id: 2, name: 'TP. HCM' },
    { id: 3, name: 'Đà Nẵng' },
  ]);

  const [districts] = useState([
    { id: 1, name: 'Quận Bình Thạnh' },
    { id: 2, name: 'Quận 1' },
    { id: 3, name: 'Quận 3' },
  ]);

  const [salaryOptions] = useState([
    { id: 1, value: 0, display: 'Thương lượng' },
    { id: 2, value: 5000000, display: '5 triệu' },
    { id: 3, value: 10000000, display: '10 triệu' },
    { id: 4, value: 15000000, display: '15 triệu' },
    { id: 5, value: 20000000, display: '20 triệu' },
    { id: 6, value: 25000000, display: '25 triệu' },
    { id: 7, value: 30000000, display: '30 triệu' },
  ]);

  // Form setup
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      name: '',
      description: '',
      requirement: '',
      benefits: '',
      amount: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)), // Default end date: 30 days from now
      salaryMin: 0,
      salaryMax: 0,
      country: 'Việt Nam',
      province: '',
      district: '',
      location: '',
      position: '',
      major: '',
      workType: '',
      positionIds: [],
      majorIds: [],
      scheduleIds: [],
    },
  });

  // Watch form values
  const watchPosition = watch('position');
  const watchMajor = watch('major');
  const watchWorkType = watch('workType');
  const watchProvince = watch('province');

  // Update hidden arrays when dropdowns change
  useEffect(() => {
    const position = positions.find((p) => p.name === watchPosition);
    if (position) {
      setValue('positionIds', [position.id], { shouldValidate: true });
    }
  }, [watchPosition, setValue]);

  useEffect(() => {
    const major = majors.find((m) => m.name === watchMajor);
    if (major) {
      setValue('majorIds', [major.id], { shouldValidate: true });
    }
  }, [watchMajor, setValue]);

  useEffect(() => {
    const schedule = schedules.find((s) => s.name === watchWorkType);
    if (schedule) {
      setValue('scheduleIds', [schedule.id], { shouldValidate: true });
    }
  }, [watchWorkType, setValue]);

  // Update available districts when province changes
  useEffect(() => {
    if (watchProvince) {
      setValue('district', '');
    }
  }, [watchProvince, setValue]);

  // Handle form submission
  const onSubmit = async (data: CreateJobFormData) => {
    if (!hr) {
      showError('Không tìm thấy thông tin HR');
      return;
    }

    try {
      const jobRequest: CreateJobRequest = {
        name: data.name,
        description: data.description,
        requirement: data.requirement,
        otherInfo: data.benefits || '',
        amount: data.amount,
        startDate: data.startDate.toISOString().split('T')[0],
        endDate: data.endDate.toISOString().split('T')[0],
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        location: `${data.location}, ${data.district}, ${data.province}`,
        positionIds: data.positionIds,
        majorIds: data.majorIds,
        scheduleIds: data.scheduleIds,
      };

      await createJob(jobRequest);
      showSuccess('Tạo tin tuyển dụng thành công');
      navigate('/hr/jobs');
    } catch {
      showError('Đã xảy ra lỗi. Vui lòng thử lại sau');
    }
  };

  const RichTextToolbar = () => (
    <div className='flex items-center space-x-1 border-b pb-2 mb-1'>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Bold'
        title='Bold'
      >
        <FaBold className='text-gray-600' />
      </button>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Italic'
        title='Italic'
      >
        <FaItalic className='text-gray-600' />
      </button>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Underline'
        title='Underline'
      >
        <FaUnderline className='text-gray-600' />
      </button>
      <span className='mx-1 text-gray-300'>|</span>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Bulleted List'
        title='Bulleted List'
      >
        <FaListUl className='text-gray-600' />
      </button>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Numbered List'
        title='Numbered List'
      >
        <FaListOl className='text-gray-600' />
      </button>
      <span className='mx-1 text-gray-300'>|</span>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Align Left'
        title='Align Left'
      >
        <FaAlignLeft className='text-gray-600' />
      </button>
      <button
        type='button'
        className='p-1 hover:bg-gray-100 rounded'
        aria-label='Align Center'
        title='Align Center'
      >
        <FaAlignCenter className='text-gray-600' />
      </button>
    </div>
  );

  return (
    <div className='container mx-auto py-8'>
      {/* Header */}
      <div className='mb-8 text-center'>
        <h1 className='text-2xl font-bold text-[#00B074]'>
          Đăng tin tuyển dụng mới
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className='max-w-5xl mx-auto bg-white rounded-md shadow-sm p-8 border border-gray-200'
      >
        {/* Job Title */}
        <div className='mb-6'>
          <label htmlFor='name' className='block text-sm mb-1'>
            Tiêu đề công việc <span className='text-red-500'>*</span>
          </label>
          <input
            id='name'
            type='text'
            {...register('name')}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#00B074]'
          />
          {errors.name && (
            <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
          )}
        </div>

        {/* Job Categories */}
        <div className='grid grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block text-sm mb-1'>
              Vị trí làm việc <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <select
                {...register('position')}
                className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
              >
                <option value=''>Chọn vị trí</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.name}>
                    {position.name}
                  </option>
                ))}
              </select>
              <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <IoChevronDown className='text-gray-500' />
              </div>
            </div>
            {errors.position && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <label className='block text-sm mb-1'>
              Chuyên ngành <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <select
                {...register('major')}
                className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
              >
                <option value=''>Chọn chuyên ngành</option>
                {majors.map((major) => (
                  <option key={major.id} value={major.name}>
                    {major.name}
                  </option>
                ))}
              </select>
              <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <IoChevronDown className='text-gray-500' />
              </div>
            </div>
            {errors.major && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.major.message}
              </p>
            )}
          </div>
        </div>

        {/* Work Type and Amount */}
        <div className='grid grid-cols-2 gap-6 mb-6'>
          <div>
            <label className='block text-sm mb-1'>
              Hình thức làm việc <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <select
                {...register('workType')}
                className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
              >
                <option value=''>Chọn hình thức</option>
                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.name}>
                    {schedule.name}
                  </option>
                ))}
              </select>
              <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <IoChevronDown className='text-gray-500' />
              </div>
            </div>
            {errors.workType && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.workType.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor='amount' className='block text-sm mb-1'>
              Số lượng tuyển <span className='text-red-500'>*</span>
            </label>
            <input
              id='amount'
              type='number'
              {...register('amount', { valueAsNumber: true })}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#00B074]'
              min='1'
            />
            {errors.amount && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>

        {/* Deadline and Salary Range */}
        <div className='mb-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm mb-1'>
                Hạn nộp hồ sơ <span className='text-red-500'>*</span>
              </label>
              <Controller
                control={control}
                name='endDate'
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) =>
                      date && field.onChange(date)
                    }
                    className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#00B074]'
                    dateFormat='dd/MM/yyyy'
                    minDate={new Date()}
                    placeholderText='Chọn ngày'
                  />
                )}
              />
              {errors.endDate && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.endDate.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm mb-1'>
                Trợ cấp <span className='text-red-500'>*</span>
              </label>
              <div className='flex items-center gap-2'>
                <div className='relative flex-1'>
                  <select
                    {...register('salaryMin', { valueAsNumber: true })}
                    className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
                  >
                    {salaryOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.display}
                      </option>
                    ))}
                  </select>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <IoChevronDown className='text-gray-500' />
                  </div>
                </div>
                <span>-</span>
                <div className='relative flex-1'>
                  <select
                    {...register('salaryMax', { valueAsNumber: true })}
                    className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
                  >
                    {salaryOptions.map((option) => (
                      <option key={option.id} value={option.value}>
                        {option.display}
                      </option>
                    ))}
                  </select>
                  <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                    <IoChevronDown className='text-gray-500' />
                  </div>
                </div>
              </div>
              {errors.salaryMax && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.salaryMax.message}
                </p>
              )}
              <div className='text-gray-400 text-xs mt-1'>Đơn vị tính VNĐ</div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className='mb-6'>
          <div className='grid grid-cols-3 gap-6 mb-3'>
            <div>
              <label className='block text-sm mb-1'>
                Quốc gia <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  {...register('country')}
                  className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
                  disabled
                >
                  <option value='Việt Nam'>Việt Nam</option>
                </select>
                <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <IoChevronDown className='text-gray-500' />
                </div>
              </div>
            </div>

            <div>
              <label className='block text-sm mb-1'>
                Tỉnh/ Thành phố <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  {...register('province')}
                  className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
                >
                  <option value=''>Chọn tỉnh/thành phố</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <IoChevronDown className='text-gray-500' />
                </div>
              </div>
              {errors.province && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.province.message}
                </p>
              )}
            </div>

            <div>
              <label className='block text-sm mb-1'>
                Quận/ Huyện <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select
                  {...register('district')}
                  className='w-full px-3 py-2 bg-white border rounded-md focus:outline-none focus:border-[#00B074] appearance-none'
                  disabled={!watchProvince}
                >
                  <option value=''>Chọn quận/huyện</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                <div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <IoChevronDown className='text-gray-500' />
                </div>
              </div>
              {errors.district && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.district.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor='location' className='block text-sm mb-1'>
              Địa điểm làm việc <span className='text-red-500'>*</span>
            </label>
            <input
              id='location'
              type='text'
              {...register('location')}
              className='w-full px-3 py-2 border rounded-md focus:outline-none focus:border-[#00B074]'
              placeholder='Lầu 8, tòa nhà Pearl Plaza, 561A Điện Biên Phủ, phường 25'
            />
            {errors.location && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.location.message}
              </p>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className='mb-6'>
          <label htmlFor='description' className='block text-sm mb-1'>
            Mô tả công việc <span className='text-red-500'>*</span>
          </label>
          <div className='border rounded-md'>
            <RichTextToolbar />
            <textarea
              id='description'
              {...register('description')}
              className='w-full px-3 py-2 border-0 focus:outline-none min-h-[200px]'
              placeholder='Nhập thông tin cho vị trí công việc: yêu cầu, trách nhiệm mà ứng viên có thể đảm nhận khi làm việc ở công ty'
            ></textarea>
          </div>
          {errors.description && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Job Requirements */}
        <div className='mb-6'>
          <label htmlFor='requirement' className='block text-sm mb-1'>
            Yêu cầu công việc <span className='text-red-500'>*</span>
          </label>
          <div className='border rounded-md'>
            <RichTextToolbar />
            <textarea
              id='requirement'
              {...register('requirement')}
              className='w-full px-3 py-2 border-0 focus:outline-none min-h-[200px]'
              placeholder='Nhập kỹ năng chuyên môn hoặc kỹ năng mềm cần thiết với công việc mà ứng viên cần quan tâm'
            ></textarea>
          </div>
          {errors.requirement && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.requirement.message}
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className='mb-8'>
          <label htmlFor='benefits' className='block text-sm mb-1'>
            Chế độ phúc lợi
          </label>
          <div className='border rounded-md'>
            <RichTextToolbar />
            <textarea
              id='benefits'
              {...register('benefits')}
              className='w-full px-3 py-2 border-0 focus:outline-none min-h-[200px]'
              placeholder='Nhập những quyền lợi, lợi ích của công việc cho ứng viên với vị trí đăng tuyển'
            ></textarea>
          </div>
        </div>

        {/* Submit buttons */}
        <div className='flex justify-center gap-4'>
          <button
            type='button'
            onClick={() => navigate('/hr/jobs')}
            className='px-10 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors font-medium'
          >
            Hủy
          </button>
          <button
            type='submit'
            className='px-10 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors font-medium'
            disabled={isCreating}
          >
            {isCreating ? (
              <div className='flex items-center gap-2'>
                <Spinner size='sm' variant='white' />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              'Đăng tuyển'
            )}
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
