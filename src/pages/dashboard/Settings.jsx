import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { ExternalLink, Copy, Check, Upload, X, MapPin } from 'lucide-react'

const MAX_SIZE_BYTES = 800 * 1024  // 800 KB

const schema = z.object({
  name:          z.string().min(2, 'Mínimo 2 caracteres'),
  business_type: z.string().min(1, 'Requerido'),
  phone:         z.string().min(1, 'Requerido'),
  email:         z.string().email('Email inválido'),
  address:       z.string().optional(),
  city:          z.string().optional(),
  description:   z.string().optional(),
  logo:          z.string().optional(),
})

const TYPES = [
  'salon', 'barberia', 'spa', 'consultorio', 'estudio', 'gym', 'otro',
]

function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])
  return (
    <div className='fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium'
      style={{
        backgroundColor: type === 'success' ? '#f0fdf4' : '#fef2f2',
        border: `1px solid ${type === 'success' ? '#bbf7d0' : '#fecaca'}`,
        color: type === 'success' ? '#166534' : '#991b1b',
      }}>
      <span>{type === 'success' ? '✓' : '✗'}</span>
      <span>{message}</span>
      <button onClick={onClose} className='ml-2 opacity-60 hover:opacity-100' aria-label='Cerrar'>×</button>
    </div>
  )
}

export default function Settings() {
  const { tenant, updateTenant } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name:          tenant?.name          || '',
      business_type: tenant?.business_type || '',
      phone:         tenant?.phone         || '',
      email:         tenant?.email         || '',
      address:       tenant?.address       || '',
      city:          tenant?.city          || '',
      description:   tenant?.description   || '',
      logo:          tenant?.logo          || '',
    },
  })

  const logoValue = watch('logo')

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE_BYTES) {
      setToast({ message: 'Imagen muy grande (máx. 800 KB). Comprime la foto primero.', type: 'error' })
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setValue('logo', ev.target.result)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => authApi.updateTenant(data).then(r => r.data.data),
    onSuccess: (data) => {
      updateTenant(data)
      setToast({ message: '✓ Cambios guardados correctamente', type: 'success' })
    },
    onError: () => {
      setToast({ message: 'Error al guardar. Intenta de nuevo', type: 'error' })
    },
  })

  const publicUrl = `${window.location.origin}/book/${tenant?.slug}`

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='space-y-6 max-w-2xl'>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Ajustes</h1>
        <p className='text-gray-500 text-sm mt-0.5'>Información de tu negocio</p>
      </div>

      {/* URL pública */}
      <div className='card p-6'>
        <h2 className='font-semibold text-gray-900 mb-1'>Tu página de reservas</h2>
        <p className='text-sm text-gray-500 mb-3'>Comparte este enlace con tus clientes</p>
        <div className='flex items-center gap-2'>
          <div className='flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 truncate font-mono'>
            {publicUrl}
          </div>
          <button
            onClick={copyUrl}
            aria-label='Copiar enlace'
            className='flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-all text-sm font-medium'
            style={{
              borderColor: copied ? '#bbf7d0' : '#e5e7eb',
              backgroundColor: copied ? '#f0fdf4' : 'white',
              color: copied ? '#166534' : '#6b7280',
            }}
          >
            {copied ? <><Check className='w-4 h-4' /> Copiado!</> : <><Copy className='w-4 h-4' /> Copiar</>}
          </button>
          <a
            href={publicUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
          >
            <ExternalLink className='w-4 h-4 text-gray-500' />
          </a>
        </div>
      </div>

      {/* Formulario */}
      <div className='card p-6'>
        <h2 className='font-semibold text-gray-900 mb-4'>Datos del negocio</h2>

        <form onSubmit={handleSubmit(mutate)} className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input label='Nombre del negocio' error={errors.name?.message}          {...register('name')} />
            <Select label='Tipo de negocio'   error={errors.business_type?.message} {...register('business_type')}>
              <option value=''>Seleccionar...</option>
              {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </Select>
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Input label='Teléfono'         error={errors.phone?.message} {...register('phone')} />
            <Input label='Email de contacto' type='email' error={errors.email?.message} {...register('email')} />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            <Input label='Dirección' {...register('address')} />
            <Input label='Ciudad'    {...register('city')} />
          </div>
          {(watch('address') || watch('city')) && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent([watch('address'), watch('city'), 'Peru'].filter(Boolean).join(' '))}`}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1.5 text-xs font-medium -mt-2'
              style={{ color: '#C0392B' }}
            >
              <MapPin className='w-3 h-3' />
              Ver en Google Maps →
            </a>
          )}
          <div className='flex flex-col gap-1.5'>
            <label className='text-sm font-medium text-gray-700'>Descripción del negocio</label>
            <textarea
              rows={3}
              placeholder='Ej: Salón de belleza con 10 años de experiencia...'
              className='w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 resize-none'
              {...register('description')}
            />
            <p className='text-xs text-gray-400'>Se mostrará en tu página pública de reservas</p>
          </div>
          {/* Logo del negocio */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium text-gray-700'>Foto / Logo del negocio</label>
            <div className='flex items-start gap-4'>
              {/* Preview */}
              <div className='flex-shrink-0'>
                {logoValue ? (
                  <div className='relative'>
                    <img
                      src={logoValue}
                      alt='Logo negocio'
                      className='w-20 h-20 rounded-2xl object-cover border-2 border-gray-200'
                      onError={e => { e.target.src = '' }}
                    />
                    <button
                      type='button'
                      onClick={() => { setValue('logo', ''); if (fileRef.current) fileRef.current.value = '' }}
                      className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
                    >
                      <X className='w-3 h-3' />
                    </button>
                  </div>
                ) : (
                  <div className='w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50'>
                    <Upload className='w-6 h-6 text-gray-300' />
                  </div>
                )}
              </div>

              {/* Controles */}
              <div className='flex-1 space-y-2'>
                {/* Botón subir archivo */}
                <input
                  ref={fileRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={handleFileChange}
                />
                <button
                  type='button'
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                  className='flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50'
                >
                  <Upload className='w-4 h-4' />
                  {uploading ? 'Procesando...' : 'Subir foto desde tu dispositivo'}
                </button>
                <p className='text-xs text-gray-400'>JPG, PNG o WebP · máx. 800 KB</p>

                {/* O pegar URL */}
                <div className='flex items-center gap-2'>
                  <div className='flex-1 h-px bg-gray-200' />
                  <span className='text-xs text-gray-400'>o pega una URL</span>
                  <div className='flex-1 h-px bg-gray-200' />
                </div>
                <input
                  type='text'
                  placeholder='https://...'
                  className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400'
                  {...register('logo')}
                />
              </div>
            </div>
          </div>
          <Button type='submit' loading={isPending}>
            Guardar cambios
          </Button>
        </form>
      </div>
    </div>
  )
}
