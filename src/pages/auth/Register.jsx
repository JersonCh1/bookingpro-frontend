import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { LogoFull } from '../../components/ui/Logo'
import { useEffect, useRef } from 'react'

const schema = z.object({
  name:          z.string().min(2, 'Mínimo 2 caracteres'),
  business_type: z.string().min(1, 'Selecciona un tipo'),
  phone:         z.string().min(7, 'Teléfono requerido'),
  city:          z.string().optional(),
  first_name:    z.string().min(1, 'Requerido'),
  last_name:     z.string().min(1, 'Requerido'),
  email:         z.string().email('Email inválido'),
  password:      z.string().min(8, 'Mínimo 8 caracteres'),
})

const BUSINESS_TYPES = [
  { value: 'salon',       label: 'Salón de Belleza' },
  { value: 'barberia',    label: 'Barbería' },
  { value: 'spa',         label: 'Spa / Estética' },
  { value: 'consultorio', label: 'Consultorio Médico' },
  { value: 'estudio',     label: 'Estudio (fotos/arte)' },
  { value: 'gym',         label: 'Gimnasio / Fitness' },
  { value: 'otro',        label: 'Otro' },
]

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:     `${(i * 5.3 + 7) % 94}%`,
  top:      `${(i * 6.7 + 11) % 92}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 2 : 3.5,
  duration: `${5 + (i % 6) * 1.2}s`,
  delay:    `${(i * 0.55) % 4.5}s`,
}))

const BENEFITS = [
  'Reservas online 24/7, sin llamadas',
  'Configura servicios y horarios en minutos',
  'Notificaciones automáticas por WhatsApp',
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

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Arequipa' },
  })
  const { mutate, isPending, error } = useRegister()
  const msg = error?.response?.data?.error ?? null

  return (
    <div className='flex min-h-screen lg:h-screen' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══════════════════════════════
          PANEL IZQUIERDO — Marketing
      ══════════════════════════════ */}
      <div className='hidden lg:flex lg:w-[44%] flex-col overflow-hidden relative px-14 py-10'>

        {/* Grid animado */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.06) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.06) 1px,transparent 1px)`,
          backgroundSize: '44px 44px',
        }} />

        {/* Glow central animado */}
        <div className='glow-breathe absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 25% 50%, rgba(192,57,43,0.15) 0%, transparent 58%)',
        }} />
        <div className='glow-breathe-slow absolute pointer-events-none' style={{
          top: '60%', right: '-10%', width: '50%', height: '50%',
          background: 'radial-gradient(circle, rgba(192,57,43,0.07) 0%, transparent 65%)',
        }} />

        {/* Vignette */}
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

          <h1 className='text-2xl xl:text-3xl font-black text-white leading-[1.1] mb-4 tracking-tight'>
            Únete a los mejores<br />negocios del Perú.
          </h1>

          <div className='overflow-hidden mb-8'>
            <p className='typing-text text-sm font-semibold' style={{ color: '#C0392B' }}>
              2 minutos y listo. Gratis.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-8 mb-7'>
            {[
              { el: <CountUp target={500} suffix='+' />, label: 'negocios' },
              { el: <CountUp target={2} suffix=' min' />, label: 'para configurar' },
              { el: <span>24/7</span>, label: 'online' },
            ].map(({ el, label }) => (
              <div key={label}>
                <p className='text-2xl font-black' style={{ color: '#C0392B' }}>{el}</p>
                <p className='text-xs text-gray-400 mt-1 font-medium'>{label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <ul className='space-y-3 mb-7'>
            {BENEFITS.map(b => (
              <li key={b} className='flex items-center gap-3'>
                <CheckCircle className='w-4 h-4 flex-shrink-0' style={{ color: '#C0392B' }} />
                <span className='text-sm text-gray-400'>{b}</span>
              </li>
            ))}
          </ul>

          {/* Chips */}
          <div className='flex flex-wrap gap-2 mb-7'>
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
          <div className='rounded-2xl p-5' style={{ backgroundColor: '#111', border: '1px solid #C0392B55', boxShadow: '0 0 20px rgba(192,57,43,0.12)' }}>
            <div className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full mb-2'
              style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.4)' }}>
              <span className='w-1 h-1 rounded-full animate-pulse' style={{ backgroundColor: '#E74C3C' }} />
              <span className='text-[9px] font-black uppercase tracking-widest' style={{ color: '#E74C3C' }}>Lanzamiento</span>
            </div>
            <div className='flex items-baseline gap-2 mb-1'>
              <span className='text-3xl font-black text-white'>S/. 69</span>
              <span className='text-sm font-medium line-through' style={{ color: '#555' }}>S/. 120</span>
              <span className='text-sm font-medium' style={{ color: '#777' }}>/&nbsp;mes</span>
            </div>
            <p className='text-xs' style={{ color: '#666' }}>Sin contrato · Cancela cuando quieras</p>
          </div>
        </div>

        <p className='relative z-10 text-xs' style={{ color: '#555' }}>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú 🇵🇪
        </p>
      </div>

      {/* ══════════════════════════════
          PANEL DERECHO — Formulario
      ══════════════════════════════ */}
      <div className='w-full lg:w-[56%] flex flex-col relative overflow-hidden bg-[#0D0D0D] lg:bg-white'>

        {/* Efectos fondo */}
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

        {/* ── Header: sticky, fondo sólido, z-20 ── */}
        <header className='header-enter sticky top-0 z-20 flex-shrink-0 flex items-center justify-between px-8 py-3'
          style={{
            backgroundColor: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 1px 12px rgba(0,0,0,0.06)',
          }}>
          {/* Línea roja decorativa bajo el header */}
          <div className='absolute bottom-0 left-0 right-0 h-[1.5px]' style={{
            background: 'linear-gradient(90deg, transparent, rgba(192,57,43,0.4) 40%, rgba(231,76,60,0.4) 60%, transparent)',
          }} />
          <LogoFull height={52} />
          <Link
            to='/login'
            className='inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all'
            style={{ backgroundColor: '#0D0D0D', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0D0D0D' }}
          >
            Iniciar sesión <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </header>

        {/* ── Formulario ── */}
        <div className='panel-enter relative z-10 flex-1 overflow-y-auto flex justify-center px-4 sm:px-8 pt-6 pb-6'>
          {/* Card blanca en móvil (sobre fondo negro), transparente en desktop */}
          <div className='w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl my-4 lg:bg-transparent lg:shadow-none lg:rounded-none lg:p-0 lg:my-0'>

            <div className='mb-5'>
              <span className='inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3'
                style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
                <span className='w-1.5 h-1.5 rounded-full bg-current animate-pulse' />
                Registro gratuito
              </span>
              <h2 className='text-lg font-black text-gray-900 tracking-tight'>
                Crea tu cuenta en 2 minutos
              </h2>
              <p className='text-xs text-gray-400 mt-1'>Sin tarjeta de crédito · Sin compromisos</p>
            </div>

            {msg && (
              <div className='mb-4 p-4 rounded-xl flex gap-3 bg-red-50 border border-red-100'>
                <span className='text-red-400'>⚠</span>
                <p className='text-sm text-red-700 font-medium'>{msg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(d => mutate(d))} className='space-y-3'>

              {/* Sección 1 */}
              <div className='rounded-2xl p-4 space-y-3'
                style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>1</div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Tu negocio</p>
                </div>

                <Input label='Nombre del negocio' placeholder='Ej: Barbería El Corte Fino'
                  error={errors.name?.message} {...register('name')} />

                <div className='grid grid-cols-2 gap-3'>
                  <Select label='Tipo' error={errors.business_type?.message} {...register('business_type')}>
                    <option value=''>Seleccionar...</option>
                    {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                  <Input label='Ciudad' placeholder='Arequipa' {...register('city')} />
                </div>

                <Input label='Teléfono / WhatsApp' placeholder='+51 987 654 321'
                  type='tel' error={errors.phone?.message} {...register('phone')} />
              </div>

              {/* Sección 2 */}
              <div className='rounded-2xl p-4 space-y-3'
                style={{ backgroundColor: '#FAFAFA', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>2</div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Tu acceso</p>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  <Input label='Nombre' placeholder='Juan'
                    error={errors.first_name?.message} {...register('first_name')} />
                  <Input label='Apellido' placeholder='Pérez'
                    error={errors.last_name?.message} {...register('last_name')} />
                </div>

                <Input label='Correo electrónico' type='email' placeholder='tu@negocio.com'
                  autoComplete='email' error={errors.email?.message} {...register('email')} />

                <Input label='Contraseña' type='password' placeholder='Mínimo 8 caracteres'
                  autoComplete='new-password' error={errors.password?.message} {...register('password')} />
              </div>

              <button type='submit' disabled={isPending}
                className='auth-btn shimmer-btn w-full py-3.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 flex items-center justify-center gap-2'
                style={{ backgroundColor: '#C0392B' }}>
                {isPending
                  ? <><Loader2 className='w-4 h-4 animate-spin' />Creando cuenta...</>
                  : <>Crear cuenta gratis <ArrowRight className='w-4 h-4' /></>}
              </button>

              <p className='text-[11px] text-center text-gray-400'>
                Al registrarte aceptas los{' '}
                <span className='underline cursor-pointer' style={{ color: '#C0392B' }}>términos de servicio</span>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
