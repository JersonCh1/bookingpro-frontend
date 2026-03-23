import { Outlet, NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Scissors, Users, Settings,
  LogOut, Menu, X, ExternalLink, Clock, ShieldCheck,
  UserCheck, BarChart2,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'
import { SidebarLogo, LogoFull } from '../ui/Logo'

const NAV_ITEMS = [
  { to: '/dashboard',              label: 'Resumen',       icon: LayoutDashboard, end: true },
  { to: '/dashboard/bookings',     label: 'Reservas',      icon: Calendar },
  { to: '/dashboard/services',     label: 'Servicios',     icon: Scissors },
  { to: '/dashboard/staff',        label: 'Personal',      icon: Users },
  { to: '/dashboard/customers',    label: 'Clientes',      icon: UserCheck },
  { to: '/dashboard/scheduling',   label: 'Horarios',      icon: Clock },
  { to: '/dashboard/analytics',    label: 'Estadísticas',  icon: BarChart2 },
  { to: '/dashboard/settings',     label: 'Ajustes',       icon: Settings },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, tenant } = useAuthStore()
  const logout = useLogout()

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-20 bg-black/70 lg:hidden backdrop-blur-sm'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: '#0D0D0D' }}
      >
        {/* Logo header */}
        <div
          className='flex items-center justify-between h-16 px-4'
          style={{ borderBottom: '1px solid #1A1A1A' }}
        >
          <SidebarLogo />
          <button
            className='lg:hidden p-1.5 rounded-lg transition-colors'
            style={{ color: '#4A4A4A' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#1A1A1A' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A'; e.currentTarget.style.backgroundColor = 'transparent' }}
            onClick={() => setSidebarOpen(false)}
            aria-label='Cerrar menú'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tenant info */}
        {tenant && (
          <div className='px-4 py-3.5' style={{ borderBottom: '1px solid #1A1A1A' }}>
            <p className='text-[10px] font-bold uppercase tracking-widest mb-1.5' style={{ color: '#4A4A4A' }}>
              Negocio
            </p>
            <div className='flex items-center gap-2'>
              <p className='text-sm font-semibold text-white truncate leading-snug'>{tenant.name}</p>
              <div className='relative flex-shrink-0 group'>
                <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse block' />
                <span className='absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded text-[10px] whitespace-nowrap font-medium pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity'
                  style={{ backgroundColor: '#1A1A1A', color: '#4ade80', border: '1px solid #2a2a2a' }}>
                  Tu página está activa
                </span>
              </div>
            </div>
            <a
              href={`/book/${tenant.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-xs mt-1 transition-colors'
              style={{ color: '#4A4A4A' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A' }}
            >
              Ver página pública <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        )}

        {/* Navigation */}
        <nav className='flex-1 px-2 py-3 space-y-0.5 overflow-y-auto'>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                ${isActive ? 'nav-active text-white' : 'text-gray-500 hover:text-white'}`
              }
            >
              <Icon className='w-4 h-4 flex-shrink-0' />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className='px-2 py-3' style={{ borderTop: '1px solid #1A1A1A' }}>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black text-white select-none'
              style={{ backgroundColor: '#C0392B' }}
            >
              {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-white truncate leading-tight'>
                {user?.first_name} {user?.last_name}
              </p>
              <p className='text-xs truncate leading-tight' style={{ color: '#4A4A4A' }}>
                {user?.email}
              </p>
            </div>
          </div>

          {(user?.is_staff || user?.email?.includes('echurapacci')) && (
            <Link to='/superadmin'
              className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all mb-1'
              style={{ color: '#D4AF37' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(212,175,55,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <ShieldCheck className='w-4 h-4' />
              Super Admin
            </Link>
          )}

          <button
            onClick={logout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all'
            style={{ color: '#4A4A4A' }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#E74C3C'
              e.currentTarget.style.backgroundColor = '#1A1A1A'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#4A4A4A'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <LogOut className='w-4 h-4' />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className='flex-1 flex flex-col min-w-0 overflow-auto'>
        {/* Mobile top bar */}
        <header className='lg:hidden flex items-center h-14 px-4 bg-white border-b border-gray-200 gap-3'>
          <button
            onClick={() => setSidebarOpen(true)}
            className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
          >
            <Menu className='w-5 h-5 text-gray-700' />
          </button>
          <LogoFull height={32} />
        </header>

        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
