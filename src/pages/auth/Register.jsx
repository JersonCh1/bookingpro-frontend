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
  { value: 'spa',         label: 'Spa / Centro de estética' },
  { value: 'consultorio', label: 'Consultorio Médico' },
  { value: 'estudio',     label: 'Estudio (fotos/arte)' },
  { value: 'gym',         label: 'Gimnasio / Fitness' },
  { value: 'otro',        label: 'Otro tipo de negocio' },
]

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id:       i,
  left:     `${(i * 5.3 + 7) % 94}%`,
  top:      `${(i * 6.7 + 11) % 83}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 3 : 4,
  duration: `${4.5 + (i % 5) * 1.3}s`,
  delay:    `${(i * 0.55) % 4.2}s`,
}))

const BENEFITS = [
  'Reservas online 24/7 sin llamadas',
  'Configura servicios y horarios en minutos',
  'Notificaciones automáticas por WhatsApp',
  'Panel completo para gestionar todo',
]

const INDUSTRIES = [
  { icon: '✂', label: 'Barberías' },
  { icon: '💅', label: 'Salones' },
  { icon: '🏥', label: 'Consultorios' },
  { icon: '🐾', label: 'Veterinarias' },
]

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
        const tick = (now) => {
          const p = Math.min((now - t0) / 1600, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.floor(eased * target) + suffix
          if (p < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => { observer.disconnect(); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Arequipa' },
  })
  const { mutate, isPending, error } = useRegister()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ════════════════════════════════════
          PANEL IZQUIERDO — 45%
      ════════════════════════════════════ */}
      <div className='hidden lg:flex lg:w-[45%] flex-col justify-between p-14 relative overflow-hidden'>

        {/* Grid */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `
            linear-gradient(rgba(192,57,43,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,57,43,0.07) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Blob */}
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 25% 55%, rgba(192,57,43,0.09) 0%, transparent 65%)',
        }} />

        {/* Partículas */}
        {PARTICLES.map(p => (
          <span key={p.id} className='particle' style={{
            width: p.size, height: p.size,
            left: p.left, top: p.top,
            animationDuration: p.duration, animationDelay: p.delay,
          }} />
        ))}

        {/* Logo — cápsula blanca visible sobre negro */}
        <div className='relative z-10'>
          <LogoFull height={44} dark />
        </div>

        {/* Copy */}
        <div className='relative z-10'>
          <div className='grow-line h-0.5 mb-8' style={{ backgroundColor: '#C0392B' }} />

          <h1 className='text-4xl font-black text-white leading-[1.05] mb-4 tracking-tight'>
            Únete a los mejores<br />negocios del Perú.
          </h1>

          <div className='overflow-hidden mb-10'>
            <p className='typing-text text-sm font-semibold' style={{ color: '#C0392B' }}>
              2 minutos y listo. Gratis.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-8 mb-10'>
            {[
              { label: 'negocios activos', el: <CountUp target={500} suffix='+' /> },
              { label: 'para configurar',  el: <CountUp target={2} suffix=' min' /> },
              { label: 'reservas online',  el: <span>24/7</span> },
            ].map(({ label, el }) => (
              <div key={label}>
                <p className='text-3xl font-black' style={{ color: '#C0392B' }}>{el}</p>
                <p className='text-xs text-gray-500 mt-1 font-medium'>{label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <ul className='space-y-3 mb-10'>
            {BENEFITS.map(b => (
              <li key={b} className='flex items-start gap-3'>
                <CheckCircle className='w-4 h-4 flex-shrink-0 mt-0.5' style={{ color: '#C0392B' }} />
                <span className='text-sm text-gray-400 leading-snug'>{b}</span>
              </li>
            ))}
          </ul>

          {/* Chips */}
          <div className='flex flex-wrap gap-2'>
            {INDUSTRIES.map(({ icon, label }) => (
              <span
                key={label}
                className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-default'
                style={{ backgroundColor: '#141414', color: '#6b7280', border: '1px solid #222' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#E74C3C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#6b7280' }}
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>

        {/* Precio + footer */}
        <div className='relative z-10 space-y-4'>
          <div className='p-4 rounded-2xl' style={{ backgroundColor: '#111', border: '1px solid #1A1A1A' }}>
            <p className='text-[10px] font-bold uppercase tracking-widest mb-1' style={{ color: '#4A4A4A' }}>
              Precio único
            </p>
            <div className='flex items-baseline gap-1.5'>
              <span className='text-2xl font-black text-white'>S/. 80</span>
              <span className='text-sm text-gray-600'>/ mes</span>
            </div>
            <p className='text-xs mt-1' style={{ color: '#4A4A4A' }}>Sin contrato · Cancela cuando quieras</p>
          </div>
          <blockquote className='pl-4 text-xs text-gray-600 italic leading-relaxed'
            style={{ borderLeft: '2px solid #C0392B' }}>
            "Pasé de perder clientes a tener el calendario lleno automáticamente."
          </blockquote>
          <p className='text-xs' style={{ color: '#2C2C2C' }}>© {new Date().getFullYear()} AgendaYa · Hecho en Perú</p>
        </div>
      </div>

      {/* ════════════════════════════════════
          PANEL DERECHO — 55%
      ════════════════════════════════════ */}
      <div
        className='w-full lg:w-[55%] flex flex-col overflow-y-auto relative'
        style={{ backgroundColor: '#F5F0EB' }}
      >
        {/* Decoración esquina */}
        <div className='absolute top-0 right-0 w-56 h-56 pointer-events-none' style={{
          background: 'radial-gradient(circle at top right, rgba(192,57,43,0.08), transparent 70%)',
        }} />

        {/* ── TOP BAR: logo móvil + UN SOLO link de login ── */}
        <div
          className='sticky top-0 z-20 flex items-center justify-between px-8 py-3.5'
          style={{
            backgroundColor: 'rgba(245,240,235,0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <div className='lg:hidden'>
            <LogoFull height={32} />
          </div>
          <div className='hidden lg:block' />

          {/* ÚNICO link de inicio de sesión — siempre visible */}
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-400 hidden sm:block'>¿Ya tienes cuenta?</span>
            <Link
              to='/login'
              className='inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all'
              style={{ backgroundColor: '#0D0D0D', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0D0D0D' }}
            >
              Iniciar sesión <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>
        </div>

        {/* ── Formulario ── */}
        <div className='flex-1 flex items-start justify-center px-8 py-8'>
          <div className='w-full max-w-lg relative z-10'>

            {/* Header */}
            <div className='mb-6'>
              <span
                className='inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3'
                style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: '#C0392B' }}
              >
                ● Registro gratuito
              </span>
              <h2 className='text-2xl font-black text-gray-900 tracking-tight leading-tight'>
                Crea tu cuenta en<br />menos de 2 minutos
              </h2>
              <p className='text-sm text-gray-400 mt-1.5'>
                Sin tarjeta de crédito · Sin compromisos
              </p>
            </div>

            {errorMessage && (
              <div className='mb-5 p-3.5 rounded-xl flex items-start gap-3 bg-red-50 border border-red-100'>
                <span className='text-red-400 mt-0.5 text-sm'>⚠</span>
                <p className='text-sm text-red-700 font-medium'>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(d => mutate(d))} className='space-y-4'>

              {/* Sección 1 */}
              <div className='rounded-2xl p-5 space-y-4'
                style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>1</div>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Tu negocio</p>
                </div>

                <Input label='Nombre del negocio' placeholder='Ej: Barbería El Corte Fino'
                  error={errors.name?.message} {...register('name')} />

                <div className='grid grid-cols-2 gap-3'>
                  <Select label='Tipo de negocio' error={errors.business_type?.message} {...register('business_type')}>
                    <option value=''>Seleccionar...</option>
                    {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                  <Input label='Ciudad' placeholder='Arequipa' {...register('city')} />
                </div>

                <Input label='Teléfono / WhatsApp' placeholder='+51 987 654 321'
                  type='tel' error={errors.phone?.message} {...register('phone')} />
              </div>

              {/* Sección 2 */}
              <div className='rounded-2xl p-5 space-y-4'
                style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>2</div>
                  <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Tu acceso</p>
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

              <button
                type='submit'
                disabled={isPending}
                className='shimmer-btn w-full py-4 rounded-xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2'
                style={{ backgroundColor: '#C0392B' }}
                onMouseEnter={e => !isPending && (e.currentTarget.style.backgroundColor = '#A93226')}
                onMouseLeave={e => !isPending && (e.currentTarget.style.backgroundColor = '#C0392B')}
              >
                {isPending
                  ? <><Loader2 className='w-4 h-4 animate-spin' />Creando tu cuenta...</>
                  : <>Crear cuenta gratis <ArrowRight className='w-4 h-4' /></>
                }
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
