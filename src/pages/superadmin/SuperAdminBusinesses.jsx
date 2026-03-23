import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { adminApi } from '../../api/admin'
import {
  Search, Eye, Ban, Trash2, CheckCircle, ExternalLink, X,
  Store, Clock, MessageSquare, CreditCard, FileText, RefreshCw,
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────

const PLAN_STYLES = {
  active:  { bg: '#f0fdf4', color: '#166534', label: 'Activo' },
  trial:   { bg: '#fffbeb', color: '#92400e', label: 'Trial' },
  expired: { bg: '#fef2f2', color: '#991b1b', label: 'Vencido' },
  blocked: { bg: '#f3f4f6', color: '#374151', label: 'Bloqueado' },
}

function PlanBadge({ status }) {
  const s = PLAN_STYLES[status] || PLAN_STYLES.trial
  return (
    <span className='inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full'
      style={{ backgroundColor: s.bg, color: s.color }}>
      {status === 'active' && '✅ '}{status === 'trial' && '🟡 '}
      {status === 'expired' && '🔴 '}{status === 'blocked' && '⚫ '}
      {s.label}
    </span>
  )
}

// ── Modal genérico ────────────────────────────────────────

function Modal({ open, onClose, children, title, wide }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-3xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto`}>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10'>
          <h2 className='font-bold text-gray-900'>{title}</h2>
          <button onClick={onClose} className='p-1.5 rounded-lg hover:bg-gray-100'>
            <X className='w-4 h-4 text-gray-500' />
          </button>
        </div>
        <div className='px-6 py-5'>{children}</div>
      </div>
    </div>
  )
}

// ── Tab detalles del negocio ──────────────────────────────

function TenantDetailModal({ tenant_id, onClose }) {
  const [tab, setTab] = useState('stats')
  const [newNote, setNewNote] = useState('')
  const [payForm, setPayForm] = useState({
    amount: 69, method: 'yape', reference: '', notes: '',
    period_month: new Date().getMonth() + 1,
    period_year: new Date().getFullYear(),
  })

  const qc = useQueryClient()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-tenant-detail', tenant_id],
    queryFn:  () => adminApi.tenantDetail(tenant_id).then(r => r.data.data),
    enabled:  !!tenant_id,
  })

  const noteMut = useMutation({
    mutationFn: (content) => adminApi.addNote(tenant_id, content).then(r => r.data.data),
    onSuccess: () => { setNewNote(''); refetch() },
  })

  const payMut = useMutation({
    mutationFn: (d) => adminApi.createPayment({ ...d, tenant_id }).then(r => r.data.data),
    onSuccess: () => {
      refetch()
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      alert('✅ Pago registrado correctamente')
    },
  })

  const extendMut = useMutation({
    mutationFn: (days) => adminApi.extendTenant(tenant_id, days).then(r => r.data.data),
    onSuccess: () => { refetch(); qc.invalidateQueries({ queryKey: ['admin-tenants'] }) },
  })

  const deleteNoteMut = useMutation({
    mutationFn: (id) => adminApi.deleteNote(id).then(r => r.data.data),
    onSuccess: () => refetch(),
  })

  const TABS = [
    { id: 'stats',   label: '📊 Estadísticas' },
    { id: 'payments',label: '💳 Pagos' },
    { id: 'notes',   label: '📝 Notas' },
    { id: 'config',  label: '⚙️ Configuración' },
  ]

  if (isLoading || !data) return (
    <div className='py-10 text-center text-gray-400'>Cargando...</div>
  )

  return (
    <div>
      {/* Header del negocio */}
      <div className='flex items-start gap-4 mb-5'>
        <div className='w-14 h-14 rounded-xl flex items-center justify-center text-xl font-black text-white flex-shrink-0'
          style={{ backgroundColor: '#C0392B' }}>
          {data.name?.[0]?.toUpperCase()}
        </div>
        <div className='min-w-0'>
          <div className='flex items-center gap-2 flex-wrap'>
            <p className='font-bold text-gray-900 text-lg'>{data.name}</p>
            <PlanBadge status={data.plan_status} />
          </div>
          <p className='text-sm text-gray-500'>{data.owner_email}</p>
          <p className='text-xs text-gray-400'>{data.business_type} · {data.city}</p>
        </div>
        <a href={`/book/${data.slug}`} target='_blank' rel='noopener noreferrer'
          className='ml-auto flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:border-red-400 hover:text-red-600 transition-colors flex-shrink-0'>
          <ExternalLink className='w-3 h-3' /> Ver página
        </a>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 mb-5 bg-gray-100 p-1 rounded-xl'>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className='flex-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all'
            style={{
              backgroundColor: tab === t.id ? 'white' : 'transparent',
              color: tab === t.id ? '#111' : '#6b7280',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Estadísticas */}
      {tab === 'stats' && (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { label: 'Reservas totales', value: data.bookings_count },
              { label: 'Clientes únicos',  value: data.unique_customers },
              { label: 'Servicios',        value: data.services_count },
              { label: 'Personal',         value: data.staff_count },
            ].map(c => (
              <div key={c.label} className='bg-gray-50 rounded-xl p-3 text-center'>
                <p className='text-2xl font-bold text-gray-900'>{c.value}</p>
                <p className='text-xs text-gray-500 mt-0.5'>{c.label}</p>
              </div>
            ))}
          </div>
          <div className='space-y-0.5'>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-2'>Timeline</p>
            {data.timeline?.map((ev, i) => (
              <div key={i} className='flex items-start gap-3 py-2 border-b border-gray-50 last:border-0'>
                <span className='w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0' />
                <div>
                  <p className='text-sm text-gray-800'>{ev.event}</p>
                  <p className='text-xs text-gray-400'>{new Date(ev.date).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Pagos */}
      {tab === 'payments' && (
        <div className='space-y-4'>
          <div className='bg-gray-50 rounded-xl p-4 space-y-3'>
            <p className='text-xs font-bold text-gray-700'>Registrar nuevo pago</p>
            <div className='grid grid-cols-2 gap-2'>
              <div>
                <label className='text-xs text-gray-500'>Monto (S/.)</label>
                <input type='number' value={payForm.amount}
                  onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))}
                  className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400' />
              </div>
              <div>
                <label className='text-xs text-gray-500'>Método</label>
                <select value={payForm.method}
                  onChange={e => setPayForm(f => ({ ...f, method: e.target.value }))}
                  className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400'>
                  <option value='yape'>Yape</option>
                  <option value='transferencia'>Transferencia</option>
                  <option value='efectivo'>Efectivo</option>
                  <option value='otro'>Otro</option>
                </select>
              </div>
            </div>
            <input placeholder='Referencia / N° de operación (opcional)'
              value={payForm.reference}
              onChange={e => setPayForm(f => ({ ...f, reference: e.target.value }))}
              className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400' />
            <button
              disabled={payMut.isPending}
              onClick={() => payMut.mutate(payForm)}
              className='w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60'
              style={{ backgroundColor: '#22c55e' }}>
              {payMut.isPending ? 'Registrando...' : '✅ Registrar pago (+30 días)'}
            </button>
          </div>

          {data.payments?.length === 0 && (
            <p className='text-center text-sm text-gray-400 py-4'>Sin pagos registrados</p>
          )}
          {data.payments?.map(p => (
            <div key={p.id} className='flex items-center justify-between py-2 border-b border-gray-50'>
              <div>
                <p className='text-sm font-semibold text-gray-900'>S/. {p.amount} · {p.method}</p>
                <p className='text-xs text-gray-400'>{new Date(p.paid_at).toLocaleDateString('es-PE')} · {p.period_month}/{p.period_year}</p>
                {p.reference && <p className='text-xs text-gray-400'>Ref: {p.reference}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Notas */}
      {tab === 'notes' && (
        <div className='space-y-3'>
          <textarea rows={3} placeholder='Agregar nota interna...'
            value={newNote} onChange={e => setNewNote(e.target.value)}
            className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-gray-400' />
          <button
            disabled={!newNote.trim() || noteMut.isPending}
            onClick={() => noteMut.mutate(newNote)}
            className='w-full py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all'
            style={{ backgroundColor: '#0D0D0D' }}>
            {noteMut.isPending ? 'Guardando...' : 'Guardar nota'}
          </button>
          <div className='space-y-2 mt-2'>
            {data.notes?.length === 0 && (
              <p className='text-sm text-gray-400 text-center py-4'>Sin notas</p>
            )}
            {data.notes?.map(n => (
              <div key={n.id} className='bg-gray-50 rounded-xl p-3 flex gap-3'>
                <div className='flex-1'>
                  <p className='text-sm text-gray-800'>{n.content}</p>
                  <p className='text-xs text-gray-400 mt-1'>{n.created_by} · {new Date(n.created_at).toLocaleDateString('es-PE')}</p>
                </div>
                <button onClick={() => deleteNoteMut.mutate(n.id)}
                  className='text-gray-300 hover:text-red-500 transition-colors flex-shrink-0'>
                  <X className='w-3.5 h-3.5' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Configuración */}
      {tab === 'config' && (
        <div className='space-y-4'>
          <div>
            <p className='text-xs font-bold text-gray-700 mb-3'>Extender trial</p>
            <div className='flex gap-2'>
              {[7, 15, 30].map(d => (
                <button key={d}
                  disabled={extendMut.isPending}
                  onClick={() => extendMut.mutate(d)}
                  className='flex-1 py-2 rounded-xl text-sm font-bold border border-gray-200 hover:border-yellow-400 hover:text-yellow-700 transition-colors disabled:opacity-50'>
                  +{d} días
                </button>
              ))}
            </div>
          </div>
          <div className='text-xs space-y-2 bg-gray-50 p-3 rounded-xl'>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Trial vence:</span>
              <span className='font-medium'>{data.trial_expires_at ? new Date(data.trial_expires_at).toLocaleDateString('es-PE') : '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Suscripción vence:</span>
              <span className='font-medium'>{data.subscription_expires_at ? new Date(data.subscription_expires_at).toLocaleDateString('es-PE') : '—'}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Estado:</span>
              <PlanBadge status={data.plan_status} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── WhatsApp composer ─────────────────────────────────────

function WhatsAppModal({ tenant, onClose }) {
  const defaultMsg = `Hola ${tenant.name} 👋\n\nTu plan AgendaYa vence pronto. Para continuar usando el sistema, realiza tu pago:\n\n💰 Monto: S/. 69\n📱 Yape al: 917780708\n📝 Indicar: ${tenant.name}\n\n¿Tienes alguna duda? Responde este mensaje.\n— AgendaYa`
  const [msg, setMsg] = useState(defaultMsg)
  const phone = (tenant.phone || '').replace(/\D/g, '').replace(/^0/, '')
  const waUrl = `https://wa.me/51${phone}?text=${encodeURIComponent(msg)}`

  return (
    <div className='space-y-4'>
      <div className='text-xs text-gray-500'>
        Enviando a: <strong>{tenant.name}</strong> ({tenant.phone || 'sin teléfono'})
      </div>
      <textarea rows={10} value={msg} onChange={e => setMsg(e.target.value)}
        className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-gray-400' />
      <a href={waUrl} target='_blank' rel='noopener noreferrer'
        className='flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white'
        style={{ backgroundColor: '#22c55e' }}>
        📱 Abrir en WhatsApp
      </a>
    </div>
  )
}

// ── Página principal ──────────────────────────────────────

export default function SuperAdminBusinesses() {
  const qc = useQueryClient()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    search: '', city: '', status: searchParams.get('status') || '', type: '',
  })
  const [viewing,   setViewing]   = useState(null)
  const [deleting,  setDeleting]  = useState(null)
  const [waTarget,  setWaTarget]  = useState(null)
  const [sortKey,   setSortKey]   = useState('created_at')
  const [sortDir,   setSortDir]   = useState(-1)
  const [toast,     setToast]     = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['admin-tenants', filters],
    queryFn:  () => adminApi.tenants(filters).then(r => r.data.data),
  })

  const toggleMut = useMutation({
    mutationFn: (id) => adminApi.toggleTenant(id).then(r => r.data.data),
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      showToast(`Negocio ${d.is_active ? 'activado' : 'bloqueado'}`)
    },
    onError: () => showToast('Error al cambiar estado', 'error'),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => adminApi.deleteTenant(id).then(r => r.data),
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ['admin-tenants'] })
      qc.invalidateQueries({ queryKey: ['admin-stats'] })
      setDeleting(null)
      showToast(d.data?.detail || 'Negocio eliminado')
    },
    onError: () => showToast('Error al eliminar', 'error'),
  })

  const COLS = [
    { key: 'name',       label: 'Negocio' },
    { key: 'city',       label: 'Ciudad' },
    { key: 'business_type', label: 'Tipo' },
    { key: 'created_at', label: 'Registrado' },
    { key: 'bookings_count', label: 'Reservas' },
    { key: 'plan_status', label: 'Estado' },
    { key: null,         label: 'Acciones' },
  ]

  const sorted = [...tenants].sort((a, b) => {
    if (!sortKey) return 0
    const va = a[sortKey] ?? ''
    const vb = b[sortKey] ?? ''
    return sortDir * (va < vb ? -1 : va > vb ? 1 : 0)
  })

  const toggleSort = (key) => {
    if (!key) return
    setSortDir(sortKey === key ? -sortDir : -1)
    setSortKey(key)
  }

  return (
    <div className='space-y-5'>
      {/* Toast */}
      {toast && (
        <div className='fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium'
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
        <p className='text-gray-500 text-sm mt-0.5'>
          {tenants.length} negocios{filters.status ? ` · filtro: ${filters.status}` : ''}
        </p>
      </div>

      {/* Filtros */}
      <div className='bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-2'>
        <div className='relative flex-1' style={{ minWidth: 180 }}>
          <Search className='absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none' />
          <input className='w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-gray-400'
            placeholder='Buscar nombre o email...'
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
        <select className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none'
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
          <option value=''>Todos</option>
          <option value='active'>✅ Activo</option>
          <option value='trial'>🟡 Trial</option>
          <option value='expired'>🔴 Vencido</option>
          <option value='blocked'>⚫ Bloqueado</option>
        </select>
        <input className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none w-28'
          placeholder='Ciudad...'
          value={filters.city}
          onChange={e => setFilters(f => ({ ...f, city: e.target.value }))} />
        <input className='px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none w-32'
          placeholder='Tipo...'
          value={filters.type}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))} />
        {(filters.search || filters.city || filters.status || filters.type) && (
          <button className='text-sm text-gray-400 hover:text-gray-600 px-2'
            onClick={() => setFilters({ search: '', city: '', status: '', type: '' })}>
            Limpiar
          </button>
        )}
      </div>

      {/* Tabla */}
      {isLoading ? (
        <div className='space-y-2'>
          {[...Array(5)].map((_, i) => <div key={i} className='h-14 rounded-xl bg-gray-100 animate-pulse' />)}
        </div>
      ) : sorted.length === 0 ? (
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
                  {COLS.map(c => (
                    <th key={c.label}
                      onClick={() => toggleSort(c.key)}
                      className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide select-none
                        ${c.key ? 'cursor-pointer hover:text-gray-800' : ''}`}>
                      {c.label}
                      {c.key && sortKey === c.key && (sortDir === 1 ? ' ↑' : ' ↓')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {sorted.map(t => (
                  <tr key={t.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-3'>
                      <p className='font-semibold text-gray-900'>{t.name}</p>
                      <p className='text-xs text-gray-400'>{t.owner_email}</p>
                    </td>
                    <td className='px-4 py-3 text-gray-600 text-xs'>{t.city || '—'}</td>
                    <td className='px-4 py-3 text-gray-600 text-xs capitalize'>{t.business_type}</td>
                    <td className='px-4 py-3 text-gray-500 text-xs'>
                      {new Date(t.created_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className='px-4 py-3'>
                      <p className='text-sm font-medium text-gray-900'>{t.bookings_count}</p>
                      <p className='text-xs text-gray-400'>{t.services_count} serv · {t.staff_count} staff</p>
                    </td>
                    <td className='px-4 py-3'>
                      <PlanBadge status={t.plan_status} />
                      {t.days_remaining > 0 && (
                        <p className='text-[10px] text-gray-400 mt-0.5'>{t.days_remaining}d restantes</p>
                      )}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-0.5'>
                        <button title='Ver detalles' onClick={() => setViewing(t.id)}
                          className='p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors'>
                          <Eye className='w-4 h-4' />
                        </button>
                        <button title='WhatsApp' onClick={() => setWaTarget(t)}
                          className='p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors'>
                          <MessageSquare className='w-4 h-4' />
                        </button>
                        <button title={t.is_active ? 'Bloquear' : 'Activar'}
                          disabled={toggleMut.isPending}
                          onClick={() => toggleMut.mutate(t.id)}
                          className='p-1.5 rounded-lg transition-colors'
                          style={{ color: t.is_active ? '#f59e0b' : '#22c55e' }}
                          onMouseEnter={e => { e.currentTarget.style.backgroundColor = t.is_active ? '#fffbeb' : '#f0fdf4' }}
                          onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                          {t.is_active ? <Ban className='w-4 h-4' /> : <CheckCircle className='w-4 h-4' />}
                        </button>
                        <button title='Eliminar' onClick={() => setDeleting(t)}
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

      {/* Modal detalle */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title='Detalle del negocio' wide>
        {viewing && <TenantDetailModal tenant_id={viewing} onClose={() => setViewing(null)} />}
      </Modal>

      {/* Modal WhatsApp */}
      <Modal open={!!waTarget} onClose={() => setWaTarget(null)}
        title={`WhatsApp → ${waTarget?.name || ''}`}>
        {waTarget && <WhatsAppModal tenant={waTarget} onClose={() => setWaTarget(null)} />}
      </Modal>

      {/* Modal eliminar */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title='¿Eliminar negocio?'>
        {deleting && (
          <div className='text-center'>
            <div className='w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4'>
              <Trash2 className='w-6 h-6 text-red-500' />
            </div>
            <p className='font-bold text-gray-900 mb-2'>Eliminar "{deleting.name}"</p>
            <p className='text-sm text-gray-500 mb-6'>
              Esto eliminará permanentemente el negocio, sus {deleting.bookings_count} reservas
              y {deleting.services_count} servicios. <strong>No se puede deshacer.</strong>
            </p>
            <div className='flex gap-3'>
              <button onClick={() => setDeleting(null)}
                className='flex-1 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 hover:bg-gray-50'>
                Cancelar
              </button>
              <button
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate(deleting.id)}
                className='flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60'
                style={{ backgroundColor: '#ef4444' }}>
                {deleteMut.isPending ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
