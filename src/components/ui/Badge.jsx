import { clsx } from 'clsx'
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/helpers'

export function StatusBadge({ status }) {
  return (
    <span className={clsx('badge', STATUS_COLORS[status] || 'bg-gray-100 text-gray-700')}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export default function Badge({ children, color = 'gray' }) {
  const colors = {
    gray:   'bg-gray-100 text-gray-700',
    green:  'bg-green-100 text-green-700',
    blue:   'bg-blue-100 text-blue-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red:    'bg-red-100 text-red-700',
  }
  return (
    <span className={clsx('badge', colors[color])}>{children}</span>
  )
}
