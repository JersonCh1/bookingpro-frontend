import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../../api/bookings'
import { LogoFull } from '../../components/ui/Logo'
import { Calendar, Clock, CheckCircle, X, AlertTriangle } from 'lucide-react'

const DAYS   = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function fmtDate(s) {
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  return `${DAYS[dt.getDay()]} ${d} de ${MONTHS[m - 1]} de ${y}`
}
function fmtTime(t) {
  const [h, min] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export default function CancelBooking() {
  const { token } = useParams()
  const [confirmed, setConfirmed] = useState(false)

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-by-token', token],
    queryFn:  () => bookingsApi.byToken(token).then(r => r.data.data),
    retry:    false,
  })

  const [cancelError, setCancelError] = useState('')

  const handleConfirm = async () => {
    setCancelError('')
    try {
      // PATCH /api/bookings/cancel-token/{token}/cancel/ — no requiere teléfono
      const { default: client } = await import('../../api/client')
      await client.patch(`/bookings/cancel-token/${token}/cancel/`)
      setConfirmed(true)
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'No se pudo cancelar la cita.'
      setCancelError(msg)
    }
  }

  if (isLoading) return (
    <Screen>
      <div className='flex items-center justify-center py-20'>
        <div className='w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin' />
      </div>
    </Screen>
  )

  if (error || !booking) return (
    <Screen>
      <div className='text-center py-12'>
        <div className='w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center' style={{ backgroundColor: '#1A1A1A' }}>
          <X className='w-7 h-7 text-gray-600' />
        </div>
        <p className='text-xl font-black text-white mb-2'>Enlace inválido</p>
        <p className='text-sm mb-5' style={{ color: '#555' }}>Este enlace de cancelación no es válido o ya fue usado.</p>
        <Link to='/mis-reservas'
          className='inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white'
          style={{ backgroundColor: '#C0392B' }}>
          Ver mis reservas
        </Link>
      </div>
    </Screen>
  )

  const isPast      = booking.status === 'cancelled'
  const isCompleted = booking.status === 'completed'
  const [y, m, d]   = booking.date.split('-').map(Number)
  const [h, min]    = booking.start_time.split(':').map(Number)
  const dt          = new Date(y, m - 1, d, h, min)
  const tooLate     = dt - Date.now() <= 2 * 60 * 60 * 1000

  if (confirmed) return (
    <Screen>
      <div className='text-center py-12'>
        <div className='w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center' style={{ backgroundColor: '#dcfce7' }}>
          <CheckCircle className='w-8 h-8 text-green-600' />
        </div>
        <h1 className='text-xl font-black text-white mb-2'>Cita cancelada</h1>
        <p className='text-sm mb-6' style={{ color: '#555' }}>El negocio fue notificado de tu cancelación.</p>
        <Link to='/mis-reservas'
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white'
          style={{ backgroundColor: '#C0392B' }}>
          Ver mis reservas
        </Link>
      </div>
    </Screen>
  )

  return (
    <Screen>
      <div className='space-y-5'>
        <div className='text-center'>
          <h1 className='text-2xl font-black text-white mb-1'>Cancelar cita</h1>
          <p className='text-sm' style={{ color: '#555' }}>Revisa los detalles antes de confirmar</p>
        </div>

        {/* Detalles de la reserva */}
        <div className='rounded-2xl p-4 space-y-3' style={{ backgroundColor: '#111', border: '1px solid #1E1E1E' }}>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl flex items-center justify-center font-black text-white' style={{ backgroundColor: '#C0392B' }}>
              {booking.tenant_name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className='font-bold text-white'>{booking.tenant_name}</p>
              <p className='text-xs' style={{ color: '#666' }}>{booking.service_name}</p>
            </div>
          </div>
          <div className='flex gap-4 text-sm' style={{ color: '#888' }}>
            <span className='flex items-center gap-1.5'><Calendar className='w-4 h-4' /> <span className='capitalize'>{fmtDate(booking.date)}</span></span>
            <span className='flex items-center gap-1.5'><Clock className='w-4 h-4' /> {fmtTime(booking.start_time)}</span>
          </div>
          <div className='text-sm font-bold text-white'>S/. {parseFloat(booking.service_price).toFixed(2)}</div>
        </div>

        {/* Mensajes de estado */}
        {isPast && (
          <Alert type='info'><CheckCircle className='w-4 h-4' /> Esta cita ya fue cancelada anteriormente.</Alert>
        )}
        {isCompleted && (
          <Alert type='info'><CheckCircle className='w-4 h-4' /> Esta cita ya fue completada.</Alert>
        )}
        {!isPast && !isCompleted && tooLate && (
          <Alert type='warning'><AlertTriangle className='w-4 h-4' /> No puedes cancelar con menos de 2 horas de anticipación.</Alert>
        )}

        {/* Botones */}
        {!isPast && !isCompleted && !tooLate && (
          <div className='space-y-2'>
            {cancelError && <Alert type='warning'><AlertTriangle className='w-4 h-4' /> {cancelError}</Alert>}
            <button onClick={handleConfirm}
              className='w-full py-3 rounded-xl text-sm font-bold text-white transition-colors'
              style={{ backgroundColor: '#C0392B' }}>
              Sí, cancelar mi cita
            </button>
            <Link to='/mis-reservas'
              className='block w-full py-3 rounded-xl text-sm font-bold text-center transition-colors'
              style={{ backgroundColor: '#1A1A1A', color: '#888', border: '1px solid #2C2C2C' }}>
              No, mantener mi cita
            </Link>
          </div>
        )}

        {(isPast || isCompleted || tooLate) && (
          <Link to='/mis-reservas'
            className='block w-full py-3 rounded-xl text-sm font-bold text-center'
            style={{ backgroundColor: '#1A1A1A', color: '#888', border: '1px solid #2C2C2C' }}>
            Ver mis reservas
          </Link>
        )}
      </div>
    </Screen>
  )
}

function Screen({ children }) {
  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: '#0D0D0D' }}>
      <div className='fixed inset-0 pointer-events-none' style={{
        backgroundImage: `linear-gradient(rgba(192,57,43,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(192,57,43,0.04) 1px,transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />
      <header className='relative z-10 border-b' style={{ borderColor: '#1A1A1A' }}>
        <div className='max-w-lg mx-auto px-5 py-4'>
          <Link to='/'><LogoFull height={32} dark /></Link>
        </div>
      </header>
      <div className='relative z-10 flex-1 max-w-lg mx-auto w-full px-5 py-8'>
        {children}
      </div>
    </div>
  )
}

function Alert({ children, type }) {
  const styles = {
    info:    { bg: '#1e3a5f', color: '#93c5fd' },
    warning: { bg: '#3d2a00', color: '#fcd34d' },
  }
  const s = styles[type] || styles.info
  return (
    <div className='flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium'
      style={{ backgroundColor: s.bg, color: s.color }}>
      {children}
    </div>
  )
}
