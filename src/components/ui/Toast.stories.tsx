import { useToast } from '@/hooks/useToast';
import ToastContainer from './ToastContainer';

export default {
  title: 'Components/Toast',
  component: ToastContainer,
};

export function ToastDemo() {
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-md mx-auto space-y-4'>
        <h2 className='text-2xl font-bold mb-6'>Toast Notifications Demo</h2>

        {/* Success Toast */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-3'>Success Toast</h3>
          <button
            onClick={() => showSuccess('Operation completed successfully!')}
            className='w-full px-4 py-2 text-white bg-secondary hover:bg-secondary-hover rounded-lg transition-colors'
          >
            Show Success Toast
          </button>
        </div>

        {/* Error Toast */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-3'>Error Toast</h3>
          <button
            onClick={() => showError('An error occurred. Please try again.')}
            className='w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors'
          >
            Show Error Toast
          </button>
        </div>

        {/* Info Toast */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-3'>Info Toast</h3>
          <button
            onClick={() => showInfo('New updates are available.')}
            className='w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors'
          >
            Show Info Toast
          </button>
        </div>

        {/* Custom Duration Toast */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-3'>Custom Duration Toast (10s)</h3>
          <button
            onClick={() =>
              showInfo('This toast will stay for 10 seconds', 10000)
            }
            className='w-full px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors'
          >
            Show Long Duration Toast
          </button>
        </div>

        {/* Multiple Toasts */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-3'>Multiple Toasts</h3>
          <button
            onClick={() => {
              showSuccess('First notification');
              setTimeout(() => showInfo('Second notification'), 500);
              setTimeout(() => showError('Third notification'), 1000);
            }}
            className='w-full px-4 py-2 text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors'
          >
            Show Multiple Toasts
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
