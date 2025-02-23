import { useState } from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function HRApplications() {
  const [isLoading] = useState(false);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Quản lý đơn ứng tuyển</h1>
      </div>

      <div className='bg-white rounded-lg p-6 shadow-sm'>
        <div className='text-center text-gray-500 py-8'>
          Tính năng đang được phát triển
        </div>
      </div>
    </div>
  );
}
