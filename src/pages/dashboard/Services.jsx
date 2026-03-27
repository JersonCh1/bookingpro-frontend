import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Scissors, Clock, DollarSign, Upload, X } from 'lucide-react'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../hooks/useBookings'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { formatCurrency } from '../../utils/helpers'

const MAX_SIZE_BYTES = 800 * 1024  // 800 KB

const schema = z.object({
  name:        z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  image_url:   z.string().optional(),
  duration:    z.coerce.number().min(15, 'Mínimo 15 min'),
  price:       z.coerce.number().min(0, 'Precio inválido'),
  is_active:   z.boolean().optional(),
})

function ServiceForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, ...defaultValues },
  })
  const descValue = watch('description') || ''
  const imageUrl = watch('image_url') || ''
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_SIZE_BYTES) {
      alert('Imagen muy grande (máx. 800 KB). Comprime la foto primero.')
      return
    }
    setUploading(true)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setValue('image_url', ev.target.result)
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Nombre del servicio'
        placeholder='Ej: Corte de cabello'
        error={errors.name?.message}
        {...register('name')}
      />
      <div>
        <div className='flex items-center justify-between mb-1'>
          <label className='block text-sm font-medium text-gray-700'>Descripción (opcional)</label>
          <span className={`text-xs ${descValue.length > 130 ? 'text-red-500' : 'text-gray-400'}`}>
            {descValue.length}/150
          </span>
        </div>
        <textarea
          className='input resize-none'
          rows={2}
          maxLength={150}
          placeholder='Ej: Incluye lavado y secado, productos premium'
          {...register('description')}
        />
      </div>
      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium text-gray-700'>Imagen del servicio (opcional)</label>
        <div className='flex items-start gap-4'>
          <div className='flex-shrink-0'>
            {imageUrl ? (
              <div className='relative'>
                <img
                  src={imageUrl}
                  alt='Preview'
                  className='w-20 h-20 rounded-xl object-cover border-2 border-gray-200'
                  onError={e => { e.target.style.display = 'none' }}
                />
                <button
                  type='button'
                  onClick={() => { setValue('image_url', ''); if (fileRef.current) fileRef.current.value = '' }}
                  className='absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600'
                >
                  <X className='w-3 h-3' />
                </button>
              </div>
            ) : (
              <div className='w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50'>
                <Upload className='w-6 h-6 text-gray-300' />
              </div>
            )}
          </div>
          <div className='flex-1 space-y-2'>
            <input ref={fileRef} type='file' accept='image/*' className='hidden' onChange={handleFileChange} />
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
            <div className='flex items-center gap-2'>
              <div className='flex-1 h-px bg-gray-200' />
              <span className='text-xs text-gray-400'>o pega una URL</span>
              <div className='flex-1 h-px bg-gray-200' />
            </div>
            <input
              type='text'
              placeholder='https://...'
              className='w-full px-3 py-2 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-gray-400'
              {...register('image_url')}
            />
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <Input
          label='Duración (min)'
          type='number'
          min={15}
          step={15}
          placeholder='60'
          error={errors.duration?.message}
          {...register('duration')}
        />
        <Input
          label='Precio (S/.)'
          type='number'
          min={0}
          step={0.50}
          placeholder='50.00'
          error={errors.price?.message}
          {...register('price')}
        />
      </div>
      <label className='flex items-center gap-2 cursor-pointer'>
        <input type='checkbox' className='rounded' {...register('is_active')} />
        <span className='text-sm text-gray-700'>Servicio activo (visible para clientes)</span>
      </label>
      <Button type='submit' loading={loading} className='w-full'>
        Guardar servicio
      </Button>
    </form>
  )
}

export default function Services() {
  const [modal, setModal] = useState(null)  // null | 'create' | <service object>

  const { data, isLoading }                    = useServices()
  const { mutate: create, isPending: creating } = useCreateService()
  const { mutate: update, isPending: updating } = useUpdateService()
  const { mutate: remove }                      = useDeleteService()

  // La API devuelve una respuesta paginada: { count, results, next, previous }
  const services = data?.results ?? []

  const handleCreate = (data) => create(data, { onSuccess: () => setModal(null) })
  const handleUpdate = (data) => update({ id: modal.id, ...data }, { onSuccess: () => setModal(null) })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Servicios</h1>
          <p className='text-gray-500 text-sm mt-0.5'>Los servicios que ofreces a tus clientes</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus className='w-4 h-4' />
          <span className='hidden sm:inline'>Nuevo servicio</span>
          <span className='sm:hidden'>Nuevo</span>
        </Button>
      </div>

      {isLoading ? (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse'>
          {[...Array(3)].map((_, i) => <div key={i} className='card h-36' />)}
        </div>
      ) : services.length === 0 ? (
        <div className='card p-12 text-center'>
          <Scissors className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-500 mb-4'>Aún no tienes servicios registrados</p>
          <Button onClick={() => setModal('create')}>
            <Plus className='w-4 h-4' /> Crear primer servicio
          </Button>
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {services.map(s => (
            <div key={s.id} className={`card p-5 hover:shadow-md transition-shadow ${!s.is_active ? 'opacity-60' : ''}`}>
              <div className='flex items-start justify-between mb-3'>
                <div className='w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden'>
                  {s.image_url
                    ? <img src={s.image_url} alt={s.name} className='w-full h-full object-cover rounded-xl' onError={e => { e.target.style.display = 'none' }} />
                    : <Scissors className='w-5 h-5 text-primary-600' />
                  }
                </div>
                <div className='flex gap-1'>
                  <button
                    onClick={() => setModal(s)}
                    className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors'
                    title='Editar'
                  >
                    <Pencil className='w-4 h-4' />
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar "${s.name}"?`)) remove(s.id) }}
                    className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors'
                    title='Eliminar'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <h3 className='font-semibold text-gray-900'>{s.name}</h3>
              {s.description && (
                <p className='text-gray-400 text-sm mt-1 line-clamp-2'>{s.description}</p>
              )}
              {!s.is_active && (
                <span className='inline-block mt-1 text-xs text-gray-400 italic'>Inactivo</span>
              )}

              <div className='flex items-center justify-between mt-3 pt-3 border-t border-gray-100'>
                <span className='flex items-center gap-1 text-sm text-gray-500'>
                  <Clock className='w-3.5 h-3.5' />
                  {s.duration} min
                </span>
                <span className='flex items-center gap-1 font-semibold text-primary-600'>
                  <DollarSign className='w-3.5 h-3.5' />
                  {formatCurrency(s.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modal === 'create'} onClose={() => setModal(null)} title='Nuevo servicio'>
        <ServiceForm onSubmit={handleCreate} loading={creating} />
      </Modal>

      <Modal
        open={typeof modal === 'object' && modal !== null}
        onClose={() => setModal(null)}
        title='Editar servicio'
      >
        {typeof modal === 'object' && modal && (
          <ServiceForm defaultValues={modal} onSubmit={handleUpdate} loading={updating} />
        )}
      </Modal>
    </div>
  )
}
