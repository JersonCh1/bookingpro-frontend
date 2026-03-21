import { useState, useEffect } from 'react'
import { useBookings, useUpdateBookingStatus, useStaff } from '../../hooks/useBookings'
import { StatusBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { formatDate, formatTime, formatCurrency } from '../../utils/helpers'
import { Search, Calendar, Phone, CheckCircle, XCircle, Clock, UserX, User } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '',          label: 'Todos los estados' },
  { value: 'pending',   label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'completed', label: 'Completada' },
  { value: 'cancelled', label: 'Cancelada' },
  { value: 'no_show',   label: 'No se presentó' },
]

const STATUS_ACTIONS = [
  { value: 'confirmed', label: 'Confirmar',       icon: CheckCircle, className: 'text-green-600 hover:bg-green-50' },
  { value: 'completed', label: 'Completada',      icon: CheckCircle, className: 'text-gray-600 hover:bg-gray-100' },
  { value: 'cancelled', label: 'Cancelar',        icon: XCircle,     className: 'text-red-600 hover:bg-red-50' },
  { value: 'no_show',   label: 'No se presentó',  icon: UserX,       className: 'text-orange-600 hover:bg-orange-50' },
]

export default function Bookings() {
  const [filters, setFilters]   = useState({ status: '', search: '', date_from: '', date_to: '' })
  const [selected, setSelected] = useState(null)
  const [page, setPage]         = useState(1)

  const { data, isLoading }                        = useBookings({ ...filters, page })
  const { mutate: updateStatus, isPending: saving } = useUpdateBookingStatus()
  const { data: staffData }                         = useStaff()
  const staffList = Array.isArray(staffData) ? staffData : (staffData?.results ?? [])

  const bookings   = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.ceil(totalCount / 20)

  useEffect(() => { setPage(1) }, [filters])

  const handleStatusChange = (booking, newStatus) => {
    updateStatus(
      { id: booking.id, status: newStatus },
      { onSuccess: () => setSelected(prev => prev ? { ...prev, status: newStatus } : null) },
    )
  }

  return (
    <div className='space-y-5'>

      {/* Cabecera */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Reservas</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Gestiona todas las citas de tu negocio</p>
      </div>

      {/* Filtros */}
      <div className='card p-4'>
        <div className='flex flex-wrap gap-3'>
          {/* Búsqueda */}
          <div className='relative flex-1 min-w-0' style={{ minWidth: '180px' }}>
            <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none' />
            <input
              className='input pl-9'
              placeholder='Buscar cliente o teléfono...'
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>

          {/* Estado */}
          <select
            className='input w-auto'
            value={filters.status}
            onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Fechas */}
          <input
            type='date'
            className='input w-auto'
            value={filters.date_from}
            onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
            title='Desde'
          />
          <input
            type='date'
            className='input w-auto'
            value={filters.date_to}
            onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
            title='Hasta'
          />

          {/* Limpiar */}
          {(filters.status || filters.search || filters.date_from || filters.date_to) && (
            <button
              className='text-sm text-gray-400 hover:text-gray-600 px-2'
              onClick={() => setFilters({ status: '', search: '', date_from: '', date_to: '' })}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className='space-y-3'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='card p-4 h-20 animate-pulse bg-gray-50' />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className='card p-12 text-center'>
          <Calendar className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          {(filters.status || filters.search || filters.date_from || filters.date_to) ? (
            <p className='text-gray-400 text-sm'>No hay reservas con estos filtros</p>
          ) : (
            <>
              <p className='text-gray-600 font-semibold text-sm mb-1'>Aún no tienes reservas</p>
              <p className='text-gray-400 text-xs max-w-xs mx-auto'>
                Comparte tu enlace de reservas con tus clientes para empezar a recibir citas.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Tabla — solo desktop */}
          <div className='card overflow-hidden hidden md:block'>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-100 bg-gray-50/60'>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Cliente</th>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Servicio</th>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Fecha & Hora</th>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Personal</th>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Precio</th>
                    <th className='text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>Estado</th>
                    <th className='px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right'>Acciones</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                  {bookings.map(b => (
                    <tr key={b.id} className='hover:bg-gray-50/60 transition-colors'>
                      <td className='px-5 py-3.5'>
                        <p className='font-medium text-gray-900'>{b.customer_name}</p>
                        <p className='text-gray-400 text-xs flex items-center gap-1 mt-0.5'>
                          <Phone className='w-3 h-3' />{b.customer_phone}
                        </p>
                      </td>
                      <td className='px-5 py-3.5 text-gray-700'>{b.service_name}</td>
                      <td className='px-5 py-3.5'>
                        <p className='text-gray-900'>{formatDate(b.date)}</p>
                        <p className='text-gray-400 text-xs'>{formatTime(b.start_time)}</p>
                      </td>
                      <td className='px-5 py-3.5'>
                        {b.staff_name
                          ? <span className='text-gray-700 text-sm'>{b.staff_name}</span>
                          : <span className='text-gray-300 text-xs italic'>Sin asignar</span>}
                      </td>
                      <td className='px-5 py-3.5 text-gray-700'>{formatCurrency(b.service_price)}</td>
                      <td className='px-5 py-3.5'><StatusBadge status={b.status} /></td>
                      <td className='px-5 py-3.5 text-right'>
                        <button
                          onClick={() => setSelected(b)}
                          className='text-sm text-primary-600 hover:text-primary-700 font-medium'
                        >
                          Gestionar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards — móvil */}
          <div className='space-y-3 md:hidden'>
            {bookings.map(b => (
              <div
                key={b.id}
                className='card p-4 active:bg-gray-50 transition-colors cursor-pointer'
                onClick={() => setSelected(b)}
              >
                <div className='flex items-start justify-between gap-2 mb-3'>
                  <div>
                    <p className='font-semibold text-gray-900'>{b.customer_name}</p>
                    <p className='text-gray-400 text-xs flex items-center gap-1 mt-0.5'>
                      <Phone className='w-3 h-3' />{b.customer_phone}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-gray-600'>{b.service_name}</span>
                  <span className='text-gray-400 text-xs'>
                    {formatDate(b.date)} · {formatTime(b.start_time)}
                  </span>
                </div>
                {/* Acciones rápidas en móvil */}
                <div className='flex gap-2 mt-3 pt-3 border-t border-gray-100'>
                  {STATUS_ACTIONS.filter(a => a.value !== b.status).slice(0, 3).map(action => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.value}
                        disabled={saving}
                        onClick={e => { e.stopPropagation(); handleStatusChange(b, action.value) }}
                        className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${action.className}`}
                      >
                        <Icon className='w-3.5 h-3.5' />
                        {action.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-4 py-3 card'>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'
          >
            ← Anterior
          </button>
          <span className='text-sm text-gray-500'>
            Página <span className='font-bold text-gray-900'>{page}</span> de <span className='font-bold text-gray-900'>{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className='text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors'
          >
            Siguiente →
          </button>
        </div>
      )}

      {/* Modal detalle + cambio de estado */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title='Detalle de la reserva'>
        {selected && (
          <div className='space-y-5'>
            {/* Datos */}
            <div className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Cliente</p>
                <p className='font-medium text-gray-900'>{selected.customer_name}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Teléfono</p>
                <p className='font-medium text-gray-900'>{selected.customer_phone}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Servicio</p>
                <p className='font-medium text-gray-900'>{selected.service_name}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Precio</p>
                <p className='font-medium text-gray-900'>{formatCurrency(selected.service_price)}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Fecha</p>
                <p className='font-medium text-gray-900'>{formatDate(selected.date)}</p>
              </div>
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Hora</p>
                <p className='font-medium text-gray-900'>
                  {formatTime(selected.start_time)}
                  {selected.end_time && ` – ${formatTime(selected.end_time)}`}
                </p>
              </div>
              {selected.staff_name && (
                <div>
                  <p className='text-gray-400 text-xs mb-0.5'>Empleado</p>
                  <p className='font-medium text-gray-900'>{selected.staff_name}</p>
                </div>
              )}
              <div>
                <p className='text-gray-400 text-xs mb-0.5'>Estado actual</p>
                <StatusBadge status={selected.status} />
              </div>
              {selected.notes && (
                <div className='col-span-2'>
                  <p className='text-gray-400 text-xs mb-0.5'>Notas</p>
                  <p className='text-gray-700'>{selected.notes}</p>
                </div>
              )}
            </div>

            {/* Asignar personal */}
            {staffList.length > 0 && (
              <div className='border-t border-gray-100 pt-4'>
                <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5'>
                  <User className='w-3.5 h-3.5' /> Asignar personal
                </p>
                <select
                  className='input w-full'
                  defaultValue={selected.staff ?? ''}
                  onChange={e => {
                    const val = e.target.value
                    updateStatus(
                      { id: selected.id, staff: val === '' ? null : Number(val) },
                      { onSuccess: (updated) => setSelected(prev => ({ ...prev, staff: updated.staff, staff_name: updated.staff_name })) }
                    )
                  }}
                >
                  <option value=''>— Sin asignar —</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Acciones */}
            <div className='border-t border-gray-100 pt-4'>
              <p className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3'>
                Cambiar estado
              </p>
              <div className='grid grid-cols-2 gap-2'>
                {STATUS_ACTIONS.map(action => {
                  const Icon = action.icon
                  const isCurrent = selected.status === action.value
                  return (
                    <button
                      key={action.value}
                      disabled={saving || isCurrent}
                      onClick={() => handleStatusChange(selected, action.value)}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                        border transition-colors
                        ${isCurrent
                          ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-default'
                          : `border-gray-200 ${action.className}`
                        }
                      `}
                    >
                      <Icon className='w-4 h-4 flex-shrink-0' />
                      {action.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
