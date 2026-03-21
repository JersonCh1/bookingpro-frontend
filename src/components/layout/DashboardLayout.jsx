import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Scissors, Users, Settings,
  LogOut, Menu, X, ExternalLink, Clock,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'

const NAV_ITEMS = [
  { to: '/dashboard',            label: 'Resumen',   icon: LayoutDashboard, end: true },
  { to: '/dashboard/bookings',   label: 'Reservas',  icon: Calendar },
  { to: '/dashboard/services',   label: 'Servicios', icon: Scissors },
  { to: '/dashboard/staff',      label: 'Personal',  icon: Users },
  { to: '/dashboard/scheduling', label: 'Horarios',  icon: Clock },
  { to: '/dashboard/settings',   label: 'Ajustes',   icon: Settings },
]

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, tenant } = useAuthStore()
  const logout = useLogout()

  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {sidebarOpen && (
        <div className='fixed inset-0 z-20 bg-black/60 lg:hidden' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 flex flex-col
          transform transition-transform duration-200 ease-in-out
          lg:static lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ backgroundColor: '#0D0D0D' }}
      >
        {/* Logo */}
        <div className='flex items-center justify-between h-16 px-5' style={{ borderBottom: '1px solid #1A1A1A' }}>
          <div className='flex items-center gap-2'>
            <span className='pulse-dot text-sm' style={{ color: '#C0392B' }}>●</span>
            <span className='text-base font-black text-white tracking-tight'>AgendaYa</span>
          </div>
          <button
            className='lg:hidden p-1 rounded text-gray-500 hover:text-white transition-colors'
            onClick={() => setSidebarOpen(false)}
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tenant info */}
        {tenant && (
          <div className='px-5 py-4' style={{ borderBottom: '1px solid #1A1A1A' }}>
            <p className='text-xs font-bold uppercase tracking-wider mb-1' style={{ color: '#4A4A4A' }}>
              Negocio
            </p>
            <p className='text-sm font-semibold text-white truncate'>{tenant.name}</p>
            <a
              href={`/book/${tenant.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-xs mt-1 transition-colors hover:text-white'
              style={{ color: '#4A4A4A' }}
            >
              Ver página pública <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        )}

        {/* Nav */}
        <nav className='flex-1 px-2 py-3 space-y-0.5'>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                border-l-[3px]
                ${isActive
                  ? 'text-white border-l-primary-600'
                  : 'text-gray-500 border-l-transparent hover:text-white'}
              `}
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#1A1A1A' : 'transparent',
              })}
              onMouseEnter={e => {
                if (!e.currentTarget.classList.contains('text-white')) {
                  e.currentTarget.style.backgroundColor = '#1A1A1A'
                }
              }}
              onMouseLeave={e => {
                if (!e.currentTarget.style.borderLeftColor?.includes('192')) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <Icon className='w-4 h-4 flex-shrink-0' />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className='px-2 py-3' style={{ borderTop: '1px solid #1A1A1A' }}>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div
              className='w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white'
              style={{ backgroundColor: '#C0392B' }}
            >
              {user?.first_name?.[0] || user?.username?.[0] || '?'}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-semibold text-white truncate'>
                {user?.first_name} {user?.last_name}
              </p>
              <p className='text-xs truncate' style={{ color: '#4A4A4A' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors'
            style={{ color: '#4A4A4A' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E74C3C'; e.currentTarget.style.backgroundColor = '#1A1A1A' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4A4A4A'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <LogOut className='w-4 h-4' />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className='flex-1 flex flex-col min-w-0 overflow-auto'>
        <header className='lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 gap-4'>
          <button onClick={() => setSidebarOpen(true)} className='p-2 rounded-lg hover:bg-gray-100'>
            <Menu className='w-5 h-5' />
          </button>
          <span className='font-black text-gray-900'>AgendaYa</span>
        </header>
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
