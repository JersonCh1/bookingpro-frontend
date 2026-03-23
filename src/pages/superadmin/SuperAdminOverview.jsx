import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { adminApi } from '../../api/admin'
import {
  Store, CheckCircle, Calendar, TrendingUp,
  Clock, XCircle, AlertTriangle, UserPlus,
} from 'lucide-react'

const GOLD = '#D4AF37'
const RED  = '#C0392B'

function StatCard({ title, value, subtitle, icon: Icon, color, to }) {
  const inner = (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5 transform duration-150'>
      <div className='inline-flex p-2.5 rounded-xl mb-3' style={{ backgroundColor: color + '18' }}>
        <Icon className='w-5 h-5' style={{ color }} />
      </div>
      <p className='text-2xl font-bold text-gray-900 leading-none'>{value ?? '—'}</p>
      <p className='text-sm font-medium text-gray-700 mt-1'>{title}</p>
      {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
  )
  return to ? <Link to={to}>{inner}</Link> : inner
}

function AlertCard({ children, type }) {
  const styles = {
    red:    { bg: '#fef2f2', border: '#fecaca', color: '#991b1b' },
    yellow: { bg: '#fffbeb', border: '#fde68a', color: '#92400e' },
    green:  { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
  }
  const s = styles[type] || styles.green
  return (
    <div className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium'
      style={{ backgroundColor: s.bg, border: `1px solid ${s.border}`, color: s.color }}>
      {children}
    </div>
  )
}

export default function SuperAdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminApi.stats().then(r => r.data.data),
    refetchInterval: 30000,
  })

  const { data: paySummary } = useQuery({
    queryKey: ['admin-payments-summary'],
    queryFn:  () => adminApi.paymentsSummary().then(r => r.data.data),
  })

  if (isLoading) return (
    <div className='space-y-4'>
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        {[...Array(6)].map((_, i) => <div key={i} className='h-32 rounded-2xl bg-gray-100 animate-pulse' />)}
      </div>
    </div>
  )

  const regData  = data?.registrations_by_day || []
  const bookData = data?.bookings_by_day || []

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Resumen del sistema</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Métricas globales de AgendaYa</p>
      </div>

      {/* FILA 1 — 6 stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4'>
        <StatCard title='Negocios registrados' value={data?.total_tenants}
          subtitle='Total histórico' icon={Store} color='#6366f1' />
        <StatCard title='Negocios activos' value={data?.active_tenants}
          subtitle='Suscripción pagada' icon={CheckCircle} color='#22c55e'
          to='/superadmin/businesses?status=active' />
        <StatCard title='En trial' value={data?.trial_tenants}
          subtitle='Primeros 7 días' icon={Clock} color='#f59e0b'
          to='/superadmin/businesses?status=trial' />
        <StatCard title='Bloqueados' value={data?.blocked_tenants}
          subtitle='Suspendidos manualmente' icon={XCircle} color='#6b7280'
          to='/superadmin/businesses?status=blocked' />
        <StatCard title='Total reservas' value={data?.total_bookings}
          subtitle='En todo el sistema' icon={Calendar} color='#3b82f6' />
        <StatCard title='Ingreso registrado' value={`S/. ${(data?.total_revenue || 0).toFixed(0)}`}
          subtitle={`Estimado activos: S/. ${data?.total_revenue_estimate || 0}`}
          icon={TrendingUp} color={GOLD} to='/superadmin/payments' />
      </div>

      {/* FILA 2 — Alertas */}
      <div className='space-y-2'>
        {(data?.expired_tenants || 0) > 0 && (
          <AlertCard type='red'>
            <AlertTriangle className='w-4 h-4 flex-shrink-0' />
            <span>
              <strong>{data.expired_tenants}</strong> negocios con trial vencido sin pagar →{' '}
              <Link to='/superadmin/businesses?status=expired' className='underline'>Ver ahora</Link>
            </span>
          </AlertCard>
        )}
        {(data?.expiring_soon || 0) > 0 && (
          <AlertCard type='yellow'>
            <Clock className='w-4 h-4 flex-shrink-0' />
            <span>
              <strong>{data.expiring_soon}</strong> negocios con trial que vence en 2 días →{' '}
              <Link to='/superadmin/payments' className='underline'>Cobrar ahora</Link>
            </span>
          </AlertCard>
        )}
        {(data?.new_this_week || 0) > 0 && (
          <AlertCard type='green'>
            <UserPlus className='w-4 h-4 flex-shrink-0' />
            <strong>{data.new_this_week}</strong> nuevos registros esta semana
          </AlertCard>
        )}
      </div>

      {/* FILA 3 — Gráfico registros */}
      {regData.length > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <h2 className='text-sm font-bold text-gray-700 mb-4'>Nuevos registros — últimos 30 días</h2>
          <ResponsiveContainer width='100%' height={180}>
            <LineChart data={regData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
              <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} width={24} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [v, 'Registros']}
                labelFormatter={l => `Fecha: ${l}`}
              />
              <Line type='monotone' dataKey='count' stroke={RED} strokeWidth={2.5}
                dot={{ r: 3, fill: RED }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* FILA 4 — Gráfico reservas */}
      {bookData.length > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <h2 className='text-sm font-bold text-gray-700 mb-4'>Reservas del sistema — últimos 14 días</h2>
          <ResponsiveContainer width='100%' height={160}>
            <BarChart data={bookData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
              <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={d => d.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} width={24} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [v, 'Reservas']}
              />
              <Bar dataKey='count' fill={RED} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Ingresos por mes */}
      {(paySummary?.by_month?.length || 0) > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-sm font-bold text-gray-700'>Ingresos mensuales</h2>
            <span className='text-sm font-bold' style={{ color: GOLD }}>
              Total: S/. {(paySummary?.total_all_time || 0).toFixed(0)}
            </span>
          </div>
          <ResponsiveContainer width='100%' height={140}>
            <BarChart data={paySummary.by_month} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
              <XAxis dataKey='month' tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} width={40}
                tickFormatter={v => `S/.${v}`} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={(v) => [`S/. ${v}`, 'Ingresos']}
              />
              <Bar dataKey='total' fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className='rounded-2xl p-4 flex items-start gap-3'
        style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
        <span>⚡</span>
        <p className='text-xs text-amber-700'>
          <strong className='text-amber-900'>Panel de Super Admin</strong> — Los cambios son inmediatos y permanentes. Procede con cuidado.
        </p>
      </div>
    </div>
  )
}
