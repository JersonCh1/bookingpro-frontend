import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Users, Phone, Pencil, Trash2 } from 'lucide-react'
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from '../../hooks/useBookings'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'

const createSchema = z.object({
  name:  z.string().min(2, 'Mínimo 2 caracteres'),
  phone: z.string().optional(),
})

const editSchema = z.object({
  name:      z.string().min(2, 'Mínimo 2 caracteres'),
  phone:     z.string().optional(),
  is_active: z.boolean().optional(),
})

function StaffForm({ defaultValues, onSubmit, loading, isEdit }) {
  const schema = isEdit ? editSchema : createSchema
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { is_active: true, ...defaultValues },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Nombre'
        placeholder='Ej: María García'
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label='Teléfono (opcional)'
        type='tel'
        placeholder='+51 987 654 321'
        error={errors.phone?.message}
        {...register('phone')}
      />
      {isEdit && (
        <label className='flex items-center gap-2 cursor-pointer'>
          <input type='checkbox' className='rounded' {...register('is_active')} />
          <span className='text-sm text-gray-700'>Empleado activo</span>
        </label>
      )}
      <Button type='submit' loading={loading} className='w-full'>
        {isEdit ? 'Guardar cambios' : 'Agregar al equipo'}
      </Button>
    </form>
  )
}

export default function Staff() {
  const [modal, setModal] = useState(null)  // null | 'create' | <staff object>

  const { data, isLoading }                    = useStaff()
  const { mutate: create, isPending: creating } = useCreateStaff()
  const { mutate: update, isPending: updating } = useUpdateStaff()
  const { mutate: remove }                      = useDeleteStaff()

  // La API devuelve respuesta paginada: { count, results, ... }
  const staff = data?.results ?? []

  const handleCreate = (data) => create(data, { onSuccess: () => setModal(null) })
  const handleUpdate = (data) => update({ id: modal.id, ...data }, { onSuccess: () => setModal(null) })

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Personal</h1>
          <p className='text-gray-500 text-sm mt-0.5'>Gestiona tu equipo de trabajo</p>
        </div>
        <Button onClick={() => setModal('create')}>
          <Plus className='w-4 h-4' />
          <span className='hidden sm:inline'>Agregar personal</span>
          <span className='sm:hidden'>Agregar</span>
        </Button>
      </div>

      {isLoading ? (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse'>
          {[...Array(2)].map((_, i) => <div key={i} className='card h-28' />)}
        </div>
      ) : staff.length === 0 ? (
        <div className='card p-12 text-center'>
          <Users className='w-10 h-10 text-gray-200 mx-auto mb-3' />
          <p className='text-gray-500 mb-4'>Aún no tienes personal registrado</p>
          <Button onClick={() => setModal('create')}>
            <Plus className='w-4 h-4' /> Agregar primera persona
          </Button>
        </div>
      ) : (
        <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {staff.map(s => (
            <div key={s.id} className={`card p-5 ${!s.is_active ? 'opacity-60' : ''}`}>
              <div className='flex items-start justify-between mb-3'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0'>
                    <span className='text-primary-700 font-semibold text-sm'>
                      {s.name?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div>
                    <p className='font-semibold text-gray-900'>{s.name}</p>
                    {s.phone && (
                      <p className='text-xs text-gray-400 flex items-center gap-1 mt-0.5'>
                        <Phone className='w-3 h-3' />{s.phone}
                      </p>
                    )}
                  </div>
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
                    onClick={() => { if (confirm(`¿Eliminar a "${s.name}"?`)) remove(s.id) }}
                    className='p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors'
                    title='Eliminar'
                  >
                    <Trash2 className='w-4 h-4' />
                  </button>
                </div>
              </div>

              <div className='flex items-center justify-between text-xs mt-2'>
                <span className='text-gray-400'>
                  {s.service_ids?.length ?? 0} servicio{s.service_ids?.length !== 1 ? 's' : ''} asignado{s.service_ids?.length !== 1 ? 's' : ''}
                </span>
                <span className={`badge ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {s.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal crear */}
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title='Agregar personal'>
        <StaffForm onSubmit={handleCreate} loading={creating} />
      </Modal>

      {/* Modal editar */}
      <Modal
        open={typeof modal === 'object' && modal !== null}
        onClose={() => setModal(null)}
        title='Editar empleado'
      >
        {typeof modal === 'object' && modal && (
          <StaffForm defaultValues={modal} onSubmit={handleUpdate} loading={updating} isEdit />
        )}
      </Modal>
    </div>
  )
}
