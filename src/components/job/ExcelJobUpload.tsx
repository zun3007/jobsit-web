import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5';
import { useToast } from '@/hooks/useToast';
import Spinner from '@/components/ui/Spinner';

export default function ExcelJobUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Vui lòng chọn file Excel (.xls hoặc .xlsx)');
      return;
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('Kích thước file không được vượt quá 5MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file Excel');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Here we would implement the actual Excel parsing logic
      // For now, we'll simulate a successful upload with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful job creation
      showSuccess('Tải lên file Excel thành công và đã tạo tin tuyển dụng mới');
      navigate('/hr/jobs');
    } catch {
      setError('Có lỗi xảy ra khi xử lý file. Vui lòng thử lại sau.');
      showError('Tải lên file thất bại');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm'>
      <h1 className='text-2xl font-bold mb-6'>
        Đăng tin tuyển dụng từ file Excel
      </h1>

      <div className='mb-6'>
        <p className='text-gray-600 mb-4'>
          Sử dụng file Excel để tạo nhiều tin tuyển dụng cùng lúc. Vui lòng tải
          xuống mẫu file Excel và điền đầy đủ thông tin theo hướng dẫn.
        </p>

        <div className='flex items-center gap-4 mb-4'>
          <a
            href='/templates/job_template.xlsx'
            download
            className='flex items-center gap-2 px-4 py-2 border border-[#00B074] text-[#00B074] rounded hover:bg-[#00B074] hover:text-white transition-colors'
          >
            <IoDocumentTextOutline />
            Tải xuống mẫu Excel
          </a>

          <button
            onClick={toggleHelp}
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors'
          >
            <IoInformationCircleOutline />
            {showHelp ? 'Ẩn hướng dẫn' : 'Xem hướng dẫn'}
          </button>
        </div>

        {showHelp && (
          <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-4'>
            <h3 className='text-lg font-medium text-blue-800 mb-2'>
              Hướng dẫn sử dụng mẫu Excel
            </h3>
            <ul className='list-disc pl-5 space-y-1 text-sm text-blue-700'>
              <li>
                File mẫu bao gồm 4 sheet: Jobs Template, Position References,
                Major References, và Schedule References.
              </li>
              <li>
                Nhập thông tin công việc vào sheet "Jobs Template", mỗi dòng là
                một tin tuyển dụng.
              </li>
              <li>
                Sử dụng các sheet tham khảo để xác định đúng ID cho vị trí,
                ngành và lịch làm việc.
              </li>
              <li>
                Đối với các trường dạng danh sách (positionIds, majorIds,
                scheduleIds), sử dụng dấu phẩy để phân tách các ID (ví dụ:
                "1,3,5").
              </li>
              <li>
                Ngày tháng phải ở định dạng YYYY-MM-DD (ví dụ: 2025-03-01).
              </li>
              <li>Không thay đổi tên cột hoặc cấu trúc của mẫu.</li>
            </ul>
          </div>
        )}
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
          error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-[#00B074] bg-gray-50'
        }`}
      >
        <input
          type='file'
          accept='.xls,.xlsx'
          onChange={handleFileChange}
          className='hidden'
          ref={fileInputRef}
          aria-label='Tải lên file Excel'
        />

        <div className='mb-4'>
          <IoCloudUploadOutline className='mx-auto h-12 w-12 text-gray-400' />
        </div>

        {file ? (
          <div>
            <p className='text-sm font-medium text-gray-900'>{file.name}</p>
            <p className='text-xs text-gray-500'>
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
        ) : (
          <div>
            <p className='text-sm font-medium text-gray-900'>
              Kéo và thả file Excel vào đây hoặc
            </p>
            <button
              type='button'
              onClick={handleButtonClick}
              className='mt-2 text-sm font-medium text-[#00B074] hover:text-[#00B074]/80'
            >
              Tìm file trên máy tính
            </button>
          </div>
        )}

        {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
      </div>

      <div className='flex justify-end gap-4'>
        <button
          type='button'
          onClick={() => navigate('/hr/jobs')}
          className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
        >
          Hủy
        </button>

        <button
          type='button'
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`px-6 py-2 rounded-md text-white font-medium flex items-center ${
            !file || isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#00B074] hover:bg-[#00B074]/90'
          }`}
        >
          {isUploading ? (
            <>
              <Spinner className='mr-2 h-4 w-4' /> Đang xử lý...
            </>
          ) : (
            'Tải lên và tạo tin'
          )}
        </button>
      </div>
    </div>
  );
}
