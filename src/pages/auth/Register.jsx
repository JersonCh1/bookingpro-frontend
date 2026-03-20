import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle } from 'lucide-react'
import { useRegister } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Button from '../../components/ui/Button'

// Campos alineados 1:1 con RegisterSerializer del backend
const schema = z.object({
  // Negocio
  name:          z.string().min(2, 'Mínimo 2 caracteres'),
  business_type: z.string().min(1, 'Selecciona un tipo'),
  phone:         z.string().min(7, 'Teléfono requerido'),
  city:          z.string().optional(),
  // Cuenta
  first_name: z.string().min(1, 'Requerido'),
  last_name:  z.string().min(1, 'Requerido'),
  email:      z.string().email('Email inválido'),
  password:   z.string().min(8, 'Mínimo 8 caracteres'),
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
  'Reservas online 24/7',
  'Notificaciones WhatsApp',
  'Panel de administración',
]

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { city: 'Arequipa' },
  })

  const { mutate, isPending, error } = useRegister()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 to-white'>
      <div className='max-w-5xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-12 items-start'>

        {/* Columna izquierda — copy */}
        <div className='hidden lg:block pt-8'>
          <div className='flex items-center gap-3 mb-8'>
            <div className='w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <span className='text-xl font-bold text-gray-900'>BookingPro</span>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 leading-tight mb-4'>
            Tu negocio merece<br />un sistema profesional
          </h2>
          <p className='text-gray-500 mb-8'>
            Empieza a recibir reservas online hoy mismo.
            Sin instalaciones, sin complicaciones.
          </p>
          <ul className='space-y-3'>
            {BENEFITS.map((b) => (
              <li key={b} className='flex items-center gap-3 text-gray-700'>
                <CheckCircle className='w-5 h-5 text-primary-500 flex-shrink-0' />
                {b}
              </li>
            ))}
          </ul>
          <p className='mt-8 text-sm text-gray-400'>
            S/. 80/mes · Sin contrato · Cancela cuando quieras
          </p>
        </div>

        {/* Columna derecha — formulario */}
        <div>
          <div className='lg:hidden text-center mb-6'>
            <div className='inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-2xl mb-3'>
              <Calendar className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-xl font-bold text-gray-900'>BookingPro</h1>
          </div>

          <div className='card p-8 shadow-sm'>
            <h3 className='text-lg font-semibold text-gray-900 mb-1'>Crear cuenta gratis</h3>
            <p className='text-sm text-gray-500 mb-6'>Configura tu negocio en 2 minutos</p>

            {errorMessage && (
              <div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <p className='text-sm text-red-700'>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>

              {/* ── Sección negocio ── */}
              <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                Tu negocio
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
                  {BUSINESS_TYPES.map((t) => (
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
                label='Teléfono del negocio'
                placeholder='+51 987 654 321'
                error={errors.phone?.message}
                {...register('phone')}
              />

              {/* ── Sección cuenta ── */}
              <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2'>
                Tu cuenta
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
                label='Email'
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

              <Button type='submit' loading={isPending} size='lg' className='w-full mt-2'>
                Crear cuenta gratis
              </Button>

              <p className='text-xs text-center text-gray-400'>
                Al registrarte aceptas los términos de servicio
              </p>
            </form>
          </div>

          <p className='text-center text-sm text-gray-500 mt-4'>
            ¿Ya tienes cuenta?{' '}
            <Link to='/login' className='text-primary-600 font-medium hover:underline'>
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}
