import { IoArrowBack, IoCloudUploadOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

export default function DemoExcelJobUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      showError('Vui lòng chọn file Excel để tải lên');
      return;
    }

    setIsUploading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    showSuccess('Tải lên file Excel thành công! Dữ liệu đang được xử lý.');
    setFile(null);
    setIsUploading(false);
  };

  return (
    <div className='px-4 py-6 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto'>
      <div className='flex items-center gap-4 mb-6'>
        <Link
          to='/demo/hr/jobs'
          className='flex items-center gap-1 text-gray-600 hover:text-gray-900'
        >
          <IoArrowBack className='w-4 h-4' />
          <span>Quay lại danh sách tin tuyển dụng</span>
        </Link>
      </div>

      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <div className='px-6 py-4 border-b border-gray-200'>
          <h3 className='text-lg font-medium leading-6 text-gray-900'>
            Tải lên tin tuyển dụng từ file Excel
          </h3>
          <p className='mt-1 text-sm text-gray-500'>
            Tải lên danh sách tin tuyển dụng từ file Excel để tạo nhiều tin
            tuyển dụng cùng lúc.
          </p>
        </div>

        <form onSubmit={handleUpload} className='p-6 space-y-6'>
          <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center'>
            <div className='flex justify-center'>
              <IoCloudUploadOutline className='h-12 w-12 text-gray-400' />
            </div>
            <div className='mt-4 flex text-sm text-gray-600 justify-center'>
              <label
                htmlFor='file-upload'
                className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none'
              >
                <span>Chọn file Excel</span>
                <input
                  id='file-upload'
                  name='file-upload'
                  type='file'
                  accept='.xlsx, .xls'
                  className='sr-only'
                  onChange={handleFileChange}
                />
              </label>
              <p className='pl-1'>hoặc kéo thả file vào đây</p>
            </div>
            <p className='text-xs text-gray-500 mt-2'>
              Chỉ chấp nhận file Excel (.xlsx, .xls)
            </p>
            {file && (
              <div className='mt-4 text-sm text-gray-600'>
                <p>File đã chọn: {file.name}</p>
                <p>Kích thước: {(file.size / 1024).toFixed(2)} KB</p>
              </div>
            )}
          </div>

          <div className='flex justify-end'>
            <Link
              to='/demo/hr/jobs'
              className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3'
            >
              Hủy
            </Link>
            <button
              type='submit'
              disabled={!file || isUploading}
              className='inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isUploading ? 'Đang tải lên...' : 'Tải lên'}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
