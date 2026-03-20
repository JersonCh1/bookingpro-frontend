import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schedulingApi } from '../../api/bookings'
import { Clock, Plus, Trash2 } from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import { useStaff } from '../../hooks/useBookings'

const DAYS = [
  { value: 0, label: 'Lunes' },
  { value: 1, label: 'Martes' },
  { value: 2, label: 'Miércoles' },
  { value: 3, label: 'Jueves' },
  { value: 4, label: 'Viernes' },
  { value: 5, label: 'Sábado' },
  { value: 6, label: 'Domingo' },
]

export default function Scheduling() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ staff: '', day_of_week: 0, start_time: '09:00', end_time: '18:00' })

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn:  () => schedulingApi.list().then(r => r.data),
  })
  const { data: staffList = [] } = useStaff()

  const createMut = useMutation({
    mutationFn: (data) => schedulingApi.create(data).then(r => r.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['schedules'] }); setOpen(false) },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => schedulingApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })

  // Agrupar por día
  const byDay = DAYS.map(d => ({
    ...d,
    schedules: schedules.filter(s => s.day_of_week === d.value),
  }))

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Horarios</h1>
          <p className='text-gray-500 text-sm mt-0.5'>Configura los días y horas de atención</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className='w-4 h-4' /> Agregar horario
        </Button>
      </div>

      {isLoading ? (
        <div className='space-y-3 animate-pulse'>
          {[...Array(5)].map((_, i) => <div key={i} className='card h-14' />)}
        </div>
      ) : (
        <div className='card divide-y divide-gray-100'>
          {byDay.map(({ value, label, schedules: daySchedules }) => (
            <div key={value} className='px-6 py-4 flex items-start gap-4'>
              <div className='w-24 flex-shrink-0'>
                <span className={`text-sm font-semibold ${daySchedules.length ? 'text-gray-900' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
              <div className='flex-1 flex flex-wrap gap-2'>
                {daySchedules.length === 0 ? (
                  <span className='text-sm text-gray-400 italic'>Sin horario</span>
                ) : (
                  daySchedules.map(s => (
                    <div key={s.id} className='flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-lg px-3 py-1.5'>
                      <Clock className='w-3.5 h-3.5 text-primary-600' />
                      <span className='text-sm text-primary-700 font-medium'>
                        {s.start_time} – {s.end_time}
                        {s.staff && <span className='text-primary-500 ml-1 text-xs'>({staffList.find(st => st.id === s.staff)?.name})</span>}
                      </span>
                      <button
                        onClick={() => deleteMut.mutate(s.id)}
                        className='ml-1 text-primary-400 hover:text-red-500 transition-colors'
                      >
                        <Trash2 className='w-3.5 h-3.5' />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title='Nuevo horario'>
        <div className='space-y-4'>
          <Select
            label='Día de la semana'
            value={form.day_of_week}
            onChange={e => setForm(f => ({ ...f, day_of_week: parseInt(e.target.value) }))}
          >
            {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </Select>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Hora inicio'
              type='time'
              value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))}
            />
            <Input
              label='Hora fin'
              type='time'
              value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))}
            />
          </div>
          <Select
            label='Empleado (opcional)'
            value={form.staff}
            onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}
          >
            <option value=''>Todo el negocio</option>
            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Button
            className='w-full'
            loading={createMut.isPending}
            onClick={() => createMut.mutate({
              day_of_week: form.day_of_week,
              start_time:  form.start_time,
              end_time:    form.end_time,
              staff:       form.staff || null,
            })}
          >
            Guardar horario
          </Button>
        </div>
      </Modal>
    </div>
  )
}
