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

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left:     `${(i * 5.3 + 7) % 94}%`,
  top:      `${(i * 6.7 + 11) % 83}%`,
  size:     i % 3 === 0 ? 5 : i % 3 === 1 ? 3 : 4,
  duration: `${4.5 + (i % 5) * 1.3}s`,
  delay:    `${(i * 0.55) % 4.2}s`,
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
    /* h-screen desktop: todo cabe en pantalla. min-h-screen móvil: scroll permitido */
    <div className='flex min-h-screen lg:h-screen' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══ PANEL IZQUIERDO 44% ══ */}
      <div className='hidden lg:flex lg:w-[44%] flex-col overflow-hidden relative px-12 py-10'>

        {/* Fondo */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.07) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.07) 1px,transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 25% 50%, rgba(192,57,43,0.1) 0%, transparent 60%)',
        }} />

        {/* Partículas */}
        {PARTICLES.map(p => (
          <span key={p.id} className='particle' style={{
            width: p.size, height: p.size, left: p.left, top: p.top,
            animationDuration: p.duration, animationDelay: p.delay,
          }} />
        ))}

        {/* Logo */}
        <div className='relative z-10 mb-8'>
          <LogoFull height={180} dark />
        </div>

        {/* Copy — fluye naturalmente */}
        <div className='relative z-10 flex-1 flex flex-col justify-center'>
          <div className='grow-line h-0.5 mb-5' style={{ backgroundColor: '#C0392B' }} />

          <h1 className='text-3xl xl:text-4xl font-black text-white leading-[1.1] mb-3 tracking-tight'>
            Únete a los mejores<br />negocios del Perú.
          </h1>

          <div className='overflow-hidden mb-7'>
            <p className='typing-text text-sm font-semibold' style={{ color: '#C0392B' }}>
              2 minutos y listo. Gratis.
            </p>
          </div>

          {/* Stats */}
          <div className='flex gap-7 mb-6'>
            {[
              { el: <CountUp target={500} suffix='+' />, label: 'negocios' },
              { el: <CountUp target={2}   suffix=' min' />, label: 'para configurar' },
              { el: <span>24/7</span>, label: 'online' },
            ].map(({ el, label }) => (
              <div key={label}>
                <p className='text-2xl font-black' style={{ color: '#C0392B' }}>{el}</p>
                <p className='text-xs text-gray-500 mt-0.5 font-medium'>{label}</p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <ul className='space-y-2.5 mb-6'>
            {BENEFITS.map(b => (
              <li key={b} className='flex items-center gap-2.5'>
                <CheckCircle className='w-3.5 h-3.5 flex-shrink-0' style={{ color: '#C0392B' }} />
                <span className='text-sm text-gray-400'>{b}</span>
              </li>
            ))}
          </ul>

          {/* Chips */}
          <div className='flex flex-wrap gap-1.5 mb-6'>
            {CHIPS.map(c => (
              <span key={c}
                className='text-xs font-semibold px-2.5 py-1 rounded-full transition-colors cursor-default'
                style={{ backgroundColor: '#141414', color: '#6b7280', border: '1px solid #222' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#E74C3C' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#222'; e.currentTarget.style.color = '#6b7280' }}
              >{c}</span>
            ))}
          </div>

          {/* Precio — inmediatamente después del contenido */}
          <div className='rounded-xl p-4'
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
        </div>

        <p className='relative z-10 text-xs mt-6' style={{ color: '#2C2C2C' }}>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú
        </p>
      </div>

      {/* ══ PANEL DERECHO 56% — formulario en una sola pantalla ══ */}
      <div className='w-full lg:w-[56%] flex flex-col' style={{ backgroundColor: '#F5F0EB' }}>

        {/* Decoración */}
        <div className='absolute top-0 right-0 w-56 h-56 pointer-events-none' style={{
          background: 'radial-gradient(circle at top right, rgba(192,57,43,0.07), transparent 70%)',
        }} />

        {/* Top bar — login link único y siempre visible */}
        <div className='flex-shrink-0 flex items-center justify-between px-8 py-3'
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className='lg:hidden'>
            <LogoFull height={80} />
          </div>
          <div className='hidden lg:block' />
          <div className='flex items-center gap-3'>
            <span className='text-sm text-gray-400 hidden sm:block'>¿Ya tienes cuenta?</span>
            <Link to='/login'
              className='inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all'
              style={{ backgroundColor: '#0D0D0D', color: 'white' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0D0D0D' }}>
              Iniciar sesión <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>
        </div>

        {/* Formulario — ocupa el espacio restante, scroll interno en mobile */}
        <div className='flex-1 overflow-y-auto flex items-start lg:items-center justify-center px-8 py-6'>
          <div className='w-full max-w-md relative z-10'>

            {/* Header compacto */}
            <div className='mb-5'>
              <span className='inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2'
                style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: '#C0392B' }}>
                ● Registro gratuito
              </span>
              <h2 className='text-xl font-black text-gray-900 tracking-tight'>
                Crea tu cuenta en 2 minutos
              </h2>
              <p className='text-xs text-gray-400 mt-1'>Sin tarjeta de crédito · Sin compromisos</p>
            </div>

            {msg && (
              <div className='mb-4 p-3 rounded-xl flex gap-2.5 bg-red-50 border border-red-100'>
                <span className='text-red-400 text-sm'>⚠</span>
                <p className='text-sm text-red-700 font-medium'>{msg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(d => mutate(d))} className='space-y-3'>

              {/* ─ Sección 1: Negocio ─ */}
              <div className='rounded-xl p-4 space-y-3'
                style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>1</div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Tu negocio</p>
                </div>

                <Input label='Nombre del negocio' placeholder='Ej: Barbería El Corte Fino'
                  error={errors.name?.message} {...register('name')} />

                <div className='grid grid-cols-2 gap-2.5'>
                  <Select label='Tipo' error={errors.business_type?.message} {...register('business_type')}>
                    <option value=''>Seleccionar...</option>
                    {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                  <Input label='Ciudad' placeholder='Arequipa' {...register('city')} />
                </div>

                <Input label='Teléfono / WhatsApp' placeholder='+51 987 654 321'
                  type='tel' error={errors.phone?.message} {...register('phone')} />
              </div>

              {/* ─ Sección 2: Cuenta ─ */}
              <div className='rounded-xl p-4 space-y-3'
                style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.07)' }}>
                <div className='flex items-center gap-2'>
                  <div className='w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0'
                    style={{ backgroundColor: '#C0392B' }}>2</div>
                  <p className='text-[10px] font-bold text-gray-400 uppercase tracking-wider'>Tu acceso</p>
                </div>

                <div className='grid grid-cols-2 gap-2.5'>
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

              {/* Submit */}
              <button type='submit' disabled={isPending}
                className='shimmer-btn w-full py-3.5 rounded-xl text-sm font-black text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2'
                style={{ backgroundColor: '#C0392B' }}
                onMouseEnter={e => !isPending && (e.currentTarget.style.backgroundColor = '#A93226')}
                onMouseLeave={e => !isPending && (e.currentTarget.style.backgroundColor = '#C0392B')}>
                {isPending
                  ? <><Loader2 className='w-4 h-4 animate-spin' />Creando cuenta...</>
                  : <>Crear cuenta gratis <ArrowRight className='w-4 h-4' /></>}
              </button>

              <p className='text-[10px] text-center text-gray-400'>
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
