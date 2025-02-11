import Spinner from './Spinner';

export default function SpinnerDemo() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <h2 className='text-2xl font-bold mb-6'>Spinner Component</h2>

        {/* Sizes */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>Sizes</h3>
          <div className='flex items-center gap-8'>
            <div className='text-center'>
              <Spinner size='sm' />
              <p className='text-sm text-gray-600 mt-2'>Small</p>
            </div>
            <div className='text-center'>
              <Spinner size='md' />
              <p className='text-sm text-gray-600 mt-2'>Medium</p>
            </div>
            <div className='text-center'>
              <Spinner size='lg' />
              <p className='text-sm text-gray-600 mt-2'>Large</p>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className='bg-white rounded-lg shadow p-6'>
          <h3 className='font-medium mb-4'>Variants</h3>
          <div className='flex items-center gap-8'>
            <div className='text-center'>
              <Spinner variant='primary' />
              <p className='text-sm text-gray-600 mt-2'>Primary</p>
            </div>
            <div className='text-center'>
              <Spinner variant='secondary' />
              <p className='text-sm text-gray-600 mt-2'>Secondary</p>
            </div>
            <div className='text-center bg-gray-800 p-4 rounded-lg'>
              <Spinner variant='white' />
              <p className='text-sm text-white mt-2'>White</p>
            </div>
          </div>
        </div>

        {/* In Context */}
        <div className='space-y-4'>
          {/* Button with Spinner */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='font-medium mb-4'>Button with Spinner</h3>
            <button className='btn btn-primary min-w-[150px]'>
              <Spinner size='sm' variant='white' className='mr-2' />
              Loading...
            </button>
          </div>

          {/* Card with Spinner */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='font-medium mb-4'>Card Loading State</h3>
            <div className='border rounded-lg p-8 flex items-center justify-center'>
              <Spinner size='lg' variant='secondary' />
            </div>
          </div>

          {/* Overlay with Spinner */}
          <div className='bg-white rounded-lg shadow p-6'>
            <h3 className='font-medium mb-4'>Overlay Loading State</h3>
            <div className='relative h-48 border rounded-lg'>
              <div className='absolute inset-0 bg-black/5 backdrop-blur-sm rounded-lg flex items-center justify-center'>
                <div className='text-center'>
                  <Spinner size='lg' variant='primary' className='mb-2' />
                  <p className='text-sm font-medium text-gray-600'>
                    Loading content...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
