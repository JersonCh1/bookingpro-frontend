import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { LogoFull } from '../components/ui/Logo'
import { CheckCircle, ArrowRight, Zap, Calendar, MessageCircle } from 'lucide-react'

/* ── Particles ── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left:     `${(i * 5.7 + 4) % 96}%`,
  top:      `${(i * 6.3 + 8) % 90}%`,
  size:     i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 3,
  duration: `${6 + (i % 5) * 1.4}s`,
  delay:    `${(i * 0.6) % 5}s`,
}))

/* ── Navbar ── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 transition-all'
      style={{
        backgroundColor: scrolled ? 'rgba(13,13,13,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      }}>
      <div className='max-w-5xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between'>
        <LogoFull height={44} dark />
        <div className='flex items-center gap-2 sm:gap-3'>
          <Link to='/login'
            className='text-sm font-semibold px-4 py-2 rounded-lg transition-all hidden sm:block'
            style={{ color: '#aaa' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#aaa' }}
          >
            Iniciar sesión
          </Link>
          <Link to='/register'
            className='inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-lg transition-all'
            style={{ backgroundColor: '#C0392B', color: 'white' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#922B21' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
          >
            Empezar gratis <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ── Hero ── */
function Hero() {
  return (
    <section className='relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28' style={{ backgroundColor: '#0D0D0D' }}>
      {/* Grid */}
      <div className='absolute inset-0 pointer-events-none' style={{
        backgroundImage: `linear-gradient(rgba(192,57,43,0.05) 1px,transparent 1px),
          linear-gradient(90deg,rgba(192,57,43,0.05) 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      {/* Glows */}
      <div className='glow-breathe absolute inset-0 pointer-events-none' style={{
        background: 'radial-gradient(ellipse at 50% 40%, rgba(192,57,43,0.18) 0%, transparent 55%)',
      }} />
      <div className='absolute inset-0 pointer-events-none' style={{
        background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)',
      }} />
      {/* Particles */}
      {PARTICLES.map(p => (
        <span key={p.id} className='particle' style={{
          width: p.size, height: p.size, left: p.left, top: p.top,
          animationDuration: p.duration, animationDelay: p.delay,
        }} />
      ))}

      <div className='relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center'>
        {/* Badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8'
          style={{ backgroundColor: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.25)' }}>
          <span className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ backgroundColor: '#C0392B' }} />
          <span className='text-xs font-bold tracking-widest uppercase' style={{ color: '#E74C3C' }}>
            Para negocios peruanos
          </span>
        </div>

        <h1 className='text-4xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6'>
          Tu agenda,<br />
          <span style={{ color: '#C0392B' }}>siempre llena.</span>
        </h1>

        <p className='text-base sm:text-xl text-gray-400 mb-10 max-w-xl mx-auto leading-relaxed'>
          El sistema de reservas que trabaja por ti las 24 horas. Clientes reservan solos, tú recibes notificaciones por WhatsApp.
        </p>

        <div className='flex flex-col sm:flex-row items-center justify-center gap-3'>
          <Link to='/register'
            className='auth-btn shimmer-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all'
            style={{ backgroundColor: '#C0392B' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#922B21' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
          >
            Crear cuenta gratis <ArrowRight className='w-4 h-4' />
          </Link>
          <a href='#how'
            className='w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold transition-all'
            style={{ color: 'white', border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
          >
            Ver cómo funciona
          </a>
        </div>

        <p className='mt-6 text-xs text-gray-600'>Sin tarjeta de crédito · Sin contrato · Cancela cuando quieras</p>
      </div>
    </section>
  )
}

/* ── Stats Bar ── */
function StatsBar() {
  return (
    <section style={{ backgroundColor: '#111' }}>
      <div className='max-w-4xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-3 gap-6 text-center divide-x divide-gray-800'>
        <div>
          <p className='text-2xl sm:text-3xl font-black text-white mb-1'>Nuevo</p>
          <span className='inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full'
            style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#4ade80' }}>
            <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
            Todo Perú 🇵🇪
          </span>
        </div>
        <div>
          <p className='text-3xl sm:text-4xl font-black' style={{ color: '#C0392B' }}>24/7</p>
          <p className='text-xs sm:text-sm text-gray-500 mt-1 font-medium'>disponible sin parar</p>
        </div>
        <div>
          <p className='text-lg sm:text-xl font-black text-white'>Recién lanzado 🚀</p>
          <p className='text-xs sm:text-sm text-gray-500 mt-1 font-medium'>únete desde el inicio</p>
        </div>
      </div>
    </section>
  )
}

/* ── Scroll Reveal ── */
function useScrollReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
        }, delay)
        obs.disconnect()
      }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])
}

function AnimatedCard({ children, delay }) {
  const ref = useRef(null)
  useScrollReveal(ref, delay)
  return <div ref={ref}>{children}</div>
}

/* ── Cómo funciona ── */
function HowItWorks() {
  const steps = [
    {
      n: '1',
      icon: Zap,
      title: 'Regístrate en 2 minutos',
      desc: 'Crea tu cuenta, configura tus servicios y horarios desde el panel de control.',
    },
    {
      n: '2',
      icon: MessageCircle,
      title: 'Comparte tu enlace por WhatsApp',
      desc: 'Cada negocio tiene su página pública única. Compártela con tus clientes y en tu bio.',
    },
    {
      n: '3',
      icon: Calendar,
      title: 'Recibe reservas automáticas',
      desc: 'Tus clientes eligen servicio, fecha y hora. Tú recibes la confirmación por WhatsApp.',
    },
  ]
  return (
    <section id='how' className='py-20 sm:py-24 bg-white'>
      <div className='max-w-5xl mx-auto px-5 sm:px-8'>
        <div className='text-center mb-14'>
          <span className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4'
            style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
            Simple y rápido
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-gray-900'>Funciona en 3 pasos</h2>
        </div>
        <div className='grid sm:grid-cols-3 gap-6'>
          {steps.map((s, i) => (
            <AnimatedCard key={s.n} delay={i * 150}>
              <div className='relative p-6 rounded-2xl border border-gray-100 hover:border-red-100 transition-all hover:shadow-lg group h-full'>
                <div className='w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-white mb-5 transition-all group-hover:scale-110'
                  style={{ backgroundColor: '#C0392B', boxShadow: '0 4px 12px rgba(192,57,43,0.3)' }}>
                  {s.n}
                </div>
                <s.icon className='w-5 h-5 mb-3' style={{ color: '#C0392B' }} />
                <h3 className='font-black text-gray-900 mb-2'>{s.title}</h3>
                <p className='text-sm text-gray-400 leading-relaxed'>{s.desc}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Rubros ── */
function BusinessTypes() {
  const types = [
    { icon: '✂', label: 'Barberías' },
    { icon: '💅', label: 'Salones de Belleza' },
    { icon: '🏥', label: 'Consultorios' },
    { icon: '🐾', label: 'Veterinarias' },
    { icon: '🍕', label: 'Restaurantes' },
    { icon: '💪', label: 'Gimnasios' },
  ]
  return (
    <section className='py-20 sm:py-24' style={{ backgroundColor: '#0D0D0D' }}>
      <div className='max-w-4xl mx-auto px-5 sm:px-8'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl sm:text-4xl font-black text-white'>Para todo tipo de negocios</h2>
          <p className='text-gray-500 mt-3'>Si tienes clientes con citas, AgendaYa es para ti</p>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
          {types.map((t, i) => (
            <AnimatedCard key={t.label} delay={i * 80}>
              <div
                className='flex items-center gap-3 p-4 rounded-2xl cursor-pointer'
                style={{
                  backgroundColor: '#111',
                  border: '1px solid #1E1E1E',
                  borderLeft: '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#C0392B33'
                  e.currentTarget.style.borderLeftColor = '#C0392B'
                  e.currentTarget.style.backgroundColor = '#161616'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1E1E1E'
                  e.currentTarget.style.borderLeftColor = 'transparent'
                  e.currentTarget.style.backgroundColor = '#111'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                <span className='text-2xl'>{t.icon}</span>
                <span className='text-sm font-semibold text-gray-300'>{t.label}</span>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Countdown ── */
function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState('')
  useEffect(() => {
    const calc = () => {
      const diff = targetDate - Date.now()
      if (diff <= 0) { setTimeLeft('Expirado'); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      setTimeLeft(`${d}d ${h}h ${m}m`)
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [targetDate])
  return timeLeft
}

/* ── Precio ── */
function Pricing() {
  const features = [
    'Reservas ilimitadas',
    'Notificaciones por WhatsApp',
    'Página pública personalizada',
    'Panel de control completo',
    'Soporte en español',
  ]
  const deadline = useMemo(() => Date.now() + 7 * 24 * 60 * 60 * 1000, [])
  const countdown = useCountdown(deadline)

  return (
    <section className='py-20 sm:py-24' style={{ backgroundColor: '#111' }}>
      <div className='max-w-md mx-auto px-5 sm:px-8'>
        <div className='text-center mb-10'>
          <span className='inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4'
            style={{ backgroundColor: 'rgba(192,57,43,0.12)', color: '#C0392B' }}>
            Precio único en Perú
          </span>
          <h2 className='text-3xl sm:text-4xl font-black text-white'>Sin sorpresas</h2>
        </div>

        <div className='relative rounded-2xl p-8 text-center pricing-glow'
          style={{ backgroundColor: '#0D0D0D', border: '2px solid #C0392B', boxShadow: '0 0 40px rgba(192,57,43,0.25), 0 0 80px rgba(192,57,43,0.1)' }}>

          {/* Badge oferta de lanzamiento */}
          <div className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-5'
            style={{ backgroundColor: 'rgba(192,57,43,0.15)', border: '1px solid rgba(192,57,43,0.5)' }}>
            <span className='w-1.5 h-1.5 rounded-full animate-pulse' style={{ backgroundColor: '#E74C3C' }} />
            <span className='text-xs font-black uppercase tracking-widest' style={{ color: '#E74C3C' }}>
              🔥 Oferta de lanzamiento
            </span>
          </div>

          {/* Precio */}
          <div className='flex items-start justify-center gap-1 mb-1'>
            <span className='text-2xl font-black text-gray-400 mt-3'>S/.</span>
            <span className='text-8xl font-black leading-none' style={{ color: '#C0392B' }}>69</span>
            <div className='flex flex-col items-start mt-3 ml-1'>
              <span className='text-sm font-medium text-gray-500 line-through'>S/. 120</span>
              <span className='text-sm font-medium text-gray-500'>/ mes</span>
            </div>
          </div>

          {/* Tiempo limitado — countdown real */}
          <p className='text-xs mb-1 font-mono' style={{ color: '#E74C3C' }}>
            ⏰ Termina en: <span className='font-black'>{countdown}</span>
          </p>
          <p className='text-xs text-gray-600 mb-7'>Sin contrato · Cancela cuando quieras</p>

          <ul className='space-y-3 mb-8 text-left'>
            {features.map(f => (
              <li key={f} className='flex items-center gap-3'>
                <CheckCircle className='w-4 h-4 flex-shrink-0' style={{ color: '#C0392B' }} />
                <span className='text-sm text-gray-300'>{f}</span>
              </li>
            ))}
          </ul>

          <Link to='/register'
            className='auth-btn shimmer-btn w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all'
            style={{ backgroundColor: '#C0392B' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#922B21' }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}
          >
            Empezar ahora <ArrowRight className='w-4 h-4' />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ── CTA Final ── */
function FinalCTA() {
  return (
    <section className='py-20 sm:py-24 text-center relative overflow-hidden' style={{ backgroundColor: '#C0392B' }}>
      <div className='absolute inset-0 pointer-events-none' style={{
        backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }} />
      <div className='relative z-10 max-w-xl mx-auto px-5 sm:px-8'>
        <h2 className='text-3xl sm:text-5xl font-black text-white mb-4 leading-tight'>
          ¿Listo para llenar<br />tu agenda?
        </h2>
        <p className='text-red-200 mb-8 text-base'>
          Únete a los negocios que ya usan AgendaYa en Perú
        </p>
        <Link to='/register'
          className='inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-black transition-all'
          style={{ backgroundColor: 'white', color: '#C0392B' }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f0f0f0' }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white' }}
        >
          Crear cuenta gratis <ArrowRight className='w-4 h-4' />
        </Link>
      </div>
    </section>
  )
}

/* ── Footer con redes sociales ── */
function Footer() {
  const socials = [
    {
      label: 'Instagram', href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    },
    {
      label: 'Facebook', href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    },
    {
      label: 'TikTok', href: '#',
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
    },
  ]
  return (
    <footer style={{ backgroundColor: '#0D0D0D', borderTop: '1px solid #1A1A1A' }}>
      <div className='max-w-5xl mx-auto px-5 sm:px-8 py-10'>
        <div className='flex flex-col sm:flex-row items-center justify-between gap-6'>
          <div className='text-center sm:text-left'>
            <LogoFull height={40} dark />
            <p className='text-xs mt-2' style={{ color: '#444' }}>Hecho en Perú 🇵🇪</p>
            <p className='text-xs mt-1' style={{ color: '#333' }}>
              © {new Date().getFullYear()} AgendaYa · Arequipa, Perú
            </p>
          </div>
          <div className='flex flex-col items-center sm:items-end gap-4'>
            <div className='flex items-center gap-4'>
              {socials.map(s => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className='transition-colors'
                  style={{ color: '#444' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#444' }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
            <div className='flex items-center gap-5'>
              <Link to='/login' className='text-sm font-medium transition-colors' style={{ color: '#444' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#888' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#444' }}>
                Iniciar sesión
              </Link>
              <Link to='/register' className='text-sm font-medium transition-colors' style={{ color: '#444' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#888' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#444' }}>
                Crear cuenta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ── Página principal ── */
export default function Landing() {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <BusinessTypes />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  )
}
