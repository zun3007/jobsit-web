import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack, IoLocationOutline } from 'react-icons/io5';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

// Mock data for select options
const DEMO_POSITIONS = [
  { id: 1, name: 'Frontend Developer' },
  { id: 2, name: 'Backend Developer' },
  { id: 3, name: 'Full-Stack Developer' },
  { id: 4, name: 'Mobile Developer' },
  { id: 5, name: 'DevOps Engineer' },
  { id: 6, name: 'Business Analyst' },
  { id: 7, name: 'QA Engineer' },
  { id: 8, name: 'Intern' },
];

const DEMO_MAJORS = [
  { id: 1, name: 'Computer Science' },
  { id: 2, name: 'Information Technology' },
  { id: 3, name: 'Web Development' },
  { id: 4, name: 'Mobile Development' },
  { id: 5, name: 'Software Engineering' },
  { id: 6, name: 'Business' },
  { id: 7, name: 'System Administration' },
];

const DEMO_SCHEDULES = [
  { id: 1, name: 'Full-time' },
  { id: 2, name: 'Part-time' },
  { id: 3, name: 'Remote' },
  { id: 4, name: 'Hybrid' },
];

const DEMO_LOCATIONS = [
  'Hồ Chí Minh',
  'Hà Nội',
  'Đà Nẵng',
  'Cần Thơ',
  'Hải Phòng',
];

export default function DemoCreateJob() {
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requirement: '',
    otherInfo: '',
    location: '',
    positions: [] as number[],
    majors: [] as number[],
    schedules: [] as number[],
    amount: 1,
    endDate: '',
    salaryMin: 0,
    salaryMax: 0,
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Format today's date as YYYY-MM-DD for min date attribute
  const today = new Date().toISOString().split('T')[0];

  // Set default end date to 30 days from now
  useEffect(() => {
    const defaultEndDate = new Date();
    defaultEndDate.setDate(defaultEndDate.getDate() + 30);

    setFormData((prev) => ({
      ...prev,
      endDate: defaultEndDate.toISOString().split('T')[0],
    }));
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number inputs
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;

    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  // Handle multi-select changes
  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    fieldName: string
  ) => {
    const options = Array.from(e.target.selectedOptions).map((option) =>
      parseInt(option.value)
    );

    // Clear error when field is modified
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: options,
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Vui lòng nhập tên công việc';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả công việc';
    }

    if (!formData.requirement.trim()) {
      newErrors.requirement = 'Vui lòng nhập yêu cầu công việc';
    }

    if (!formData.location) {
      newErrors.location = 'Vui lòng chọn địa điểm làm việc';
    }

    if (formData.positions.length === 0) {
      newErrors.positions = 'Vui lòng chọn ít nhất một vị trí';
    }

    if (formData.majors.length === 0) {
      newErrors.majors = 'Vui lòng chọn ít nhất một chuyên ngành';
    }

    if (formData.schedules.length === 0) {
      newErrors.schedules = 'Vui lòng chọn ít nhất một hình thức';
    }

    if (formData.amount < 1) {
      newErrors.amount = 'Số lượng cần tuyển phải lớn hơn 0';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Vui lòng chọn hạn nộp hồ sơ';
    }

    if (formData.salaryMin < 0) {
      newErrors.salaryMin = 'Mức lương tối thiểu không được âm';
    }

    if (formData.salaryMax < formData.salaryMin) {
      newErrors.salaryMax =
        'Mức lương tối đa phải lớn hơn hoặc bằng mức lương tối thiểu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Demo mode - just show success message and redirect
      showSuccess('Tạo tin tuyển dụng thành công!');
      navigate('/demo/hr/jobs');
    } catch {
      showError('Đã xảy ra lỗi khi tạo tin tuyển dụng. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6 flex items-center'>
        <button
          type='button'
          onClick={() => navigate('/demo/hr/jobs')}
          className='mr-4 text-gray-500 hover:text-gray-700 transition-colors'
          aria-label='Quay lại trang danh sách công việc'
        >
          <IoArrowBack className='w-5 h-5' />
        </button>
        <h1 className='text-2xl font-bold text-gray-900'>
          Tạo tin tuyển dụng mới
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className='bg-white shadow-sm rounded-lg overflow-hidden'
      >
        <div className='p-6 space-y-6'>
          {/* Job basic info */}
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>
              Thông tin cơ bản
            </h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div className='col-span-2'>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Tên công việc <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                  placeholder='Nhập tên công việc'
                />
                {errors.name && (
                  <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
                )}
              </div>

              <div className='col-span-2'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Mô tả công việc <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.description ? 'border-red-300' : ''
                  }`}
                  placeholder='Nhập mô tả công việc, trách nhiệm, nhiệm vụ...'
                />
                {errors.description && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.description}
                  </p>
                )}
              </div>

              <div className='col-span-2'>
                <label
                  htmlFor='requirement'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Yêu cầu công việc <span className='text-red-500'>*</span>
                </label>
                <textarea
                  id='requirement'
                  name='requirement'
                  rows={5}
                  value={formData.requirement}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.requirement ? 'border-red-300' : ''
                  }`}
                  placeholder='Nhập yêu cầu về kỹ năng, kinh nghiệm, trình độ học vấn...'
                />
                {errors.requirement && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.requirement}
                  </p>
                )}
              </div>

              <div className='col-span-2'>
                <label
                  htmlFor='otherInfo'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Quyền lợi
                </label>
                <textarea
                  id='otherInfo'
                  name='otherInfo'
                  rows={5}
                  value={formData.otherInfo}
                  onChange={handleChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm'
                  placeholder='Nhập thông tin về quyền lợi, chế độ đãi ngộ, phúc lợi...'
                />
              </div>
            </div>
          </div>

          {/* Job details */}
          <div>
            <h2 className='text-lg font-medium text-gray-900 mb-4'>
              Chi tiết công việc
            </h2>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div>
                <label
                  htmlFor='location'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Địa điểm làm việc <span className='text-red-500'>*</span>
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <IoLocationOutline className='h-5 w-5 text-gray-400' />
                  </div>
                  <select
                    id='location'
                    name='location'
                    value={formData.location}
                    onChange={handleChange}
                    className={`pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.location ? 'border-red-300' : ''
                    }`}
                  >
                    <option value=''>Chọn địa điểm</option>
                    {DEMO_LOCATIONS.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.location && (
                  <p className='mt-1 text-sm text-red-600'>{errors.location}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='amount'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Số lượng cần tuyển <span className='text-red-500'>*</span>
                </label>
                <input
                  type='number'
                  id='amount'
                  name='amount'
                  min='1'
                  value={formData.amount}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.amount ? 'border-red-300' : ''
                  }`}
                />
                {errors.amount && (
                  <p className='mt-1 text-sm text-red-600'>{errors.amount}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='positions'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Vị trí <span className='text-red-500'>*</span>
                </label>
                <select
                  id='positions'
                  name='positions'
                  multiple
                  size={4}
                  value={formData.positions.map(String)}
                  onChange={(e) => handleMultiSelectChange(e, 'positions')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.positions ? 'border-red-300' : ''
                  }`}
                >
                  {DEMO_POSITIONS.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
                <p className='mt-1 text-xs text-gray-500'>
                  Giữ phím Ctrl để chọn nhiều vị trí
                </p>
                {errors.positions && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.positions}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='majors'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Chuyên ngành <span className='text-red-500'>*</span>
                </label>
                <select
                  id='majors'
                  name='majors'
                  multiple
                  size={4}
                  value={formData.majors.map(String)}
                  onChange={(e) => handleMultiSelectChange(e, 'majors')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.majors ? 'border-red-300' : ''
                  }`}
                >
                  {DEMO_MAJORS.map((major) => (
                    <option key={major.id} value={major.id}>
                      {major.name}
                    </option>
                  ))}
                </select>
                <p className='mt-1 text-xs text-gray-500'>
                  Giữ phím Ctrl để chọn nhiều chuyên ngành
                </p>
                {errors.majors && (
                  <p className='mt-1 text-sm text-red-600'>{errors.majors}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='schedules'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Hình thức làm việc <span className='text-red-500'>*</span>
                </label>
                <select
                  id='schedules'
                  name='schedules'
                  multiple
                  size={4}
                  value={formData.schedules.map(String)}
                  onChange={(e) => handleMultiSelectChange(e, 'schedules')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.schedules ? 'border-red-300' : ''
                  }`}
                >
                  {DEMO_SCHEDULES.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {schedule.name}
                    </option>
                  ))}
                </select>
                <p className='mt-1 text-xs text-gray-500'>
                  Giữ phím Ctrl để chọn nhiều hình thức
                </p>
                {errors.schedules && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.schedules}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='endDate'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Hạn nộp hồ sơ <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  id='endDate'
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleChange}
                  min={today}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.endDate ? 'border-red-300' : ''
                  }`}
                />
                {errors.endDate && (
                  <p className='mt-1 text-sm text-red-600'>{errors.endDate}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor='salaryMin'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Mức lương tối thiểu (VNĐ)
                </label>
                <input
                  type='number'
                  id='salaryMin'
                  name='salaryMin'
                  min='0'
                  step='500000'
                  value={formData.salaryMin}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.salaryMin ? 'border-red-300' : ''
                  }`}
                />
                {errors.salaryMin && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.salaryMin}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor='salaryMax'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Mức lương tối đa (VNĐ)
                </label>
                <input
                  type='number'
                  id='salaryMax'
                  name='salaryMax'
                  min='0'
                  step='500000'
                  value={formData.salaryMax}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                    errors.salaryMax ? 'border-red-300' : ''
                  }`}
                />
                {errors.salaryMax && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.salaryMax}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className='px-6 py-4 bg-gray-50 text-right'>
          <button
            type='button'
            onClick={() => navigate('/demo/hr/jobs')}
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3'
          >
            Hủy
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo tin tuyển dụng'}
          </button>
        </div>
      </form>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
