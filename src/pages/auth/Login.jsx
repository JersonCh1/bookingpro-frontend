import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Loader2, ArrowRight } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'
import { useEffect, useRef } from 'react'
import { LogoFull } from '../../components/ui/Logo'

const schema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id:       i,
  left:     `${(i * 4.7 + 3) % 96}%`,
  top:      `${(i * 7.3 + 5) % 85}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 3 : 4,
  duration: `${4 + (i % 5) * 1.4}s`,
  delay:    `${(i * 0.65) % 4}s`,
}))

const STATS = [
  { suffix: '+', target: 500, label: 'negocios activos' },
  { fixed: '24/7',           label: 'disponibilidad'   },
  { fixed: '0',              label: 'llamadas perdidas' },
]

const CHIPS = ['✂ Barberías', '💅 Salones', '🏥 Consultorios', '🐾 Veterinarias']

function CountUp({ target, suffix = '' }) {
  const ref = useRef(null); const raf = useRef(null); const done = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / 1500, 1)
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix
          if (p < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick); obs.disconnect()
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => { obs.disconnect(); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, suffix])
  return <span ref={ref}>0{suffix}</span>
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className='block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2'>{label}</label>
      <input
        className={`glow-input w-full bg-transparent pb-2.5 text-sm text-gray-900 font-medium
          border-0 border-b-2 outline-none transition-all placeholder:text-gray-300
          ${error ? 'border-red-400' : 'border-gray-200 focus:border-primary-600'}`}
        {...props}
      />
      {error && <p className='mt-1 text-xs text-red-500'>{error}</p>}
    </div>
  )
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const { mutate, isPending, error } = useLogin()
  const msg = error?.response?.data?.error ?? null

  return (
    /* h-screen en desktop — todo en una sola ventana, sin scroll de página */
    <div className='flex min-h-screen lg:h-screen' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══ PANEL IZQUIERDO 52% ══ */}
      <div className='hidden lg:flex lg:w-[52%] flex-col overflow-hidden relative px-12 py-10'>

        {/* Fondo grid */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.07) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.07) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 30% 45%, rgba(192,57,43,0.1) 0%, transparent 60%)',
        }} />

        {/* Partículas */}
        {PARTICLES.map(p => (
          <span key={p.id} className='particle' style={{
            width: p.size, height: p.size, left: p.left, top: p.top,
            animationDuration: p.duration, animationDelay: p.delay,
          }} />
        ))}

        {/* ── Logo ── */}
        <div className='relative z-10 mb-8'>
          <LogoFull height={64} dark />
        </div>

        {/* ── Copy central — fluye naturalmente sin justify-between ── */}
        <div className='relative z-10 flex-1 flex flex-col justify-center'>
          <div className='grow-line h-0.5 mb-6' style={{ backgroundColor: '#C0392B' }} />

          <h1 className='text-4xl xl:text-5xl font-black text-white leading-[1.05] mb-3 tracking-tight'>
            Tu negocio<br />nunca duerme.
          </h1>

          <div className='overflow-hidden mb-8'>
            <p className='typing-text text-sm font-semibold' style={{ color: '#C0392B' }}>
              Reservas automáticas 24/7.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-8 mb-7'>
            {STATS.map(s => (
              <div key={s.label}>
                <p className='text-2xl font-black' style={{ color: '#C0392B' }}>
                  {s.target != null ? <CountUp target={s.target} suffix={s.suffix} /> : s.fixed}
                </p>
                <p className='text-xs text-gray-500 mt-0.5 font-medium'>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chips */}
          <div className='flex flex-wrap gap-2 mb-7'>
            {CHIPS.map(c => (
              <span key={c}
                className='text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-default'
                style={{ backgroundColor: '#141414', color: '#6b7280', border: '1px solid #222' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#E74C3C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#6b7280' }}
              >{c}</span>
            ))}
          </div>

          {/* Precio — pegado al contenido, sin gap enorme */}
          <div className='rounded-xl p-4 mb-6'
            style={{ backgroundColor: '#111', border: '1px solid #1A1A1A' }}>
            <p className='text-[10px] font-bold uppercase tracking-widest mb-1' style={{ color: '#4A4A4A' }}>
              Precio único en Perú
            </p>
            <div className='flex items-baseline gap-1.5'>
              <span className='text-xl font-black text-white'>S/. 80</span>
              <span className='text-sm text-gray-600'>/ mes</span>
            </div>
            <p className='text-xs mt-0.5' style={{ color: '#4A4A4A' }}>Sin contrato · Cancela cuando quieras</p>
          </div>

          {/* Testimonial */}
          <blockquote className='pl-4 text-xs text-gray-500 italic leading-relaxed'
            style={{ borderLeft: '2px solid #C0392B' }}>
            "Antes perdíamos citas por no contestar. Ahora todo es automático."
            <span className='block mt-1 not-italic' style={{ color: '#4A4A4A' }}>— Cliente desde 2024 · Arequipa</span>
          </blockquote>
        </div>

        {/* Footer */}
        <p className='relative z-10 text-xs mt-6' style={{ color: '#2C2C2C' }}>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú
        </p>
      </div>

      {/* ══ PANEL DERECHO 48% ══ */}
      <div className='w-full lg:w-[48%] flex items-center justify-center px-8 py-10 relative overflow-hidden'
        style={{ backgroundColor: '#F5F0EB' }}>

        {/* ── Efectos panel derecho ── */}
        {/* Línea roja top */}
        <div className='absolute top-0 left-0 right-0 h-[2px] pointer-events-none' style={{
          background: 'linear-gradient(90deg, transparent, #C0392B 35%, #E74C3C 65%, transparent)',
        }} />
        {/* Orb top-right */}
        <div className='absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none' style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.09) 0%, transparent 65%)',
        }} />
        {/* Orb bottom-left */}
        <div className='absolute -bottom-24 -left-24 w-72 h-72 rounded-full pointer-events-none' style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 65%)',
        }} />
        {/* Dot grid sutil */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: 'radial-gradient(rgba(192,57,43,0.13) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          opacity: 0.55,
        }} />

        <div className='w-full max-w-sm relative z-10'>

          {/* Logo móvil */}
          <div className='lg:hidden mb-8 flex justify-center'>
            <LogoFull height={44} />
          </div>

          <p className='text-[10px] font-bold uppercase tracking-widest mb-1.5' style={{ color: '#C0392B' }}>
            Panel de administración
          </p>
          <h2 className='text-2xl font-black text-gray-900 mb-1 tracking-tight'>Bienvenido de vuelta</h2>
          <p className='text-sm text-gray-400 mb-8'>Ingresa tus credenciales para continuar</p>

          {msg && (
            <div className='mb-5 p-3.5 rounded-xl flex gap-3 bg-red-50 border border-red-100'>
              <span className='text-red-400 text-sm'>⚠</span>
              <p className='text-sm text-red-700 font-medium'>{msg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(d => mutate(d))} className='space-y-7'>
            <Field label='Correo electrónico' type='email' placeholder='tu@negocio.com'
              autoComplete='email' error={errors.email?.message} {...register('email')} />
            <Field label='Contraseña' type='password' placeholder='••••••••'
              autoComplete='current-password' error={errors.password?.message} {...register('password')} />

            <button type='submit' disabled={isPending}
              className='shimmer-btn w-full py-4 rounded-xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2'
              style={{ backgroundColor: '#C0392B' }}
              onMouseEnter={e => !isPending && (e.currentTarget.style.backgroundColor = '#A93226')}
              onMouseLeave={e => !isPending && (e.currentTarget.style.backgroundColor = '#C0392B')}>
              {isPending ? <><Loader2 className='w-4 h-4 animate-spin' />Ingresando...</> : <>Iniciar sesión <ArrowRight className='w-4 h-4' /></>}
            </button>
          </form>

          <div className='mt-8 pt-6' style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className='text-center text-sm text-gray-400'>
              ¿No tienes cuenta?{' '}
              <Link to='/register' className='font-bold' style={{ color: '#C0392B' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#922B21' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#C0392B' }}>
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
