import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'
import { useEffect, useRef } from 'react'
import { LogoFull } from '../../components/ui/Logo'

const schema = z.object({
  email:    z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

/* 20 floating particles — deterministic positions for SSR safety */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  left:     `${(i * 4.7 + 3) % 96}%`,
  top:      `${(i * 7.3 + 5) % 85}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 3 : 4,
  duration: `${4 + (i % 5) * 1.4}s`,
  delay:    `${(i * 0.65) % 4}s`,
}))

const INDUSTRIES = [
  { icon: '✂', label: 'Barberías' },
  { icon: '💅', label: 'Salones' },
  { icon: '🏥', label: 'Consultorios' },
  { icon: '🐾', label: 'Veterinarias' },
]

/* Counter-up with IntersectionObserver + cubic ease-out */
function CountUp({ target, suffix = '' }) {
  const ref  = useRef(null)
  const raf  = useRef(null)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const DURATION = 1600
        const tick = (now) => {
          const p = Math.min((now - t0) / DURATION, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.floor(eased * target) + suffix
          if (p < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* Underline-only input with red glow on focus */
function AuthInput({ label, error, ...props }) {
  return (
    <div>
      <label className='block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2'>
        {label}
      </label>
      <input
        className={`
          glow-input w-full bg-transparent px-0 pb-2.5 pt-0 text-sm text-gray-900 font-medium
          border-0 border-b-2 outline-none transition-all placeholder:text-gray-300
          ${error ? 'border-red-400' : 'border-gray-200 focus:border-primary-600'}
        `}
        {...props}
      />
      {error && (
        <p className='mt-1.5 text-xs text-red-500 flex items-center gap-1'>
          <span className='text-red-400'>▲</span> {error}
        </p>
      )}
    </div>
  )
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  const { mutate, isPending, error } = useLogin()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══════════════════════════════════════
          LEFT PANEL — 55% dark, hero content
      ══════════════════════════════════════ */}
      <div className='hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative overflow-hidden'>

        {/* Grid pattern */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `
            linear-gradient(rgba(192,57,43,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,57,43,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Radial vignette */}
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 30% 40%, rgba(192,57,43,0.08) 0%, transparent 65%)',
        }} />

        {/* Floating particles */}
        {PARTICLES.map(p => (
          <span
            key={p.id}
            className='particle'
            style={{
              width:             p.size,
              height:            p.size,
              left:              p.left,
              top:               p.top,
              animationDuration: p.duration,
              animationDelay:    p.delay,
            }}
          />
        ))}

        {/* ── Logo ── */}
        <div className='relative z-10'>
          <LogoFull height={40} variant='light' />
        </div>

        {/* ── Hero copy ── */}
        <div className='relative z-10'>
          {/* Animated red separator */}
          <div className='grow-line h-0.5 mb-8' style={{ backgroundColor: '#C0392B' }} />

          <h1 className='text-5xl font-black text-white leading-[1.05] mb-4 tracking-tight'>
            Tu negocio<br />nunca duerme.
          </h1>

          {/* Typing subtitle — exactly 26 chars */}
          <div className='overflow-hidden mb-10'>
            <p
              className='typing-text text-sm font-semibold'
              style={{ color: '#C0392B' }}
            >
              Reservas automáticas 24/7.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-10 mb-10'>
            <div>
              <p className='text-3xl font-black' style={{ color: '#C0392B' }}>
                <CountUp target={500} suffix='+' />
              </p>
              <p className='text-xs text-gray-500 mt-1 font-medium'>negocios activos</p>
            </div>
            <div>
              <p className='text-3xl font-black' style={{ color: '#C0392B' }}>24/7</p>
              <p className='text-xs text-gray-500 mt-1 font-medium'>disponibilidad</p>
            </div>
            <div>
              <p className='text-3xl font-black' style={{ color: '#C0392B' }}>0</p>
              <p className='text-xs text-gray-500 mt-1 font-medium'>llamadas para coordinar</p>
            </div>
          </div>

          {/* Industry chips */}
          <div className='flex flex-wrap gap-2'>
            {INDUSTRIES.map(({ icon, label }) => (
              <span
                key={label}
                className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-default'
                style={{
                  backgroundColor: '#141414',
                  color: '#6b7280',
                  border: '1px solid #1f1f1f',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C0392B'
                  e.currentTarget.style.color = '#E74C3C'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1f1f1f'
                  e.currentTarget.style.color = '#6b7280'
                }}
              >
                <span>{icon}</span> {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Testimonial ── */}
        <div className='relative z-10'>
          <blockquote
            className='pl-4 text-sm text-gray-500 italic leading-relaxed'
            style={{ borderLeft: '2px solid #C0392B' }}
          >
            "Antes perdíamos citas por no contestar el teléfono.<br />Ahora todo es automático."
          </blockquote>
          <p className='mt-2 text-xs font-semibold' style={{ color: '#4A4A4A' }}>
            — Cliente desde 2024 · Arequipa, Perú
          </p>
        </div>

        {/* Footer */}
        <p className='relative z-10 text-xs' style={{ color: '#2C2C2C' }}>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú
        </p>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — 45% cream, login form
      ══════════════════════════════════════ */}
      <div
        className='w-full lg:w-[45%] flex items-center justify-center px-8 py-12 relative'
        style={{ backgroundColor: '#F5F0EB' }}
      >
        {/* Subtle corner decoration */}
        <div
          className='absolute top-0 right-0 w-32 h-32 pointer-events-none opacity-40'
          style={{
            background: 'radial-gradient(circle at top right, rgba(192,57,43,0.12), transparent 70%)',
          }}
        />

        <div className='w-full max-w-sm relative z-10'>

          {/* Mobile logo */}
          <div className='lg:hidden mb-8 flex justify-center'>
            <LogoFull height={36} />
          </div>

          <p className='text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: '#C0392B' }}>
            Panel de administración
          </p>
          <h2 className='text-2xl font-black text-gray-900 mb-1 tracking-tight'>
            Bienvenido de vuelta
          </h2>
          <p className='text-sm text-gray-400 mb-8'>
            Ingresa tus credenciales para continuar
          </p>

          {errorMessage && (
            <div className='mb-6 p-3.5 rounded-xl flex items-start gap-3 bg-red-50 border border-red-100'>
              <span className='text-red-500 text-sm mt-0.5'>⚠</span>
              <p className='text-sm text-red-700 font-medium'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-6'>
            <AuthInput
              label='Correo electrónico'
              type='email'
              placeholder='tu@negocio.com'
              autoComplete='email'
              error={errors.email?.message}
              {...register('email')}
            />
            <AuthInput
              label='Contraseña'
              type='password'
              placeholder='••••••••'
              autoComplete='current-password'
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type='submit'
              disabled={isPending}
              className='shimmer-btn w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2'
              style={{ backgroundColor: '#C0392B' }}
              onMouseEnter={e => !isPending && (e.currentTarget.style.backgroundColor = '#A93226')}
              onMouseLeave={e => !isPending && (e.currentTarget.style.backgroundColor = '#C0392B')}
            >
              {isPending
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Ingresando...</>
                : 'Iniciar sesión →'
              }
            </button>
          </form>

          <div className='mt-8 pt-6' style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className='text-center text-sm text-gray-400'>
              ¿No tienes una cuenta?{' '}
              <Link
                to='/register'
                className='font-bold transition-colors'
                style={{ color: '#C0392B' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#922B21' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#C0392B' }}
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
