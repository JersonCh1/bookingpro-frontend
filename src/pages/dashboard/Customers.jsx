import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { bookingsApi } from '../../api/bookings'
import { Users, Phone, Calendar, Star, MessageSquare, X } from 'lucide-react'

const STATUS_MAP = {
  pending:   { label: 'Pendiente',  color: '#92400e', bg: '#fffbeb' },
  confirmed: { label: 'Confirmada', color: '#1e40af', bg: '#eff6ff' },
  completed: { label: 'Completada', color: '#166534', bg: '#f0fdf4' },
  cancelled: { label: 'Cancelada',  color: '#991b1b', bg: '#fef2f2' },
  no_show:   { label: 'No asistió', color: '#9a3412', bg: '#fff7ed' },
}

const MONTHS = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic']
function fmtDate(s) {
  if (!s) return '—'
  const [y, m, d] = s.split('-')
  return `${d} ${MONTHS[parseInt(m) - 1]} ${y}`
}

export default function Customers() {
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [sortBy, setSortBy]     = useState('last_visit') // last_visit | total_bookings

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', search],
    queryFn:  () => bookingsApi.customers({ search }).then(r => r.data.data),
    keepPreviousData: true,
  })

  const sorted = [...customers].sort((a, b) => {
    if (sortBy === 'last_visit') return (b.last_visit || '') > (a.last_visit || '') ? 1 : -1
    return b.total_bookings - a.total_bookings
  })

  return (
    <div className='space-y-5'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Clientes</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Historial de tus clientes</p>
      </div>

      {/* Filtros */}
      <div className='flex items-center gap-3'>
        <div className='relative flex-1'>
          <Users className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
          <input type='text' value={search} onChange={e => setSearch(e.target.value)}
            placeholder='Buscar por nombre o teléfono...'
            className='w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-200' />
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className='px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none'>
          <option value='last_visit'>Última visita</option>
          <option value='total_bookings'>Más citas</option>
        </select>
      </div>

      {isLoading ? (
        <div className='space-y-2 animate-pulse'>
          {[...Array(5)].map((_, i) => <div key={i} className='h-16 rounded-xl bg-gray-100' />)}
        </div>
      ) : sorted.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
          <Users className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No se encontraron clientes</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/60'>
                  {['Cliente', 'Teléfono', 'Última visita', 'Nº citas', 'Total gastado', ''].map(h => (
                    <th key={h} className='text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {sorted.map(c => (
                  <tr key={c.phone} className='hover:bg-gray-50/60 transition-colors cursor-pointer'
                    onClick={() => setSelected(c)}>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-2'>
                        <div className='w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0'
                          style={{ backgroundColor: '#C0392B' }}>
                          {c.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className='font-semibold text-gray-900'>{c.name}</p>
                          {c.total_bookings >= 5 && (
                            <span className='text-[10px] font-bold px-1.5 py-0.5 rounded-full' style={{ backgroundColor: '#fef9c3', color: '#92400e' }}>
                              ⭐ Cliente frecuente
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-3 text-gray-600'>{c.phone}</td>
                    <td className='px-4 py-3 text-gray-600 text-xs'>{fmtDate(c.last_visit)}</td>
                    <td className='px-4 py-3'>
                      <span className='font-bold text-gray-900'>{c.total_bookings}</span>
                    </td>
                    <td className='px-4 py-3 font-semibold text-gray-900'>
                      S/. {c.total_spent.toFixed(2)}
                    </td>
                    <td className='px-4 py-3'>
                      <button
                        onClick={e => { e.stopPropagation(); setSelected(c) }}
                        className='text-xs text-gray-400 hover:text-gray-700'>
                        Ver →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal detalle cliente */}
      {selected && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
          <div className='bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col'>
            <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white' style={{ backgroundColor: '#C0392B' }}>
                  {selected.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className='font-bold text-gray-900'>{selected.name}</p>
                  <p className='text-xs text-gray-500'>{selected.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className='p-1.5 rounded-lg hover:bg-gray-100'>
                <X className='w-5 h-5 text-gray-400' />
              </button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-0 border-b border-gray-100'>
              {[
                { label: 'Visitas', value: selected.total_bookings, icon: Calendar },
                { label: 'Gastado',  value: `S/. ${selected.total_spent.toFixed(0)}`, icon: Star },
                { label: 'Última',   value: fmtDate(selected.last_visit), icon: Clock2 },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className='px-4 py-3 text-center border-r last:border-r-0 border-gray-100'>
                  <p className='text-lg font-black text-gray-900'>{value}</p>
                  <p className='text-xs text-gray-400 mt-0.5'>{label}</p>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className='flex-1 overflow-y-auto p-5 space-y-2'>
              <p className='text-xs font-bold text-gray-400 uppercase tracking-wide mb-3'>Historial de visitas</p>
              {selected.visits.map(v => {
                const s = STATUS_MAP[v.status] ?? STATUS_MAP.pending
                return (
                  <div key={v.id} className='flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0'>
                    <div className='w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0'
                      style={{ backgroundColor: s.bg }}>
                      <Calendar className='w-3.5 h-3.5' style={{ color: s.color }} />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-gray-800 truncate'>{v.service_name}</p>
                      <p className='text-xs text-gray-400'>{fmtDate(v.date)} · {v.start_time?.slice(0,5)}</p>
                    </div>
                    <div className='text-right flex-shrink-0'>
                      <p className='text-xs font-bold text-gray-900'>S/. {parseFloat(v.service_price).toFixed(0)}</p>
                      <span className='text-[10px] font-semibold px-1.5 py-0.5 rounded-full' style={{ backgroundColor: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* WhatsApp */}
            <div className='px-5 py-4 border-t border-gray-100'>
              <a
                href={`https://wa.me/${selected.phone.replace(/\D/g, '').replace(/^0/, '51')}`}
                target='_blank' rel='noopener noreferrer'
                className='flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white'
                style={{ backgroundColor: '#25D366' }}>
                <MessageSquare className='w-4 h-4' /> Enviar WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper icon
function Clock2({ className, style }) {
  return <Calendar className={className} style={style} />
}
