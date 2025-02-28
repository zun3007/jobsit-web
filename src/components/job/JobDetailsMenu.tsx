import React, { useState, useRef, useEffect } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface JobDetailsMenuProps {
  jobId: number;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  isExpired?: boolean;
}

export default function JobDetailsMenu({
  jobId,
  onClose,
  onDuplicate,
  onDelete,
  isExpired = false,
}: JobDetailsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle outside click to close menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle menu item clicks
  const handleEdit = () => {
    navigate(`/hr/jobs/edit/${jobId}`);
    setIsOpen(false);
  };

  const handleCloseJob = () => {
    onClose();
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate();
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className='relative' ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors'
        aria-label='Menu options'
      >
        <IoEllipsisVertical className='w-5 h-5' />
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10'>
          <div className='py-1' role='menu' aria-orientation='vertical'>
            <button
              onClick={handleEdit}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              role='menuitem'
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleCloseJob}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              role='menuitem'
            >
              {isExpired ? 'Mở lại' : 'Đóng tin'}
            </button>
            <button
              onClick={handleDuplicate}
              className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              role='menuitem'
            >
              Nhân bản
            </button>
            <button
              onClick={handleDelete}
              className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700'
              role='menuitem'
            >
              Xóa tin
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
