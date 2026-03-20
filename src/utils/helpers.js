import { format, parseISO, isToday, isTomorrow } from 'date-fns'
import { es } from 'date-fns/locale'

// ── Fechas y horas ────────────────────────────────────────

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  if (isToday(date))    return 'Hoy'
  if (isTomorrow(date)) return 'Mañana'
  return format(date, "d 'de' MMMM", { locale: es })
}

export function formatDateFull(dateStr) {
  if (!dateStr) return ''
  const date = typeof dateStr === 'string' ? parseISO(dateStr + 'T00:00') : dateStr
  return format(date, "EEEE d 'de' MMMM yyyy", { locale: es })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const h12  = hour % 12 || 12
  return `${h12}:${m} ${ampm}`
}

export function formatCurrency(amount) {
  const n = parseFloat(amount)
  return isNaN(n) ? 'S/. 0.00' : `S/. ${n.toFixed(2)}`
}

// ── Errores ───────────────────────────────────────────────

/**
 * Extrae un mensaje legible del error de Axios.
 *
 * El backend devuelve:
 *   { success: false, error: "mensaje", code: "ERROR_CODE" }
 */
export function getErrorMessage(error) {
  if (!error) return 'Error desconocido.'

  // Formato nuevo del backend
  const apiError = error?.response?.data?.error
  if (apiError && typeof apiError === 'string') return apiError

  // Fallback para errores de red
  if (error?.message) return error.message

  return 'Error desconocido.'
}

// ── Status de reservas ────────────────────────────────────

export const STATUS_LABELS = {
  pending:   'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  no_show:   'No se presentó',
}

export const STATUS_COLORS = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-800',
  no_show:   'bg-orange-100 text-orange-700',
}

// ── Days ──────────────────────────────────────────────────

export const DAY_NAMES = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves',
  'Viernes', 'Sábado', 'Domingo',
]
