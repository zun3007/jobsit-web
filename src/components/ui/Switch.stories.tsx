import { useState } from 'react';
import Switch from './Switch';

export default function SwitchDemo() {
  const [isEnabled1, setIsEnabled1] = useState(false);
  const [isEnabled2, setIsEnabled2] = useState(true);
  const [isEnabled3, setIsEnabled3] = useState(false);
  const [isEnabled4, setIsEnabled4] = useState(false);

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-md mx-auto space-y-8'>
        <h2 className='text-2xl font-bold mb-6'>Switch Component Demo</h2>

        {/* Basic Switch */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Basic Switch</h3>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-700'>Toggle me</span>
            <Switch
              checked={isEnabled1}
              onChange={(e) => setIsEnabled1(e.target.checked)}
            />
          </div>
        </div>

        {/* Switch with Description */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Switch with Description</h3>
          <div className='flex items-center justify-between'>
            <div className='space-y-1'>
              <span className='text-sm font-medium text-gray-700'>
                Available to hire
              </span>
              <p className='text-sm text-gray-500'>
                Show that you're open to job opportunities
              </p>
            </div>
            <Switch
              checked={isEnabled2}
              onChange={(e) => setIsEnabled2(e.target.checked)}
            />
          </div>
        </div>

        {/* Disabled Switch */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Disabled Switch</h3>
          <div className='flex items-center justify-between'>
            <span className='text-sm text-gray-700'>Notifications</span>
            <Switch
              checked={isEnabled3}
              onChange={(e) => setIsEnabled3(e.target.checked)}
              disabled
            />
          </div>
        </div>

        {/* Switch with Label */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Switch with Label</h3>
          <div className='flex items-center justify-between'>
            <Switch
              checked={isEnabled4}
              onChange={(e) => setIsEnabled4(e.target.checked)}
              label='Email notifications'
              description='Receive email updates about your account'
            />
          </div>
        </div>

        {/* State Display */}
        <div className='bg-white rounded-lg shadow p-4'>
          <h3 className='font-medium mb-4'>Current States</h3>
          <pre className='bg-gray-50 p-4 rounded-lg text-sm'>
            {JSON.stringify(
              {
                basic: isEnabled1,
                withDescription: isEnabled2,
                disabled: isEnabled3,
                withLabel: isEnabled4,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
