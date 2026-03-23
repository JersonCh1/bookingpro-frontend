import { useState } from 'react'
import { Link } from 'react-router-dom'
import { bookingsApi } from '../../api/bookings'
import { LogoFull } from '../../components/ui/Logo'
import { Calendar, Clock, MapPin, Phone, X, CheckCircle, Search } from 'lucide-react'

const STATUS_MAP = {
  pending:   { label: 'Pendiente',  bg: '#fffbeb', color: '#92400e' },
  confirmed: { label: 'Confirmada', bg: '#eff6ff', color: '#1e40af' },
  completed: { label: 'Completada', bg: '#f3f4f6', color: '#374151' },
  cancelled: { label: 'Cancelada',  bg: '#fef2f2', color: '#991b1b' },
  no_show:   { label: 'No asistió', bg: '#fff7ed', color: '#9a3412' },
}

const DAYS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado']
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function fmtDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt  = new Date(y, m - 1, d)
  return `${DAYS[dt.getDay()]} ${d} de ${MONTHS[m - 1]}`
}

function fmtTime(t) {
  if (!t) return ''
  const [h, min] = t.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  return `${h % 12 || 12}:${String(min).padStart(2, '0')} ${ampm}`
}

function canCancel(booking) {
  if (!['pending', 'confirmed'].includes(booking.status)) return false
  const [y, m, d] = booking.date.split('-').map(Number)
  const [h, min]  = booking.start_time.split(':').map(Number)
  const dt = new Date(y, m - 1, d, h, min)
  return dt - Date.now() > 2 * 60 * 60 * 1000
}

export default function MyBookings() {
  const [phone, setPhone]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [bookings, setBookings] = useState(null)
  const [error, setError]       = useState('')
  const [cancelling, setCancelling] = useState(null)  // booking id
  const [cancelDone, setCancelDone] = useState(null)  // booking id
  const [toast, setToast]       = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    const ph = phone.replace(/\s/g, '')
    if (!ph) return
    setLoading(true)
    setError('')
    try {
      const res  = await bookingsApi.byPhone(ph)
      const data = res.data.data
      setBookings(data.bookings || [])
    } catch {
      setError('No pudimos conectar con el servidor. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  async function confirmCancel(booking) {
    setCancelling(booking.id)
    try {
      await bookingsApi.cancelByPhone(booking.id, phone.replace(/\s/g, ''))
      setBookings(prev => prev.map(b =>
        b.id === booking.id ? { ...b, status: 'cancelled' } : b
      ))
      setCancelDone(booking.id)
      setToast('Tu cita fue cancelada. El negocio fue notificado.')
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'No se pudo cancelar la cita.'
      setToast(msg)
      setTimeout(() => setToast(''), 4000)
    } finally {
      setCancelling(null)
    }
  }

  const upcoming  = (bookings || []).filter(b => ['pending', 'confirmed'].includes(b.status))
  const past      = (bookings || []).filter(b => !['pending', 'confirmed'].includes(b.status))

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: '#0D0D0D' }}>
      {/* Grid bg */}
      <div className='fixed inset-0 pointer-events-none' style={{
        backgroundImage: `linear-gradient(rgba(192,57,43,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(192,57,43,0.04) 1px,transparent 1px)`,
        backgroundSize: '32px 32px',
      }} />

      {/* Header */}
      <header className='relative z-10 border-b' style={{ borderColor: '#1A1A1A' }}>
        <div className='max-w-lg mx-auto px-5 py-4 flex items-center justify-between'>
          <Link to='/'>
            <LogoFull height={32} dark />
          </Link>
          <span className='text-sm font-semibold' style={{ color: '#888' }}>Mis reservas</span>
        </div>
      </header>

      <div className='relative z-10 flex-1 max-w-lg mx-auto w-full px-5 py-8'>

        {/* Búsqueda */}
        <div className='text-center mb-8'>
          <h1 className='text-2xl font-black text-white mb-2'>Tus próximas citas</h1>
          <p className='text-sm' style={{ color: '#555' }}>Ingresa tu número para ver y gestionar tus reservas</p>
        </div>

        <form onSubmit={handleSearch} className='flex gap-2 mb-6'>
          <div className='relative flex-1'>
            <Phone className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4' style={{ color: '#444' }} />
            <input
              type='tel'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder='+51 987 654 321'
              className='w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 transition-all'
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C', focusBorderColor: '#C0392B' }}
            />
          </div>
          <button type='submit' disabled={loading || !phone.trim()}
            className='flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40'
            style={{ backgroundColor: '#C0392B' }}>
            {loading ? (
              <span className='w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin' />
            ) : (
              <Search className='w-4 h-4' />
            )}
            Buscar
          </button>
        </form>

        {error && (
          <div className='rounded-xl p-3 text-sm text-center mb-4' style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
            {error}
          </div>
        )}

        {/* Resultados */}
        {bookings !== null && (
          <>
            {bookings.length === 0 ? (
              <div className='text-center py-12'>
                <Calendar className='w-12 h-12 mx-auto mb-3' style={{ color: '#2C2C2C' }} />
                <p className='font-bold text-white mb-1'>Sin reservas encontradas</p>
                <p className='text-sm mb-5' style={{ color: '#555' }}>No encontramos citas con ese número</p>
                <Link to='/'
                  className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white'
                  style={{ backgroundColor: '#C0392B' }}>
                  Buscar un negocio
                </Link>
              </div>
            ) : (
              <div className='space-y-6'>
                {upcoming.length > 0 && (
                  <section>
                    <h2 className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#555' }}>Próximas citas</h2>
                    <div className='space-y-3'>
                      {upcoming.map(b => <BookingCard key={b.id} b={b} onCancel={confirmCancel} cancelling={cancelling} cancelDone={cancelDone} />)}
                    </div>
                  </section>
                )}
                {past.length > 0 && (
                  <section>
                    <h2 className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#333' }}>Citas anteriores</h2>
                    <div className='space-y-3'>
                      {past.map(b => <BookingCard key={b.id} b={b} onCancel={null} cancelling={null} cancelDone={cancelDone} />)}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium text-white shadow-xl'
          style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}>
          <CheckCircle className='w-4 h-4 text-green-400' />
          {toast}
        </div>
      )}

      <footer className='relative z-10 py-4 text-center' style={{ borderTop: '1px solid #1A1A1A' }}>
        <p className='text-xs' style={{ color: '#333' }}>Powered by <span style={{ color: '#C0392B' }}>AgendaYa</span></p>
      </footer>
    </div>
  )
}

function BookingCard({ b, onCancel, cancelling, cancelDone }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const s   = STATUS_MAP[b.status] ?? STATUS_MAP.pending
  const can = onCancel && canCancel(b) && cancelDone !== b.id

  return (
    <div className='rounded-2xl p-4 space-y-3' style={{ backgroundColor: '#111', border: '1px solid #1E1E1E' }}>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl flex items-center justify-center text-base font-black text-white flex-shrink-0'
            style={{ backgroundColor: '#C0392B' }}>
            {b.tenant_name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className='font-bold text-white text-sm'>{b.tenant_name}</p>
            <p className='text-xs' style={{ color: '#666' }}>{b.service_name}</p>
          </div>
        </div>
        <span className='text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0'
          style={{ backgroundColor: s.bg, color: s.color }}>
          {s.label}
        </span>
      </div>

      <div className='flex items-center gap-4 text-xs' style={{ color: '#666' }}>
        <span className='flex items-center gap-1'>
          <Calendar className='w-3.5 h-3.5' />
          <span className='capitalize'>{fmtDate(b.date)}</span>
        </span>
        <span className='flex items-center gap-1'>
          <Clock className='w-3.5 h-3.5' />
          {fmtTime(b.start_time)}
        </span>
        <span className='font-semibold text-white'>S/. {parseFloat(b.service_price).toFixed(2)}</span>
      </div>

      {can && !showConfirm && (
        <button onClick={() => setShowConfirm(true)}
          className='w-full py-2 rounded-lg text-xs font-bold transition-colors'
          style={{ backgroundColor: '#1A1A1A', color: '#ef4444', border: '1px solid #2C2C2C' }}>
          Cancelar cita
        </button>
      )}

      {showConfirm && (
        <div className='rounded-xl p-3 space-y-2' style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}>
          <p className='text-xs text-center' style={{ color: '#888' }}>
            ¿Estás seguro que quieres cancelar tu cita del <strong className='text-white capitalize'>{fmtDate(b.date)}</strong> a las <strong className='text-white'>{fmtTime(b.start_time)}</strong>?
          </p>
          <div className='flex gap-2'>
            <button onClick={() => { setShowConfirm(false); onCancel(b) }}
              disabled={cancelling === b.id}
              className='flex-1 py-2 rounded-lg text-xs font-bold text-white disabled:opacity-50'
              style={{ backgroundColor: '#C0392B' }}>
              {cancelling === b.id ? 'Cancelando...' : 'Sí, cancelar'}
            </button>
            <button onClick={() => setShowConfirm(false)}
              className='flex-1 py-2 rounded-lg text-xs font-bold'
              style={{ backgroundColor: '#2C2C2C', color: '#888' }}>
              No, mantener
            </button>
          </div>
        </div>
      )}

      {cancelDone === b.id && (
        <div className='flex items-center gap-2 text-xs text-green-400'>
          <CheckCircle className='w-3.5 h-3.5' /> Cita cancelada
        </div>
      )}
    </div>
  )
}
