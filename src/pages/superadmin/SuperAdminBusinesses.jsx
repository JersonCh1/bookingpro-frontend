import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { Search, Eye, Ban, Trash2, CheckCircle, ExternalLink, X } from 'lucide-react'

const STATUS_LABEL = { true: 'Activo', false: 'Bloqueado' }

function Badge({ active }) {
  return (
    <span className='inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full'
      style={{
        backgroundColor: active ? '#f0fdf4' : '#fef2f2',
        color: active ? '#166534' : '#991b1b',
      }}>
      <span className='w-1.5 h-1.5 rounded-full' style={{ backgroundColor: active ? '#22c55e' : '#ef4444' }} />
      {STATUS_LABEL[active]}
    </span>
  )
}

function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
          <h2 className='font-bold text-gray-900'>{title}</h2>
          <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-gray-100 transition-colors'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
        <div className='px-6 py-5'>{children}</div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  if (!value) return null
  return (
    <div className='flex gap-3 py-2 border-b border-gray-50 last:border-0'>
      <span className='text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5'>{label}</span>
      <span className='text-sm text-gray-900 font-medium break-all'>{value}</span>
    </div>
  )
}

export default function SuperAdminBusinesses() {
  const qc = useQueryClient()
  const [filters, setFilters] = useState({ search: '', city: '', status: '' })
  const [viewing,  setViewing]  = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toast,    setToast]    = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['admin-tenants', filters],
    queryFn:  () => adminApi.tenants(filters).then(r => r.data.data),
  })

  const toggleMutation = useMutation({
    mutationFn: (id) => adminApi.toggleTenant(id).then(r => r.data.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      showToast(`Negocio ${data.is_active ? 'activado' : 'bloqueado'} correctamente`)
    },
    onError: () => showToast('Error al cambiar estado', 'error'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteTenant(id).then(r => r.data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setDeleting(null)
      showToast(data.data?.detail || 'Negocio eliminado')
    },
    onError: () => showToast('Error al eliminar', 'error'),
  })

  return (
    <div className='space-y-5'>
      {/* Toast */}
      {toast && (
        <div className='fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium'
          style={{
            backgroundColor: toast.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${toast.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            color: toast.type === 'success' ? '#166534' : '#991b1b',
          }}>
          {toast.type === 'success' ? '✓' : '✗'} {toast.msg}
        </div>
      )}

      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Negocios</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Todos los negocios registrados en AgendaYa</p>
      </div>

      {/* Filtros */}
      <div className='bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-3'>
        <div className='relative flex-1' style={{ minWidth: 180 }}>
          <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none' />
          <input className='w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400'
            placeholder='Buscar negocio...'
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <input className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400 w-36'
          placeholder='Ciudad...'
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
        <select className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400'
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value=''>Todos</option>
          <option value='active'>Activos</option>
          <option value='blocked'>Bloqueados</option>
        </select>
        {(filters.search || filters.city || filters.status) && (
          <button className='text-sm text-gray-400 hover:text-gray-600 px-2'
            onClick={() => setFilters({ search: '', city: '', status: '' })}>
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-14 rounded-xl bg-gray-100 animate-pulse' />
          ))}
        </div>
      ) : tenants.length === 0 ? (
        <div className='bg-white rounded-2xl p-12 text-center border border-gray-100'>
          <Store className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-400 text-sm'>No hay negocios con estos filtros</p>
        </div>
      ) : (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/60'>
                  {['Negocio', 'Ciudad', 'Tipo', 'Registrado', 'Reservas', 'Estado', 'Acciones'].map(h => (
                    <th key={h} className='text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {tenants.map(t => (
                  <tr key={t.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-3'>
                      <p className='font-semibold text-gray-900'>{t.name}</p>
                      <p className='text-xs text-gray-400'>{t.owner_email}</p>
                    </td>
                    <td className='px-4 py-3 text-gray-600'>{t.city || '—'}</td>
                    <td className='px-4 py-3 text-gray-600 capitalize'>{t.business_type}</td>
                    <td className='px-4 py-3 text-gray-500 text-xs'>
                      {new Date(t.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex gap-2 text-xs text-gray-500'>
                        <span>{t.bookings_count} reservas</span>
                      </div>
                      <div className='flex gap-2 text-xs text-gray-400'>
                        <span>{t.services_count} servicios</span>
                        <span>·</span>
                        <span>{t.staff_count} personal</span>
                      </div>
                    </td>
                    <td className='px-4 py-3'><Badge active={t.is_active} /></td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-1'>
                        <button title='Ver detalles'
                          onClick={() => setViewing(t)}
                          className='p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'>
                          <Eye className='w-4 h-4' />
                        </button>
                        <button title={t.is_active ? 'Bloquear' : 'Activar'}
                          disabled={toggleMutation.isPending}
                          onClick={() => toggleMutation.mutate(t.id)}
                          className='p-1.5 rounded-lg transition-colors'
                          style={{ color: t.is_active ? '#f59e0b' : '#22c55e' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = t.is_active ? '#fffbeb' : '#f0fdf4' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                          {t.is_active ? <Ban className='w-4 h-4' /> : <CheckCircle className='w-4 h-4' />}
                        </button>
                        <button title='Eliminar'
                          onClick={() => setDeleting(t)}
                          className='p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors'>
                          <Trash2 className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Ver negocio */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title='Detalle del negocio'>
        {viewing && (
          <div>
            <div className='flex items-center gap-3 mb-5'>
              <div className='w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black text-white flex-shrink-0'
                style={{ backgroundColor: '#C0392B' }}>
                {viewing.name[0]?.toUpperCase()}
              </div>
              <div>
                <p className='font-bold text-gray-900'>{viewing.name}</p>
                <Badge active={viewing.is_active} />
              </div>
            </div>
            <DetailRow label='Tipo' value={viewing.business_type} />
            <DetailRow label='Ciudad' value={viewing.city} />
            <DetailRow label='Teléfono' value={viewing.phone} />
            <DetailRow label='Email negocio' value={viewing.email} />
            <DetailRow label='Owner email' value={viewing.owner_email} />
            <DetailRow label='Registrado' value={new Date(viewing.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })} />
            <DetailRow label='Servicios' value={`${viewing.services_count}`} />
            <DetailRow label='Personal' value={`${viewing.staff_count}`} />
            <DetailRow label='Reservas' value={`${viewing.bookings_count}`} />
            <a href={`/book/${viewing.slug}`} target='_blank' rel='noopener noreferrer'
              className='mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold transition-all'
              style={{ border: '1.5px solid #e5e7eb', color: '#374151' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C0392B'; e.currentTarget.style.color = '#C0392B' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}>
              <ExternalLink className='w-4 h-4' /> Ver página pública
            </a>
          </div>
        )}
      </Modal>

      {/* Modal: Confirmar eliminación */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title='¿Eliminar negocio?'>
        {deleting && (
          <div className='text-center'>
            <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
              <Trash2 className='w-6 h-6 text-red-500' />
            </div>
            <p className='font-bold text-gray-900 mb-2'>Eliminar "{deleting.name}"</p>
            <p className='text-sm text-gray-500 mb-6'>
              Esta acción eliminará permanentemente el negocio y todos sus datos
              ({deleting.bookings_count} reservas, {deleting.services_count} servicios).
              <strong> No se puede deshacer.</strong>
            </p>
            <div className='flex gap-3'>
              <button onClick={() => setDeleting(null)}
                className='flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors'>
                Cancelar
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleting.id)}
                className='flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60'
                style={{ backgroundColor: '#ef4444' }}>
                {deleteMutation.isPending ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
