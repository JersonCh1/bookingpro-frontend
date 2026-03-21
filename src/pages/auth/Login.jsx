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

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:     `${(i * 4.7 + 3) % 96}%`,
  top:      `${(i * 7.3 + 5) % 92}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 3.5,
  duration: `${5 + (i % 6) * 1.2}s`,
  delay:    `${(i * 0.55) % 4.5}s`,
}))

const STATS = [
  { suffix: '+', target: 500, label: 'negocios activos' },
  { fixed: '24/7', label: 'disponibilidad' },
  { fixed: '0',   label: 'llamadas perdidas' },
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
      <label className='block text-xs font-semibold text-gray-500 mb-2 tracking-wide'>{label}</label>
      <input
        className={`auth-input w-full px-4 py-3 rounded-xl text-sm text-gray-900 font-medium bg-gray-50 border placeholder:text-gray-300
          ${error ? 'border-red-300' : 'border-gray-200'}`}
        {...props}
      />
      {error && <p className='mt-1.5 text-xs text-red-500 font-medium'>{error}</p>}
    </div>
  )
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const { mutate, isPending, error } = useLogin()
  const msg = error?.response?.data?.error ?? null

  return (
    <div className='flex min-h-screen lg:h-screen' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══════════════════════════════
          PANEL IZQUIERDO — Marketing
      ══════════════════════════════ */}
      <div className='hidden lg:flex lg:w-[52%] flex-col overflow-hidden relative px-14 py-10'>

        {/* Grid animado */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.06) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.06) 1px,transparent 1px)`,
          backgroundSize: '44px 44px',
        }} />

        {/* Glow central animado */}
        <div className='glow-breathe absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(192,57,43,0.15) 0%, transparent 58%)',
        }} />

        {/* Segundo glow esquina */}
        <div className='glow-breathe-slow absolute pointer-events-none' style={{
          top: '60%', right: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(192,57,43,0.07) 0%, transparent 65%)',
        }} />

        {/* Vignette edges */}
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }} />

        {/* Partículas */}
        {PARTICLES.map(p => (
          <span key={p.id} className='particle' style={{
            width: p.size, height: p.size, left: p.left, top: p.top,
            animationDuration: p.duration, animationDelay: p.delay,
          }} />
        ))}

        {/* Contenido */}
        <div className='relative z-10 flex-1 flex flex-col justify-center'>
          <div className='grow-line h-px mb-8' style={{ backgroundColor: '#C0392B' }} />

          <h1 className='text-4xl xl:text-5xl font-black text-white leading-[1.05] mb-4 tracking-tight'>
            Tu negocio<br />nunca duerme.
          </h1>

          <div className='overflow-hidden mb-10'>
            <p className='typing-text text-sm font-semibold' style={{ color: '#C0392B' }}>
              Reservas automáticas 24/7.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-10 mb-8'>
            {STATS.map(s => (
              <div key={s.label}>
                <p className='text-3xl font-black' style={{ color: '#C0392B' }}>
                  {s.target != null ? <CountUp target={s.target} suffix={s.suffix} /> : s.fixed}
                </p>
                <p className='text-xs text-gray-400 mt-1 font-medium'>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Chips */}
          <div className='flex flex-wrap gap-2 mb-8'>
            {CHIPS.map(c => (
              <span key={c}
                className='text-xs font-semibold px-3 py-1.5 rounded-full cursor-default transition-all'
                style={{ backgroundColor: '#111', color: '#888', border: '1px solid #2A2A2A' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#E74C3C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#2A2A2A'; e.currentTarget.style.color = '#888' }}
              >{c}</span>
            ))}
          </div>

          {/* Precio */}
          <div className='rounded-2xl p-5 mb-8' style={{ backgroundColor: '#111', border: '1px solid #C0392B22' }}>
            <p className='text-[10px] font-bold uppercase tracking-widest mb-2' style={{ color: '#C0392B' }}>
              ✦ Precio único en Perú
            </p>
            <div className='flex items-baseline gap-2 mb-1'>
              <span className='text-3xl font-black text-white'>S/. 50</span>
              <span className='text-sm font-medium' style={{ color: '#777' }}>/&nbsp;mes</span>
            </div>
            <p className='text-xs' style={{ color: '#666' }}>Sin contrato · Cancela cuando quieras</p>
          </div>

          {/* Testimonial */}
          <blockquote className='pl-4 text-xs italic leading-relaxed' style={{ color: '#777', borderLeft: '2px solid #3A3A3A' }}>
            "Antes perdíamos citas por no contestar. Ahora todo es automático."
            <span className='block mt-1 not-italic' style={{ color: '#555' }}>— Cliente desde 2024 · Arequipa</span>
          </blockquote>
        </div>

        <p className='relative z-10 text-xs' style={{ color: '#555' }}>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú 🇵🇪
        </p>
      </div>

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
      ══════════════════════════════ */}
      <div className='w-full lg:w-[48%] flex flex-col relative overflow-hidden bg-white'>

        {/* Efectos fondo panel derecho */}
        <div className='absolute top-0 left-0 right-0 h-[2px] pointer-events-none' style={{
          background: 'linear-gradient(90deg, transparent, #C0392B 40%, #E74C3C 60%, transparent)',
        }} />
        <div className='absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full pointer-events-none' style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.06) 0%, transparent 65%)',
        }} />
        <div className='absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none' style={{
          background: 'radial-gradient(circle, rgba(192,57,43,0.04) 0%, transparent 65%)',
        }} />
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: 'radial-gradient(rgba(192,57,43,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          opacity: 0.6,
        }} />

        {/* ── Header: logo izquierda + botón derecha ── */}
        <header className='header-enter relative z-10 flex-shrink-0 flex items-center justify-between px-8 py-4'
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <LogoFull height={58} />
          <Link
            to='/register'
            className='inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all'
            style={{ backgroundColor: '#0D0D0D', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0D0D0D' }}
          >
            Crear cuenta <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </header>

        {/* ── Contenido del formulario ── */}
        <div className='panel-enter relative z-10 flex-1 flex items-center justify-center px-8 py-10'>
          <div className='w-full max-w-sm'>

            {/* Encabezado */}
            <div className='form-item-1 mb-8'>
              <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3'
                style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
                <span className='w-1.5 h-1.5 rounded-full bg-current animate-pulse' />
                Panel de administración
              </span>
              <h2 className='text-xl font-black text-gray-900 tracking-tight leading-tight'>
                Bienvenido de vuelta
              </h2>
              <p className='text-sm text-gray-400 mt-1'>Ingresa tus credenciales para continuar</p>
            </div>

            {msg && (
              <div className='mb-6 p-4 rounded-xl flex gap-3 bg-red-50 border border-red-100'>
                <span className='text-red-400'>⚠</span>
                <p className='text-sm text-red-700 font-medium'>{msg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(d => mutate(d))} className='space-y-5'>
              <div className='form-item-2'>
                <Field label='Correo electrónico' type='email' placeholder='tu@negocio.com'
                  autoComplete='email' error={errors.email?.message} {...register('email')} />
              </div>
              <div className='form-item-3'>
                <Field label='Contraseña' type='password' placeholder='••••••••'
                  autoComplete='current-password' error={errors.password?.message} {...register('password')} />
              </div>

              <div className='form-item-4'>
                <button type='submit' disabled={isPending}
                  className='auth-btn shimmer-btn w-full py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2'
                  style={{ backgroundColor: '#C0392B' }}>
                  {isPending
                    ? <><Loader2 className='w-4 h-4 animate-spin' />Ingresando...</>
                    : <>Iniciar sesión <ArrowRight className='w-4 h-4' /></>}
                </button>
              </div>
            </form>

            <p className='form-item-5 text-center text-sm text-gray-400 mt-8'>
              ¿No tienes cuenta?{' '}
              <Link to='/register' className='font-bold transition-colors' style={{ color: '#C0392B' }}
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
