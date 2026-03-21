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

import BookingPage from './pages/public/BookingPage'
import Landing     from './pages/Landing'
import NotFound    from './pages/NotFound'

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

function AppInner() {
  const { token } = useAuthStore()
  const location = useLocation()

  return (
    <div key={location.pathname} style={{ animation: 'fade-slide-up 0.15s ease both' }}>
      <Routes>
        {/* Página pública de reservas (sin auth) — primero para evitar conflictos */}
        <Route path='/book/:slug' element={<BookingPage />} />
        {/* Redirect de ruta vieja /b/:slug → /book/:slug */}
        <Route path='/b/:slug' element={<RedirectToBook />} />

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
          <Route path='settings'     element={<Settings />} />
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
