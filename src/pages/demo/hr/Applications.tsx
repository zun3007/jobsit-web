import { useState } from 'react';
import { IoFilterOutline, IoSearchOutline } from 'react-icons/io5';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

export default function DemoHRApplications() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { toasts, showSuccess, removeToast } = useToast();

  // Mock data for demo
  const applications = [
    {
      id: 1,
      candidateName: 'Nguyễn Văn A',
      position: 'Frontend Developer',
      jobTitle: 'Thực tập ReactJS',
      applyDate: '2025-02-25',
      status: 'Đang xem xét',
      email: 'nguyenvana@example.com',
      phone: '0901234567',
    },
    {
      id: 2,
      candidateName: 'Trần Thị B',
      position: 'Backend Developer',
      jobTitle: 'Java Developer',
      applyDate: '2025-02-24',
      status: 'Đã phỏng vấn',
      email: 'tranthib@example.com',
      phone: '0901234568',
    },
    {
      id: 3,
      candidateName: 'Lê Văn C',
      position: 'Business Analyst',
      jobTitle: 'Business Analyst',
      applyDate: '2025-02-23',
      status: 'Đã từ chối',
      email: 'levanc@example.com',
      phone: '0901234569',
    },
    {
      id: 4,
      candidateName: 'Phạm Thị D',
      position: 'Mobile Developer',
      jobTitle: 'Mobile Developer (React Native)',
      applyDate: '2025-02-23',
      status: 'Đã nhận việc',
      email: 'phamthid@example.com',
      phone: '0901234570',
    },
    {
      id: 5,
      candidateName: 'Hoàng Văn E',
      position: 'Frontend Developer',
      jobTitle: 'Thực tập ReactJS',
      applyDate: '2025-02-22',
      status: 'Đang xem xét',
      email: 'hoangvane@example.com',
      phone: '0901234571',
    },
  ];

  // Positions for filter dropdown
  const positions = [
    'Frontend Developer',
    'Backend Developer',
    'Business Analyst',
    'Mobile Developer',
  ];

  // Statuses for filter dropdown
  const statuses = [
    'Đang xem xét',
    'Đã phỏng vấn',
    'Đã từ chối',
    'Đã nhận việc',
  ];

  // Filter applications based on search and filters
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      searchTerm === '' ||
      app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPosition =
      selectedPosition === '' || app.position === selectedPosition;

    const matchesStatus =
      selectedStatus === '' || app.status === selectedStatus;

    return matchesSearch && matchesPosition && matchesStatus;
  });

  // Update application status (demo only)
  const handleStatusChange = (applicationId: number, newStatus: string) => {
    showSuccess(`Cập nhật trạng thái ứng viên thành công: ${newStatus}`);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý đơn ứng tuyển</h1>
      </div>

      <div className='bg-white rounded-lg p-6 shadow-sm'>
        {/* Search and filters */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='relative flex-grow'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <IoSearchOutline className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm'
              placeholder='Tìm kiếm ứng viên, công việc...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className='flex gap-4'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <IoFilterOutline className='h-5 w-5 text-gray-400' />
              </div>
              <select
                className='block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                aria-label='Chọn vị trí'
              >
                <option value=''>Tất cả vị trí</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
            </div>

            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <IoFilterOutline className='h-5 w-5 text-gray-400' />
              </div>
              <select
                className='block w-full pl-10 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md'
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                aria-label='Chọn trạng thái'
              >
                <option value=''>Tất cả trạng thái</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Applications table */}
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Ứng viên
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Vị trí
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Ngày ứng tuyển
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Trạng thái
                </th>
                <th
                  scope='col'
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredApplications.length > 0 ? (
                filteredApplications.map((application) => (
                  <tr key={application.id}>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {application.candidateName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {application.email}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {application.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {application.position}
                      </div>
                      <div className='text-sm text-gray-500'>
                        {application.jobTitle}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='text-sm text-gray-900'>
                        {new Date(application.applyDate).toLocaleDateString(
                          'vi-VN'
                        )}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          application.status === 'Đã nhận việc'
                            ? 'bg-green-100 text-green-800'
                            : application.status === 'Đã từ chối'
                            ? 'bg-red-100 text-red-800'
                            : application.status === 'Đã phỏng vấn'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {application.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <select
                        className='block w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                        value={application.status}
                        onChange={(e) =>
                          handleStatusChange(application.id, e.target.value)
                        }
                        aria-label={`Cập nhật trạng thái cho ${application.candidateName}`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-4 text-center text-gray-500'
                  >
                    Không tìm thấy ứng viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
