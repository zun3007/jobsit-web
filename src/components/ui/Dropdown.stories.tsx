import Dropdown from './Dropdown';

export default function DropdownDemo() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-end gap-4'>
        <Dropdown userName='Nguyen Hoa' />
      </div>
    </div>
  );
}
