import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useLogin } from '../../hooks/useAuth'

const schema = z.object({
  email:    z.string().email('Ingresa un email válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
})

const STATS = [
  { value: '500+',      label: 'negocios activos' },
  { value: '24/7',      label: 'disponibilidad'   },
  { value: '0 llamadas', label: 'para coordinar'  },
]

/* Input especial para el formulario oscuro-claro */
function FormInput({ label, error, ...props }) {
  return (
    <div className='space-y-1.5'>
      <label className='block text-xs font-semibold text-gray-500 uppercase tracking-wider'>
        {label}
      </label>
      <input
        className={`
          w-full bg-white px-0 py-2.5 text-sm text-gray-900 font-medium
          border-0 border-b-2 outline-none transition-colors
          ${error
            ? 'border-red-500'
            : 'border-gray-200 focus:border-primary-600'}
        `}
        {...props}
      />
      {error && <p className='text-xs text-red-600'>{error}</p>}
    </div>
  )
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })
  const { mutate, isPending, error } = useLogin()
  const errorMessage = error?.response?.data?.error ?? null

  return (
    <div className='min-h-screen flex' style={{ backgroundColor: '#0D0D0D' }}>

      {/* ── Lado izquierdo (55%) ── */}
      <div className='hidden lg:flex lg:w-[55%] flex-col justify-between p-14 relative overflow-hidden'>

        {/* Patrón geométrico sutil */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `
            linear-gradient(rgba(192,57,43,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(192,57,43,0.06) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Logo + indicador Perú */}
        <div className='relative z-10'>
          <div className='flex items-center gap-3 mb-2'>
            <span className='text-3xl font-black text-white tracking-tight'>AgendaYa</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='pulse-dot text-primary-500 text-base'>●</span>
            <span className='text-xs font-bold text-primary-500 uppercase tracking-widest'>Perú</span>
          </div>
        </div>

        {/* Contenido central */}
        <div className='relative z-10'>
          <div className='w-14 h-0.5 bg-primary-600 mb-8' />
          <h1 className='text-5xl font-black text-white leading-none mb-5'>
            Tu negocio<br />nunca duerme.
          </h1>
          <p className='text-gray-400 text-base leading-relaxed mb-12 max-w-xs'>
            El sistema de reservas más inteligente para negocios peruanos.
          </p>

          {/* Stats */}
          <div className='flex gap-10'>
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className='text-2xl font-black text-primary-500'>{value}</p>
                <p className='text-xs text-gray-500 mt-0.5'>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className='relative z-10 text-xs text-gray-600'>
          © {new Date().getFullYear()} AgendaYa · Hecho en Perú
        </p>
      </div>

      {/* ── Lado derecho (45%) ── */}
      <div
        className='w-full lg:w-[45%] flex items-center justify-center px-8 py-12'
        style={{ backgroundColor: '#F5F0EB' }}
      >
        <div className='w-full max-w-sm'>

          {/* Logo móvil */}
          <div className='lg:hidden mb-8 text-center'>
            <span className='text-2xl font-black' style={{ color: '#0D0D0D' }}>AgendaYa</span>
          </div>

          <h2 className='text-2xl font-black text-gray-900 mb-1'>Bienvenido de vuelta</h2>
          <p className='text-sm text-gray-500 mb-8'>Ingresa a tu panel de administración</p>

          {errorMessage && (
            <div className='mb-5 p-3 bg-red-50 border border-red-200 rounded-lg'>
              <p className='text-sm text-red-700'>{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit((data) => mutate(data))} className='space-y-6'>
            <FormInput
              label='Email'
              type='email'
              placeholder='tu@email.com'
              autoComplete='email'
              error={errors.email?.message}
              {...register('email')}
            />
            <FormInput
              label='Contraseña'
              type='password'
              placeholder='••••••••'
              autoComplete='current-password'
              error={errors.password?.message}
              {...register('password')}
            />

            <button
              type='submit'
              disabled={isPending}
              className='w-full py-3 rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2'
              style={{ backgroundColor: isPending ? '#922B21' : '#C0392B' }}
              onMouseEnter={e => !isPending && (e.target.style.backgroundColor = '#922B21')}
              onMouseLeave={e => !isPending && (e.target.style.backgroundColor = '#C0392B')}
            >
              {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
              Iniciar sesión
            </button>
          </form>

          <p className='text-center text-sm text-gray-500 mt-7'>
            ¿No tienes cuenta?{' '}
            <Link to='/register' className='font-bold hover:underline' style={{ color: '#C0392B' }}>
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
