import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Scissors, Clock, DollarSign } from 'lucide-react'
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../hooks/useBookings'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { formatCurrency } from '../../utils/helpers'

const schema = z.object({
  name:        z.string().min(1, 'Requerido'),
  description: z.string().optional(),
  duration:    z.coerce.number().min(15, 'Mínimo 15 min'),
  price:       z.coerce.number().min(0, 'Precio inválido'),
  is_active:   z.boolean().optional(),
})

function ServiceForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, ...defaultValues },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Nombre del servicio'
        placeholder='Ej: Corte de cabello'
        error={errors.name?.message}
        {...register('name')}
      />
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>Descripción (opcional)</label>
        <textarea
          className='input resize-none'
          rows={2}
          placeholder='Descripción breve del servicio...'
          {...register('description')}
        />
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
                <div className='w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0'>
                  <Scissors className='w-5 h-5 text-primary-600' />
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
