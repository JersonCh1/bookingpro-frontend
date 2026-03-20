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
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200'>
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
              <Calendar className='w-4 h-4 text-white' />
            </div>
            <span className='font-bold text-gray-900'>BookingPro</span>
          </div>
          <button className='lg:hidden p-1 rounded hover:bg-gray-100' onClick={() => setSidebarOpen(false)}>
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* Tenant info */}
        {tenant && (
          <div className='px-6 py-4 border-b border-gray-100'>
            <p className='text-xs text-gray-500 uppercase tracking-wide font-medium'>Negocio</p>
            <p className='text-sm font-semibold text-gray-900 mt-0.5 truncate'>{tenant.name}</p>
            <a
              href={`/book/${tenant.slug}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 mt-1'
            >
              Ver página pública <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        )}

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
              `}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className='w-5 h-5 flex-shrink-0' />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className='px-3 py-4 border-t border-gray-200'>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div className='w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0'>
              <span className='text-primary-700 text-sm font-semibold'>
                {user?.first_name?.[0] || user?.username?.[0] || '?'}
              </span>
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-gray-900 truncate'>
                {user?.first_name} {user?.last_name}
              </p>
              <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors'
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
          <span className='font-semibold text-gray-900'>BookingPro</span>
        </header>
        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
