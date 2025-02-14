import { useState, useEffect } from 'react';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import Spinner from './Spinner';
import { useSavedJobs } from '@/hooks/useSavedJobs';

interface SaveButtonProps {
  jobId: number;
  onToggle?: (saved: boolean) => void;
  isLoading?: boolean;
  className?: string;
}

export default function SaveButton({
  jobId,
  onToggle,
  isLoading = false,
  className = '',
}: SaveButtonProps) {
  const { savedJobIds } = useSavedJobs();
  const [isSaved, setIsSaved] = useState(savedJobIds.includes(jobId));

  useEffect(() => {
    setIsSaved(savedJobIds.includes(jobId));
  }, [savedJobIds, jobId]);

  const handleToggle = () => {
    if (isLoading) return;
    const newState = !isSaved;
    setIsSaved(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center gap-1.5 
        px-3 sm:px-8 py-1.5 sm:py-2
        rounded-[3px] border transition-all duration-200
        min-w-[90px] sm:min-w-[100px]
        ${
          isSaved
            ? 'bg-white text-primary border-primary'
            : 'bg-white text-[#7D7D7D] border-2 border-[#B0B0B0] hover:bg-gray-50'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <Spinner size='sm' variant={isSaved ? 'primary' : 'secondary'} />
      ) : (
        <>
          <span className='text-xs sm:text-sm font-medium whitespace-nowrap'>
            {isSaved ? 'ĐÃ LƯU' : 'LƯU TIN'}
          </span>
          {isSaved ? (
            <IoBookmark className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0' />
          ) : (
            <IoBookmarkOutline className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0' />
          )}
        </>
      )}
    </button>
  );
}
