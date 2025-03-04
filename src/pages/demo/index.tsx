import { Link } from 'react-router-dom';
import {
  IoBriefcaseOutline,
  IoPersonOutline,
  IoSettingsOutline,
} from 'react-icons/io5';

export default function DemoLanding() {
  const demoSections = [
    {
      title: 'HR Dashboard',
      description:
        'Giao diện quản lý tuyển dụng dành cho nhà tuyển dụng, bao gồm quản lý tin tuyển dụng, ứng viên và hồ sơ.',
      icon: <IoBriefcaseOutline className='w-8 h-8' />,
      link: '/demo/hr',
      color: 'bg-blue-500',
    },
    {
      title: 'Candidate Portal',
      description:
        'Giao diện dành cho ứng viên tìm việc, quản lý hồ sơ và theo dõi quá trình ứng tuyển.',
      icon: <IoPersonOutline className='w-8 h-8' />,
      link: '/demo/candidate',
      color: 'bg-green-500',
      comingSoon: true,
    },
    {
      title: 'Admin Portal',
      description:
        'Giao diện quản trị hệ thống, quản lý người dùng, phân quyền và cấu hình hệ thống.',
      icon: <IoSettingsOutline className='w-8 h-8' />,
      link: '/demo/admin',
      color: 'bg-purple-500',
      comingSoon: true,
    },
  ];

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-3xl font-extrabold text-gray-900 sm:text-4xl'>
            Demo Giao diện JobsIT
          </h1>
          <p className='mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4'>
            Trải nghiệm các chức năng của hệ thống JobsIT qua các giao diện demo
          </p>
        </div>

        <div className='grid gap-6 lg:grid-cols-1'>
          {demoSections.map((section) => (
            <div
              key={section.title}
              className='bg-white overflow-hidden shadow rounded-lg'
            >
              <div className='p-6'>
                <div className='flex items-center'>
                  <div
                    className={`flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-md ${section.color} text-white`}
                  >
                    {section.icon}
                  </div>
                  <div className='ml-4'>
                    <h2 className='text-xl font-medium text-gray-900 flex items-center'>
                      {section.title}
                      {section.comingSoon && (
                        <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
                          Sắp ra mắt
                        </span>
                      )}
                    </h2>
                    <p className='mt-1 text-gray-500'>{section.description}</p>
                  </div>
                </div>
                <div className='mt-6'>
                  {section.comingSoon ? (
                    <button
                      disabled
                      className='w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed'
                    >
                      Sắp ra mắt
                    </button>
                  ) : (
                    <Link
                      to={section.link}
                      className='w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    >
                      Truy cập Demo {section.title}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-12 text-center'>
          <p className='text-sm text-gray-500'>
            Demo này được tạo ra nhằm mục đích giới thiệu giao diện và chức năng
            của hệ thống JobsIT. Dữ liệu trong demo là dữ liệu giả và không đại
            diện cho dữ liệu thực tế.
          </p>
          <p className='mt-2 text-sm text-gray-500'>
            © {new Date().getFullYear()} JobsIT - Nền tảng kết nối việc làm
            trong lĩnh vực CNTT
          </p>
        </div>
      </div>
    </div>
  );
}
