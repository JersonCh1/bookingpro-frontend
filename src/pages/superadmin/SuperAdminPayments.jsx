import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { adminApi } from '../../api/admin'
import { X, CreditCard, MessageSquare, Trash2 } from 'lucide-react'

const GOLD = '#D4AF37'
const METHOD_LABEL = { yape: 'Yape', transferencia: 'Transferencia', efectivo: 'Efectivo', otro: 'Otro' }

function Modal({ open, onClose, children, title }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
      <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-md'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
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

function PaymentForm({ tenants, preselected, onSuccess, onClose }) {
  const now = new Date()
  const [form, setForm] = useState({
    tenant_id:    preselected?.id || '',
    amount:       69,
    method:       'yape',
    reference:    '',
    period_month: now.getMonth() + 1,
    period_year:  now.getFullYear(),
    notes:        '',
  })
  const mut = useMutation({
    mutationFn: (d) => adminApi.createPayment(d).then(r => r.data.data),
    onSuccess: (d) => {
      onSuccess(`✅ Pago registrado. ${d.tenant_name} activo hasta ${new Date(d.subscription_expires_at).toLocaleDateString('es-PE')}`)
      onClose()
    },
  })

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className='space-y-3'>
      {!preselected && (
        <div>
          <label className='text-xs text-gray-500'>Negocio</label>
          <select value={form.tenant_id} onChange={f('tenant_id')}
            className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400'>
            <option value=''>Seleccionar negocio...</option>
            {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      )}
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='text-xs text-gray-500'>Monto (S/.)</label>
          <input type='number' value={form.amount} onChange={f('amount')}
            className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400' />
        </div>
        <div>
          <label className='text-xs text-gray-500'>Método</label>
          <select value={form.method} onChange={f('method')}
            className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400'>
            <option value='yape'>Yape</option>
            <option value='transferencia'>Transferencia</option>
            <option value='efectivo'>Efectivo</option>
            <option value='otro'>Otro</option>
          </select>
        </div>
        <div>
          <label className='text-xs text-gray-500'>Mes</label>
          <select value={form.period_month} onChange={f('period_month')}
            className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400'>
            {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'].map((m,i) => (
              <option key={i} value={i+1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className='text-xs text-gray-500'>Año</label>
          <input type='number' value={form.period_year} onChange={f('period_year')}
            className='w-full mt-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400' />
        </div>
      </div>
      <input placeholder='N° de operación / referencia (opcional)' value={form.reference} onChange={f('reference')}
        className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-gray-400' />
      <textarea rows={2} placeholder='Notas internas (opcional)' value={form.notes} onChange={f('notes')}
        className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none focus:outline-none focus:border-gray-400' />
      <button
        disabled={!form.tenant_id || mut.isPending}
        onClick={() => mut.mutate(form)}
        className='w-full py-3 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all'
        style={{ backgroundColor: '#22c55e' }}>
        {mut.isPending ? 'Registrando...' : '✅ Registrar pago (+30 días de suscripción)'}
      </button>
    </div>
  )
}

function WhatsAppMsg({ tenant, onClose }) {
  const msg = `Hola ${tenant.name} 👋\n\nTu plan AgendaYa vence pronto.\n\n💰 Monto: S/. 69\n📱 Yape al: 917780708\n📝 Indicar: ${tenant.name}\n\n¿Tienes dudas? Responde este mensaje.\n— AgendaYa`
  const [text, setText] = useState(msg)
  const phone = (tenant.phone || '').replace(/\D/g, '')
  const url   = `https://wa.me/51${phone}?text=${encodeURIComponent(text)}`

  return (
    <div className='space-y-3'>
      <p className='text-xs text-gray-500'>Para: <strong>{tenant.name}</strong> · {tenant.phone}</p>
      <textarea rows={9} value={text} onChange={e => setText(e.target.value)}
        className='w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:border-gray-400' />
      <a href={url} target='_blank' rel='noopener noreferrer'
        className='flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white'
        style={{ backgroundColor: '#22c55e' }}>
        📱 Abrir en WhatsApp
      </a>
    </div>
  )
}

const STATUS_ORDER = { expired: 0, trial: 1, active: 2, blocked: 3 }
const STATUS_STYLE = {
  active:  { bg: '#f0fdf4', color: '#166534', label: '✅ Al día' },
  trial:   { bg: '#fffbeb', color: '#92400e', label: '⚠️ Trial' },
  expired: { bg: '#fef2f2', color: '#991b1b', label: '🔴 Vencido' },
  blocked: { bg: '#f3f4f6', color: '#374151', label: '⚫ Suspendido' },
}

export default function SuperAdminPayments() {
  const qc = useQueryClient()
  const [payTarget,  setPayTarget]  = useState(null)
  const [waTarget,   setWaTarget]   = useState(null)
  const [toast,      setToast]      = useState(null)

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 4000) }

  const { data: tenants = [] } = useQuery({
    queryKey: ['admin-tenants', {}],
    queryFn:  () => adminApi.tenants().then(r => r.data.data),
  })

  const { data: payments = [] } = useQuery({
    queryKey: ['admin-payments'],
    queryFn:  () => adminApi.payments().then(r => r.data.data),
  })

  const { data: summary } = useQuery({
    queryKey: ['admin-payments-summary'],
    queryFn:  () => adminApi.paymentsSummary().then(r => r.data.data),
  })

  const deleteMut = useMutation({
    mutationFn: (id) => adminApi.deletePayment(id).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-payments'] })
      qc.invalidateQueries({ queryKey: ['admin-payments-summary'] })
      showToast('Pago eliminado')
    },
  })

  const sorted = [...tenants].sort((a, b) =>
    (STATUS_ORDER[a.plan_status] ?? 9) - (STATUS_ORDER[b.plan_status] ?? 9)
  )

  const statCards = [
    { label: 'Cobrado este mes', value: `S/. ${(summary?.total_this_month || 0).toFixed(0)}` },
    { label: 'Total histórico',  value: `S/. ${(summary?.total_all_time || 0).toFixed(0)}` },
    { label: 'Promedio por pago', value: `S/. ${(summary?.avg_per_payment || 0).toFixed(0)}` },
    { label: 'Negocios al día',  value: tenants.filter(t => t.plan_status === 'active').length },
  ]

  return (
    <div className='space-y-5'>
      {toast && (
        <div className='fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-50 border border-green-200 text-green-800'>
          ✓ {toast}
        </div>
      )}

      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Pagos</h1>
          <p className='text-gray-500 text-sm mt-0.5'>Control de suscripciones y cobros</p>
        </div>
        <button onClick={() => setPayTarget({ id: '', name: 'Nuevo pago' })}
          className='flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white'
          style={{ backgroundColor: '#22c55e' }}>
          <CreditCard className='w-4 h-4' /> Registrar pago
        </button>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
        {statCards.map(c => (
          <div key={c.label} className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
            <p className='text-xl font-bold text-gray-900'>{c.value}</p>
            <p className='text-xs text-gray-500 mt-0.5'>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Gráfico ingresos por mes */}
      {(summary?.by_month?.length || 0) > 0 && (
        <div className='bg-white rounded-2xl p-5 border border-gray-100 shadow-sm'>
          <h2 className='text-sm font-bold text-gray-700 mb-4'>Ingresos por mes</h2>
          <ResponsiveContainer width='100%' height={150}>
            <BarChart data={summary.by_month} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
              <XAxis dataKey='month' tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} width={40} tickFormatter={v => `S/.${v}`} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={v => [`S/. ${v}`, 'Ingreso']} />
              <Bar dataKey='total' fill={GOLD} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Tabla estado de pagos por negocio */}
      <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
        <div className='px-5 py-3 border-b border-gray-100'>
          <p className='text-sm font-bold text-gray-700'>Estado de suscripciones</p>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-100 bg-gray-50/60'>
                {['Negocio', 'Vencimiento', 'Días rest.', 'Estado', 'Acciones'].map(h => (
                  <th key={h} className='text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-50'>
              {sorted.map(t => {
                const s = STATUS_STYLE[t.plan_status] || STATUS_STYLE.trial
                const expires = t.subscription_expires_at || t.trial_expires_at
                return (
                  <tr key={t.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-3'>
                      <p className='font-semibold text-gray-900'>{t.name}</p>
                      <p className='text-xs text-gray-400'>{t.owner_email}</p>
                    </td>
                    <td className='px-4 py-3 text-xs text-gray-600'>
                      {expires ? new Date(expires).toLocaleDateString('es-PE') : '—'}
                    </td>
                    <td className='px-4 py-3 text-xs font-semibold'
                      style={{ color: t.days_remaining <= 2 ? '#ef4444' : '#374151' }}>
                      {t.days_remaining > 0 ? `${t.days_remaining}d` : '—'}
                    </td>
                    <td className='px-4 py-3'>
                      <span className='inline-flex text-xs font-semibold px-2 py-0.5 rounded-full'
                        style={{ backgroundColor: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center gap-1'>
                        <button title='Registrar pago' onClick={() => setPayTarget(t)}
                          className='flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-white transition-all'
                          style={{ backgroundColor: '#22c55e' }}>
                          <CreditCard className='w-3 h-3' /> Cobrar
                        </button>
                        <button title='WhatsApp' onClick={() => setWaTarget(t)}
                          className='p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors'>
                          <MessageSquare className='w-4 h-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de pagos */}
      {payments.length > 0 && (
        <div className='bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm'>
          <div className='px-5 py-3 border-b border-gray-100'>
            <p className='text-sm font-bold text-gray-700'>Historial de pagos ({payments.length})</p>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-100 bg-gray-50/60'>
                  {['Negocio', 'Monto', 'Método', 'Período', 'Fecha', ''].map(h => (
                    <th key={h} className='text-left px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide'>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {payments.map(p => (
                  <tr key={p.id} className='hover:bg-gray-50/60 transition-colors'>
                    <td className='px-4 py-2 font-medium text-gray-900'>{p.tenant_name}</td>
                    <td className='px-4 py-2 font-bold text-gray-900'>S/. {p.amount}</td>
                    <td className='px-4 py-2 text-gray-600'>{METHOD_LABEL[p.method] || p.method}</td>
                    <td className='px-4 py-2 text-gray-500 text-xs'>{p.period_month}/{p.period_year}</td>
                    <td className='px-4 py-2 text-gray-400 text-xs'>
                      {new Date(p.paid_at).toLocaleDateString('es-PE')}
                    </td>
                    <td className='px-4 py-2'>
                      <button onClick={() => deleteMut.mutate(p.id)}
                        className='p-1 rounded text-gray-300 hover:text-red-500 transition-colors'>
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal pago */}
      <Modal open={!!payTarget} onClose={() => setPayTarget(null)}
        title={payTarget?.id ? `Pago — ${payTarget.name}` : 'Registrar pago'}>
        <PaymentForm
          tenants={tenants}
          preselected={payTarget?.id ? payTarget : null}
          onSuccess={showToast}
          onClose={() => {
            setPayTarget(null)
            qc.invalidateQueries({ queryKey: ['admin-payments'] })
            qc.invalidateQueries({ queryKey: ['admin-payments-summary'] })
            qc.invalidateQueries({ queryKey: ['admin-tenants'] })
            qc.invalidateQueries({ queryKey: ['admin-stats'] })
          }}
        />
      </Modal>

      {/* Modal WhatsApp */}
      <Modal open={!!waTarget} onClose={() => setWaTarget(null)}
        title={`WhatsApp → ${waTarget?.name || ''}`}>
        {waTarget && <WhatsAppMsg tenant={waTarget} onClose={() => setWaTarget(null)} />}
      </Modal>
    </div>
  )
}
