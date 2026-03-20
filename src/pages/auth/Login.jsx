import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Calendar, CheckCircle } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  email:    z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

const FEATURES = [
  'Reservas online 24/7 sin llamadas',
  'Notificaciones automáticas por WhatsApp',
  'Panel de control en tiempo real',
]

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending, error } = useLogin()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex'>

      {/* Lado izquierdo — branding */}
      <div
        className='hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white'
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)' }}
      >
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center'>
            <Calendar className='w-5 h-5 text-white' />
          </div>
          <span className='text-xl font-bold tracking-tight'>AgendaYa</span>
        </div>

        <div>
          <h2 className='text-4xl font-bold leading-tight mb-4'>
            Tu agenda,<br />siempre llena.
          </h2>
          <p className='text-white/70 text-lg mb-10'>
            El sistema de reservas que entiende cómo trabajan los negocios en Perú.
          </p>
          <ul className='space-y-4'>
            {FEATURES.map(f => (
              <li key={f} className='flex items-center gap-3 text-white/90'>
                <CheckCircle className='w-5 h-5 text-white/60 flex-shrink-0' />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className='text-white/40 text-sm'>
          © {new Date().getFullYear()} AgendaYa · Todos los derechos reservados
        </p>
      </div>

      {/* Lado derecho — formulario */}
      <div className='w-full lg:w-1/2 flex items-center justify-center bg-white px-8 py-12'>
        <div className='w-full max-w-sm'>

          {/* Logo móvil */}
          <div className='lg:hidden text-center mb-8'>
            <div
              className='inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3'
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
            >
              <Calendar className='w-6 h-6 text-white' />
            </div>
            <h1 className='text-xl font-bold text-gray-900'>AgendaYa</h1>
          </div>

          <h2 className='text-2xl font-bold text-gray-900 mb-1'>Bienvenido de vuelta</h2>
          <p className='text-gray-500 text-sm mb-8'>Inicia sesión en tu panel de administración</p>

          {errorMessage && (
            <div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2'>
              <span className='text-red-500 mt-0.5 flex-shrink-0 text-sm'>✕</span>
              <p className='text-sm text-red-700'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-4'>
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
              placeholder='••••••••'
              autoComplete='current-password'
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type='submit' loading={isPending} className='w-full' size='lg'>
              Iniciar sesión
            </Button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-6'>
            ¿No tienes cuenta?{' '}
            <Link to='/register' className='text-primary-600 font-semibold hover:underline'>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
