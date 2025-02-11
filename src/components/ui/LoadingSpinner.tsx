import Spinner from './Spinner';

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingSpinner({
  text = 'Loading',
  fullScreen = false,
  className = '',
}: LoadingSpinnerProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm'
    : 'w-full h-full';

  return (
    <div
      className={`
        ${containerClasses}
        flex flex-col items-center justify-center
        min-h-[200px]
        ${className}
      `}
    >
      <Spinner size='lg' variant='secondary' className='mb-4' />
      <div className='flex items-center text-gray-600 font-medium'>
        <span>{text}</span>
        <span className='w-4 text-left animate-[dots_1.4s_infinite]'>.</span>
        <span className='w-4 text-left animate-[dots_1.4s_0.2s_infinite]'>
          .
        </span>
        <span className='w-4 text-left animate-[dots_1.4s_0.4s_infinite]'>
          .
        </span>
      </div>
    </div>
  );
}
