import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

export default function DemoHRProfile() {
  const { toasts, showSuccess, removeToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Mock data for HR user
  const [hrData, setHrData] = useState({
    userDTO: {
      id: 1,
      firstName: 'Thu',
      lastName: 'Nguyen',
      email: 'thunguyen@r2s.com.vn',
      phone: '0901234567',
      birthdate: '1990-01-15',
      isEmailConfirmed: true,
      createdDate: '2024-01-01',
    },
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      email: 'contact@r2s.edu.vn',
      phone: '02838364748',
      website: 'https://r2s.edu.vn',
      address:
        '271 Đường Lê Văn Việt, Phường Hiệp Phú, Thành phố Thủ Đức, Thành phố Hồ Chí Minh',
      description:
        'R2S Academy là một trung tâm đào tạo CNTT hàng đầu tại Việt Nam, chuyên cung cấp các khóa học đa dạng về lập trình, phát triển web, ứng dụng di động và các công nghệ mới nhất.',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
  });

  // Form state for editing
  const [formData, setFormData] = useState({ ...hrData });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [objectKey, field] = name.split('.');
      setFormData({
        ...formData,
        [objectKey]: {
          ...formData[objectKey as keyof typeof formData],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Start editing
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData({ ...hrData });
    setIsEditing(false);
  };

  // Save changes
  const handleSave = () => {
    // In a real app, this would call an API
    setHrData(formData);
    setIsEditing(false);
    showSuccess('Thông tin đã được cập nhật thành công!');
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-lg p-8 shadow-sm'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-bold'>Thông tin cá nhân</h1>
            <Link
              to='/demo/hr/jobs'
              className='text-[#00B074] hover:text-[#00B074]/80 transition-colors'
            >
              Đổi mật khẩu
            </Link>
          </div>

          <div className='space-y-6'>
            {/* Personal Information */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Thông tin cá nhân</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='lastName'
                  >
                    Họ
                  </label>
                  <input
                    id='lastName'
                    name='userDTO.lastName'
                    type='text'
                    value={formData.userDTO.lastName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='firstName'
                  >
                    Tên
                  </label>
                  <input
                    id='firstName'
                    name='userDTO.firstName'
                    type='text'
                    value={formData.userDTO.firstName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='email'
                  >
                    Email
                  </label>
                  <input
                    id='email'
                    name='userDTO.email'
                    type='email'
                    value={formData.userDTO.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='phone'
                  >
                    Số điện thoại
                  </label>
                  <input
                    id='phone'
                    name='userDTO.phone'
                    type='tel'
                    value={formData.userDTO.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='birthdate'
                  >
                    Ngày sinh
                  </label>
                  <input
                    id='birthdate'
                    name='userDTO.birthdate'
                    type='date'
                    value={formData.userDTO.birthdate}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h2 className='text-lg font-semibold mb-4'>Thông tin công ty</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='md:col-span-2'>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyName'
                  >
                    Tên công ty
                  </label>
                  <input
                    id='companyName'
                    name='companyDTO.name'
                    type='text'
                    value={formData.companyDTO.name}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyEmail'
                  >
                    Email công ty
                  </label>
                  <input
                    id='companyEmail'
                    name='companyDTO.email'
                    type='email'
                    value={formData.companyDTO.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyPhone'
                  >
                    Số điện thoại công ty
                  </label>
                  <input
                    id='companyPhone'
                    name='companyDTO.phone'
                    type='tel'
                    value={formData.companyDTO.phone}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyWebsite'
                  >
                    Website
                  </label>
                  <input
                    id='companyWebsite'
                    name='companyDTO.website'
                    type='url'
                    value={formData.companyDTO.website}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div className='md:col-span-2'>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyAddress'
                  >
                    Địa chỉ
                  </label>
                  <input
                    id='companyAddress'
                    name='companyDTO.address'
                    type='text'
                    value={formData.companyDTO.address}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div className='md:col-span-2'>
                  <label
                    className='block text-sm font-medium text-gray-700 mb-1'
                    htmlFor='companyDescription'
                  >
                    Giới thiệu công ty
                  </label>
                  <textarea
                    id='companyDescription'
                    name='companyDTO.description'
                    rows={4}
                    value={formData.companyDTO.description}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={`w-full px-4 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-[#00B074] ${
                      isEditing ? 'bg-white' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex justify-end space-x-4 pt-4'>
              {isEditing ? (
                <>
                  <button
                    type='button'
                    onClick={handleCancel}
                    className='px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    Hủy
                  </button>
                  <button
                    type='button'
                    onClick={handleSave}
                    className='px-4 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors'
                  >
                    Lưu thay đổi
                  </button>
                </>
              ) : (
                <button
                  type='button'
                  onClick={handleEdit}
                  className='px-4 py-2 bg-[#00B074] text-white rounded hover:bg-[#00B074]/90 transition-colors'
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
