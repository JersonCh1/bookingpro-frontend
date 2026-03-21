import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'

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
  'Configura en 2 minutos',
  'Tus clientes reservan solos',
  'Notificaciones por WhatsApp',
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

      {/* ── Lado izquierdo ── */}
      <div className='hidden lg:flex lg:w-5/12 flex-col justify-between p-14 relative overflow-hidden'>

        {/* Patrón geométrico sutil */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `
            linear-gradient(rgba(192,57,43,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,57,43,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Logo */}
        <div className='relative z-10'>
          <span className='text-2xl font-black text-white tracking-tight'>AgendaYa</span>
          <div className='flex items-center gap-2 mt-1'>
            <span className='pulse-dot text-primary-500 text-sm'>●</span>
            <span className='text-xs font-bold text-primary-500 uppercase tracking-widest'>Perú</span>
          </div>
        </div>

        {/* Copy */}
        <div className='relative z-10'>
          <div className='w-14 h-0.5 bg-primary-600 mb-7' />
          <h2 className='text-3xl font-black text-white leading-tight mb-4'>
            Únete a los mejores<br />negocios del Perú
          </h2>
          <p className='text-gray-400 text-sm mb-10'>
            Más de 500 negocios ya confían en AgendaYa para gestionar sus reservas.
          </p>
          <ul className='space-y-4'>
            {BENEFITS.map(b => (
              <li key={b} className='flex items-center gap-3'>
                <CheckCircle className='w-5 h-5 flex-shrink-0' style={{ color: '#C0392B' }} />
                <span className='text-gray-300 text-sm'>{b}</span>
              </li>
            ))}
          </ul>
          <div className='mt-10 p-4 rounded-xl border border-gray-700'>
            <p className='text-xs text-gray-500 mb-1 uppercase tracking-wider'>Precio</p>
            <p className='text-white font-bold'>S/. 80 / mes</p>
            <p className='text-gray-500 text-xs mt-0.5'>Sin contrato · Cancela cuando quieras</p>
          </div>
        </div>

        <p className='relative z-10 text-xs text-gray-600'>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú
        </p>
      </div>

      {/* ── Lado derecho ── */}
      <div
        className='w-full lg:w-7/12 flex items-start justify-center px-8 py-10 overflow-y-auto'
        style={{ backgroundColor: '#F5F0EB' }}
      >
        <div className='w-full max-w-lg'>

          {/* Logo móvil */}
          <div className='lg:hidden text-center mb-6'>
            <span className='text-2xl font-black' style={{ color: '#0D0D0D' }}>AgendaYa</span>
          </div>

          <h2 className='text-2xl font-black text-gray-900 mb-1'>Crear cuenta gratis</h2>
          <p className='text-sm text-gray-500 mb-7'>Configura tu negocio en menos de 2 minutos</p>

          {errorMessage && (
            <div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-xl'>
              <p className='text-sm text-red-700'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>

            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Tu negocio</p>

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
              <Input label='Ciudad' placeholder='Arequipa' {...register('city')} />
            </div>
            <Input
              label='Teléfono del negocio'
              placeholder='+51 987 654 321'
              error={errors.phone?.message}
              {...register('phone')}
            />

            <p className='text-xs font-bold text-gray-400 uppercase tracking-wider pt-2'>Tu cuenta</p>

            <div className='grid grid-cols-2 gap-3'>
              <Input label='Nombre'   placeholder='Juan'  error={errors.first_name?.message} {...register('first_name')} />
              <Input label='Apellido' placeholder='Pérez' error={errors.last_name?.message}  {...register('last_name')} />
            </div>
            <Input
              label='Email' type='email' placeholder='tu@email.com'
              autoComplete='email' error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label='Contraseña' type='password' placeholder='Mínimo 8 caracteres'
              autoComplete='new-password' error={errors.password?.message}
              {...register('password')}
            />

            <button
              type='submit'
              disabled={isPending}
              className='w-full py-3 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2'
              style={{ backgroundColor: '#C0392B' }}
              onMouseEnter={e => !isPending && (e.target.style.backgroundColor = '#922B21')}
              onMouseLeave={e => !isPending && (e.target.style.backgroundColor = '#C0392B')}
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              Crear cuenta gratis
            </button>

            <p className='text-xs text-center text-gray-400'>
              Al registrarte aceptas los términos de servicio
            </p>
          </form>

          <p className='text-center text-sm text-gray-500 mt-5'>
            ¿Ya tienes cuenta?{' '}
            <Link to='/login' className='font-bold hover:underline' style={{ color: '#C0392B' }}>
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
