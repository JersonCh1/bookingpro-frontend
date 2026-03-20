import { clsx } from 'clsx'
import { forwardRef } from 'react'

const Select = forwardRef(function Select(
  { label, error, className, children, ...props },
  ref
) {
  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>{label}</label>
      )}
      <select
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-sm bg-white transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  )
})

export default Select
