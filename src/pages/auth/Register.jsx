import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { LogoFull } from '../../components/ui/Logo'

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
  { value: 'spa',         label: 'Spa' },
  { value: 'consultorio', label: 'Consultorio Médico' },
  { value: 'estudio',     label: 'Estudio (fotos/arte)' },
  { value: 'gym',         label: 'Gimnasio / Fitness' },
  { value: 'otro',        label: 'Otro' },
]

const BENEFITS = [
  { text: 'Configura tu perfil en menos de 2 minutos' },
  { text: 'Tus clientes reservan solos, sin llamadas' },
  { text: 'Notificaciones automáticas por WhatsApp' },
  { text: 'Sin contratos · Cancela cuando quieras' },
]

const STEPS = [
  { n: 1, label: 'Crea tu negocio' },
  { n: 2, label: 'Agrega servicios' },
  { n: 3, label: 'Comparte tu link' },
]

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Arequipa' },
  })
  const { mutate, isPending, error } = useRegister()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ══════════════════════════════════════
          LEFT PANEL — 42% dark
      ══════════════════════════════════════ */}
      <div className='hidden lg:flex lg:w-[42%] flex-col justify-between p-12 relative overflow-hidden'>

        {/* Grid pattern */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `
            linear-gradient(rgba(192,57,43,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,57,43,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Glow blob */}
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 20% 60%, rgba(192,57,43,0.1) 0%, transparent 60%)',
        }} />

        {/* Logo */}
        <div className='relative z-10'>
          <LogoFull height={38} variant='light' />
        </div>

        {/* Copy */}
        <div className='relative z-10'>
          <div className='grow-line h-0.5 mb-7' style={{ backgroundColor: '#C0392B' }} />

          <h2 className='text-3xl font-black text-white leading-tight mb-3 tracking-tight'>
            Únete a los mejores<br />negocios del Perú
          </h2>
          <p className='text-sm text-gray-500 mb-8 leading-relaxed'>
            Más de 500 negocios ya confían en AgendaYa<br />para gestionar sus reservas.
          </p>

          {/* Benefits */}
          <ul className='space-y-3.5 mb-10'>
            {BENEFITS.map(b => (
              <li key={b.text} className='flex items-start gap-3'>
                <CheckCircle className='w-4 h-4 flex-shrink-0 mt-0.5' style={{ color: '#C0392B' }} />
                <span className='text-sm text-gray-400 leading-snug'>{b.text}</span>
              </li>
            ))}
          </ul>

          {/* 3-step flow */}
          <div className='space-y-3'>
            <p className='text-[10px] font-bold uppercase tracking-widest mb-3' style={{ color: '#4A4A4A' }}>
              Así de fácil
            </p>
            {STEPS.map(s => (
              <div key={s.n} className='flex items-center gap-3'>
                <div
                  className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0'
                  style={{ backgroundColor: '#1A1A1A', color: '#C0392B', border: '1px solid #C0392B' }}
                >
                  {s.n}
                </div>
                <span className='text-sm text-gray-400'>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price card */}
        <div className='relative z-10'>
          <div
            className='p-4 rounded-2xl'
            style={{ backgroundColor: '#0D0D0D', border: '1px solid #1A1A1A' }}
          >
            <p className='text-[10px] font-bold uppercase tracking-widest mb-1' style={{ color: '#4A4A4A' }}>
              Precio único
            </p>
            <div className='flex items-baseline gap-1.5'>
              <span className='text-2xl font-black text-white'>S/. 80</span>
              <span className='text-sm text-gray-500'>/ mes</span>
            </div>
            <p className='text-xs mt-1' style={{ color: '#4A4A4A' }}>
              Sin contrato · Cancela cuando quieras
            </p>
          </div>
          <p className='mt-4 text-xs' style={{ color: '#2C2C2C' }}>
            © {new Date().getFullYear()} AgendaYa · Hecho en Perú
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — 58% cream, form
      ══════════════════════════════════════ */}
      <div
        className='w-full lg:w-[58%] flex items-start justify-center px-8 py-10 overflow-y-auto relative'
        style={{ backgroundColor: '#F5F0EB' }}
      >
        {/* Corner decoration */}
        <div
          className='absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-50'
          style={{
            background: 'radial-gradient(circle at top right, rgba(192,57,43,0.1), transparent 70%)',
          }}
        />

        <div className='w-full max-w-lg relative z-10'>

          {/* Mobile logo */}
          <div className='lg:hidden flex justify-center mb-6'>
            <LogoFull height={34} />
          </div>

          <p className='text-[10px] font-bold uppercase tracking-widest mb-1.5' style={{ color: '#C0392B' }}>
            Crear cuenta gratis
          </p>
          <h2 className='text-2xl font-black text-gray-900 mb-1 tracking-tight'>
            Empieza en 2 minutos
          </h2>
          <p className='text-sm text-gray-400 mb-7'>
            Sin tarjeta de crédito · Sin compromisos
          </p>

          {errorMessage && (
            <div className='mb-5 p-3.5 rounded-xl flex items-start gap-3 bg-red-50 border border-red-100'>
              <span className='text-red-400 mt-0.5'>⚠</span>
              <p className='text-sm text-red-700 font-medium'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>

            {/* Section label */}
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1'>
              Información del negocio
            </p>

            <Input
              label='Nombre del negocio'
              placeholder='Ej: Barbería El Corte'
              error={errors.name?.message}
              {...register('name')}
            />

            <div className='grid grid-cols-2 gap-3'>
              <Select
                label='Tipo de negocio'
                error={errors.business_type?.message}
                {...register('business_type')}
              >
                <option value=''>Seleccionar...</option>
                {BUSINESS_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
              <Input
                label='Ciudad'
                placeholder='Arequipa'
                {...register('city')}
              />
            </div>

            <Input
              label='Teléfono / WhatsApp'
              placeholder='+51 987 654 321'
              type='tel'
              error={errors.phone?.message}
              {...register('phone')}
            />

            {/* Section label */}
            <p className='text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-3'>
              Tu cuenta de acceso
            </p>

            <div className='grid grid-cols-2 gap-3'>
              <Input
                label='Nombre'
                placeholder='Juan'
                error={errors.first_name?.message}
                {...register('first_name')}
              />
              <Input
                label='Apellido'
                placeholder='Pérez'
                error={errors.last_name?.message}
                {...register('last_name')}
              />
            </div>

            <Input
              label='Correo electrónico'
              type='email'
              placeholder='tu@email.com'
              autoComplete='email'
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label='Contraseña'
              type='password'
              placeholder='Mínimo 8 caracteres'
              autoComplete='new-password'
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
                ? <><Loader2 className='w-4 h-4 animate-spin' /> Creando cuenta...</>
                : 'Crear cuenta gratis →'
              }
            </button>

            <p className='text-[11px] text-center text-gray-400 leading-relaxed'>
              Al registrarte aceptas los{' '}
              <span className='underline cursor-pointer' style={{ color: '#C0392B' }}>
                términos de servicio
              </span>{' '}
              y la política de privacidad.
            </p>
          </form>

          <div className='mt-6 pt-5' style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <p className='text-center text-sm text-gray-400'>
              ¿Ya tienes cuenta?{' '}
              <Link
                to='/login'
                className='font-bold transition-colors'
                style={{ color: '#C0392B' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#922B21' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#C0392B' }}
              >
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
