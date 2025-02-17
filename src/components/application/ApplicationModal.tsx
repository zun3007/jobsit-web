import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { IoClose, IoCloudUpload } from 'react-icons/io5';
import { applicationService } from '@/services/applicationService';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import ToastContainer from '@/components/ui/ToastContainer';
import { fileService } from '@/services/fileService';

interface ApplicationModalProps {
  jobId: number;
  onClose: () => void;
  defaultCV?: string | null;
  defaultReferenceLetter?: string | null;
}

export default function ApplicationModal({
  jobId,
  onClose,
  defaultCV,
  defaultReferenceLetter,
}: ApplicationModalProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [referenceLetter, setReferenceLetter] = useState(
    defaultReferenceLetter || ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError, toasts, removeToast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile && !defaultCV) {
      showError('Vui lòng tải lên CV của bạn');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        'candidateApplication',
        JSON.stringify({
          jobDTO: { id: jobId },
          referenceLetter: referenceLetter,
        })
      );

      // Handle CV file
      if (cvFile) {
        // If user selected a new CV, append it
        formData.append('fileCV', cvFile);
      } else if (defaultCV) {
        // If user has an existing CV but didn't select a new one
        try {
          const response = await fetch(
            fileService.getFileDisplayUrl(defaultCV)
          );
          const blob = await response.blob();
          const fileName = defaultCV.split('/').pop() || 'cv.pdf';
          const file = new File([blob], fileName, { type: blob.type });
          formData.append('fileCV', file);
        } catch (error) {
          console.error('Error fetching current CV:', error);
          showError('Không thể tải CV hiện tại. Vui lòng thử lại.');
          setIsSubmitting(false);
          return;
        }
      }

      await applicationService.applyForJob(formData);
      showSuccess('Nộp đơn ứng tuyển thành công!');
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.root });
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showError(error.message);
      } else {
        showError('Đã xảy ra lỗi khi nộp đơn ứng tuyển');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-2xl mx-4'>
        <div className='flex justify-between items-center p-6 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-900'>Nộp đơn ứng tuyển</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500'
            title='Đóng'
          >
            <IoClose className='w-6 h-6' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
          {/* CV Upload */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              CV đính kèm <span className='text-red-500'>*</span>
            </label>
            {defaultCV ? (
              <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                <span className='text-sm text-gray-600'>CV hiện tại</span>
                <a
                  href={fileService.getFileDisplayUrl(defaultCV)}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#00B074] hover:text-[#00915F]'
                >
                  Xem CV
                </a>
              </div>
            ) : null}
            <div className='mt-2'>
              <div className='flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg'>
                <div className='space-y-1 text-center'>
                  <IoCloudUpload className='mx-auto h-12 w-12 text-gray-400' />
                  <div className='flex text-sm text-gray-600'>
                    <label
                      htmlFor='cv-upload'
                      className='relative cursor-pointer rounded-md bg-white font-medium text-[#00B074] focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00B074] focus-within:ring-offset-2 hover:text-[#00915F]'
                    >
                      <span>Tải lên CV mới</span>
                      <input
                        id='cv-upload'
                        name='cv-upload'
                        type='file'
                        className='sr-only'
                        accept='.pdf,.doc,.docx'
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCvFile(file);
                        }}
                      />
                    </label>
                    <p className='pl-1'>hoặc kéo thả vào đây</p>
                  </div>
                  <p className='text-xs text-gray-500'>
                    PDF, DOC, DOCX tối đa 10MB
                  </p>
                </div>
              </div>
              {cvFile && (
                <div className='mt-2 flex items-center justify-between text-sm text-gray-600 bg-gray-50 p-2 rounded'>
                  <span>{cvFile.name}</span>
                  <button
                    type='button'
                    onClick={() => setCvFile(null)}
                    className='text-red-500 hover:text-red-700'
                  >
                    Xóa
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Reference Letter */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Thư giới thiệu
            </label>
            <textarea
              value={referenceLetter}
              onChange={(e) => setReferenceLetter(e.target.value)}
              rows={4}
              className='w-full p-2 border border-gray-300 rounded-lg focus:ring-[#00B074] focus:border-[#00B074] outline-none'
              placeholder='Viết giới thiệu ngắn gọn về bản thân (điểm mạnh và điểm yếu) và nêu rõ mong muốn, lý do làm việc tại công ty này.'
            />
          </div>

          {/* Submit Button */}
          <div className='flex justify-end gap-4'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-8 py-2.5 bg-[#00B074] text-white font-medium rounded-lg hover:bg-[#00915F] disabled:opacity-50'
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp hồ sơ'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='px-8 py-2.5 border-2 border-[#00B074] text-[#00B074] font-medium rounded-lg hover:bg-gray-50'
            >
              Đóng lại
            </button>
          </div>
        </form>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
