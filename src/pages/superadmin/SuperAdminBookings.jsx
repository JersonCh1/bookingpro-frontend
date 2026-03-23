import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { Calendar, Download } from 'lucide-react'

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
    <span className='inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full'
      style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

const DATE_PRESETS = [
  { label: 'Hoy', fn: () => { const d = new Date().toISOString().slice(0,10); return { from: d, to: d } } },
  { label: 'Esta semana', fn: () => {
    const now = new Date(); const mon = new Date(now); mon.setDate(now.getDate() - now.getDay() + 1)
    return { from: mon.toISOString().slice(0,10), to: now.toISOString().slice(0,10) }
  }},
  { label: 'Este mes', fn: () => {
    const now = new Date()
    return { from: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`, to: now.toISOString().slice(0,10) }
  }},
]

export default function SuperAdminBookings() {
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ tenant_id: '', status: '', date_from: '', date_to: '' })

  const { data: tenants = [] } = useQuery({
    queryKey: ['admin-tenants', {}],
    queryFn:  () => adminApi.tenants().then(r => r.data.data),
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-bookings', page, filters],
    queryFn:  () => adminApi.bookings({ page, ...filters }).then(r => r.data.data),
    keepPreviousData: true,
  })

  const bookings   = data?.results ?? []
  const totalPages = data?.pages   ?? 1
  const total      = data?.count   ?? 0
  const completed  = data?.completed ?? 0
  const cancelled  = data?.cancelled ?? 0
  const noShow     = data?.no_show   ?? 0
  const rate       = total > 0 ? ((completed / total) * 100).toFixed(0) : 0

  function exportCSV() {
    const headers = ['Negocio','Cliente','Teléfono','Servicio','Fecha','Hora','Estado','Precio']
    const rows = bookings.map(b => [
      b.tenant_name, b.customer_name, b.customer_phone,
      b.service_name, b.date, b.start_time?.slice(0,5), b.status, b.service_price,
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `reservas-${new Date().toISOString().slice(0,10)}.csv`
    a.click()
  }

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Reservas globales</h1>
          <p className='text-gray-500 text-sm mt-0.5'>{total} reservas en el sistema</p>
        </div>
        <button onClick={exportCSV}
          className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50 transition-colors'>
          <Download className='w-4 h-4' /> Exportar CSV
        </button>
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className='grid grid-cols-4 gap-3'>
          {[
            { label: 'Total',       value: total,     color: '#6366f1' },
            { label: 'Completadas', value: completed, color: '#22c55e' },
            { label: 'Canceladas',  value: cancelled, color: '#ef4444' },
            { label: 'Tasa compl.', value: `${rate}%`,color: '#f59e0b' },
          ].map(c => (
            <div key={c.label} className='bg-white rounded-xl p-3 border border-gray-100 text-center shadow-sm'>
              <p className='text-xl font-bold' style={{ color: c.color }}>{c.value}</p>
              <p className='text-xs text-gray-500 mt-0.5'>{c.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
      <div className='bg-white rounded-2xl p-4 border border-gray-100 space-y-3'>
        <div className='flex flex-wrap gap-2'>
          <select className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none flex-1' style={{ minWidth: 160 }}
            value={filters.tenant_id}
            onChange={e => { setFilters(f => ({ ...f, tenant_id: e.target.value })); setPage(1) }}>
            <option value=''>Todos los negocios</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none'
            value={filters.status}
            onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1) }}>
            <option value=''>Todos los estados</option>
            <option value='pending'>Pendiente</option>
            <option value='confirmed'>Confirmada</option>
            <option value='completed'>Completada</option>
            <option value='cancelled'>Cancelada</option>
            <option value='no_show'>No se presentó</option>
          </select>
          <input type='date' value={filters.date_from}
            onChange={e => { setFilters(f => ({ ...f, date_from: e.target.value })); setPage(1) }}
            className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none' />
          <input type='date' value={filters.date_to}
            onChange={e => { setFilters(f => ({ ...f, date_to: e.target.value })); setPage(1) }}
            className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none' />
        </div>
        <div className='flex gap-2'>
          {DATE_PRESETS.map(p => (
            <button key={p.label}
              onClick={() => { const r = p.fn(); setFilters(f => ({ ...f, date_from: r.from, date_to: r.to })); setPage(1) }}
              className='text-xs font-medium px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'>
              {p.label}
            </button>
          ))}
          {(filters.tenant_id || filters.status || filters.date_from || filters.date_to) && (
            <button onClick={() => { setFilters({ tenant_id: '', status: '', date_from: '', date_to: '' }); setPage(1) }}
              className='text-xs text-gray-400 hover:text-gray-600 px-2'>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className='space-y-2'>
          {[...Array(6)].map((_, i) => <div key={i} className='h-12 rounded-xl bg-gray-100 animate-pulse' />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
          <Calendar className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No hay reservas con estos filtros</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/60'>
                  {['Negocio', 'Cliente', 'Servicio', 'Fecha', 'Estado', 'Precio'].map(h => (
                    <th key={h} className='text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {bookings.map(b => (
                  <tr key={b.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-3'>
                      <a href={`/book/${b.tenant_slug}`} target='_blank' rel='noopener noreferrer'
                        className='font-semibold text-gray-900 hover:text-red-600 transition-colors'>
                        {b.tenant_name}
                      </a>
                    </td>
                    <td className='px-4 py-3'>
                      <p className='text-gray-700'>{b.customer_name}</p>
                      {b.customer_phone && <p className='text-xs text-gray-400'>{b.customer_phone}</p>}
                    </td>
                    <td className='px-4 py-3 text-gray-600 text-xs'>{b.service_name}</td>
                    <td className='px-4 py-3'>
                      <p className='text-gray-900 text-xs'>{new Date(b.date + 'T12:00').toLocaleDateString('es-PE')}</p>
                      <p className='text-xs text-gray-400'>{b.start_time?.slice(0,5)}</p>
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
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'>
            ← Anterior
          </button>
          <span className='text-sm text-gray-500'>
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
