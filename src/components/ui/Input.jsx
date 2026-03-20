import { clsx } from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, error, className, ...props },
  ref
) {
  return (
    <div className='space-y-1'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>{label}</label>
      )}
      <input
        ref={ref}
        className={clsx(
          'w-full px-3 py-2 border rounded-lg text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  )
})

export default Input
