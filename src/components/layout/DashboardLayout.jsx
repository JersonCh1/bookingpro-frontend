import { Outlet, NavLink, useNavigate } from 'react-router-dom'
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
        <div className='fixed inset-0 z-20 bg-black/50 lg:hidden' onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col
        transform transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
        style={{ background: 'linear-gradient(160deg, #4F46E5 0%, #7C3AED 100%)' }}
      >
        {/* Logo */}
        <div className='flex items-center justify-between h-16 px-6 border-b border-white/10'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center'>
              <Calendar className='w-4 h-4 text-white' />
            </div>
            <span className='font-bold text-white text-lg tracking-tight'>AgendaYa</span>
          </div>
          <button className='lg:hidden p-1 rounded hover:bg-white/10 text-white' onClick={() => setSidebarOpen(false)}>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tenant info */}
        {tenant && (
          <div className='px-5 py-4 border-b border-white/10'>
            <p className='text-xs text-white/50 uppercase tracking-wide font-medium'>Negocio</p>
            <p className='text-sm font-semibold text-white mt-0.5 truncate'>{tenant.name}</p>
            <a
              href={`/book/${tenant.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-xs text-white/60 hover:text-white mt-1 transition-colors'
            >
              Ver página pública <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        )}

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 space-y-0.5'>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className='w-5 h-5 flex-shrink-0' />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className='px-3 py-4 border-t border-white/10'>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div className='w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0'>
              <span className='text-white text-sm font-semibold'>
                {user?.first_name?.[0] || user?.username?.[0] || '?'}
              </span>
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-white truncate'>
                {user?.first_name} {user?.last_name}
              </p>
              <p className='text-xs text-white/50 truncate'>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors'
          >
            <LogOut className='w-5 h-5' />
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
          <span className='font-bold text-gray-900'>AgendaYa</span>
        </header>
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
