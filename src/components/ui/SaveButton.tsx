import { useState } from 'react';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';

interface SaveButtonProps {
  onToggle?: (saved: boolean) => void;
  defaultSaved?: boolean;
  className?: string;
}

export default function SaveButton({
  onToggle,
  defaultSaved = false,
  className = '',
}: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(defaultSaved);

  const handleToggle = () => {
    const newState = !isSaved;
    setIsSaved(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center justify-center gap-1.5 
        px-3 sm:px-8 py-1.5 sm:py-2
        rounded-[3px] border transition-all duration-200
        min-w-[90px] sm:min-w-[100px]
        ${
          isSaved
            ? 'bg-white text-primary border-primary'
            : 'bg-white text-[#7D7D7D] border-[#F1F1F1] hover:bg-gray-50'
        }
        ${className}
      `}
    >
      <span className='text-xs sm:text-sm font-medium whitespace-nowrap'>
        {isSaved ? 'ĐÃ LƯU' : 'LƯU TIN'}
      </span>
      {isSaved ? (
        <IoBookmark className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0' />
      ) : (
        <IoBookmarkOutline className='w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0' />
      )}
    </button>
  );
}
