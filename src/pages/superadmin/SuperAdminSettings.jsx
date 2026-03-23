import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../api/admin'
import { Save, Settings, DollarSign, MessageSquare, Phone, CheckCircle, AlertTriangle } from 'lucide-react'

const SECTIONS = [
  { id: 'pricing',    label: 'Precios y planes',    icon: DollarSign },
  { id: 'contact',   label: 'Contacto y pagos',     icon: Phone },
  { id: 'messages',  label: 'Plantillas de mensajes', icon: MessageSquare },
]

function Field({ label, description, children }) {
  return (
    <div className='space-y-1.5'>
      <div>
        <label className='text-sm font-semibold text-gray-700'>{label}</label>
        {description && <p className='text-xs text-gray-400 mt-0.5'>{description}</p>}
      </div>
      {children}
    </div>
  )
}

export default function SuperAdminSettings() {
  const [section, setSection] = useState('pricing')
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    monthly_price:         '',
    annual_price:          '',
    trial_days:            '7',
    yape_number:           '',
    plin_number:           '',
    contact_whatsapp:      '',
    msg_trial_expiring:    '',
    msg_payment_reminder:  '',
    msg_welcome:           '',
  })

  const qc = useQueryClient()

  const { data: config, isLoading } = useQuery({
    queryKey: ['admin-config'],
    queryFn: () => adminApi.getConfig().then(r => r.data.data),
  })

  useEffect(() => {
    if (config) {
      setForm(prev => ({
        ...prev,
        monthly_price:        config.monthly_price        ?? '',
        annual_price:         config.annual_price         ?? '',
        trial_days:           config.trial_days           ?? '7',
        yape_number:          config.yape_number          ?? '',
        plin_number:          config.plin_number          ?? '',
        contact_whatsapp:     config.contact_whatsapp     ?? '',
        msg_trial_expiring:   config.msg_trial_expiring   ?? '',
        msg_payment_reminder: config.msg_payment_reminder ?? '',
        msg_welcome:          config.msg_welcome          ?? '',
      }))
    }
  }, [config])

  const mutation = useMutation({
    mutationFn: (data) => adminApi.saveConfig(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-config'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  function handleSave() {
    mutation.mutate(form)
  }

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  if (isLoading) return (
    <div className='space-y-4'>
      {[...Array(4)].map((_, i) => <div key={i} className='h-16 rounded-2xl bg-gray-100 animate-pulse' />)}
    </div>
  )

  return (
    <div className='space-y-5'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Configuración del sistema</h1>
          <p className='text-gray-500 text-sm mt-0.5'>Precios, contacto y plantillas de AgendaYa</p>
        </div>
        <button onClick={handleSave} disabled={mutation.isPending}
          className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60'
          style={{ backgroundColor: saved ? '#22c55e' : '#6366f1' }}>
          {saved ? <CheckCircle className='w-4 h-4' /> : <Save className='w-4 h-4' />}
          {saved ? 'Guardado' : mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {mutation.isError && (
        <div className='flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200'>
          <AlertTriangle className='w-4 h-4' />
          Error al guardar. Verifica que el backend tenga el endpoint /admin/config/
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-5'>
        {/* Sidebar de secciones */}
        <div className='bg-white rounded-2xl p-3 border border-gray-100 shadow-sm h-fit'>
          {SECTIONS.map(s => {
            const Icon = s.icon
            const active = section === s.id
            return (
              <button key={s.id} onClick={() => setSection(s.id)}
                className='flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left'
                style={{
                  backgroundColor: active ? '#6366f115' : 'transparent',
                  color: active ? '#4f46e5' : '#6b7280',
                }}>
                <Icon className='w-4 h-4 flex-shrink-0' />
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Contenido */}
        <div className='lg:col-span-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6'>
          {section === 'pricing' && (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <DollarSign className='w-5 h-5 text-indigo-500' />
                <h2 className='font-bold text-gray-900'>Precios y planes</h2>
              </div>
              <Field label='Precio mensual (S/.)' description='Precio que cobras por suscripción mensual'>
                <input type='number' value={form.monthly_price} onChange={e => set('monthly_price', e.target.value)}
                  placeholder='Ej: 49'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
              <Field label='Precio anual (S/.)' description='Precio con descuento para pago anual (opcional)'>
                <input type='number' value={form.annual_price} onChange={e => set('annual_price', e.target.value)}
                  placeholder='Ej: 490'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
              <Field label='Días de trial gratuito' description='Cuántos días tiene el nuevo negocio para probar'>
                <input type='number' value={form.trial_days} onChange={e => set('trial_days', e.target.value)}
                  min='1' max='90'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
              {form.monthly_price && (
                <div className='rounded-xl p-4 bg-indigo-50 border border-indigo-100'>
                  <p className='text-xs font-bold text-indigo-700 mb-2'>Resumen actual</p>
                  <div className='grid grid-cols-3 gap-3'>
                    <div className='text-center'>
                      <p className='text-lg font-bold text-indigo-800'>S/. {form.monthly_price}</p>
                      <p className='text-xs text-indigo-500'>mensual</p>
                    </div>
                    {form.annual_price && (
                      <div className='text-center'>
                        <p className='text-lg font-bold text-indigo-800'>S/. {form.annual_price}</p>
                        <p className='text-xs text-indigo-500'>anual</p>
                      </div>
                    )}
                    <div className='text-center'>
                      <p className='text-lg font-bold text-indigo-800'>{form.trial_days} días</p>
                      <p className='text-xs text-indigo-500'>trial</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {section === 'contact' && (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <Phone className='w-5 h-5 text-indigo-500' />
                <h2 className='font-bold text-gray-900'>Contacto y métodos de pago</h2>
              </div>
              <Field label='Número Yape' description='Número al que deben yapear para pagar la suscripción'>
                <input type='text' value={form.yape_number} onChange={e => set('yape_number', e.target.value)}
                  placeholder='Ej: 999888777'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
              <Field label='Número Plin (opcional)' description='Número Plin si aceptas pagos por Plin'>
                <input type='text' value={form.plin_number} onChange={e => set('plin_number', e.target.value)}
                  placeholder='Ej: 999888777'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
              <Field label='WhatsApp de soporte' description='Número de WhatsApp que ven los clientes para soporte'>
                <input type='text' value={form.contact_whatsapp} onChange={e => set('contact_whatsapp', e.target.value)}
                  placeholder='Ej: 51999888777'
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200' />
              </Field>
            </>
          )}

          {section === 'messages' && (
            <>
              <div className='flex items-center gap-2 mb-2'>
                <MessageSquare className='w-5 h-5 text-indigo-500' />
                <h2 className='font-bold text-gray-900'>Plantillas de mensajes WhatsApp</h2>
              </div>
              <p className='text-xs text-gray-400 -mt-3'>
                Usa <code className='bg-gray-100 px-1 rounded'>{'{{name}}'}</code> para insertar el nombre del negocio automáticamente.
              </p>
              <Field label='Trial por vencer' description='Se envía cuando faltan 2 días para que venza el trial'>
                <textarea rows={5} value={form.msg_trial_expiring}
                  onChange={e => set('msg_trial_expiring', e.target.value)}
                  placeholder={`Hola {{name}} 👋 Tu prueba gratuita de AgendaYa vence pronto...`}
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none' />
              </Field>
              <Field label='Recordatorio de pago' description='Se envía cuando la suscripción está vencida'>
                <textarea rows={5} value={form.msg_payment_reminder}
                  onChange={e => set('msg_payment_reminder', e.target.value)}
                  placeholder={`Hola {{name}} 👋 Tu suscripción de AgendaYa está pendiente de pago...`}
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none' />
              </Field>
              <Field label='Mensaje de bienvenida' description='Se envía al activar una cuenta nueva'>
                <textarea rows={5} value={form.msg_welcome}
                  onChange={e => set('msg_welcome', e.target.value)}
                  placeholder={`¡Hola {{name}}! 🎉 Bienvenido/a a AgendaYa...`}
                  className='w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none' />
              </Field>
            </>
          )}

          <div className='pt-2 border-t border-gray-100 flex justify-end'>
            <button onClick={handleSave} disabled={mutation.isPending}
              className='flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60'
              style={{ backgroundColor: saved ? '#22c55e' : '#6366f1' }}>
              {saved ? <CheckCircle className='w-4 h-4' /> : <Save className='w-4 h-4' />}
              {saved ? 'Guardado' : mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </div>
      </div>

      <div className='rounded-2xl p-4 flex items-start gap-3'
        style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
        <Settings className='w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0' />
        <p className='text-xs text-amber-700'>
          <strong className='text-amber-900'>Nota:</strong> Los cambios de configuración son globales. El campo <em>trial_days</em> solo aplica a nuevos registros, no afecta negocios ya creados.
        </p>
      </div>
    </div>
  )
}
