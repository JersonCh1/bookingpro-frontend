import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { schedulingApi } from '../../api/bookings'
import { Clock, Plus, Trash2, Ban } from 'lucide-react'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import { useStaff } from '../../hooks/useBookings'
import {
  format, addMonths, subMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay,
} from 'date-fns'
import { es } from 'date-fns/locale'

const DAYS = [
  { value: 0, label: 'Lunes' },
  { value: 1, label: 'Martes' },
  { value: 2, label: 'Miércoles' },
  { value: 3, label: 'Jueves' },
  { value: 4, label: 'Viernes' },
  { value: 5, label: 'Sábado' },
  { value: 6, label: 'Domingo' },
]

const TAB_LABELS = ['Horarios semanales', 'Días bloqueados']

export default function Scheduling() {
  const qc   = useQueryClient()
  const [tab, setTab]   = useState(0)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ staff: '', day_of_week: 0, start_time: '09:00', end_time: '18:00' })

  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ['schedules'],
    queryFn:  () => schedulingApi.list().then(r => r.data.data),
  })
  const schedules = schedulesData?.results ?? []

  const { data: staffData } = useStaff()
  const staffList = staffData?.results ?? []

  const createMut = useMutation({
    mutationFn: (data) => schedulingApi.create(data).then(r => r.data.data),
    onSuccess:  () => { qc.invalidateQueries({ queryKey: ['schedules'] }); setOpen(false) },
  })
  const deleteMut = useMutation({
    mutationFn: (id) => schedulingApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })

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
        {tab === 0 && (
          <Button onClick={() => setOpen(true)}>
            <Plus className='w-4 h-4' /> Agregar horario
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className='flex gap-1 bg-gray-100 p-1 rounded-xl w-fit'>
        {TAB_LABELS.map((label, i) => (
          <button key={i} onClick={() => setTab(i)}
            className='px-4 py-2 rounded-lg text-sm font-medium transition-all'
            style={{
              backgroundColor: tab === i ? 'white' : 'transparent',
              color: tab === i ? '#111827' : '#6b7280',
              boxShadow: tab === i ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}>
            {i === 1 && <Ban className='w-3.5 h-3.5 inline mr-1.5' />}
            {label}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <>
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
                          <button onClick={() => deleteMut.mutate(s.id)}
                            className='ml-1 text-primary-400 hover:text-red-500 transition-colors'>
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
        </>
      )}

      {tab === 1 && <BlockedDaysSection />}

      <Modal open={open} onClose={() => setOpen(false)} title='Nuevo horario'>
        <div className='space-y-4'>
          <Select label='Día de la semana' value={form.day_of_week}
            onChange={e => setForm(f => ({ ...f, day_of_week: parseInt(e.target.value) }))}>
            {DAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </Select>
          <div className='grid grid-cols-2 gap-4'>
            <Input label='Hora inicio' type='time' value={form.start_time}
              onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            <Input label='Hora fin' type='time' value={form.end_time}
              onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
          </div>
          <Select label='Empleado (opcional)' value={form.staff}
            onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}>
            <option value=''>Todo el negocio</option>
            {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Button className='w-full' loading={createMut.isPending}
            onClick={() => createMut.mutate({
              day_of_week: form.day_of_week,
              start_time:  form.start_time,
              end_time:    form.end_time,
              staff:       form.staff || null,
            })}>
            Guardar horario
          </Button>
        </div>
      </Modal>
    </div>
  )
}

/* ── Sección de días bloqueados (all_day) ── */
function BlockedDaysSection() {
  const qc = useQueryClient()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [reason, setReason] = useState('')

  const { data: blockedDays = [] } = useQuery({
    queryKey: ['blocked-days'],
    queryFn:  () => schedulingApi.listBlockedDays().then(r => r.data.data),
  })

  const blockedSet = new Set(blockedDays.map(d => d.date))

  const toggleMut = useMutation({
    mutationFn: (data) => schedulingApi.toggleBlockedDay(data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['blocked-days'] }),
  })

  // Construir días del mes
  const start = startOfMonth(currentMonth)
  const end   = endOfMonth(currentMonth)
  const days  = eachDayOfInterval({ start, end })
  const offset = (getDay(start) + 6) % 7  // 0=Lunes

  function handleDayClick(day) {
    const dateStr = format(day, 'yyyy-MM-dd')
    if (blockedSet.has(dateStr)) {
      const slot = blockedDays.find(d => d.date === dateStr)
      if (slot) schedulingApi.deleteBlockedDay(slot.id).then(() => qc.invalidateQueries({ queryKey: ['blocked-days'] }))
    } else {
      toggleMut.mutate({ date: dateStr, reason })
    }
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-xl p-3 text-sm' style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#92400e' }}>
        <strong>¿Cómo funciona?</strong> Click en un día para bloquearlo (aparecerá en rojo). Los días bloqueados no estarán disponibles para reservas.
      </div>

      {/* Motivo opcional */}
      <div className='flex items-center gap-2'>
        <input type='text' value={reason} onChange={e => setReason(e.target.value)}
          placeholder='Motivo opcional (ej: Feriado, Vacaciones)'
          className='flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none' />
      </div>

      {/* Calendario */}
      <div className='bg-white rounded-2xl p-4 border border-gray-100 shadow-sm'>
        {/* Navegación */}
        <div className='flex items-center justify-between mb-4'>
          <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
            className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-600'>‹</button>
          <p className='text-sm font-bold text-gray-900 capitalize'>
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </p>
          <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
            className='p-1.5 rounded-lg hover:bg-gray-100 text-gray-600'>›</button>
        </div>

        {/* Header días */}
        <div className='grid grid-cols-7 mb-2'>
          {['Lu','Ma','Mi','Ju','Vi','Sá','Do'].map(d => (
            <div key={d} className='text-center text-[11px] font-bold text-gray-400'>{d}</div>
          ))}
        </div>

        {/* Días */}
        <div className='grid grid-cols-7 gap-1'>
          {[...Array(offset)].map((_, i) => <div key={`empty-${i}`} />)}
          {days.map(day => {
            const dateStr  = format(day, 'yyyy-MM-dd')
            const isBlocked = blockedSet.has(dateStr)
            return (
              <button key={dateStr} onClick={() => handleDayClick(day)}
                className='aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all'
                style={{
                  backgroundColor: isBlocked ? '#fef2f2' : 'transparent',
                  color:           isBlocked ? '#C0392B' : '#374151',
                  border:          isBlocked ? '2px solid #fca5a5' : '2px solid transparent',
                  fontWeight:      isBlocked ? 700 : 400,
                }}>
                {isBlocked ? '✕' : format(day, 'd')}
              </button>
            )
          })}
        </div>
      </div>

      {/* Lista de días bloqueados */}
      {blockedDays.length > 0 && (
        <div className='bg-white rounded-xl border border-gray-100 overflow-hidden'>
          <div className='px-4 py-3 border-b border-gray-100'>
            <p className='text-sm font-bold text-gray-700'>Días bloqueados ({blockedDays.length})</p>
          </div>
          <div className='divide-y divide-gray-50'>
            {blockedDays.map(d => (
              <div key={d.id} className='flex items-center justify-between px-4 py-2.5'>
                <div>
                  <span className='text-sm font-medium text-gray-900 capitalize'>{d.date}</span>
                  {d.reason && <span className='ml-2 text-xs text-gray-400'>— {d.reason}</span>}
                </div>
                <button
                  onClick={() => schedulingApi.deleteBlockedDay(d.id).then(() => qc.invalidateQueries({ queryKey: ['blocked-days'] }))}
                  className='p-1 rounded text-gray-400 hover:text-red-500 transition-colors'>
                  <Trash2 className='w-3.5 h-3.5' />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
