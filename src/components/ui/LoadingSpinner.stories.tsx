import LoadingSpinner from './LoadingSpinner';

export default function LoadingSpinnerDemo() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <h2 className='text-2xl font-bold mb-6'>Loading Spinner Component</h2>

        {/* Default Loading */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>Default Loading</h3>
          <div className='border rounded-lg h-[300px]'>
            <LoadingSpinner />
          </div>
        </div>

        {/* Custom Text */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>Custom Text</h3>
          <div className='border rounded-lg h-[300px]'>
            <LoadingSpinner text='Fetching data' />
          </div>
        </div>

        {/* In Card */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>In Card Context</h3>
          <div className='grid grid-cols-2 gap-4'>
            <div className='border rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Card Title</h4>
              <div className='h-[200px]'>
                <LoadingSpinner text='Loading card' />
              </div>
            </div>
            <div className='border rounded-lg p-4'>
              <h4 className='font-medium mb-2'>Card Title</h4>
              <div className='h-[200px]'>
                <LoadingSpinner text='Processing' />
              </div>
            </div>
          </div>
        </div>

        {/* Full Screen */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>Full Screen Overlay</h3>
          <div className='relative border rounded-lg h-[400px] overflow-hidden'>
            {/* Content */}
            <div className='p-4'>
              <h4 className='font-medium mb-2'>Page Content</h4>
              <p className='text-gray-600'>
                This content will be blurred when the loading overlay appears.
              </p>
            </div>
            {/* Loading Overlay */}
            <LoadingSpinner fullScreen text='Loading page' />
          </div>
        </div>
      </div>
    </div>
  );
}
