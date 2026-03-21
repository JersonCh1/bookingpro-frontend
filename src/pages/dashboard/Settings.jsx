import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import { ExternalLink, Copy, Check } from 'lucide-react'

const schema = z.object({
  name:          z.string().min(2, 'Mínimo 2 caracteres'),
  business_type: z.string().min(1, 'Requerido'),
  phone:         z.string().min(1, 'Requerido'),
  email:         z.string().email('Email inválido'),
  address:       z.string().optional(),
  city:          z.string().optional(),
  description:   z.string().optional(),
})

const TYPES = [
  'salon', 'barberia', 'spa', 'consultorio', 'estudio', 'gym', 'otro',
]

export default function Settings() {
  const { tenant, updateTenant } = useAuthStore()
  const [copied, setCopied] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name:          tenant?.name          || '',
      business_type: tenant?.business_type || '',
      phone:         tenant?.phone         || '',
      email:         tenant?.email         || '',
      address:       tenant?.address       || '',
      city:          tenant?.city          || '',
      description:   tenant?.description   || '',
    },
  })

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data) => authApi.updateTenant(data).then(r => r.data.data),
    onSuccess:  (data) => updateTenant(data),
  })

  const publicUrl = `${window.location.origin}/book/${tenant?.slug}`

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className='space-y-6 max-w-2xl'>
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
            className='p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors'
            title='Copiar'
          >
            {copied
              ? <Check className='w-4 h-4 text-green-600' />
              : <Copy  className='w-4 h-4 text-gray-500' />}
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

        {isSuccess && (
          <div className='mb-4 p-3 bg-green-50 border border-green-200 rounded-lg'>
            <p className='text-sm text-green-700'>Cambios guardados</p>
          </div>
        )}

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
          <Button type='submit' loading={isPending}>
            Guardar cambios
          </Button>
        </form>
      </div>
    </div>
  )
}
