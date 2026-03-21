import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../../api/auth'
import { schedulingApi, bookingsApi } from '../../api/bookings'
import client from '../../api/client'
import { LogoFull } from '../../components/ui/Logo'
import { formatCurrency, formatTime, getErrorMessage } from '../../utils/helpers'
import {
  Calendar, Clock, MapPin, Phone, CheckCircle,
  ChevronLeft, ChevronRight, Loader2, Scissors,
  Search, X, Star, ArrowRight, Sparkles,
} from 'lucide-react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, startOfToday, isBefore, isSameDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import Input from '../../components/ui/Input'

const STEP_LABELS = ['Servicio', 'Fecha', 'Hora', 'Datos']

/* ── helpers ── */
function parseAvailableDays(raw) {
  if (Array.isArray(raw)) return raw
  if (raw?.available_days && Array.isArray(raw.available_days)) return raw.available_days
  if (raw?.days && Array.isArray(raw.days)) return raw.days
  if (raw?.results && Array.isArray(raw.results)) return raw.results
  return []
}

// ── Paso 1: Elegir servicio ────────────────────────────────────────────────
function StepService({ slug, onSelect }) {
  const [query, setQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-services', slug],
    queryFn:  () => client.get(`/services/public/${slug}/`).then(r => r.data.data),
  })
  const allServices = useMemo(() => {
    const list = Array.isArray(data) ? data : (data?.results ?? [])
    if (!query.trim()) return list
    return list.filter(s =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(query.toLowerCase())
    )
  }, [data, query])

  if (isLoading) return (
    <div className='flex flex-col items-center justify-center py-16 gap-3'>
      <Loader2 className='w-7 h-7 animate-spin' style={{ color: '#C0392B' }} />
      <p className='text-sm text-gray-400'>Cargando servicios...</p>
    </div>
  )

  if (error) return (
    <div className='text-center py-14'>
      <div className='w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center bg-red-50'>
        <X className='w-6 h-6 text-red-400' />
      </div>
      <p className='text-sm text-gray-500'>No se pudieron cargar los servicios</p>
    </div>
  )

  const totalServices = Array.isArray(data) ? data.length : (data?.results?.length ?? 0)

  return (
    <div>
      {/* Header */}
      <div className='mb-5'>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2'
          style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
          <Sparkles className='w-3 h-3' />
          Paso 1 de 4
        </span>
        <h2 className='text-xl font-black text-gray-900 leading-tight'>¿Qué servicio necesitas?</h2>
        <p className='text-sm text-gray-400 mt-1'>{totalServices} servicios disponibles</p>
      </div>

      {/* Buscador */}
      {totalServices > 4 && (
        <div className='relative mb-4'>
          <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300' />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Buscar servicio...'
            className='w-full pl-10 pr-9 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-red-400 focus:bg-white transition-all'
          />
          {query && (
            <button onClick={() => setQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-gray-400 hover:text-gray-600'>
              <X className='w-3.5 h-3.5' />
            </button>
          )}
        </div>
      )}

      {/* Lista */}
      {allServices.length === 0 ? (
        <div className='text-center py-10'>
          <Search className='w-9 h-9 mx-auto mb-2 text-gray-200' />
          <p className='text-sm text-gray-400'>Sin resultados para "{query}"</p>
          <button onClick={() => setQuery('')} className='mt-2 text-xs font-bold' style={{ color: '#C0392B' }}>
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <div className='space-y-2.5'>
          {allServices.map(s => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className='w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all group'
              style={{ borderColor: '#F0F0F0', backgroundColor: '#FAFAFA' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#C0392B'
                e.currentTarget.style.backgroundColor = '#fff7f7'
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(192,57,43,0.1)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#F0F0F0'
                e.currentTarget.style.backgroundColor = '#FAFAFA'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className='flex items-center gap-3.5 min-w-0'>
                <div className='w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors'
                  style={{ backgroundColor: '#fde8e8' }}>
                  <Scissors className='w-5 h-5' style={{ color: '#C0392B' }} />
                </div>
                <div className='min-w-0'>
                  <p className='font-bold text-gray-900 text-sm leading-tight'>{s.name}</p>
                  {s.description && (
                    <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>{s.description}</p>
                  )}
                  <div className='flex items-center gap-1 mt-1'>
                    <Clock className='w-3 h-3 text-gray-300' />
                    <span className='text-xs text-gray-400'>{s.duration} min</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 ml-3 flex-shrink-0'>
                <span className='text-base font-black' style={{ color: '#C0392B' }}>
                  {formatCurrency(s.price)}
                </span>
                <div className='w-7 h-7 rounded-full flex items-center justify-center transition-all'
                  style={{ backgroundColor: 'rgba(192,57,43,0.08)' }}>
                  <ArrowRight className='w-3.5 h-3.5' style={{ color: '#C0392B' }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Paso 2: Elegir fecha ───────────────────────────────────────────────────
const DAY_NAMES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

function StepDate({ slug, service, onSelect }) {
  const today = startOfToday()
  const [month, setMonth] = useState(startOfMonth(today))
  const [selected, setSelected] = useState(null)
  const year = month.getFullYear()
  const mon  = month.getMonth() + 1

  const { data: raw, isLoading } = useQuery({
    queryKey: ['available-days', slug, service.id, year, mon],
    queryFn:  () => schedulingApi.availableDays({
      tenant_slug: slug, service_id: service.id, year, month: mon,
    }).then(r => r.data?.data ?? r.data),
  })

  const availableDays = useMemo(() => parseAvailableDays(raw), [raw])

  const days    = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const blanks  = Array(getDay(days[0])).fill(null)
  const isAvail = (d) => availableDays.includes(format(d, 'yyyy-MM-dd'))
  const isPast  = (d) => isBefore(d, today)

  const handleDayClick = (day) => {
    const dateStr = format(day, 'yyyy-MM-dd')
    setSelected(dateStr)
    onSelect(dateStr)
  }

  return (
    <div>
      {/* Header */}
      <div className='mb-5'>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2'
          style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
          <Calendar className='w-3 h-3' />
          Paso 2 de 4
        </span>
        <h2 className='text-xl font-black text-gray-900 leading-tight'>¿Qué día prefieres?</h2>
        <p className='text-sm text-gray-400 mt-1'>
          Servicio: <span className='font-semibold text-gray-600'>{service.name}</span>
        </p>
      </div>

      {/* Resumen servicio */}
      <div className='flex items-center gap-3 p-3.5 rounded-xl mb-5'
        style={{ backgroundColor: '#fef7f7', border: '1px solid #fde8e8' }}>
        <div className='w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0'
          style={{ backgroundColor: '#fde8e8' }}>
          <Scissors className='w-4 h-4' style={{ color: '#C0392B' }} />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-bold text-gray-900'>{service.name}</p>
          <p className='text-xs text-gray-400'>{service.duration} min · {formatCurrency(service.price)}</p>
        </div>
      </div>

      {/* Nav mes */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setMonth(m => subMonths(m, 1))}
          disabled={isBefore(subMonths(month, 1), startOfMonth(today))}
          className='w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 transition-colors'
        >
          <ChevronLeft className='w-5 h-5 text-gray-600' />
        </button>
        <p className='text-sm font-black text-gray-900 capitalize'>
          {format(month, 'MMMM yyyy', { locale: es })}
        </p>
        <button
          onClick={() => setMonth(m => addMonths(m, 1))}
          className='w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors'
        >
          <ChevronRight className='w-5 h-5 text-gray-600' />
        </button>
      </div>

      {/* Días de la semana */}
      <div className='grid grid-cols-7 mb-2'>
        {DAY_NAMES.map(d => (
          <div key={d} className='text-center text-[11px] font-bold text-gray-300 py-1'>{d}</div>
        ))}
      </div>

      {/* Calendario */}
      {isLoading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='w-6 h-6 animate-spin' style={{ color: '#C0392B' }} />
        </div>
      ) : (
        <>
          <div className='grid grid-cols-7 gap-1'>
            {blanks.map((_, i) => <div key={`b${i}`} />)}
            {days.map(day => {
              const past     = isPast(day)
              const avail    = !past && isAvail(day)
              const isToday  = isSameDay(day, today)
              const isSel    = selected === format(day, 'yyyy-MM-dd')

              return (
                <button
                  key={day.toString()}
                  disabled={!avail}
                  onClick={() => avail && handleDayClick(day)}
                  className='aspect-square rounded-xl text-xs font-bold transition-all flex items-center justify-center relative'
                  style={{
                    backgroundColor: isSel ? '#922B21' : avail ? '#C0392B' : 'transparent',
                    color:           isSel || avail ? 'white' : past ? '#e5e7eb' : '#d1d5db',
                    cursor:          avail ? 'pointer' : 'default',
                    boxShadow:       isSel ? '0 4px 12px rgba(192,57,43,0.4)' : 'none',
                    outline:         isToday && !avail ? '1.5px solid #d1d5db' : 'none',
                    transform:       isSel ? 'scale(1.08)' : 'scale(1)',
                  }}
                  onMouseEnter={e => avail && !isSel && (e.currentTarget.style.backgroundColor = '#922B21')}
                  onMouseLeave={e => avail && !isSel && (e.currentTarget.style.backgroundColor = '#C0392B')}
                >
                  {format(day, 'd')}
                  {isToday && (
                    <span className='absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full'
                      style={{ backgroundColor: avail ? 'rgba(255,255,255,0.7)' : '#C0392B' }} />
                  )}
                </button>
              )
            })}
          </div>

          {availableDays.length === 0 && !isLoading && (
            <div className='mt-4 p-4 rounded-xl text-center' style={{ backgroundColor: '#f9fafb' }}>
              <p className='text-xs text-gray-400'>Sin disponibilidad este mes</p>
              <button onClick={() => setMonth(m => addMonths(m, 1))}
                className='mt-2 text-xs font-bold' style={{ color: '#C0392B' }}>
                Ver mes siguiente →
              </button>
            </div>
          )}

          {/* Leyenda */}
          <div className='flex items-center gap-4 mt-4 pt-4 border-t border-gray-50'>
            <div className='flex items-center gap-1.5'>
              <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#C0392B' }} />
              <span className='text-[11px] text-gray-400'>Disponible</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <div className='w-3 h-3 rounded-full bg-gray-200' />
              <span className='text-[11px] text-gray-400'>No disponible</span>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ── Paso 3: Elegir hora ────────────────────────────────────────────────────
function StepTime({ slug, service, date, onSelect }) {
  const { data, isLoading } = useQuery({
    queryKey: ['slots', slug, service.id, date],
    queryFn:  () => schedulingApi.availableSlots({
      tenant_slug: slug, service_id: service.id, date,
    }).then(r => r.data?.data ?? r.data),
  })

  const slots     = data?.slots ?? (Array.isArray(data) ? data : [])
  const available = slots.filter(s => s.available)
  const busy      = slots.filter(s => !s.available)

  return (
    <div>
      {/* Header */}
      <div className='mb-5'>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2'
          style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
          <Clock className='w-3 h-3' />
          Paso 3 de 4
        </span>
        <h2 className='text-xl font-black text-gray-900 leading-tight'>¿A qué hora?</h2>
        <p className='text-sm text-gray-400 mt-1 capitalize'>
          {format(new Date(date + 'T12:00'), "EEEE d 'de' MMMM", { locale: es })}
        </p>
      </div>

      {/* Resumen */}
      <div className='flex items-center gap-3 p-3.5 rounded-xl mb-5'
        style={{ backgroundColor: '#fef7f7', border: '1px solid #fde8e8' }}>
        <div className='w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0'
          style={{ backgroundColor: '#fde8e8' }}>
          <Calendar className='w-4 h-4' style={{ color: '#C0392B' }} />
        </div>
        <div>
          <p className='text-sm font-bold text-gray-900 capitalize'>
            {format(new Date(date + 'T12:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
          </p>
          <p className='text-xs text-gray-400'>{service.name}</p>
        </div>
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-14 gap-3'>
          <Loader2 className='w-6 h-6 animate-spin' style={{ color: '#C0392B' }} />
          <p className='text-sm text-gray-400'>Buscando horarios...</p>
        </div>
      ) : available.length === 0 ? (
        <div className='text-center py-12'>
          <div className='w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center'
            style={{ backgroundColor: '#f9fafb' }}>
            <Clock className='w-7 h-7 text-gray-300' />
          </div>
          <p className='font-bold text-gray-700 mb-1'>Sin horarios disponibles</p>
          <p className='text-xs text-gray-400'>Intenta con otro día</p>
        </div>
      ) : (
        <>
          <p className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
            {available.length} horarios disponibles
          </p>
          <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
            {available.map(slot => (
              <button
                key={slot.time}
                onClick={() => onSelect(slot.time)}
                className='py-3 rounded-xl text-sm font-bold border-2 transition-all'
                style={{ borderColor: '#C0392B', color: '#C0392B', backgroundColor: 'white' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#C0392B'
                  e.currentTarget.style.color = 'white'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(192,57,43,0.25)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#C0392B'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {slot.time}
              </button>
            ))}
          </div>

          {busy.length > 0 && (
            <div className='mt-4'>
              <p className='text-xs font-bold text-gray-300 uppercase tracking-wider mb-2'>Ocupados</p>
              <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                {busy.map(slot => (
                  <div key={slot.time}
                    className='py-3 rounded-xl text-xs font-medium text-center line-through text-gray-300 bg-gray-50 cursor-not-allowed'>
                    {slot.time}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Paso 4: Datos del cliente ──────────────────────────────────────────────
const clientSchema = z.object({
  customer_name:  z.string().min(2, 'Nombre requerido'),
  customer_phone: z.string().min(7, 'Teléfono / WhatsApp requerido'),
})

function StepClientForm({ service, date, time, onSubmit, loading, error }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(clientSchema),
  })

  return (
    <div>
      {/* Header */}
      <div className='mb-5'>
        <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2'
          style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
          <Star className='w-3 h-3' />
          Paso 4 de 4
        </span>
        <h2 className='text-xl font-black text-gray-900 leading-tight'>Confirma tu reserva</h2>
        <p className='text-sm text-gray-400 mt-1'>Último paso · Solo tarda 10 segundos</p>
      </div>

      {/* Resumen completo */}
      <div className='rounded-2xl p-4 mb-5' style={{ backgroundColor: '#fef7f7', border: '1px solid #fde8e8' }}>
        <p className='text-[10px] font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
          Resumen de tu cita
        </p>
        <div className='space-y-2.5'>
          <div className='flex items-center gap-2.5 text-sm'>
            <div className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: '#fde8e8' }}>
              <Scissors className='w-3.5 h-3.5' style={{ color: '#C0392B' }} />
            </div>
            <div>
              <p className='font-bold text-gray-900 leading-none'>{service.name}</p>
              <p className='text-[11px] text-gray-400 mt-0.5'>{service.duration} min</p>
            </div>
          </div>
          <div className='flex items-center gap-2.5 text-sm'>
            <div className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: '#fde8e8' }}>
              <Calendar className='w-3.5 h-3.5' style={{ color: '#C0392B' }} />
            </div>
            <p className='font-semibold text-gray-700 capitalize'>
              {format(new Date(date + 'T12:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
            </p>
          </div>
          <div className='flex items-center gap-2.5 text-sm'>
            <div className='w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: '#fde8e8' }}>
              <Clock className='w-3.5 h-3.5' style={{ color: '#C0392B' }} />
            </div>
            <p className='font-semibold text-gray-700'>{time}</p>
          </div>
        </div>
        <div className='mt-3 pt-3 flex items-center justify-between' style={{ borderTop: '1px solid #fde8e8' }}>
          <span className='text-xs text-gray-400'>Total</span>
          <span className='text-lg font-black' style={{ color: '#C0392B' }}>{formatCurrency(service.price)}</span>
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3.5 rounded-xl flex gap-3 bg-red-50 border border-red-100'>
          <span className='text-red-400 text-sm'>⚠</span>
          <p className='text-sm text-red-700'>{getErrorMessage(error)}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <Input
          label='Nombre completo'
          placeholder='Ej: María García'
          error={errors.customer_name?.message}
          {...register('customer_name')}
        />
        <Input
          label='WhatsApp'
          placeholder='+51 987 654 321'
          type='tel'
          error={errors.customer_phone?.message}
          {...register('customer_phone')}
        />
        <button
          type='submit'
          disabled={loading}
          className='auth-btn shimmer-btn w-full py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2'
          style={{ backgroundColor: '#C0392B' }}
        >
          {loading
            ? <><Loader2 className='w-4 h-4 animate-spin' />Reservando...</>
            : <>Reservar ahora <ArrowRight className='w-4 h-4' /></>}
        </button>
        <p className='text-[11px] text-center text-gray-400'>
          Recibirás confirmación por WhatsApp
        </p>
      </form>
    </div>
  )
}

// ── Pantalla de éxito ──────────────────────────────────────────────────────
function StepSuccess({ booking, service, tenant }) {
  const items = [
    { icon: Scissors, label: 'Servicio',  value: service.name },
    { icon: Calendar, label: 'Fecha',
      value: format(new Date(booking.date + 'T12:00'), "EEEE d 'de' MMMM yyyy", { locale: es }) },
    { icon: Clock, label: 'Hora',
      value: `${formatTime(booking.start_time)}${booking.end_time ? ` — ${formatTime(booking.end_time)}` : ''}` },
    ...(tenant.address ? [{ icon: MapPin, label: 'Dirección', value: tenant.address }] : []),
    ...(tenant.phone   ? [{ icon: Phone,  label: 'Teléfono',  value: tenant.phone   }] : []),
  ]

  return (
    <div className='text-center'>
      {/* Checkmark animado */}
      <div className='relative w-20 h-20 mx-auto mb-5'>
        <div className='w-20 h-20 rounded-full flex items-center justify-center'
          style={{ backgroundColor: '#C0392B', boxShadow: '0 8px 32px rgba(192,57,43,0.35)' }}>
          <CheckCircle className='w-10 h-10 text-white' />
        </div>
        <div className='absolute inset-0 rounded-full animate-ping opacity-20'
          style={{ backgroundColor: '#C0392B' }} />
      </div>

      <h2 className='text-2xl font-black text-gray-900 mb-1'>¡Reserva confirmada!</h2>
      <p className='text-gray-400 mb-6'>
        Te esperamos en <span className='font-black text-gray-900'>{tenant.name}</span>
      </p>

      {/* Detalles */}
      <div className='rounded-2xl p-5 text-left space-y-3 mb-4'
        style={{ backgroundColor: '#FAFAFA', border: '1px solid #F0F0F0' }}>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className='flex items-start gap-3 text-sm'>
            <div className='w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: '#fde8e8' }}>
              <Icon className='w-4 h-4' style={{ color: '#C0392B' }} />
            </div>
            <div>
              <p className='text-[11px] text-gray-400 mb-0.5'>{label}</p>
              <p className='font-bold text-gray-900 capitalize text-sm'>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* WhatsApp banner */}
      <div className='rounded-2xl p-4 space-y-2'
        style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 text-white text-sm font-black'>
            W
          </div>
          <p className='text-sm font-bold text-green-800'>Notificaciones enviadas por WhatsApp</p>
        </div>
        <p className='text-xs text-green-700 pl-11'>
          ✓ Recibirás confirmación al número que ingresaste
        </p>
        <p className='text-xs text-green-700 pl-11'>
          ✓ El negocio también fue notificado por WhatsApp
        </p>
      </div>
    </div>
  )
}

// ── Página principal ───────────────────────────────────────────────────────
export default function BookingPage() {
  const { slug } = useParams()
  const [step,    setStep]    = useState(1)
  const [service, setService] = useState(null)
  const [date,    setDate]    = useState(null)
  const [time,    setTime]    = useState(null)
  const [booking, setBooking] = useState(null)

  const { data: tenant, isLoading: loadingTenant, error: tenantError } = useQuery({
    queryKey: ['tenant-public', slug],
    queryFn:  () => authApi.getPublicTenant(slug).then(r => r.data.data),
  })

  const { mutate: createBooking, isPending, error: bookingError } = useMutation({
    mutationFn: (data) => bookingsApi.createPublic(data).then(r => r.data.data),
    onSuccess:  (data) => { setBooking(data); setStep(5) },
  })

  const handleClientSubmit = (clientData) => {
    createBooking({ tenant_slug: slug, service_id: service.id, date, start_time: time, ...clientData })
  }

  if (loadingTenant) return (
    <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#0D0D0D' }}>
      <div className='text-center'>
        <Loader2 className='w-8 h-8 animate-spin mx-auto mb-3' style={{ color: '#C0392B' }} />
        <p className='text-gray-500 text-sm'>Cargando...</p>
      </div>
    </div>
  )

  if (tenantError || !tenant) return (
    <div className='min-h-screen flex items-center justify-center p-6 text-center' style={{ backgroundColor: '#0D0D0D' }}>
      <div>
        <div className='w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center'
          style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}>
          <X className='w-7 h-7 text-gray-600' />
        </div>
        <p className='text-xl font-black text-white mb-2'>Negocio no encontrado</p>
        <p className='text-gray-500 text-sm'>El enlace puede ser incorrecto o el negocio está inactivo.</p>
      </div>
    </div>
  )

  const isSuccessStep = step === 5

  return (
    <div className='min-h-screen flex flex-col' style={{ backgroundColor: '#F5F5F7' }}>

      {/* ── Hero ── */}
      <div style={{ backgroundColor: '#0D0D0D' }} className='relative overflow-hidden'>
        {/* Grid */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.05) 1px,transparent 1px)`,
          backgroundSize: '32px 32px',
        }} />
        {/* Glow */}
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 60% 0%, rgba(192,57,43,0.12) 0%, transparent 55%)',
        }} />

        <div className='max-w-lg mx-auto px-5 py-8 relative z-10'>

          {/* Negocio info */}
          <div className='flex items-center gap-4 mb-6'>
            <div
              className='w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-black text-white'
              style={{ backgroundColor: '#C0392B', boxShadow: '0 4px 16px rgba(192,57,43,0.4)' }}
            >
              {tenant.name[0]?.toUpperCase()}
            </div>
            <div>
              <div className='flex items-center gap-2 mb-0.5'>
                <h1 className='text-xl font-black text-white leading-none'>{tenant.name}</h1>
                <span className='relative flex h-2 w-2'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75' />
                  <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500' />
                </span>
              </div>
              {(tenant.address || tenant.city) && (
                <p className='text-sm flex items-center gap-1.5' style={{ color: '#666' }}>
                  <MapPin className='w-3.5 h-3.5' />
                  {tenant.address || tenant.city}
                </p>
              )}
            </div>
          </div>

          <p className='text-2xl font-black text-white leading-tight mb-1'>
            Reserva tu cita <span style={{ color: '#C0392B' }}>en línea</span>
          </p>
          <p className='text-sm mb-6' style={{ color: '#555' }}>Rápido, fácil y sin llamadas</p>

          {/* Barra de progreso */}
          {!isSuccessStep && (
            <div className='flex items-center'>
              {STEP_LABELS.map((label, i) => {
                const n      = i + 1
                const active = step === n
                const done   = step > n
                return (
                  <div key={n} className='flex items-center flex-1 last:flex-none'>
                    <div className='flex flex-col items-center'>
                      <div
                        className='w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all'
                        style={{
                          backgroundColor: done ? '#16a34a' : active ? '#C0392B' : '#1A1A1A',
                          color:           done || active ? 'white' : '#4A4A4A',
                          border:          active ? '2px solid rgba(192,57,43,0.4)' : 'none',
                          boxShadow:       active ? '0 0 0 4px rgba(192,57,43,0.15)' : 'none',
                        }}
                      >
                        {done ? '✓' : n}
                      </div>
                      <span className='text-[10px] font-semibold mt-1 hidden sm:block'
                        style={{ color: active ? '#E74C3C' : done ? '#4ade80' : '#3A3A3A' }}>
                        {label}
                      </span>
                    </div>
                    {n < STEP_LABELS.length && (
                      <div className='flex-1 h-0.5 mx-2 rounded'
                        style={{ backgroundColor: done ? '#16a34a' : '#2C2C2C' }} />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Contenido del step ── */}
      <div className='flex-1 max-w-lg mx-auto w-full px-4 py-5 pb-10'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6'>

          {/* Botón volver */}
          {step > 1 && !isSuccessStep && (
            <button
              onClick={() => setStep(s => s - 1)}
              className='flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-700 mb-5 -mt-1 transition-colors'
            >
              <ChevronLeft className='w-4 h-4' /> Volver
            </button>
          )}

          {step === 1 && <StepService slug={slug} onSelect={s => { setService(s); setStep(2) }} />}
          {step === 2 && service && <StepDate slug={slug} service={service} onSelect={d => { setDate(d); setStep(3) }} />}
          {step === 3 && service && date && <StepTime slug={slug} service={service} date={date} onSelect={t => { setTime(t); setStep(4) }} />}
          {step === 4 && service && date && time && (
            <StepClientForm service={service} date={date} time={time}
              onSubmit={handleClientSubmit} loading={isPending} error={bookingError} />
          )}
          {step === 5 && booking && <StepSuccess booking={booking} service={service} tenant={tenant} />}
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className='py-4 text-center' style={{ borderTop: '1px solid #eee', backgroundColor: 'white' }}>
        <div className='inline-flex items-center gap-2 opacity-50 hover:opacity-80 transition-opacity'>
          <span className='text-[11px] text-gray-400'>Reservas por</span>
          <LogoFull height={18} />
        </div>
      </footer>
    </div>
  )
}
