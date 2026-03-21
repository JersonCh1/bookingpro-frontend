import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { Store, CheckCircle, Calendar, TrendingUp } from 'lucide-react'

const GOLD = '#D4AF37'

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
      <div className='inline-flex p-2.5 rounded-xl mb-3'
        style={{ backgroundColor: color + '15' }}>
        <Icon className='w-5 h-5' style={{ color }} />
      </div>
      <p className='text-2xl font-bold text-gray-900 leading-none'>{value ?? '—'}</p>
      <p className='text-sm font-medium text-gray-700 mt-1'>{title}</p>
      {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
  )
}

function SkeletonCard() {
  return <div className='h-32 rounded-2xl bg-gray-100 animate-pulse' />
}

export default function SuperAdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn:  () => adminApi.stats().then(r => r.data.data),
    refetchInterval: 30000,
  })

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Resumen del sistema</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Métricas globales de AgendaYa</p>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Negocios registrados'
            value={data?.total_tenants}
            subtitle='Desde el lanzamiento'
            icon={Store}
            color='#6366f1'
          />
          <StatCard
            title='Negocios activos'
            value={data?.active_tenants}
            subtitle={`${data?.total_tenants - data?.active_tenants || 0} bloqueados`}
            icon={CheckCircle}
            color='#22c55e'
          />
          <StatCard
            title='Reservas totales'
            value={data?.total_bookings}
            subtitle='En todo el sistema'
            icon={Calendar}
            color='#3b82f6'
          />
          <StatCard
            title='Ingreso estimado'
            value={data?.total_revenue_estimate != null ? `S/. ${data.total_revenue_estimate}` : '—'}
            subtitle='Negocios activos × S/. 69'
            icon={TrendingUp}
            color={GOLD}
          />
        </div>
      )}

      {/* Info badge */}
      <div className='rounded-2xl p-5 flex items-start gap-4'
        style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
        <span className='text-2xl'>⚡</span>
        <div>
          <p className='font-bold text-amber-900 text-sm'>Panel de Super Administrador</p>
          <p className='text-xs text-amber-700 mt-1'>
            Desde aquí puedes gestionar todos los negocios registrados en AgendaYa.
            Los cambios son inmediatos y permanentes. Procede con cuidado.
          </p>
        </div>
      </div>
    </div>
  )
}
