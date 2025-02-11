import SaveButton from './SaveButton';

export default function SaveButtonDemo() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-md mx-auto space-y-8'>
        <h2 className='text-2xl font-bold mb-6'>Save Button Demo</h2>

        {/* Default State */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Default State</h3>
          <SaveButton
            onToggle={(saved) =>
              console.log('Save button toggled:', saved ? 'Saved' : 'Unsaved')
            }
          />
        </div>

        {/* Initially Saved */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Initially Saved</h3>
          <SaveButton
            defaultSaved={true}
            onToggle={(saved) =>
              console.log('Save button toggled:', saved ? 'Saved' : 'Unsaved')
            }
          />
        </div>

        {/* Custom Class */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Custom Size</h3>
          <SaveButton
            className='text-base px-6 py-3'
            onToggle={(saved) =>
              console.log('Save button toggled:', saved ? 'Saved' : 'Unsaved')
            }
          />
        </div>

        {/* In Context */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>In Context</h3>
          <div className='flex items-center justify-between p-4 border rounded-lg'>
            <div>
              <h4 className='font-medium'>Job Title</h4>
              <p className='text-sm text-gray-600'>Company Name</p>
            </div>
            <SaveButton />
          </div>
        </div>
      </div>
    </div>
  );
}
