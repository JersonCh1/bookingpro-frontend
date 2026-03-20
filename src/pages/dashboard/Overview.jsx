import { Calendar, CheckCircle, Clock, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStats } from '../../hooks/useBookings'
import { useAuthStore } from '../../store/authStore'
import { StatusBadge } from '../../components/ui/Badge'
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers'

function StatCard({ title, value, subtitle, icon: Icon, colorClass }) {
  return (
    <div className='card p-5'>
      <div className={`inline-flex p-2.5 rounded-xl mb-3 ${colorClass}`}>
        <Icon className='w-5 h-5' />
      </div>
      <p className='text-2xl font-bold text-gray-900 leading-none'>{value}</p>
      <p className='text-sm font-medium text-gray-700 mt-1'>{title}</p>
      {subtitle && <p className='text-xs text-gray-400 mt-0.5'>{subtitle}</p>}
    </div>
  )
}

function SkeletonCard() {
  return <div className='card p-5 h-28 animate-pulse bg-gray-50' />
}

export default function Overview() {
  const { data: stats, isLoading } = useStats()
  const { tenant } = useAuthStore()

  const todayTotal   = stats?.today?.total ?? 0
  const todayPending = stats?.today?.by_status?.pending   ?? 0
  const weekTotal    = stats?.week?.total   ?? 0
  const monthRevenue = stats?.month?.revenue ?? 0

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 19) return 'Buenas tardes'
    return 'Buenas noches'
  })()

  return (
    <div className='space-y-6'>

      {/* Cabecera con bienvenida */}
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {greeting}{tenant?.name ? `, ${tenant.name}` : ''}
          </h1>
          <p className='text-gray-500 text-sm mt-0.5'>
            {new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        {tenant?.slug && (
          <a
            href={`/b/${tenant.slug}`}
            target='_blank'
            rel='noopener noreferrer'
            className='hidden sm:inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium whitespace-nowrap'
          >
            Ver página pública <ExternalLink className='w-3.5 h-3.5' />
          </a>
        )}
      </div>

      {/* Tarjetas de estadísticas */}
      {isLoading ? (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          <StatCard
            title='Citas hoy'
            value={todayTotal}
            subtitle={todayPending > 0 ? `${todayPending} pendientes` : 'Todo confirmado'}
            icon={Calendar}
            colorClass='bg-blue-50 text-blue-600'
          />
          <StatCard
            title='Esta semana'
            value={weekTotal}
            subtitle='Reservas acumuladas'
            icon={Clock}
            colorClass='bg-purple-50 text-purple-600'
          />
          <StatCard
            title='Completadas mes'
            value={stats?.month?.by_status?.completed ?? 0}
            subtitle={`de ${stats?.month?.total ?? 0} reservas`}
            icon={CheckCircle}
            colorClass='bg-green-50 text-green-600'
          />
          <StatCard
            title='Ingresos del mes'
            value={formatCurrency(monthRevenue)}
            subtitle='Citas completadas'
            icon={TrendingUp}
            colorClass='bg-yellow-50 text-yellow-600'
          />
        </div>
      )}

      {/* Próximas 5 reservas */}
      <div className='card'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='font-semibold text-gray-900'>Próximas reservas</h2>
          <Link
            to='/dashboard/bookings'
            className='text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1'
          >
            Ver todas <ArrowRight className='w-3.5 h-3.5' />
          </Link>
        </div>

        {isLoading ? (
          <div className='divide-y divide-gray-50'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='px-6 py-4 flex gap-4 animate-pulse'>
                <div className='w-10 h-10 rounded-full bg-gray-100 flex-shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='h-3.5 bg-gray-100 rounded w-1/3' />
                  <div className='h-3 bg-gray-100 rounded w-1/4' />
                </div>
              </div>
            ))}
          </div>
        ) : !stats?.upcoming?.length ? (
          <div className='px-6 py-12 text-center'>
            <Calendar className='w-10 h-10 text-gray-200 mx-auto mb-3' />
            <p className='text-gray-400 text-sm'>No hay reservas próximas</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-50'>
            {stats.upcoming.map(b => (
              <div key={b.id} className='px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors'>
                {/* Avatar + info */}
                <div className='flex items-center gap-3 min-w-0'>
                  <div className='w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0'>
                    <span className='text-primary-700 font-semibold text-sm'>
                      {b.customer_name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className='min-w-0'>
                    <p className='font-medium text-gray-900 text-sm truncate'>{b.customer_name}</p>
                    <p className='text-gray-400 text-xs truncate'>{b.service_name}</p>
                  </div>
                </div>

                {/* Fecha + hora + estado */}
                <div className='flex items-center gap-3 flex-shrink-0 ml-2'>
                  <div className='text-right hidden sm:block'>
                    <p className='text-sm font-medium text-gray-900'>{formatDate(b.date)}</p>
                    <p className='text-xs text-gray-400'>{formatTime(b.start_time)}</p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
