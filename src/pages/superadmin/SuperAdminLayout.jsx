import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  LayoutDashboard, Store, Users, Calendar,
  LogOut, Menu, X, ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'
import { SidebarLogo } from '../../components/ui/Logo'

const GOLD = '#D4AF37'
const GOLD_DIM = 'rgba(212,175,55,0.12)'

const NAV_ITEMS = [
  { to: '/superadmin',           label: 'Resumen',          icon: LayoutDashboard, end: true },
  { to: '/superadmin/businesses',label: 'Negocios',         icon: Store },
  { to: '/superadmin/bookings',  label: 'Reservas globales',icon: Calendar },
]

export default function SuperAdminLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useAuthStore()
  const logout   = useLogout()
  const navigate = useNavigate()

  return (
    <div className='flex h-screen overflow-hidden' style={{ backgroundColor: '#0A0A0A' }}>

      {open && (
        <div className='fixed inset-0 z-20 bg-black/70 lg:hidden backdrop-blur-sm'
          onClick={() => setOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-200
          lg:static lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#0D0D0D', borderRight: `1px solid ${GOLD}22` }}
      >
        {/* Header */}
        <div className='flex items-center justify-between h-16 px-4'
          style={{ borderBottom: `1px solid ${GOLD}22` }}>
          <div className='flex items-center gap-2'>
            <SidebarLogo />
          </div>
          <button className='lg:hidden p-1.5 rounded-lg' style={{ color: '#555' }}
            onClick={() => setOpen(false)}>
            <X className='w-4 h-4' />
          </button>
        </div>

        {/* Badge superadmin */}
        <div className='px-4 py-3' style={{ borderBottom: `1px solid ${GOLD}22` }}>
          <span className='inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full'
            style={{ backgroundColor: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD}44` }}>
            ⚡ Super Admin
          </span>
          <p className='text-xs mt-1.5 font-medium' style={{ color: '#666' }}>
            {user?.first_name} {user?.last_name}
          </p>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-2 py-3 space-y-0.5 overflow-y-auto'>
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`
              }
              style={({ isActive }) => isActive
                ? { backgroundColor: GOLD_DIM, borderLeft: `2px solid ${GOLD}` }
                : { borderLeft: '2px solid transparent' }
              }
            >
              <Icon className='w-4 h-4 flex-shrink-0' />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className='px-2 py-3 space-y-1' style={{ borderTop: `1px solid ${GOLD}22` }}>
          <button onClick={() => navigate('/dashboard')}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all'
            style={{ color: '#555' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.backgroundColor = '#1A1A1A' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <ArrowLeft className='w-4 h-4' />
            Volver al dashboard
          </button>
          <button onClick={logout}
            className='flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all'
            style={{ color: '#555' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E74C3C'; e.currentTarget.style.backgroundColor = '#1A1A1A' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#555'; e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <LogOut className='w-4 h-4' />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className='flex-1 flex flex-col min-w-0 overflow-auto bg-gray-50'>
        {/* Mobile header */}
        <header className='lg:hidden flex items-center h-14 px-4 gap-3'
          style={{ backgroundColor: '#0D0D0D', borderBottom: `1px solid ${GOLD}22` }}>
          <button onClick={() => setOpen(true)} className='p-2 rounded-lg' style={{ color: '#888' }}>
            <Menu className='w-5 h-5' />
          </button>
          <span className='text-sm font-bold' style={{ color: GOLD }}>Super Admin</span>
        </header>

        <main className='flex-1 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
