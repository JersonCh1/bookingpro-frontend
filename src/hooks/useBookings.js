import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi, servicesApi, staffApi, schedulingApi } from '../api/bookings'

// Todas las respuestas del backend tienen forma { success, data: <payload> }
// Axios envuelve el body en r.data, así que el payload real está en r.data.data

// ── Stats & Bookings ──────────────────────────────────────
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn:  () => bookingsApi.stats().then(r => r.data.data),
  })
}

export function useBookingsToday() {
  return useQuery({
    queryKey: ['bookings', 'today'],
    queryFn:  () => bookingsApi.today().then(r => r.data.data),
  })
}

export function useBookings(params) {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn:  () => bookingsApi.list(params).then(r => r.data.data),
  })
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => bookingsApi.updateStatus(id, data).then(r => r.data.data),
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: ['bookings'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
    },
  })
}

// ── Services ──────────────────────────────────────────────
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    // Lista paginada → devuelve { count, results, next, previous }
    queryFn:  () => servicesApi.list().then(r => r.data.data),
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => servicesApi.create(data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => servicesApi.update(id, data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => servicesApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['services'] }),
  })
}

// ── Staff ─────────────────────────────────────────────────
export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn:  () => staffApi.list().then(r => r.data.data),
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => staffApi.create(data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => staffApi.update(id, data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export function useDeleteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => staffApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

// ── Scheduling ────────────────────────────────────────────
export function useSchedules(params) {
  return useQuery({
    queryKey: ['schedules', params],
    queryFn:  () => schedulingApi.list(params).then(r => r.data.data),
  })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => schedulingApi.create(data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })
}

export function useUpdateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => schedulingApi.update(id, data).then(r => r.data.data),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })
}

export function useDeleteSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => schedulingApi.delete(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ['schedules'] }),
  })
}

export function useAvailableSlots(params) {
  return useQuery({
    queryKey: ['slots', params],
    queryFn:  () => schedulingApi.availableSlots(params).then(r => r.data.data),
    enabled:  !!(params?.date && params?.service_id && params?.tenant_slug),
  })
}
