import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

import BookingPage  from './pages/public/BookingPage'
import LandingPage  from './pages/public/LandingPage'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to='/login' replace />
}

function PublicRoute({ children }) {
  const { token } = useAuthStore()
  return !token ? children : <Navigate to='/dashboard' replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login'    element={<PublicRoute><Login /></PublicRoute>} />
        <Route path='/register' element={<PublicRoute><Register /></PublicRoute>} />

        <Route path='/dashboard' element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index                   element={<Overview />} />
          <Route path='bookings'         element={<Bookings />} />
          <Route path='services'         element={<Services />} />
          <Route path='staff'            element={<Staff />} />
          <Route path='scheduling'       element={<Scheduling />} />
          <Route path='settings'         element={<Settings />} />
        </Route>

        <Route path='/book/:slug' element={<BookingPage />} />
        <Route path='/'        element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path='*'        element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
