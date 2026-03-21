import { Link } from 'react-router-dom'
import { LogoFull } from '../components/ui/Logo'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center px-6 text-center'
      style={{ backgroundColor: '#0D0D0D' }}>

      {/* Grid background */}
      <div className='absolute inset-0 pointer-events-none' style={{
        backgroundImage: `linear-gradient(rgba(192,57,43,0.04) 1px,transparent 1px),
          linear-gradient(90deg,rgba(192,57,43,0.04) 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div className='relative z-10'>
        <div className='mb-8'>
          <LogoFull height={44} dark />
        </div>

        <p className='text-[140px] sm:text-[180px] font-black leading-none'
          style={{ color: '#C0392B', textShadow: '0 0 80px rgba(192,57,43,0.3)' }}>
          404
        </p>

        <h1 className='text-xl sm:text-2xl font-black text-white mt-2 mb-3'>
          Página no encontrada
        </h1>
        <p className='text-sm text-gray-500 mb-10 max-w-xs mx-auto'>
          El enlace puede ser incorrecto o la página ya no existe.
        </p>

        <Link
          to='/'
          className='inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all'
          style={{ backgroundColor: '#C0392B' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#922B21' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
        >
          Volver al inicio <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </div>
  )
}
