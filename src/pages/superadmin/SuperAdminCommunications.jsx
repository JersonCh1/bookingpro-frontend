import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { MessageSquare, Send, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

const TEMPLATES = [
  {
    id: 'trial_expiring',
    label: 'Trial por vencer',
    icon: Clock,
    color: '#f59e0b',
    message: (name) =>
      `Hola ${name} 👋 Te recordamos que tu prueba gratuita de *AgendaYa* vence pronto.\n\n✅ Para continuar disfrutando tu agenda online, escríbenos para activar tu plan.\n\n¡Estamos aquí para ayudarte! 🚀`,
  },
  {
    id: 'payment_reminder',
    label: 'Cobro de suscripción',
    icon: AlertTriangle,
    color: '#ef4444',
    message: (name) =>
      `Hola ${name} 👋 Tu suscripción de *AgendaYa* está pendiente de pago.\n\n💳 *Yape / Plin:* [TU_NÚMERO]\n💵 *Precio:* S/. [PRECIO]\n\nUna vez confirmado el pago, activamos tu cuenta inmediatamente. ¡Gracias! 🙌`,
  },
  {
    id: 'welcome',
    label: 'Bienvenida',
    icon: CheckCircle,
    color: '#22c55e',
    message: (name) =>
      `¡Hola ${name}! 🎉 Bienvenido/a a *AgendaYa* — tu sistema de reservas online.\n\nYa puedes compartir tu link personalizado con tus clientes para que agenden contigo.\n\n¿Necesitas ayuda para configurar tu cuenta? ¡Escríbenos! 😊`,
  },
  {
    id: 'custom',
    label: 'Mensaje personalizado',
    icon: MessageSquare,
    color: '#6366f1',
    message: () => '',
  },
]

const AUDIENCES = [
  { id: 'all',     label: 'Todos los negocios' },
  { id: 'trial',   label: 'Solo en trial' },
  { id: 'expired', label: 'Trial vencido (sin pagar)' },
  { id: 'active',  label: 'Solo activos (pagados)' },
  { id: 'blocked', label: 'Bloqueados' },
]

const STATUS_BADGE = {
  trial:   { bg: '#fffbeb', color: '#92400e', label: 'Trial' },
  active:  { bg: '#f0fdf4', color: '#166534', label: 'Activo' },
  expired: { bg: '#fef2f2', color: '#991b1b', label: 'Vencido' },
  blocked: { bg: '#f3f4f6', color: '#374151', label: 'Bloqueado' },
}

function MessageModal({ tenant, defaultMsg, onSent, onClose }) {
  const [msg, setMsg] = useState(defaultMsg)
  const phone = tenant?.phone?.replace(/\D/g, '') || ''
  const wa = phone
    ? `https://wa.me/${phone.startsWith('51') ? phone : '51' + phone}?text=${encodeURIComponent(msg)}`
    : null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='font-bold text-gray-900'>Redactar mensaje</h3>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-xl leading-none'>×</button>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600'>
            {tenant?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className='text-sm font-semibold text-gray-800'>{tenant?.name}</p>
            <p className='text-xs text-gray-400'>{tenant?.phone || 'Sin teléfono registrado'}</p>
          </div>
        </div>
        <textarea
          rows={7}
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className='w-full text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none'
        />
        <div className='flex gap-2'>
          <button onClick={onClose}
            className='flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors'>
            Cancelar
          </button>
          {wa ? (
            <a href={wa} target='_blank' rel='noopener noreferrer' onClick={onSent}
              className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white'
              style={{ backgroundColor: '#25D366' }}>
              <Send className='w-4 h-4' /> Enviar por WhatsApp
            </a>
          ) : (
            <button disabled
              className='flex-1 py-2.5 rounded-xl text-sm font-bold text-white opacity-40 cursor-not-allowed'
              style={{ backgroundColor: '#25D366' }}>
              Sin teléfono
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SuperAdminCommunications() {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0])
  const [audience, setAudience] = useState('trial')
  const [searchTenant, setSearchTenant] = useState('')
  const [composingFor, setComposingFor] = useState(null)
  const [sentLog, setSentLog] = useState([])

  const { data: tenants = [] } = useQuery({
    queryKey: ['admin-tenants', {}],
    queryFn: () => adminApi.tenants().then(r => r.data.data),
  })

  const filtered = tenants.filter(t => {
    const matchSearch = !searchTenant || t.name?.toLowerCase().includes(searchTenant.toLowerCase())
    const matchAudience =
      audience === 'all'     ? true :
      audience === 'trial'   ? t.plan_status === 'trial' :
      audience === 'expired' ? t.plan_status === 'expired' :
      audience === 'active'  ? t.plan_status === 'active' :
      audience === 'blocked' ? t.plan_status === 'blocked' : true
    return matchSearch && matchAudience
  })

  function openComposer(tenant) {
    const firstName = tenant.name?.split(' ')[0] || tenant.name
    const msg = selectedTemplate.message(firstName)
    setComposingFor({ tenant, msg })
  }

  function markSent() {
    setSentLog(prev => [{
      id: Date.now(),
      name: composingFor.tenant.name,
      time: new Date().toLocaleTimeString('es-PE'),
      template: selectedTemplate.label,
    }, ...prev.slice(0, 49)])
    setComposingFor(null)
  }

  return (
    <div className='space-y-5'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Comunicaciones</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Envía mensajes de WhatsApp a tus negocios</p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
        {/* Columna izquierda */}
        <div className='space-y-4'>
          {/* Plantillas */}
          <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>Plantilla de mensaje</p>
            <div className='space-y-1.5'>
              {TEMPLATES.map(t => {
                const Icon = t.icon
                const active = selectedTemplate.id === t.id
                return (
                  <button key={t.id} onClick={() => setSelectedTemplate(t)}
                    className='flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left'
                    style={{
                      backgroundColor: active ? t.color + '15' : 'transparent',
                      border: `1px solid ${active ? t.color + '40' : 'transparent'}`,
                      color: active ? t.color : '#6b7280',
                    }}>
                    <Icon className='w-4 h-4 flex-shrink-0' />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Vista previa */}
          {selectedTemplate.id !== 'custom' && (
            <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-2'>Vista previa</p>
              <div className='rounded-xl p-3 text-xs text-gray-700 whitespace-pre-wrap leading-relaxed'
                style={{ backgroundColor: '#dcfce7' }}>
                {selectedTemplate.message('Nombre')}
              </div>
            </div>
          )}

          {/* Audiencia */}
          <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
            <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>Filtrar audiencia</p>
            <div className='space-y-1'>
              {AUDIENCES.map(a => {
                const count = a.id === 'all' ? tenants.length :
                  tenants.filter(t => t.plan_status === a.id).length
                return (
                  <button key={a.id} onClick={() => setAudience(a.id)}
                    className='flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors text-left'
                    style={{
                      backgroundColor: audience === a.id ? '#6366f115' : 'transparent',
                      color: audience === a.id ? '#4f46e5' : '#6b7280',
                      fontWeight: audience === a.id ? 600 : 400,
                    }}>
                    <span>{a.label}</span>
                    <span className='text-xs px-1.5 py-0.5 rounded-full'
                      style={{
                        backgroundColor: audience === a.id ? '#6366f120' : '#f3f4f6',
                        color: audience === a.id ? '#4f46e5' : '#9ca3af',
                      }}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Columna principal */}
        <div className='lg:col-span-2 space-y-3'>
          <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
            <div className='flex items-center gap-3 mb-4'>
              <input type='text' placeholder='Buscar negocio...'
                value={searchTenant} onChange={e => setSearchTenant(e.target.value)}
                className='flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none' />
              <span className='text-sm text-gray-400 whitespace-nowrap font-medium'>
                {filtered.length} negocio{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {filtered.length === 0 ? (
              <div className='text-center py-10 text-gray-400'>
                <Users className='w-9 h-9 mx-auto mb-2 opacity-30' />
                <p className='text-sm'>No hay negocios en esta audiencia</p>
              </div>
            ) : (
              <div className='space-y-1 max-h-[420px] overflow-y-auto pr-1'>
                {filtered.map(t => {
                  const s = STATUS_BADGE[t.plan_status] ?? STATUS_BADGE.blocked
                  const alreadySent = sentLog.some(l => l.name === t.name)
                  return (
                    <div key={t.id}
                      className='flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors'>
                      <div className='w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0'
                        style={{ backgroundColor: '#6366f1' }}>
                        {t.name?.[0]?.toUpperCase()}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-gray-800 truncate'>{t.name}</p>
                        <p className='text-xs text-gray-400 truncate'>{t.phone || 'Sin teléfono'}</p>
                      </div>
                      <span className='text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0'
                        style={{ backgroundColor: s.bg, color: s.color }}>
                        {s.label}
                      </span>
                      {alreadySent ? (
                        <span className='flex items-center gap-1 text-xs text-green-500 font-semibold flex-shrink-0'>
                          <CheckCircle className='w-3 h-3' /> Enviado
                        </span>
                      ) : (
                        <button onClick={() => openComposer(t)}
                          className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0'
                          style={{ backgroundColor: '#25D366' }}>
                          <MessageSquare className='w-3 h-3' /> WA
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Log de enviados */}
          {sentLog.length > 0 && (
            <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
              <p className='text-xs font-bold text-gray-500 uppercase tracking-wide mb-3'>
                Enviados esta sesión ({sentLog.length})
              </p>
              <div className='space-y-1 max-h-40 overflow-y-auto'>
                {sentLog.map(l => (
                  <div key={l.id} className='flex items-center gap-2 text-xs text-gray-600 py-1 border-b border-gray-50 last:border-0'>
                    <CheckCircle className='w-3 h-3 text-green-500 flex-shrink-0' />
                    <span className='font-semibold'>{l.name}</span>
                    <span className='text-gray-400'>— {l.template}</span>
                    <span className='ml-auto text-gray-400 flex-shrink-0'>{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {composingFor && (
        <MessageModal
          tenant={composingFor.tenant}
          defaultMsg={composingFor.msg}
          onSent={markSent}
          onClose={() => setComposingFor(null)}
        />
      )}
    </div>
  )
}
