import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  IoLocationOutline,
  IoCalendarOutline,
  IoPersonOutline,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import JobDetailsMenu from '@/components/job/JobDetailsMenu';
import JobActionModal, { JobActionType } from '@/components/job/JobActionModal';
import DuplicateJobModal from '@/components/job/DuplicateJobModal';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

// Mock data for demonstration
const DEMO_JOBS = [
  {
    id: 1,
    name: 'Thực tập ReactJS',
    endDate: new Date(
      new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    ).toISOString(), // 30 days from now
    amount: 5,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [
      { id: 1, name: 'Frontend Developer' },
      { id: 2, name: 'Intern' },
    ],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 2, name: 'Web Development' },
    ],
    description:
      'Chúng tôi đang tìm kiếm thực tập sinh ReactJS tài năng để tham gia vào đội ngũ phát triển frontend. Bạn sẽ được làm việc trong môi trường chuyên nghiệp, học hỏi từ các lập trình viên giàu kinh nghiệm và tham gia vào các dự án thực tế.\n\nCông việc bao gồm:\n- Phát triển giao diện người dùng sử dụng ReactJS\n- Tích hợp API và xử lý dữ liệu\n- Tối ưu hóa hiệu suất ứng dụng\n- Tham gia vào quy trình phát triển sản phẩm từ ý tưởng đến triển khai',
    requirement:
      'Yêu cầu:\n- Có kiến thức cơ bản về HTML, CSS, JavaScript\n- Đã làm quen với ReactJS, Redux\n- Hiểu biết về REST API, JSON\n- Có khả năng làm việc nhóm và giao tiếp tốt\n- Siêng năng, chịu khó học hỏi và đam mê công nghệ mới',
    otherInfo:
      'Quyền lợi:\n- Trợ cấp hấp dẫn\n- Được đào tạo bởi các chuyên gia trong ngành\n- Có cơ hội được nhận chính thức sau thời gian thực tập\n- Môi trường làm việc trẻ trung, năng động\n- Các hoạt động team building thường xuyên\n- Được tham gia các khóa đào tạo nội bộ và chứng chỉ quốc tế',
    salaryMin: 3000000,
    salaryMax: 5000000,
  },
  {
    id: 2,
    name: 'Java Developer',
    endDate: new Date(
      new Date().getTime() + 15 * 24 * 60 * 60 * 1000
    ).toISOString(), // 15 days from now
    amount: 3,
    location: 'Hà Nội',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 3, name: 'Backend Developer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [{ id: 1, name: 'Computer Science' }],
    description:
      'Chúng tôi đang tìm kiếm một Java Developer có kinh nghiệm để tham gia vào đội ngũ phát triển backend của chúng tôi.\n\nCông việc bao gồm:\n- Phát triển và bảo trì các ứng dụng Java backend\n- Thiết kế và triển khai RESTful APIs\n- Tối ưu hóa hiệu suất ứng dụng\n- Tham gia vào quy trình phát triển sản phẩm từ ý tưởng đến triển khai',
    requirement:
      'Yêu cầu:\n- Có ít nhất 1-2 năm kinh nghiệm với Java\n- Thành thạo Spring Boot, Spring MVC, Spring Security\n- Kinh nghiệm làm việc với RESTful APIs\n- Hiểu biết về cơ sở dữ liệu SQL và NoSQL\n- Có khả năng làm việc nhóm và giao tiếp tốt',
    otherInfo:
      'Quyền lợi:\n- Lương thưởng hấp dẫn\n- Môi trường làm việc năng động, chuyên nghiệp\n- Cơ hội thăng tiến rõ ràng\n- Chế độ phúc lợi đầy đủ theo quy định\n- Được tham gia các khóa đào tạo nội bộ và chứng chỉ quốc tế',
    salaryMin: 15000000,
    salaryMax: 25000000,
  },
  {
    id: 3,
    name: 'Business Analyst',
    endDate: new Date(
      new Date().getTime() - 5 * 24 * 60 * 60 * 1000
    ).toISOString(), // 5 days ago (expired)
    amount: 2,
    location: 'Đà Nẵng',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 4, name: 'Business Analyst' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 3, name: 'Business' },
      { id: 4, name: 'IT' },
    ],
    description:
      'Chúng tôi đang tìm kiếm một Business Analyst tài năng để làm việc trực tiếp với khách hàng và đội ngũ phát triển nhằm định hình các yêu cầu sản phẩm.\n\nCông việc bao gồm:\n- Phân tích và ghi lại yêu cầu từ khách hàng\n- Tạo tài liệu đặc tả yêu cầu và thiết kế giao diện\n- Làm việc với đội ngũ phát triển để đảm bảo các yêu cầu được triển khai chính xác\n- Hỗ trợ khách hàng trong quá trình kiểm thử và xác nhận sản phẩm',
    requirement:
      'Yêu cầu:\n- Có ít nhất 2 năm kinh nghiệm trong vai trò Business Analyst\n- Thành thạo trong việc phân tích quy trình kinh doanh và yêu cầu phần mềm\n- Kỹ năng giao tiếp và thuyết trình xuất sắc\n- Kinh nghiệm làm việc với các công cụ phát triển Agile\n- Có kiến thức nền tảng về công nghệ phát triển phần mềm',
    otherInfo:
      'Quyền lợi:\n- Chế độ đãi ngộ hấp dẫn\n- Môi trường làm việc chuyên nghiệp và năng động\n- Cơ hội thăng tiến cao\n- Được đào tạo và nâng cao kỹ năng chuyên môn\n- Chế độ bảo hiểm và phúc lợi đầy đủ',
    salaryMin: 12000000,
    salaryMax: 18000000,
  },
  {
    id: 4,
    name: 'Mobile Developer (React Native)',
    endDate: new Date(
      new Date().getTime() + 20 * 24 * 60 * 60 * 1000
    ).toISOString(), // 20 days from now
    amount: 1,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 5, name: 'Mobile Developer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 5, name: 'Mobile Development' },
    ],
    description:
      'Chúng tôi đang tìm kiếm một Mobile Developer có kinh nghiệm với React Native để phát triển ứng dụng di động đa nền tảng cho khách hàng của chúng tôi.\n\nCông việc bao gồm:\n- Phát triển ứng dụng di động sử dụng React Native\n- Hợp tác với đội ngũ thiết kế để tạo ra giao diện người dùng mượt mà\n- Tích hợp với backend APIs và dịch vụ bên thứ ba\n- Tối ưu hóa hiệu suất ứng dụng trên cả iOS và Android',
    requirement:
      'Yêu cầu:\n- Có ít nhất 2 năm kinh nghiệm phát triển ứng dụng di động với React Native\n- Thành thạo JavaScript/TypeScript và React\n- Hiểu biết sâu về quy trình phát triển ứng dụng di động\n- Kinh nghiệm với quản lý trạng thái (Redux, Context API, MobX)\n- Đã từng phát hành ứng dụng lên App Store và Google Play\n- Có khả năng phát hiện và giải quyết các vấn đề hiệu suất',
    otherInfo:
      'Quyền lợi:\n- Môi trường làm việc chuyên nghiệp, cơ hội học hỏi công nghệ mới\n- Lương thưởng hấp dẫn, cạnh tranh với thị trường\n- Chế độ bảo hiểm sức khỏe cho nhân viên và người thân\n- Lịch làm việc linh hoạt\n- Các hoạt động team building thường xuyên\n- Cơ hội thăng tiến rõ ràng',
    salaryMin: 18000000,
    salaryMax: 30000000,
  },
  {
    id: 5,
    name: 'DevOps Engineer',
    endDate: new Date(
      new Date().getTime() + 25 * 24 * 60 * 60 * 1000
    ).toISOString(), // 25 days from now
    amount: 2,
    location: 'Hồ Chí Minh',
    companyDTO: {
      id: 1,
      name: 'R2S Academy',
      logo: 'https://r2s.edu.vn/wp-content/uploads/2020/04/r2s.com_.png',
    },
    positionDTOs: [{ id: 6, name: 'DevOps Engineer' }],
    scheduleDTOs: [{ id: 1, name: 'Full-time' }],
    majorDTOs: [
      { id: 1, name: 'Computer Science' },
      { id: 6, name: 'System Administration' },
    ],
    description:
      'Chúng tôi đang tìm kiếm một DevOps Engineer tài năng để tham gia vào đội ngũ phát triển và quản lý hạ tầng của chúng tôi.\n\nCông việc bao gồm:\n- Thiết kế, triển khai và quản lý quy trình CI/CD\n- Quản lý hạ tầng đám mây (AWS, GCP)\n- Tự động hóa quy trình phát triển và triển khai phần mềm\n- Giám sát hệ thống và giải quyết sự cố',
    requirement:
      'Yêu cầu:\n- Có ít nhất 3 năm kinh nghiệm trong vai trò DevOps Engineer\n- Thành thạo với Docker, Kubernetes\n- Kinh nghiệm với AWS/GCP và các dịch vụ đám mây\n- Hiểu biết sâu về các công cụ CI/CD (Jenkins, GitLab CI, GitHub Actions)\n- Kinh nghiệm với Infrastructure as Code (Terraform, CloudFormation)\n- Kiến thức về bảo mật hệ thống và quản lý mạng',
    otherInfo:
      'Quyền lợi:\n- Cơ hội làm việc với công nghệ hiện đại\n- Lương thưởng hấp dẫn, cạnh tranh với thị trường\n- Chế độ bảo hiểm sức khỏe toàn diện\n- Lịch làm việc linh hoạt\n- Môi trường làm việc quốc tế\n- Cơ hội tham gia các hội thảo và sự kiện công nghệ',
    salaryMin: 25000000,
    salaryMax: 40000000,
  },
];

export default function DemoHRJobDetails() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id || '0');
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Modal states
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    actionType: JobActionType;
  }>({
    isOpen: false,
    actionType: 'delete',
  });

  const [duplicateModal, setDuplicateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find the job by ID from our mock data
  const job = DEMO_JOBS.find((job) => job.id === jobId);

  // Check if job is expired
  const isExpired = job ? new Date(job.endDate) < new Date() : false;

  // Handle close job
  const handleCloseJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'close',
    });
  };

  // Handle reopen job
  const handleReopenJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'reopen',
    });
  };

  // Handle duplicate job
  const handleDuplicateJob = () => {
    setDuplicateModal(true);
  };

  // Handle delete job
  const handleDeleteJob = () => {
    setActionModal({
      isOpen: true,
      actionType: 'delete',
    });
  };

  // Confirm action (close or delete) - In demo, just show success message
  const confirmAction = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (actionModal.actionType === 'delete') {
        showSuccess('Xóa tin tuyển dụng thành công');
        navigate('/demo/hr/jobs');
      } else if (actionModal.actionType === 'close') {
        showSuccess('Đóng tin tuyển dụng thành công');
      } else if (actionModal.actionType === 'reopen') {
        showSuccess('Mở lại tin tuyển dụng thành công');
      }
      setActionModal({ isOpen: false, actionType: 'delete' });
    } catch {
      let errorMessage = 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      if (actionModal.actionType === 'delete') {
        errorMessage = 'Không thể xóa tin tuyển dụng. Vui lòng thử lại sau.';
      } else if (actionModal.actionType === 'close') {
        errorMessage = 'Không thể đóng tin tuyển dụng. Vui lòng thử lại sau.';
      } else if (actionModal.actionType === 'reopen') {
        errorMessage = 'Không thể mở lại tin tuyển dụng. Vui lòng thử lại sau.';
      }
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm duplicate job - In demo, just show success message
  const confirmDuplicate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showSuccess('Nhân bản tin tuyển dụng thành công');
      setDuplicateModal(false);
      navigate('/demo/hr/jobs');
    } catch {
      showError('Không thể nhân bản tin tuyển dụng. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  // Close modals
  const closeModal = () => {
    setActionModal({ isOpen: false, actionType: 'delete' });
  };

  const closeDuplicateModal = () => {
    setDuplicateModal(false);
  };

  // Loading state for initial page render
  if (!job) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500 text-lg'>
          Không tìm thấy thông tin công việc có ID {jobId}.
        </p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8'>
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {/* Header section with job title and action menu */}
        <div className='flex justify-between items-start p-6 border-b'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{job.name}</h1>
            <p className='text-gray-600 mt-1'>Công ty {job.companyDTO.name}</p>
            <div className='flex flex-wrap gap-2 mt-3'>
              {job.positionDTOs.map((position) => (
                <span
                  key={position.id}
                  className='bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full'
                >
                  {position.name}
                </span>
              ))}
              {job.scheduleDTOs.map((schedule) => (
                <span
                  key={schedule.id}
                  className='bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full'
                >
                  {schedule.name}
                </span>
              ))}
            </div>
          </div>

          {/* Action menu */}
          <JobDetailsMenu
            jobId={jobId}
            onClose={isExpired ? handleReopenJob : handleCloseJob}
            onDuplicate={handleDuplicateJob}
            onDelete={handleDeleteJob}
            isExpired={isExpired}
          />
        </div>

        {/* Job details section */}
        <div className='p-6 grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left column: Job description */}
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Mô tả công việc
              </h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{
                  __html: job.description.replace(/\n/g, '<br>'),
                }}
              />
            </div>

            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Yêu cầu công việc
              </h2>
              <div
                className='prose max-w-none'
                dangerouslySetInnerHTML={{
                  __html: job.requirement.replace(/\n/g, '<br>'),
                }}
              />
            </div>

            {job.otherInfo && (
              <div>
                <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                  Quyền lợi
                </h2>
                <div
                  className='prose max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: job.otherInfo.replace(/\n/g, '<br>'),
                  }}
                />
              </div>
            )}
          </div>

          {/* Right column: Job details */}
          <div className='lg:col-span-1 bg-gray-50 p-6 rounded-lg'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Thông tin công việc
            </h2>

            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <IoLocationOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Địa điểm làm việc</p>
                  <p className='font-medium'>{job.location}</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <IoPersonOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Số lượng cần tuyển</p>
                  <p className='font-medium'>{job.amount} ứng viên</p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <IoCalendarOutline className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Hạn nộp hồ sơ</p>
                  <p className='font-medium'>
                    {new Date(job.endDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              <div className='flex items-start gap-3'>
                <FaRegClock className='mt-1 text-gray-500 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-600'>Trợ cấp</p>
                  <p className='font-medium'>
                    {job.salaryMin.toLocaleString('vi-VN')} -{' '}
                    {job.salaryMax.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>

              <div className='pt-4 border-t'>
                <p className='text-sm text-gray-600 mb-2'>Chuyên ngành</p>
                <div className='flex flex-wrap gap-2'>
                  {job.majorDTOs.map((major) => (
                    <span
                      key={major.id}
                      className='bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full'
                    >
                      {major.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action modals */}
      <JobActionModal
        isOpen={actionModal.isOpen}
        onClose={closeModal}
        onConfirm={confirmAction}
        jobTitle={job.name}
        actionType={actionModal.actionType}
        isLoading={isLoading}
      />

      <DuplicateJobModal
        isOpen={duplicateModal}
        onClose={closeDuplicateModal}
        onConfirm={confirmDuplicate}
        jobTitle={job.name}
        isLoading={isLoading}
      />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
