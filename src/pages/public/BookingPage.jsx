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
  ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth,
         eachDayOfInterval, getDay, startOfToday, isBefore, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import Button from '../../components/ui/Button'
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
        <Loader2 className='w-6 h-6 animate-spin text-primary-600' />
      </div>
    )
  }

  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>¿Qué servicio necesitas?</h2>
      <div className='space-y-3'>
        {services.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className='w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all text-left group'
          >
            <div className='min-w-0'>
              <p className='font-semibold text-gray-900 group-hover:text-primary-700'>{s.name}</p>
              {s.description && (
                <p className='text-sm text-gray-500 mt-0.5 line-clamp-2'>{s.description}</p>
              )}
              <p className='text-sm text-gray-400 mt-1 flex items-center gap-1'>
                <Clock className='w-3.5 h-3.5' />{s.duration} min
              </p>
            </div>
            <span className='text-lg font-bold text-primary-600 ml-4 flex-shrink-0'>
              {formatCurrency(s.price)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Paso 2: Elegir fecha (calendario mensual) ─────────────
const DAY_NAMES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

function StepDate({ slug, service, onSelect }) {
  const today = startOfToday()
  const [month, setMonth] = useState(startOfMonth(today))

  const year  = month.getFullYear()
  const mon   = month.getMonth() + 1

  const { data: availableDays = [], isLoading } = useQuery({
    queryKey: ['available-days', slug, service.id, year, mon],
    queryFn:  () => schedulingApi.availableDays({
      tenant_slug: slug,
      service_id:  service.id,
      year,
      month:       mon,
    }).then(r => r.data.data),
  })

  const days      = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
  const firstDay  = getDay(days[0])  // 0=Dom ... 6=Sáb
  const blanks    = Array(firstDay).fill(null)

  const isAvailable = (day) => availableDays.includes(format(day, 'yyyy-MM-dd'))
  const isPast      = (day) => isBefore(day, today)

  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>¿Qué día prefieres?</h2>

      {/* Navegación mes */}
      <div className='flex items-center justify-between mb-4'>
        <button
          onClick={() => setMonth(m => subMonths(m, 1))}
          disabled={isBefore(subMonths(month, 1), startOfMonth(today))}
          className='p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        <p className='font-semibold text-gray-900 capitalize'>
          {format(month, 'MMMM yyyy', { locale: es })}
        </p>
        <button
          onClick={() => setMonth(m => addMonths(m, 1))}
          className='p-2 rounded-lg hover:bg-gray-100'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      {/* Cabecera días */}
      <div className='grid grid-cols-7 mb-1'>
        {DAY_NAMES.map(d => (
          <div key={d} className='text-center text-xs font-medium text-gray-400 py-1'>{d}</div>
        ))}
      </div>

      {/* Grilla */}
      {isLoading ? (
        <div className='flex justify-center py-8'>
          <Loader2 className='w-5 h-5 animate-spin text-primary-600' />
        </div>
      ) : (
        <div className='grid grid-cols-7 gap-1'>
          {blanks.map((_, i) => <div key={`b${i}`} />)}
          {days.map(day => {
            const past  = isPast(day)
            const avail = !past && isAvailable(day)
            const isToday = isSameDay(day, today)
            return (
              <button
                key={day.toString()}
                disabled={!avail}
                onClick={() => avail && onSelect(format(day, 'yyyy-MM-dd'))}
                className={`
                  aspect-square rounded-xl text-sm font-medium transition-all
                  ${avail
                    ? 'bg-primary-100 text-primary-700 hover:bg-primary-500 hover:text-white border-2 border-primary-300'
                    : past
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-400 cursor-not-allowed'
                  }
                  ${isToday && !avail ? 'ring-1 ring-gray-300' : ''}
                `}
              >
                {format(day, 'd')}
              </button>
            )
          })}
        </div>
      )}

      <p className='text-xs text-gray-400 mt-3 text-center'>
        Los días resaltados en verde tienen disponibilidad
      </p>
    </div>
  )
}

// ── Paso 3: Elegir hora ───────────────────────────────────
function StepTime({ slug, service, date, onSelect }) {
  const { data, isLoading } = useQuery({
    queryKey: ['slots', slug, service.id, date],
    queryFn:  () => schedulingApi.availableSlots({
      tenant_slug: slug,
      service_id:  service.id,
      date,
    }).then(r => r.data.data),
  })

  const slots = data?.slots ?? []

  return (
    <div>
      <h2 className='text-lg font-semibold text-gray-900 mb-1'>¿A qué hora?</h2>
      <p className='text-sm text-gray-500 mb-4 capitalize'>
        {format(new Date(date + 'T00:00'), "EEEE d 'de' MMMM", { locale: es })}
      </p>

      {isLoading ? (
        <div className='flex justify-center py-10'>
          <Loader2 className='w-6 h-6 animate-spin text-primary-600' />
        </div>
      ) : slots.filter(s => s.available).length === 0 ? (
        <div className='text-center py-10 text-gray-400'>
          <Clock className='w-8 h-8 mx-auto mb-2 text-gray-200' />
          <p>Sin horarios disponibles este día</p>
        </div>
      ) : (
        <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
          {slots.map(slot => (
            slot.available ? (
              <button
                key={slot.time}
                onClick={() => onSelect(slot.time)}
                className='py-3 rounded-xl text-sm font-semibold border-2 border-primary-200 text-primary-700 hover:border-primary-500 hover:bg-primary-50 transition-all'
              >
                {slot.time}
              </button>
            ) : (
              <div
                key={slot.time}
                className='py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-300 text-center line-through cursor-not-allowed'
              >
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
      <h2 className='text-lg font-semibold text-gray-900 mb-4'>Confirma tu reserva</h2>

      {/* Resumen */}
      <div className='bg-primary-50 border border-primary-100 rounded-xl p-4 mb-5 space-y-2'>
        <p className='font-bold text-primary-800 text-base'>{service.name}</p>
        <div className='flex items-center gap-2 text-sm text-primary-700'>
          <Calendar className='w-4 h-4 flex-shrink-0' />
          <span className='capitalize'>
            {format(new Date(date + 'T00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
          </span>
        </div>
        <div className='flex items-center gap-2 text-sm text-primary-700'>
          <Clock className='w-4 h-4 flex-shrink-0' />
          <span>{time}</span>
        </div>
        <p className='font-semibold text-primary-700 text-sm pt-1 border-t border-primary-200'>
          {formatCurrency(service.price)}
        </p>
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
        <Button type='submit' loading={loading} className='w-full'>
          Reservar ahora
        </Button>
      </form>
    </div>
  )
}

// ── Pantalla de éxito ─────────────────────────────────────
function StepSuccess({ booking, service, tenant }) {
  return (
    <div className='text-center py-4'>
      <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
        <CheckCircle className='w-9 h-9 text-green-600' />
      </div>
      <h2 className='text-xl font-bold text-gray-900 mb-1'>¡Reserva confirmada!</h2>
      <p className='text-gray-500 mb-6'>Te esperamos en <span className='font-semibold'>{tenant.name}</span></p>

      <div className='bg-gray-50 border border-gray-100 rounded-xl p-5 text-left space-y-3 mb-6'>
        <div className='flex items-start gap-3 text-sm'>
          <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <Calendar className='w-4 h-4 text-primary-600' />
          </div>
          <div>
            <p className='text-xs text-gray-400 mb-0.5'>Servicio</p>
            <p className='font-semibold text-gray-900'>{service.name}</p>
          </div>
        </div>

        <div className='flex items-start gap-3 text-sm'>
          <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <Calendar className='w-4 h-4 text-primary-600' />
          </div>
          <div>
            <p className='text-xs text-gray-400 mb-0.5'>Fecha</p>
            <p className='font-semibold text-gray-900 capitalize'>
              {format(new Date(booking.date + 'T00:00'), "EEEE d 'de' MMMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        <div className='flex items-start gap-3 text-sm'>
          <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
            <Clock className='w-4 h-4 text-primary-600' />
          </div>
          <div>
            <p className='text-xs text-gray-400 mb-0.5'>Hora</p>
            <p className='font-semibold text-gray-900'>
              {formatTime(booking.start_time)}
              {booking.end_time ? ` – ${formatTime(booking.end_time)}` : ''}
            </p>
          </div>
        </div>

        {tenant.address && (
          <div className='flex items-start gap-3 text-sm'>
            <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
              <MapPin className='w-4 h-4 text-primary-600' />
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Dirección</p>
              <p className='font-semibold text-gray-900'>{tenant.address}</p>
            </div>
          </div>
        )}

        {tenant.phone && (
          <div className='flex items-start gap-3 text-sm'>
            <div className='w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0'>
              <Phone className='w-4 h-4 text-primary-600' />
            </div>
            <div>
              <p className='text-xs text-gray-400 mb-0.5'>Teléfono</p>
              <p className='font-semibold text-gray-900'>{tenant.phone}</p>
            </div>
          </div>
        )}
      </div>

      <div className='bg-green-50 border border-green-200 rounded-xl p-4'>
        <p className='text-sm font-medium text-green-800'>
          Recibirás una confirmación por WhatsApp
        </p>
        <p className='text-xs text-green-600 mt-0.5'>
          Revisa tu teléfono en los próximos minutos
        </p>
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
    createBooking({
      tenant_slug: slug,
      service_id:  service.id,
      date,
      start_time:  time,
      ...clientData,
    })
  }

  const goBack = () => setStep(s => s - 1)

  // ── Loading / Error del tenant ─────────────────────────
  if (loadingTenant) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader2 className='w-8 h-8 animate-spin text-primary-600' />
      </div>
    )
  }
  if (tenantError || !tenant) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4 text-center'>
        <div>
          <p className='text-2xl font-bold text-gray-900 mb-2'>Negocio no encontrado</p>
          <p className='text-gray-500'>El enlace puede ser incorrecto o el negocio está inactivo.</p>
        </div>
      </div>
    )
  }

  const isSuccessStep = step === 5

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header del negocio */}
      <div className='bg-white border-b border-gray-200'>
        <div className='max-w-lg mx-auto px-4 py-5 flex items-center gap-4'>
          <div className='w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0'>
            <span className='text-2xl font-bold text-primary-600'>
              {tenant.name[0]?.toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className='text-lg font-bold text-gray-900'>{tenant.name}</h1>
            {tenant.address && (
              <p className='text-xs text-gray-400 mt-0.5 flex items-center gap-1'>
                <MapPin className='w-3 h-3' />{tenant.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Barra de progreso */}
      {!isSuccessStep && (
        <div className='max-w-lg mx-auto px-4 pt-5'>
          <div className='flex items-center gap-1'>
            {STEP_LABELS.map((label, i) => {
              const n      = i + 1
              const active = step === n
              const done   = step > n
              return (
                <div key={n} className='flex items-center gap-1 flex-1'>
                  <div className='flex items-center gap-1.5 flex-shrink-0'>
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                      ${done  ? 'bg-primary-600 text-white'
                      : active ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                      :          'bg-gray-200 text-gray-400'}
                    `}>
                      {done ? '✓' : n}
                    </div>
                    <span className={`
                      text-xs font-medium hidden sm:block transition-colors
                      ${active || done ? 'text-primary-600' : 'text-gray-400'}
                    `}>
                      {label}
                    </span>
                  </div>
                  {n < STEP_LABELS.length && (
                    <div className={`flex-1 h-0.5 rounded transition-colors ${done ? 'bg-primary-400' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className='max-w-lg mx-auto px-4 py-6 pb-12'>
        <div className='card p-6'>

          {/* Botón volver */}
          {step > 1 && !isSuccessStep && (
            <button
              onClick={goBack}
              className='flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-5 -mt-1'
            >
              <ChevronLeft className='w-4 h-4' /> Volver
            </button>
          )}

          {step === 1 && (
            <StepService
              slug={slug}
              onSelect={s => { setService(s); setStep(2) }}
            />
          )}

          {step === 2 && (
            <StepDate
              slug={slug}
              service={service}
              onSelect={d => { setDate(d); setStep(3) }}
            />
          )}

          {step === 3 && (
            <StepTime
              slug={slug}
              service={service}
              date={date}
              onSelect={t => { setTime(t); setStep(4) }}
            />
          )}

          {step === 4 && (
            <StepClientForm
              service={service}
              date={date}
              time={time}
              onSubmit={handleClientSubmit}
              loading={isPending}
              error={bookingError}
            />
          )}

          {step === 5 && booking && (
            <StepSuccess
              booking={booking}
              service={service}
              tenant={tenant}
            />
          )}
        </div>
      </div>
    </div>
  )
}
