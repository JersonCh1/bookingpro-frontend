import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

import DashboardLayout from './components/layout/DashboardLayout'
import Overview    from './pages/dashboard/Overview'
import Bookings    from './pages/dashboard/Bookings'
import Services    from './pages/dashboard/Services'
import Staff       from './pages/dashboard/Staff'
import Scheduling  from './pages/dashboard/Scheduling'
import Settings    from './pages/dashboard/Settings'
import Customers   from './pages/dashboard/Customers'
import Analytics   from './pages/dashboard/Analytics'

import BookingPage    from './pages/public/BookingPage'
import MyBookings     from './pages/public/MyBookings'
import CancelBooking  from './pages/public/CancelBooking'
import RateBooking    from './pages/public/RateBooking'
import Landing              from './pages/Landing'
import TermsAndConditions  from './pages/TermsAndConditions'
import NotFound            from './pages/NotFound'

import SuperAdminLayout        from './pages/superadmin/SuperAdminLayout'
import SuperAdminOverview      from './pages/superadmin/SuperAdminOverview'
import SuperAdminBusinesses    from './pages/superadmin/SuperAdminBusinesses'
import SuperAdminPayments      from './pages/superadmin/SuperAdminPayments'
import SuperAdminBookings      from './pages/superadmin/SuperAdminBookings'
import SuperAdminCommunications from './pages/superadmin/SuperAdminCommunications'
import SuperAdminSettings      from './pages/superadmin/SuperAdminSettings'

function RedirectToBook() {
  const { slug } = useParams()
  return <Navigate to={`/book/${slug}`} replace />
}

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to='/login' replace />
}

function PublicRoute({ children }) {
  const { token } = useAuthStore()
  return !token ? children : <Navigate to='/dashboard' replace />
}

function SuperAdminRoute({ children }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to='/login' replace />
  const allowed = user?.is_staff || user?.email?.includes('echurapacci')
  if (!allowed) return <Navigate to='/dashboard' replace />
  return children
}

function AppInner() {
  const { token } = useAuthStore()
  const location = useLocation()

  return (
    <div key={location.pathname} style={{ animation: 'fade-slide-up 0.15s ease both' }}>
      <Routes>
        {/* Páginas públicas sin auth */}
        <Route path='/book/:slug'      element={<BookingPage />} />
        <Route path='/b/:slug'         element={<RedirectToBook />} />
        <Route path='/mis-reservas'    element={<MyBookings />} />
        <Route path='/cancelar/:token' element={<CancelBooking />} />
        <Route path='/valorar/:token'  element={<RateBooking />} />
        <Route path='/terminos'        element={<TermsAndConditions />} />

        {/* Públicas (redirigen a dashboard si ya está logueado) */}
        <Route path='/'         element={<PublicRoute><Landing /></PublicRoute>} />
        <Route path='/login'    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />

        {/* Dashboard (requiere auth) */}
        <Route path='/dashboard' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index               element={<Overview />} />
          <Route path='bookings'     element={<Bookings />} />
          <Route path='services'     element={<Services />} />
          <Route path='staff'        element={<Staff />} />
          <Route path='scheduling'   element={<Scheduling />} />
          <Route path='customers'    element={<Customers />} />
          <Route path='analytics'    element={<Analytics />} />
          <Route path='settings'     element={<Settings />} />
        </Route>

        {/* Super Admin (requiere is_staff=true) */}
        <Route path='/superadmin' element={<SuperAdminRoute><SuperAdminLayout /></SuperAdminRoute>}>
          <Route index                    element={<SuperAdminOverview />} />
          <Route path='businesses'        element={<SuperAdminBusinesses />} />
          <Route path='payments'          element={<SuperAdminPayments />} />
          <Route path='bookings'          element={<SuperAdminBookings />} />
          <Route path='communications'    element={<SuperAdminCommunications />} />
          <Route path='settings'          element={<SuperAdminSettings />} />
        </Route>

        {/* 404 — catch-all */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  )
}
