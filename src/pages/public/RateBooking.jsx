import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { bookingsApi, ratingsApi } from '../../api/bookings'
import { LogoFull } from '../../components/ui/Logo'
import { Star, CheckCircle, X } from 'lucide-react'

export default function RateBooking() {
  const { token }  = useParams()
  const [score, setScore]     = useState(0)
  const [hover, setHover]     = useState(0)
  const [comment, setComment] = useState('')
  const [done, setDone]       = useState(false)

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking-by-token-rate', token],
    queryFn:  () => bookingsApi.byToken(token).then(r => r.data.data),
    retry: false,
  })

  const mutation = useMutation({
    mutationFn: () => ratingsApi.create({ cancel_token: token, score, comment }),
    onSuccess:  () => setDone(true),
  })

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
        <p className='text-sm' style={{ color: '#555' }}>Este enlace no es válido o ya fue utilizado.</p>
      </div>
    </Screen>
  )

  if (booking.status !== 'completed') return (
    <Screen>
      <div className='text-center py-12'>
        <p className='text-xl font-black text-white mb-2'>Cita no completada</p>
        <p className='text-sm mb-5' style={{ color: '#555' }}>Solo puedes valorar citas que ya se realizaron.</p>
        <Link to='/mis-reservas' className='text-sm font-bold' style={{ color: '#C0392B' }}>
          Ver mis reservas
        </Link>
      </div>
    </Screen>
  )

  if (done) return (
    <Screen>
      <div className='text-center py-12'>
        <div className='w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center' style={{ backgroundColor: '#fef9c3' }}>
          <Star className='w-8 h-8 text-yellow-500 fill-yellow-400' />
        </div>
        <h1 className='text-2xl font-black text-white mb-2'>¡Gracias por tu valoración! ⭐</h1>
        <p className='text-sm mb-6' style={{ color: '#555' }}>Tu opinión ayuda a mejorar el servicio de {booking.tenant_name}.</p>
        <Link to='/'
          className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white'
          style={{ backgroundColor: '#C0392B' }}>
          Volver al inicio
        </Link>
      </div>
    </Screen>
  )

  const errMsg = mutation.error?.response?.data?.error?.message

  return (
    <Screen>
      <div className='space-y-6'>
        <div className='text-center'>
          <h1 className='text-2xl font-black text-white mb-1'>¿Cómo fue tu experiencia?</h1>
          <p className='text-sm' style={{ color: '#555' }}>en <span className='text-white font-semibold'>{booking.tenant_name}</span></p>
        </div>

        {/* Detalles */}
        <div className='rounded-2xl p-4 space-y-1' style={{ backgroundColor: '#111', border: '1px solid #1E1E1E' }}>
          <p className='text-sm font-bold text-white'>{booking.service_name}</p>
          <p className='text-xs capitalize' style={{ color: '#666' }}>{booking.date} · {booking.start_time?.slice(0,5)}</p>
        </div>

        {/* Estrellas */}
        <div className='text-center'>
          <p className='text-sm font-semibold text-white mb-3'>Puntúa del 1 al 5</p>
          <div className='flex justify-center gap-3'>
            {[1,2,3,4,5].map(n => (
              <button key={n}
                onClick={() => setScore(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className='transition-all'
              >
                <Star
                  className='w-10 h-10 transition-all'
                  style={{
                    color: n <= (hover || score) ? '#f59e0b' : '#2C2C2C',
                    fill:  n <= (hover || score) ? '#f59e0b' : 'transparent',
                    transform: n <= (hover || score) ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              </button>
            ))}
          </div>
          {score > 0 && (
            <p className='text-sm mt-2 font-semibold' style={{ color: '#f59e0b' }}>
              {['', '😞 Muy malo', '😕 Malo', '😐 Regular', '😊 Bueno', '🤩 Excelente'][score]}
            </p>
          )}
        </div>

        {/* Comentario */}
        <div>
          <label className='text-sm font-semibold text-white block mb-2'>Comentario <span className='font-normal' style={{ color: '#555' }}>(opcional)</span></label>
          <textarea
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder='¿Qué te pareció? ¿Algo que mejorar?'
            className='w-full px-4 py-3 rounded-xl text-sm text-white resize-none focus:outline-none focus:ring-2 transition-all placeholder-gray-600'
            style={{ backgroundColor: '#1A1A1A', border: '1px solid #2C2C2C' }}
          />
        </div>

        {errMsg && (
          <div className='rounded-xl px-4 py-3 text-sm' style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
            {errMsg}
          </div>
        )}

        <button
          onClick={() => mutation.mutate()}
          disabled={!score || mutation.isPending}
          className='w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-40'
          style={{ backgroundColor: '#C0392B' }}>
          {mutation.isPending ? 'Enviando...' : 'Enviar valoración'}
        </button>
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
