import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { Calendar } from 'lucide-react'

const STATUS_STYLES = {
  pending:   { bg: '#fffbeb', color: '#92400e', label: 'Pendiente' },
  confirmed: { bg: '#eff6ff', color: '#1e40af', label: 'Confirmada' },
  completed: { bg: '#f0fdf4', color: '#166534', label: 'Completada' },
  cancelled: { bg: '#fef2f2', color: '#991b1b', label: 'Cancelada' },
  no_show:   { bg: '#fff7ed', color: '#9a3412', label: 'No se presentó' },
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] ?? { bg: '#f3f4f6', color: '#374151', label: status }
  return (
    <span className='inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full'
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

export default function SuperAdminBookings() {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page],
    queryFn:  () => adminApi.bookings({ page }).then(r => r.data.data),
    keepPreviousData: true,
  })

  const bookings = data?.results ?? []
  const totalPages = data?.pages ?? 1

  return (
    <div className='space-y-5'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Reservas globales</h1>
        <p className='text-gray-500 text-sm mt-0.5'>
          Todas las reservas del sistema · {data?.count ?? 0} en total
        </p>
      </div>

      {isLoading ? (
        <div className='space-y-2'>
          {[...Array(6)].map((_, i) => <div key={i} className='h-14 rounded-xl bg-gray-100 animate-pulse' />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
          <Calendar className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No hay reservas en el sistema</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/60'>
                  {['Negocio', 'Cliente', 'Servicio', 'Fecha', 'Estado', 'Precio'].map(h => (
                    <th key={h} className='text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {bookings.map(b => (
                  <tr key={b.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-3'>
                      <p className='font-semibold text-gray-900'>{b.tenant_name}</p>
                    </td>
                    <td className='px-4 py-3 text-gray-700'>{b.customer_name}</td>
                    <td className='px-4 py-3 text-gray-600'>{b.service_name}</td>
                    <td className='px-4 py-3'>
                      <p className='text-gray-900'>{new Date(b.date + 'T12:00').toLocaleDateString('es-PE')}</p>
                      <p className='text-xs text-gray-400'>{b.start_time?.slice(0, 5)}</p>
                    </td>
                    <td className='px-4 py-3'><StatusBadge status={b.status} /></td>
                    <td className='px-4 py-3 font-semibold text-gray-900'>
                      S/. {parseFloat(b.service_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between bg-white rounded-2xl px-5 py-3 border border-gray-100'>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'>
            ← Anterior
          </button>
          <span className='text-sm text-gray-500'>
            Página <span className='font-bold text-gray-900'>{page}</span> de <span className='font-bold text-gray-900'>{totalPages}</span>
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
