import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../../api/bookings'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Calendar, CheckCircle, DollarSign } from 'lucide-react'

const RED  = '#C0392B'
const COLORS = ['#C0392B','#E67E22','#F1C40F','#27AE60','#2980B9','#9B59B6','#1ABC9C']

function DiffBadge({ current, prev }) {
  if (!prev && !current) return null
  const pct = prev > 0 ? Math.round((current - prev) / prev * 100) : null
  if (pct === null) return null
  const up  = pct >= 0
  return (
    <span className='inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded-full ml-2'
      style={{ backgroundColor: up ? '#f0fdf4' : '#fef2f2', color: up ? '#166534' : '#991b1b' }}>
      {up ? <TrendingUp className='w-3 h-3' /> : <TrendingDown className='w-3 h-3' />}
      {Math.abs(pct)}%
    </span>
  )
}

export default function Analytics() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn:  () => bookingsApi.analytics().then(r => r.data.data),
  })

  if (isLoading) return (
    <div className='space-y-4 animate-pulse'>
      <div className='h-8 rounded bg-gray-100 w-48' />
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {[...Array(4)].map((_, i) => <div key={i} className='h-28 rounded-2xl bg-gray-100' />)}
      </div>
      <div className='h-56 rounded-2xl bg-gray-100' />
    </div>
  )

  const tm = data?.this_month_stats  || {}
  const lm = data?.last_month_stats  || {}

  const statCards = [
    { label: 'Reservas este mes',     value: tm.total,              prev: lm.total,              icon: Calendar,     color: '#6366f1' },
    { label: 'Ingresos este mes',     value: `S/. ${(tm.revenue||0).toFixed(0)}`, prev: lm.revenue, icon: DollarSign, color: '#22c55e', isRevenue: true },
    { label: 'Clientes nuevos',       value: tm.new_customers,      prev: lm.new_customers,      icon: Users,        color: '#f59e0b' },
    { label: 'Tasa de completado',    value: `${tm.completion_rate || 0}%`, prev: lm.completion_rate, icon: CheckCircle, color: RED, isRate: true },
  ]

  const byDay     = data?.bookings_by_day       || []
  const byService = data?.bookings_by_service   || []
  const byHour    = data?.bookings_by_hour      || []
  const topCustomers = data?.top_customers      || []

  // Prepare pie data
  const pieData = byService.slice(0, 6).map((s, i) => ({
    name:  s.name,
    value: s.count,
    color: COLORS[i % COLORS.length],
  }))

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Estadísticas</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Rendimiento de tu negocio</p>
      </div>

      {/* Cards resumen */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
        {statCards.map(c => {
          const Icon = c.icon
          const pctPrev = c.isRevenue ? lm.revenue : c.isRate ? lm.completion_rate : (typeof c.prev === 'number' ? c.prev : null)
          const currNum = c.isRevenue ? tm.revenue : c.isRate ? tm.completion_rate : tm[c.label]
          return (
            <div key={c.label} className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
              <div className='inline-flex p-2 rounded-xl mb-2' style={{ backgroundColor: c.color + '15' }}>
                <Icon className='w-4 h-4' style={{ color: c.color }} />
              </div>
              <div className='flex items-center flex-wrap'>
                <p className='text-xl font-black text-gray-900'>{c.value ?? '—'}</p>
                <DiffBadge current={currNum} prev={pctPrev} />
              </div>
              <p className='text-xs text-gray-500 mt-0.5'>{c.label}</p>
              {typeof c.prev === 'number' && (
                <p className='text-[10px] text-gray-400 mt-0.5'>mes pasado: {c.isRevenue ? `S/. ${(c.prev||0).toFixed(0)}` : c.isRate ? `${c.prev||0}%` : c.prev}</p>
              )}
            </div>
          )
        })}
      </div>

      {/* Gráfico de barras — reservas por día */}
      {byDay.length > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <h2 className='text-sm font-bold text-gray-700 mb-4'>Reservas por día — últimos 30 días</h2>
          <ResponsiveContainer width='100%' height={200}>
            <BarChart data={byDay} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
              <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickFormatter={d => d?.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} width={24} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                formatter={v => [v, 'Reservas']} />
              <Bar dataKey='count' fill={RED} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
        {/* Pie de servicios */}
        {pieData.length > 0 && (
          <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
            <h2 className='text-sm font-bold text-gray-700 mb-4'>Servicios más populares</h2>
            <ResponsiveContainer width='100%' height={200}>
              <PieChart>
                <Pie data={pieData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={75} label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend iconSize={10} iconType='circle' formatter={(v) => <span style={{ fontSize: 11, color: '#6b7280' }}>{v}</span>} />
                <Tooltip formatter={(v, n) => [v, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Horas pico */}
        {byHour.length > 0 && (
          <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
            <h2 className='text-sm font-bold text-gray-700 mb-4'>Horas pico</h2>
            <div className='space-y-3'>
              {byHour.map((h, i) => {
                const maxCount = byHour[0]?.count || 1
                const width    = Math.round(h.count / maxCount * 100)
                const [hr, min] = h.hour.split(':').map(Number)
                const ampm = hr < 12 ? 'AM' : 'PM'
                const h12  = hr % 12 || 12
                return (
                  <div key={i} className='flex items-center gap-3'>
                    <span className='text-sm font-bold text-gray-700 w-16 flex-shrink-0'>{h12}:{String(min).padStart(2,'0')} {ampm}</span>
                    <div className='flex-1 bg-gray-100 rounded-full h-3 overflow-hidden'>
                      <div className='h-full rounded-full transition-all' style={{ width: `${width}%`, backgroundColor: RED }} />
                    </div>
                    <span className='text-sm font-bold text-gray-700 w-8 text-right'>{h.count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top clientes */}
      {topCustomers.length > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <h2 className='text-sm font-bold text-gray-700 mb-4'>Top 5 clientes más frecuentes</h2>
          <div className='space-y-2'>
            {topCustomers.map((c, i) => (
              <div key={i} className='flex items-center gap-3 py-2 border-b border-gray-50 last:border-0'>
                <span className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0'
                  style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#b45309' : '#d1d5db', color: i <= 2 ? 'white' : '#6b7280' }}>
                  {i + 1}
                </span>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold text-gray-800 truncate'>{c.name}</p>
                  <p className='text-xs text-gray-400'>{c.phone}</p>
                </div>
                <span className='text-sm font-bold text-gray-700 flex-shrink-0'>
                  {c.visits} cita{c.visits !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
