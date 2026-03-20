import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Calendar, Loader2 } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'

const schema = z.object({
  email:    z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const { mutate, isPending, error } = useLogin()

  // El error viene de { success: false, error: "...", code: "..." }
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white px-4'>
      <div className='w-full max-w-md'>

        {/* Logo */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-14 h-14 bg-primary-600 rounded-2xl mb-4 shadow-lg'>
            <Calendar className='w-7 h-7 text-white' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900'>BookingPro</h1>
          <p className='text-gray-500 mt-1 text-sm'>Inicia sesión en tu panel</p>
        </div>

        <div className='card p-8 shadow-sm'>

          {/* Error de API */}
          {errorMessage && (
            <div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2'>
              <span className='text-red-500 mt-0.5 flex-shrink-0'>✕</span>
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

            <Button
              type='submit'
              loading={isPending}
              className='w-full'
              size='lg'
            >
              Iniciar sesión
            </Button>
          </form>
        </div>

        <p className='text-center text-sm text-gray-500 mt-6'>
          ¿No tienes cuenta?{' '}
          <Link to='/register' className='text-primary-600 font-medium hover:underline'>
            Regístrate gratis
          </Link>
        </p>

      </div>
    </div>
  )
}
