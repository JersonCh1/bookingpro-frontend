import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRegister } from '../../hooks/useAuth'
import { LogoFull } from '../../components/ui/Logo'
import { useEffect, useRef, useState } from 'react'
import {
  CheckCircle, ArrowRight, Zap, Bell, Users, LayoutDashboard,
  Star, Menu, X, ChevronRight,
} from 'lucide-react'

/* ─── Scroll-triggered fade-in ─── */
function useInView(options = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.12, ...options })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function FadeIn({ children, delay = 0, className = '' }) {
  const [ref, visible] = useInView()
  return (
    <div ref={ref} className={className} style={{
      opacity:   visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

/* ─── CountUp ─── */
function CountUp({ target, suffix = '' }) {
  const ref = useRef(null); const raf = useRef(null); const done = useRef(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / 1800, 1)
          el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix
          if (p < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick); obs.disconnect()
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => { obs.disconnect(); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, suffix])
  return <span ref={ref}>0{suffix}</span>
}

/* ─── Datos ─── */
const CATEGORIES = [
  { icon: '💈', label: 'Barberías' },
  { icon: '💅', label: 'Salones de belleza' },
  { icon: '🏥', label: 'Consultorios' },
  { icon: '🐾', label: 'Veterinarias' },
  { icon: '🏋️', label: 'Gimnasios' },
  { icon: '📸', label: 'Estudios' },
]

const FEATURES = [
  { icon: Zap,            title: 'Reservas online 24/7',       desc: 'Tus clientes reservan en cualquier momento, desde su celular, sin llamadas ni WhatsApp manuales.' },
  { icon: Bell,           title: 'Recordatorios automáticos',  desc: 'Envía confirmaciones y recordatorios por WhatsApp automáticamente. Reduce cancelaciones hasta un 40%.' },
  { icon: Users,          title: 'Gestión de clientes',        desc: 'Historial completo de citas, datos de contacto y notas por cliente en un solo lugar.' },
  { icon: LayoutDashboard,title: 'Panel simple y rápido',      desc: 'Dashboard diseñado para dueños de negocios, no para expertos en tecnología. Empieza en minutos.' },
]

const TESTIMONIALS = [
  { name: 'María Quispe', role: 'Barbería El Estilo · Arequipa', rating: 5,
    quote: 'Desde que uso AgendaYa mis reservas aumentaron un 35%. Mis clientes ya no me llaman para agendar, lo hacen solos desde el link.' },
  { name: 'Carlos Mamani', role: 'Salón Glam · Lima', rating: 5,
    quote: 'Lo configuré en menos de 10 minutos. Ahora tengo el calendario lleno y no pierdo tiempo coordinando por WhatsApp.' },
  { name: 'Dra. Ana Flores', role: 'Consultorio Dental · Cusco', rating: 5,
    quote: 'El recordatorio automático redujo mis cancelaciones a la mitad. Vale cada sol que pago al mes.' },
]

/* ─── Mini form en hero (4 campos, alta conversión) ─── */
const heroSchema = z.object({
  name:     z.string().min(2, 'Escribe el nombre de tu negocio'),
  phone:    z.string().min(7, 'Teléfono requerido'),
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
})

function HeroForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(heroSchema) })
  const { mutate, isPending, error } = useRegister()
  const msg = error?.response?.data?.error ?? null

  const onSubmit = ({ name, phone, email, password }) => {
    const words = name.trim().split(/\s+/)
    mutate({
      name,
      phone,
      email,
      password,
      business_type: 'otro',
      city: 'Lima',
      first_name: words[0] ?? 'Usuario',
      last_name:  words.slice(1).join(' ') || 'Negocio',
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
      {msg && (
        <div className='p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium'>
          ⚠ {msg}
        </div>
      )}

      {[
        { field: 'name',     label: 'Nombre del negocio',    placeholder: 'Ej: Barbería El Corte',  type: 'text'     },
        { field: 'phone',    label: 'Teléfono / WhatsApp',   placeholder: '+51 987 654 321',         type: 'tel'      },
        { field: 'email',    label: 'Correo electrónico',    placeholder: 'tu@negocio.com',          type: 'email'    },
        { field: 'password', label: 'Contraseña',            placeholder: 'Mínimo 8 caracteres',    type: 'password' },
      ].map(({ field, label, placeholder, type }) => (
        <div key={field}>
          <label className='block text-xs font-semibold text-gray-600 mb-1'>{label}</label>
          <input
            type={type}
            placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all
              focus:ring-2 focus:ring-red-200 focus:border-red-400 placeholder:text-gray-300
              ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}
            {...register(field)}
          />
          {errors[field] && <p className='mt-1 text-xs text-red-500'>{errors[field].message}</p>}
        </div>
      ))}

      <button type='submit' disabled={isPending}
        className='shimmer-btn w-full py-3.5 rounded-xl text-sm font-black text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60'
        style={{ backgroundColor: '#C0392B' }}
        onMouseEnter={e => !isPending && (e.currentTarget.style.backgroundColor = '#A93226')}
        onMouseLeave={e => !isPending && (e.currentTarget.style.backgroundColor = '#C0392B')}>
        {isPending ? 'Creando tu cuenta...' : <>Crear mi cuenta gratis <ArrowRight className='w-4 h-4' /></>}
      </button>

      <p className='text-center text-xs text-gray-400'>
        Sin tarjeta de crédito · Cancela cuando quieras
      </p>
    </form>
  )
}

/* ─── Dashboard Mockup CSS ─── */
function DashboardMockup() {
  const bookings = [
    { name: 'María García',    service: 'Corte + Barba', time: '10:00', status: 'confirmed' },
    { name: 'Carlos Mamani',   service: 'Coloración',    time: '11:30', status: 'pending'   },
    { name: 'Ana Rodríguez',   service: 'Manicure',      time: '14:00', status: 'confirmed' },
    { name: 'Luis Quispe',     service: 'Corte clásico', time: '15:30', status: 'confirmed' },
  ]
  const days  = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
  const slots = [2, 4, 1, 3, 2, 5, 0]

  return (
    <div className='relative mx-auto' style={{ maxWidth: 720 }}>
      {/* Browser chrome */}
      <div className='rounded-2xl overflow-hidden shadow-2xl' style={{ border: '1px solid #2C2C2C' }}>
        {/* Title bar */}
        <div className='flex items-center gap-2 px-4 py-3' style={{ backgroundColor: '#1A1A1A' }}>
          <span className='w-3 h-3 rounded-full' style={{ backgroundColor: '#FF5F57' }} />
          <span className='w-3 h-3 rounded-full' style={{ backgroundColor: '#FFBD2E' }} />
          <span className='w-3 h-3 rounded-full' style={{ backgroundColor: '#28CA42' }} />
          <div className='flex-1 mx-4'>
            <div className='rounded-md px-3 py-1 text-xs text-gray-500 text-center' style={{ backgroundColor: '#111' }}>
              app.agendaya.pe/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard layout */}
        <div className='flex' style={{ backgroundColor: '#0D0D0D', minHeight: 340 }}>
          {/* Sidebar */}
          <div className='w-44 flex-shrink-0 flex flex-col py-4 px-3 gap-1' style={{ borderRight: '1px solid #1A1A1A' }}>
            <div className='px-2 py-1.5 rounded-lg flex items-center gap-2 mb-3' style={{ backgroundColor: '#1A1A1A' }}>
              <div className='w-2 h-2 rounded-full' style={{ backgroundColor: '#C0392B' }} />
              <span className='text-xs font-black text-white'>AgendaYa</span>
            </div>
            {['Resumen', 'Reservas', 'Servicios', 'Personal', 'Ajustes'].map((item, i) => (
              <div key={item} className='px-2 py-1.5 rounded-lg flex items-center gap-2'
                style={{
                  backgroundColor: i === 0 ? '#1A1A1A' : 'transparent',
                  borderLeft: i === 0 ? '2px solid #C0392B' : '2px solid transparent',
                }}>
                <div className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: i === 0 ? '#C0392B' : '#333' }} />
                <span className='text-xs' style={{ color: i === 0 ? 'white' : '#4A4A4A' }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div className='flex-1 p-4 space-y-3'>
            {/* Stats row */}
            <div className='grid grid-cols-4 gap-2'>
              {[
                { label: 'Citas hoy',     value: '12' },
                { label: 'Esta semana',   value: '48' },
                { label: 'Completadas',   value: '284' },
                { label: 'Ingresos/mes',  value: 'S/.2.4k' },
              ].map(s => (
                <div key={s.label} className='rounded-xl p-3' style={{ backgroundColor: '#111', border: '1px solid #1A1A1A' }}>
                  <p className='text-xs font-black text-white'>{s.value}</p>
                  <p className='text-[10px] mt-0.5' style={{ color: '#4A4A4A' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-5 gap-3'>
              {/* Booking list */}
              <div className='col-span-3 rounded-xl overflow-hidden' style={{ backgroundColor: '#111', border: '1px solid #1A1A1A' }}>
                <div className='px-3 py-2 flex items-center justify-between' style={{ borderBottom: '1px solid #1A1A1A' }}>
                  <span className='text-xs font-bold text-white'>Próximas reservas</span>
                  <span className='text-[10px] px-2 py-0.5 rounded-full font-bold' style={{ backgroundColor: 'rgba(192,57,43,0.15)', color: '#C0392B' }}>Hoy</span>
                </div>
                {bookings.map((b, i) => (
                  <div key={i} className='px-3 py-2 flex items-center gap-2' style={{ borderBottom: i < 3 ? '1px solid #1A1A1A' : 'none' }}>
                    <div className='w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white'
                      style={{ backgroundColor: '#C0392B' }}>
                      {b.name[0]}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-[11px] font-semibold text-white truncate'>{b.name}</p>
                      <p className='text-[10px]' style={{ color: '#4A4A4A' }}>{b.service}</p>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-[11px] font-bold' style={{ color: '#C0392B' }}>{b.time}</p>
                      <div className='w-1.5 h-1.5 rounded-full ml-auto mt-0.5'
                        style={{ backgroundColor: b.status === 'confirmed' ? '#22c55e' : '#f59e0b' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mini calendar */}
              <div className='col-span-2 rounded-xl p-3' style={{ backgroundColor: '#111', border: '1px solid #1A1A1A' }}>
                <p className='text-xs font-bold text-white mb-2'>Marzo 2026</p>
                <div className='grid grid-cols-7 gap-0.5 mb-1'>
                  {days.map(d => <div key={d} className='text-center text-[9px] font-bold' style={{ color: '#4A4A4A' }}>{d}</div>)}
                </div>
                <div className='grid grid-cols-7 gap-0.5'>
                  {Array.from({ length: 31 }, (_, i) => {
                    const hasBooking = [3,5,8,10,12,15,17,19,20,22].includes(i+1)
                    const isToday = i + 1 === 20
                    return (
                      <div key={i} className='aspect-square rounded flex items-center justify-center text-[9px] font-semibold'
                        style={{
                          backgroundColor: isToday ? '#C0392B' : hasBooking ? 'rgba(192,57,43,0.15)' : 'transparent',
                          color: isToday ? 'white' : hasBooking ? '#E74C3C' : '#4A4A4A',
                        }}>
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp notification bubble */}
      <div className='absolute -bottom-4 -right-4 rounded-2xl px-4 py-3 shadow-2xl flex items-start gap-3'
        style={{ backgroundColor: '#25D366', maxWidth: 240 }}>
        <div className='w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-white'>
          <span className='text-sm'>💬</span>
        </div>
        <div>
          <p className='text-xs font-black text-white'>AgendaYa</p>
          <p className='text-[11px] text-white/90 leading-tight'>Hola María, tu cita del viernes a las 10am está confirmada ✅</p>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LANDING PAGE PRINCIPAL
═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <div className='min-h-screen bg-white font-sans'>

      {/* ════════ NAVBAR ════════ */}
      <nav className='sticky top-0 z-50' style={{ backgroundColor: '#0D0D0D', borderBottom: '1px solid #1A1A1A' }}>
        <div className='max-w-7xl mx-auto px-5 h-36 flex items-center justify-between'>
          <LogoFull height={110} dark />

          {/* Desktop nav */}
          <div className='hidden md:flex items-center gap-8'>
            {['Funciones', 'Precios', 'Testimonios'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className='text-sm font-medium transition-colors'
                style={{ color: '#6b7280' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b7280' }}>
                {item}
              </a>
            ))}
          </div>

          <div className='hidden md:flex items-center gap-3'>
            <Link to='/login'
              className='text-sm font-semibold px-4 py-2 rounded-lg transition-all'
              style={{ color: '#9ca3af' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#9ca3af' }}>
              Iniciar sesión
            </Link>
            <Link to='/register'
              className='shimmer-btn text-sm font-black px-5 py-2 rounded-lg text-white transition-all flex items-center gap-1.5'
              style={{ backgroundColor: '#C0392B' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}>
              Empezar gratis <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button className='md:hidden p-2 rounded-lg text-gray-400'
            onClick={() => setMobileMenu(v => !v)}>
            {mobileMenu ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className='md:hidden px-5 pb-4 space-y-2' style={{ borderTop: '1px solid #1A1A1A' }}>
            <Link to='/login' className='block py-2 text-sm text-gray-400'>Iniciar sesión</Link>
            <Link to='/register'
              className='block w-full py-2.5 text-sm font-black text-white text-center rounded-xl'
              style={{ backgroundColor: '#C0392B' }}>
              Empezar gratis →
            </Link>
          </div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <section className='relative overflow-hidden' style={{ backgroundColor: '#0D0D0D' }}>
        {/* Grid pattern */}
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.06) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.06) 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className='absolute inset-0 pointer-events-none' style={{
          background: 'radial-gradient(ellipse at 20% 50%, rgba(192,57,43,0.12) 0%, transparent 60%)',
        }} />

        <div className='relative z-10 max-w-7xl mx-auto px-5 py-16 lg:py-20'>
          <div className='grid lg:grid-cols-2 gap-12 items-center'>

            {/* ─ Left: copy ─ */}
            <div>
              {/* Badge */}
              <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6'
                style={{ backgroundColor: 'rgba(192,57,43,0.12)', border: '1px solid rgba(192,57,43,0.25)' }}>
                <span className='pulse-dot text-xs' style={{ color: '#C0392B' }}>●</span>
                <span className='text-xs font-bold text-white'>Plataforma N°1 de reservas en Perú</span>
              </div>

              <h1 className='text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tight mb-5'>
                Gestiona reservas<br />
                <span style={{ color: '#C0392B' }}>y citas online</span><br />
                para tu negocio
              </h1>

              <p className='text-base text-gray-400 leading-relaxed mb-8 max-w-xl'>
                Automatiza tus reservas por WhatsApp, reduce cancelaciones
                y vende más — sin llamadas ni coordinación manual.
              </p>

              {/* Bullets */}
              <ul className='space-y-3 mb-10'>
                {[
                  'Recibe reservas 24/7 automáticamente',
                  'Configura servicios y horarios en minutos',
                  'Notificaciones automáticas por WhatsApp',
                ].map(b => (
                  <li key={b} className='flex items-center gap-3'>
                    <CheckCircle className='w-5 h-5 flex-shrink-0' style={{ color: '#C0392B' }} />
                    <span className='text-sm text-gray-300 font-medium'>{b}</span>
                  </li>
                ))}
              </ul>

              {/* CTA desktop */}
              <div className='hidden lg:flex items-center gap-4 flex-wrap'>
                <Link to='/register'
                  className='shimmer-btn inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-black text-white transition-all'
                  style={{ backgroundColor: '#C0392B' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}>
                  Empieza gratis en 2 minutos <ArrowRight className='w-5 h-5' />
                </Link>
                <Link to='/login' className='text-sm font-semibold transition-colors'
                  style={{ color: '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6b7280' }}>
                  Ya tengo cuenta →
                </Link>
              </div>

              {/* Social proof */}
              <div className='flex items-center gap-3 mt-8'>
                <div className='flex -space-x-2'>
                  {['M','C','A','L','R'].map((l, i) => (
                    <div key={i} className='w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black text-white'
                      style={{ backgroundColor: `hsl(${i * 37},60%,35%)`, borderColor: '#0D0D0D' }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className='flex items-center gap-0.5 mb-0.5'>
                    {[...Array(5)].map((_, i) => <Star key={i} className='w-3 h-3 fill-yellow-400 text-yellow-400' />)}
                  </div>
                  <p className='text-xs text-gray-500'>
                    <span className='font-bold text-white'>+500 negocios</span> en todo Perú confían en AgendaYa
                  </p>
                </div>
              </div>
            </div>

            {/* ─ Right: form card ─ */}
            <div>
              <div className='rounded-2xl p-7 shadow-2xl' style={{ backgroundColor: 'white' }}>
                <div className='mb-5'>
                  <span className='text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full'
                    style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>
                    ● Registro gratuito
                  </span>
                  <h2 className='text-xl font-black text-gray-900 mt-3 tracking-tight'>
                    Crea tu cuenta en 2 minutos
                  </h2>
                  <p className='text-xs text-gray-400 mt-1'>Sin tarjeta de crédito requerida</p>
                </div>
                <HeroForm />
                <p className='text-center text-xs text-gray-400 mt-4'>
                  ¿Ya tienes cuenta?{' '}
                  <Link to='/login' className='font-bold' style={{ color: '#C0392B' }}>Inicia sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ CATEGORÍAS ════════ */}
      <section className='py-12 border-b border-gray-100'>
        <div className='max-w-5xl mx-auto px-5'>
          <p className='text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8'>
            Usado por todo tipo de negocios en Perú
          </p>
          <div className='grid grid-cols-3 md:grid-cols-6 gap-4'>
            {CATEGORIES.map(c => (
              <FadeIn key={c.label} className='text-center group cursor-default'>
                <div className='w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl transition-all group-hover:scale-110 group-hover:shadow-md'
                  style={{ backgroundColor: '#fef2f2', border: '1px solid #fde8e8' }}>
                  {c.icon}
                </div>
                <p className='text-xs font-semibold text-gray-600'>{c.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ STATS ════════ */}
      <section className='py-16' style={{ backgroundColor: '#0D0D0D' }}>
        <div className='max-w-4xl mx-auto px-5'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            {[
              { val: 500, suf: '+', label: 'Negocios activos' },
              { val: 98,  suf: '%', label: 'Tasa de satisfacción' },
              { val: 40,  suf: '%', label: 'Menos cancelaciones' },
              { val: 2,   suf: ' min', label: 'Para configurar' },
            ].map(s => (
              <FadeIn key={s.label}>
                <p className='text-4xl font-black mb-1' style={{ color: '#C0392B' }}>
                  <CountUp target={s.val} suffix={s.suf} />
                </p>
                <p className='text-sm text-gray-500 font-medium'>{s.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ MOCKUP ════════ */}
      <section id='funciones' className='py-20' style={{ backgroundColor: '#080808' }}>
        <div className='max-w-5xl mx-auto px-5'>
          <FadeIn className='text-center mb-14'>
            <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
              El panel más simple del mercado
            </p>
            <h2 className='text-3xl lg:text-4xl font-black text-white tracking-tight'>
              Todo lo que necesitas,<br />nada que no necesitas
            </h2>
          </FadeIn>
          <FadeIn delay={100}>
            <DashboardMockup />
          </FadeIn>
        </div>
      </section>

      {/* ════════ FEATURES ════════ */}
      <section className='py-20 bg-gray-50'>
        <div className='max-w-5xl mx-auto px-5'>
          <FadeIn className='text-center mb-14'>
            <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
              Funciones
            </p>
            <h2 className='text-3xl lg:text-4xl font-black text-gray-900 tracking-tight'>
              Todo lo que tu negocio necesita
            </h2>
          </FadeIn>

          <div className='grid md:grid-cols-2 gap-5'>
            {FEATURES.map((f, i) => (
              <FadeIn key={f.title} delay={i * 80}>
                <div className='service-card bg-white rounded-2xl p-7 h-full'
                  style={{ border: '1px solid #f0f0f0' }}>
                  <div className='w-11 h-11 rounded-xl flex items-center justify-center mb-5'
                    style={{ backgroundColor: '#fef2f2' }}>
                    <f.icon className='w-5 h-5' style={{ color: '#C0392B' }} />
                  </div>
                  <h3 className='text-base font-black text-gray-900 mb-2'>{f.title}</h3>
                  <p className='text-sm text-gray-500 leading-relaxed'>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ TESTIMONIALS ════════ */}
      <section id='testimonios' className='py-20 bg-white'>
        <div className='max-w-5xl mx-auto px-5'>
          <FadeIn className='text-center mb-14'>
            <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
              Testimonios
            </p>
            <h2 className='text-3xl lg:text-4xl font-black text-gray-900 tracking-tight'>
              Lo que dicen nuestros clientes
            </h2>
          </FadeIn>

          <div className='grid md:grid-cols-3 gap-5'>
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={t.name} delay={i * 100}>
                <div className='stat-card bg-white rounded-2xl p-7 h-full'
                  style={{ border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                  <div className='flex items-center gap-0.5 mb-4'>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className='w-4 h-4 fill-yellow-400 text-yellow-400' />
                    ))}
                  </div>
                  <p className='text-sm text-gray-700 leading-relaxed mb-6 italic'>
                    "{t.quote}"
                  </p>
                  <div className='flex items-center gap-3 mt-auto'>
                    <div className='w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0'
                      style={{ backgroundColor: '#C0392B' }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <p className='text-sm font-bold text-gray-900'>{t.name}</p>
                      <p className='text-xs text-gray-400'>{t.role}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PRICING ════════ */}
      <section id='precios' className='py-20 bg-gray-50'>
        <div className='max-w-lg mx-auto px-5'>
          <FadeIn className='text-center mb-10'>
            <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
              Precios
            </p>
            <h2 className='text-3xl font-black text-gray-900 tracking-tight'>
              Simple. Sin sorpresas.
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <div className='rounded-3xl overflow-hidden shadow-xl'
              style={{ border: '2px solid #C0392B' }}>
              {/* Header */}
              <div className='px-8 py-8 text-center' style={{ backgroundColor: '#0D0D0D' }}>
                <p className='text-xs font-bold uppercase tracking-widest mb-3' style={{ color: '#C0392B' }}>
                  Plan único · Todo incluido
                </p>
                <div className='flex items-baseline justify-center gap-1'>
                  <span className='text-2xl font-bold text-gray-400'>S/.</span>
                  <span className='text-7xl font-black text-white'>80</span>
                  <span className='text-xl text-gray-500'>/mes</span>
                </div>
                <p className='text-sm text-gray-500 mt-2'>Sin contrato · Cancela cuando quieras</p>
              </div>

              {/* Features */}
              <div className='px-8 py-7 bg-white'>
                <ul className='space-y-3 mb-7'>
                  {[
                    'Reservas online ilimitadas',
                    'Notificaciones por WhatsApp',
                    'Panel de administración completo',
                    'Gestión de servicios y personal',
                    'Horarios y días personalizables',
                    'Soporte por WhatsApp incluido',
                  ].map(f => (
                    <li key={f} className='flex items-center gap-3'>
                      <CheckCircle className='w-4 h-4 flex-shrink-0' style={{ color: '#C0392B' }} />
                      <span className='text-sm text-gray-700 font-medium'>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to='/register'
                  className='shimmer-btn block w-full py-4 rounded-xl text-sm font-black text-white text-center transition-all'
                  style={{ backgroundColor: '#C0392B' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}>
                  Probar gratis 14 días →
                </Link>
                <p className='text-center text-xs text-gray-400 mt-3'>
                  Sin tarjeta de crédito requerida
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════ CTA FINAL ════════ */}
      <section className='py-20 relative overflow-hidden' style={{ backgroundColor: '#0D0D0D' }}>
        <div className='absolute inset-0 pointer-events-none' style={{
          backgroundImage: `linear-gradient(rgba(192,57,43,0.06) 1px,transparent 1px),
            linear-gradient(90deg,rgba(192,57,43,0.06) 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />
        <div className='relative z-10 max-w-2xl mx-auto px-5 text-center'>
          <FadeIn>
            <h2 className='text-4xl font-black text-white leading-tight tracking-tight mb-4'>
              Tu negocio merece<br />
              <span style={{ color: '#C0392B' }}>crecer sin límites.</span>
            </h2>
            <p className='text-gray-400 mb-8'>
              Más de 500 negocios ya automatizaron sus reservas con AgendaYa.
              Empieza hoy, gratis.
            </p>
            <Link to='/register'
              className='shimmer-btn inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-black text-white transition-all'
              style={{ backgroundColor: '#C0392B' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#A93226' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C0392B' }}>
              Empieza gratis en 2 minutos <ArrowRight className='w-5 h-5' />
            </Link>
            <p className='text-xs text-gray-600 mt-4'>Sin tarjeta · Sin contrato · Cancela cuando quieras</p>
          </FadeIn>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ backgroundColor: '#080808', borderTop: '1px solid #1A1A1A' }}>
        <div className='max-w-7xl mx-auto px-5 py-10'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-6'>
            <div className='flex items-center gap-4'>
              <LogoFull height={80} dark />
              <span className='text-xs text-gray-600'>Hecho en Perú 🇵🇪</span>
            </div>

            <div className='flex items-center gap-6 flex-wrap justify-center'>
              {['Términos', 'Privacidad', 'Soporte'].map(l => (
                <a key={l} href='#'
                  className='text-xs font-medium transition-colors'
                  style={{ color: '#4A4A4A' }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A' }}>
                  {l}
                </a>
              ))}
              <a href='https://wa.me/51999999999'
                className='inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all'
                style={{ backgroundColor: '#1A1A1A', color: '#25D366', border: '1px solid #25D366' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#25D366'; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1A1A1A'; e.currentTarget.style.color = '#25D366' }}>
                <span>💬</span> Soporte WhatsApp
              </a>
            </div>

            <p className='text-xs' style={{ color: '#2C2C2C' }}>
              © {new Date().getFullYear()} AgendaYa
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
