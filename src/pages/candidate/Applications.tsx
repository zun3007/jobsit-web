import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { applicationService } from '@/services/applicationService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Link } from 'react-router-dom';
import {
  IoLocationOutline,
  IoPersonOutline,
  IoChevronBack,
  IoChevronForward,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';

export default function Applications() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      const [date, time] = dateString.split(' ');
      const [day, month, year] = date.split('-');
      const [hour, minute] = time.split(':');
      return `${day}/${month}/${year} ${hour}:${minute}`;
    } catch {
      return new Date(dateString).toLocaleString('vi-VN');
    }
  };

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', currentPage - 1, itemsPerPage],
    queryFn: () =>
      applicationService.getCandidateApplications(
        currentPage - 1,
        itemsPerPage
      ),
  });

  console.log(applications);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const totalPages = applications?.totalPages || 0;

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex gap-8'>
        {/* Main Content */}
        <div className='flex-1'>
          {/* Info Box */}
          <div className='bg-[#00B074] text-white rounded-lg p-6 mb-8'>
            <h1 className='text-2xl font-bold mb-2'>
              Danh sách việc làm đã ứng tuyển
            </h1>
            <p>
              Xem lại danh sách những việc làm mà bạn đã ứng tuyển. Theo dõi
              trạng thái ứng tuyển và cập nhật thông tin khi cần thiết.
            </p>
          </div>

          {/* Applications Count */}
          <p className='text-gray-600 mb-6'>
            Bạn đã ứng tuyển{' '}
            <span className='font-bold'>{applications?.totalItems || 0}</span>{' '}
            việc làm
          </p>

          {/* Empty State or Applications List */}
          {!applications?.contents?.length ? (
            <div className='bg-white rounded-lg p-8'>
              <div className='text-center'>
                <img
                  src='/empty_box.svg'
                  alt='No applications'
                  className='w-48 h-48 mx-auto mb-4'
                />
                <p className='text-lg font-medium mb-2'>
                  Bạn chưa ứng tuyển công việc nào!
                </p>
                <p className='text-gray-500'>
                  Hãy tìm kiếm và ứng tuyển các công việc phù hợp với bạn.
                </p>
              </div>
            </div>
          ) : (
            <div className='space-y-4'>
              {applications.contents.map((application) => (
                <div
                  key={application.id}
                  className='bg-white rounded-lg p-6 pb-4 border border-[#DEDEDE]'
                >
                  <div className='flex gap-6'>
                    {/* Company Logo */}
                    <Link
                      to={`/companies/${application.jobDTO.companyDTO.id}`}
                      className='w-[100px] h-[100px] border rounded-lg overflow-hidden flex-shrink-0'
                    >
                      <img
                        src={
                          application.jobDTO.companyDTO.logo ||
                          '/company_logo_temp.svg'
                        }
                        alt={application.jobDTO.companyDTO.name}
                        className='w-full h-full object-contain p-2'
                      />
                    </Link>

                    {/* Job Info */}
                    <div className='flex-1'>
                      <Link
                        to={`/jobs/${application.jobDTO.id}`}
                        className='text-lg font-bold text-[#00B074] transition-colors'
                      >
                        {application.jobDTO.name}
                      </Link>
                      <Link
                        to={`/companies/${application.jobDTO.companyDTO.id}`}
                        className='block text-gray-600 hover:text-[#00B074] transition-colors'
                      >
                        {application.jobDTO.companyDTO.name}
                      </Link>
                      <div className='flex items-center gap-2 mt-2'>
                        <IoLocationOutline className='w-4 h-4 text-[#00B074]' />
                        <span className='text-sm text-gray-500'>
                          {application.jobDTO.location}
                        </span>
                      </div>
                      <div className='flex flex-wrap gap-2 mt-2'>
                        {application.jobDTO.majorDTOs.map((major) => (
                          <span
                            key={major.id}
                            className='px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded'
                          >
                            {major.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Side Info */}
                    <div className='flex flex-col items-end justify-between'>
                      <div className='flex items-center gap-2 mb-4'>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            application.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : application.status === 'ACCEPTED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {application.status === 'PENDING'
                            ? 'Đang chờ'
                            : application.status === 'ACCEPTED'
                            ? 'Đã chấp nhận'
                            : 'Đã từ chối'}
                        </span>
                      </div>
                      <div className='text-right space-y-3'>
                        <div className='flex items-center justify-end text-gray-500 gap-1 text-sm'>
                          <IoPersonOutline className='w-4 h-4 text-[#00B074]' />
                          <span>
                            Số lượng ứng viên: {application.jobDTO.amount}
                          </span>
                        </div>
                        <div className='flex items-center justify-end gap-1 text-sm text-gray-500'>
                          <FaRegClock className='w-4 h-4 text-[#00B074]' />
                          <span>
                            Ngày ứng tuyển:{' '}
                            {formatDateTime(application.appliedDate)}
                          </span>
                        </div>
                        {application.cv && (
                          <div className='flex items-center justify-end gap-1 text-sm'>
                            <a
                              href={application.cv}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center gap-2 px-4 py-2 bg-[#E6F6F1] text-[#00B074] rounded-lg hover:bg-[#d4f0e8] transition-colors'
                            >
                              <IoDocumentTextOutline className='w-4 h-4' />
                              Xem CV
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='flex justify-center mt-6 gap-2'>
                  <button
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    aria-label='Previous page'
                  >
                    <IoChevronBack className='w-4 h-4' />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`
                          w-8 h-8 rounded-full text-sm font-medium transition-colors
                          ${
                            page === currentPage
                              ? 'rounded-full border border-[#00B074] text-slate-900'
                              : 'text-slate-700 rounded-full hover:border hover:border-[#00B074] hover:text-slate-900'
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-50'
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    aria-label='Next page'
                  >
                    <IoChevronForward className='w-4 h-4' />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Advertising Section */}
        <div className='w-[300px] bg-gray-200 rounded-lg flex-shrink-0 h-[600px]'>
          {/* Advertising content will go here */}
        </div>
      </div>
    </div>
  );
}
