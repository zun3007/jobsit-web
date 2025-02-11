import { forwardRef } from 'react';

interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, className = '', ...props }, ref) => {
    return (
      <label className='relative inline-flex items-center mx-3'>
        <div className='relative'>
          <input
            type='checkbox'
            className='absolute w-[33px] h-[24px] opacity-0 z-20 cursor-pointer peer'
            ref={ref}
            {...props}
          />
          <div
            className={`
              w-[33px] h-[16px]
              bg-[#9F9F9F]
              rounded-full
              peer-checked:bg-secondary
              peer-disabled:opacity-50
              peer-disabled:cursor-not-allowed
              ${className}
            `}
          />
          <div
            className={`
              absolute
              w-[25px] h-[24px]
              bg-white
              rounded-full
              shadow-[4px_4px_4px_rgba(0,0,0,0.25)]
              transition-all
              duration-200
              ease-in-out
              left-[-12px]
              top-[-4px]
              peer-checked:translate-x-[30px]
            `}
          />
        </div>
        {(label || description) && (
          <div className='ml-3'>
            {label && (
              <span className='text-sm font-medium text-gray-900'>{label}</span>
            )}
            {description && (
              <p className='text-sm text-gray-500'>{description}</p>
            )}
          </div>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;
