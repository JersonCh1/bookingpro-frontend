import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { authApi } from '../../api/auth'
import { schedulingApi, bookingsApi } from '../../api/bookings'
import client from '../../api/client'
import { formatCurrency, formatTime, getErrorMessage } from '../../utils/helpers'
import {
  Calendar, Clock, MapPin, Phone, CheckCircle,
  ChevronLeft, ChevronRight, Loader2, Scissors,
} from 'lucide-react'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, startOfToday, isBefore, isSameDay,
} from 'date-fns'
import { es } from 'date-fns/locale'
import Input from '../../components/ui/Input'

const STEP_LABELS = ['Servicio', 'Fecha', 'Hora', 'Datos']

// ── Paso 1: Elegir servicio ───────────────────────────────
function StepService({ slug, onSelect }) {
  const { data, isLoading } = useQuery({
    queryKey: ['public-services', slug],
    queryFn:  () => client.get(`/services/public/${slug}/`).then(r => r.data.data),
  })
  const services = Array.isArray(data) ? data : (data?.results ?? [])

  if (isLoading) {
    return (
      <div className='flex justify-center py-12'>
        <Loader2 className='w-6 h-6 animate-spin' style={{ color: '#C0392B' }} />
      </div>
    )
  }

  return (
    <div>
      <h2 className='text-lg font-black text-gray-900 mb-1'>¿Qué servicio necesitas?</h2>
      <p className='text-sm text-gray-400 mb-5'>Elige el servicio para tu cita</p>
      <div className='space-y-2.5'>
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-l-4 text-left group transition-all bg-white'
            style={{ borderLeftColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderLeft = '4px solid #C0392B'; e.currentTarget.style.backgroundColor = '#fef9f9' }}
            onMouseLeave={e => { e.currentTarget.style.borderLeft = '1px solid #f3f4f6'; e.currentTarget.style.backgroundColor = 'white' }}
          >
            <div className='flex items-center gap-4 min-w-0'>
              <div className='w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0'
                style={{ backgroundColor: '#fde8e8' }}>
                <Scissors className='w-5 h-5' style={{ color: '#C0392B' }} />
              </div>
              <div className='min-w-0'>
                <p className='font-bold text-gray-900 text-sm'>{s.name}</p>
                {s.description && (
                  <p className='text-xs text-gray-400 mt-0.5 line-clamp-1'>{s.description}</p>
                )}
                <p className='text-xs text-gray-400 mt-0.5 flex items-center gap-1'>
                  <Clock className='w-3 h-3' />{s.duration} min
                </p>
              </div>
            </div>
            <span className='text-base font-black ml-3 flex-shrink-0' style={{ color: '#C0392B' }}>
              {formatCurrency(s.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Paso 2: Elegir fecha ──────────────────────────────────
const DAY_NAMES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

function StepDate({ slug, service, onSelect }) {
  const today = startOfToday()
  const [month, setMonth] = useState(startOfMonth(today))
  const year = month.getFullYear()
  const mon  = month.getMonth() + 1

  const { data: availableDays = [], isLoading } = useQuery({
    queryKey: ['available-days', slug, service.id, year, mon],
    queryFn:  () => schedulingApi.availableDays({
      tenant_slug: slug, service_id: service.id, year, month: mon,
    }).then(r => r.data.data),
  })

  const days   = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const blanks = Array(getDay(days[0])).fill(null)
  const isAvail = (d) => availableDays.includes(format(d, 'yyyy-MM-dd'))
  const isPast  = (d) => isBefore(d, today)

  return (
    <div>
      <h2 className='text-lg font-black text-gray-900 mb-1'>¿Qué día prefieres?</h2>
      <p className='text-sm text-gray-400 mb-5'>Los días en rojo tienen disponibilidad</p>

      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setMonth(m => subMonths(m, 1))}
          disabled={isBefore(subMonths(month, 1), startOfMonth(today))}
          className='p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        <p className='font-bold text-gray-900 capitalize'>
          {format(month, 'MMMM yyyy', { locale: es })}
        </p>
        <button
          onClick={() => setMonth(m => addMonths(m, 1))}
          className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      <div className='grid grid-cols-7 mb-2'>
        {DAY_NAMES.map(d => (
          <div key={d} className='text-center text-xs font-bold text-gray-400 py-1'>{d}</div>
        ))}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Loader2 className='w-5 h-5 animate-spin' style={{ color: '#C0392B' }} />
        </div>
      ) : (
        <div className='grid grid-cols-7 gap-1'>
          {blanks.map((_, i) => <div key={`b${i}`} />)}
          {days.map(day => {
            const past  = isPast(day)
            const avail = !past && isAvail(day)
            return (
              <button
                key={day.toString()}
                disabled={!avail}
                onClick={() => avail && onSelect(format(day, 'yyyy-MM-dd'))}
                className='aspect-square rounded-xl text-sm font-bold transition-all'
                style={{
                  backgroundColor: avail ? '#C0392B' : 'transparent',
                  color: avail ? 'white' : past ? '#d1d5db' : '#9ca3af',
                  cursor: avail ? 'pointer' : 'not-allowed',
                  outline: isSameDay(day, today) && !avail ? '1px solid #d1d5db' : 'none',
                }}
                onMouseEnter={e => avail && (e.currentTarget.style.backgroundColor = '#922B21')}
                onMouseLeave={e => avail && (e.currentTarget.style.backgroundColor = '#C0392B')}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Paso 3: Elegir hora ───────────────────────────────────
function StepTime({ slug, service, date, onSelect }) {
  const { data, isLoading } = useQuery({
    queryKey: ['slots', slug, service.id, date],
    queryFn:  () => schedulingApi.availableSlots({
      tenant_slug: slug, service_id: service.id, date,
    }).then(r => r.data.data),
  })
  const slots = data?.slots ?? []

  return (
    <div>
      <h2 className='text-lg font-black text-gray-900 mb-1'>¿A qué hora?</h2>
      <p className='text-sm text-gray-400 mb-5 capitalize'>
        {format(new Date(date + 'T00:00'), "EEEE d 'de' MMMM", { locale: es })}
      </p>

      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='w-6 h-6 animate-spin' style={{ color: '#C0392B' }} />
        </div>
      ) : slots.filter(s => s.available).length === 0 ? (
        <div className='text-center py-10'>
          <Clock className='w-10 h-10 mx-auto mb-3 text-gray-200' />
          <p className='text-gray-400 text-sm'>Sin horarios disponibles este día</p>
        </div>
      ) : (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {slots.map(slot => (
            slot.available ? (
              <button
                key={slot.time}
                onClick={() => onSelect(slot.time)}
                className='py-3 rounded-xl text-sm font-bold border-2 transition-all'
                style={{ borderColor: '#C0392B', color: '#C0392B', backgroundColor: 'white' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#C0392B'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'white'
                  e.currentTarget.style.color = '#C0392B'
                }}
              >
                {slot.time}
              </button>
            ) : (
              <div key={slot.time} className='py-3 rounded-xl text-sm font-medium bg-gray-50 text-gray-300 text-center line-through cursor-not-allowed'>
                {slot.time}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  )
}

// ── Paso 4: Datos del cliente ─────────────────────────────
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
      <h2 className='text-lg font-black text-gray-900 mb-4'>Confirma tu reserva</h2>

      <div className='rounded-2xl p-4 mb-5 space-y-2.5' style={{ backgroundColor: '#fef2f2', border: '1px solid #fbd0d0' }}>
        <p className='font-black text-base' style={{ color: '#922B21' }}>{service.name}</p>
        <div className='flex items-center gap-2 text-sm' style={{ color: '#C0392B' }}>
          <Calendar className='w-4 h-4 flex-shrink-0' />
          <span className='font-semibold capitalize'>
            {format(new Date(date + 'T00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
          </span>
        </div>
        <div className='flex items-center gap-2 text-sm' style={{ color: '#C0392B' }}>
          <Clock className='w-4 h-4 flex-shrink-0' />
          <span className='font-semibold'>{time}</span>
        </div>
        <div className='pt-2' style={{ borderTop: '1px solid #fbd0d0' }}>
          <span className='font-black' style={{ color: '#922B21' }}>{formatCurrency(service.price)}</span>
        </div>
      </div>

      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-xl'>
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
          label='Número de WhatsApp'
          placeholder='+51 987 654 321'
          type='tel'
          error={errors.customer_phone?.message}
          {...register('customer_phone')}
        />
        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
          style={{ backgroundColor: '#C0392B' }}
          onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#922B21')}
          onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = '#C0392B')}
        >
          {loading && <Loader2 className='w-4 h-4 animate-spin' />}
          Reservar ahora
        </button>
      </form>
    </div>
  )
}

// ── Pantalla de éxito ─────────────────────────────────────
function StepSuccess({ booking, service, tenant }) {
  const items = [
    { icon: Scissors, label: 'Servicio',  value: service.name },
    { icon: Calendar, label: 'Fecha',
      value: format(new Date(booking.date + 'T00:00'), "EEEE d 'de' MMMM yyyy", { locale: es }) },
    { icon: Clock,    label: 'Hora',
      value: `${formatTime(booking.start_time)}${booking.end_time ? ` — ${formatTime(booking.end_time)}` : ''}` },
    ...(tenant.address ? [{ icon: MapPin, label: 'Dirección', value: tenant.address }] : []),
    ...(tenant.phone   ? [{ icon: Phone,  label: 'Teléfono',  value: tenant.phone   }] : []),
  ]

  return (
    <div className='text-center py-4'>
      <div className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'
        style={{ backgroundColor: '#C0392B' }}>
        <CheckCircle className='w-9 h-9 text-white' />
      </div>
      <h2 className='text-xl font-black text-gray-900 mb-1'>¡Reserva confirmada!</h2>
      <p className='text-gray-500 mb-6'>
        Te esperamos en <span className='font-black text-gray-900'>{tenant.name}</span>
      </p>

      <div className='bg-gray-50 border border-gray-100 rounded-2xl p-5 text-left space-y-3 mb-5'>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className='flex items-start gap-3 text-sm'>
            <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
              style={{ backgroundColor: '#fde8e8' }}>
              <Icon className='w-4 h-4' style={{ color: '#C0392B' }} />
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>{label}</p>
              <p className='font-bold text-gray-900 capitalize'>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='rounded-2xl p-4' style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
        <p className='text-sm font-bold text-green-800'>Recibirás una confirmación por WhatsApp</p>
        <p className='text-xs text-green-600 mt-0.5'>Revisa tu teléfono en los próximos minutos</p>
      </div>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────
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

  if (loadingTenant) {
    return (
      <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#0D0D0D' }}>
        <Loader2 className='w-8 h-8 animate-spin' style={{ color: '#C0392B' }} />
      </div>
    )
  }
  if (tenantError || !tenant) {
    return (
      <div className='min-h-screen flex items-center justify-center p-4 text-center' style={{ backgroundColor: '#0D0D0D' }}>
        <div>
          <p className='text-2xl font-black text-white mb-2'>Negocio no encontrado</p>
          <p className='text-gray-500'>El enlace puede ser incorrecto o el negocio está inactivo.</p>
        </div>
      </div>
    )
  }

  const isSuccessStep = step === 5

  return (
    <div className='min-h-screen flex flex-col bg-gray-50'>

      {/* Hero negro */}
      <div style={{ backgroundColor: '#0D0D0D' }}>
        <div className='max-w-lg mx-auto px-5 py-10'>

          {/* Negocio info */}
          <div className='flex items-center gap-4 mb-7'>
            <div
              className='w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl font-black text-white'
              style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}
            >
              {tenant.name[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className='text-2xl font-black text-white leading-none'>{tenant.name}</h1>
              {tenant.address && (
                <p className='text-sm mt-1 flex items-center gap-1' style={{ color: '#4A4A4A' }}>
                  <MapPin className='w-3.5 h-3.5' />{tenant.address}
                </p>
              )}
            </div>
          </div>

          <h2 className='text-3xl font-black leading-tight mb-3' style={{ color: '#C0392B' }}>
            Reserva tu cita<br />en minutos.
          </h2>

          {/* Badge online */}
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full'
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75' />
              <span className='relative inline-flex h-2 w-2 rounded-full bg-green-500' />
            </span>
            <span className='text-xs font-bold text-green-400'>En línea</span>
          </div>

          {/* Barra de progreso */}
          {!isSuccessStep && (
            <div className='mt-7 flex items-center gap-1'>
              {STEP_LABELS.map((label, i) => {
                const n      = i + 1
                const active = step === n
                const done   = step > n
                return (
                  <div key={n} className='flex items-center gap-1 flex-1'>
                    <div className='flex items-center gap-1.5 flex-shrink-0'>
                      <div
                        className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all'
                        style={{
                          backgroundColor: done || active ? '#C0392B' : '#1A1A1A',
                          color: done || active ? 'white' : '#4A4A4A',
                          border: active ? '2px solid #E74C3C' : 'none',
                        }}
                      >
                        {done ? '✓' : n}
                      </div>
                      <span
                        className='text-xs font-semibold hidden sm:block'
                        style={{ color: active || done ? '#E74C3C' : '#4A4A4A' }}
                      >
                        {label}
                      </span>
                    </div>
                    {n < STEP_LABELS.length && (
                      <div
                        className='flex-1 h-0.5 rounded'
                        style={{ backgroundColor: done ? '#C0392B' : '#2C2C2C' }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className='flex-1 max-w-lg mx-auto w-full px-4 py-6 pb-10'>
        <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
          {step > 1 && !isSuccessStep && (
            <button
              onClick={() => setStep(s => s - 1)}
              className='flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-5 -mt-1 transition-colors'
            >
              <ChevronLeft className='w-4 h-4' /> Volver
            </button>
          )}

          {step === 1 && <StepService slug={slug} onSelect={s => { setService(s); setStep(2) }} />}
          {step === 2 && <StepDate slug={slug} service={service} onSelect={d => { setDate(d); setStep(3) }} />}
          {step === 3 && <StepTime slug={slug} service={service} date={date} onSelect={t => { setTime(t); setStep(4) }} />}
          {step === 4 && <StepClientForm service={service} date={date} time={time} onSubmit={handleClientSubmit} loading={isPending} error={bookingError} />}
          {step === 5 && booking && <StepSuccess booking={booking} service={service} tenant={tenant} />}
        </div>
      </div>

      {/* Footer */}
      <footer className='py-5 text-center border-t border-gray-100 bg-white'>
        <p className='text-xs text-gray-400'>
          Powered by <span className='font-black text-gray-600'>AgendaYa</span>
          <span className='pulse-dot ml-1' style={{ color: '#C0392B' }}>●</span>
        </p>
      </footer>
    </div>
  )
}
