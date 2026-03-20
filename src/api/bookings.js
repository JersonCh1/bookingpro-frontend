import client from './client'

// ── Services ──────────────────────────────────────────────
export const servicesApi = {
  list:   ()         => client.get('/services/'),
  create: (data)     => client.post('/services/', data),
  update: (id, data) => client.patch(`/services/${id}/`, data),
  delete: (id)       => client.delete(`/services/${id}/`),
}

// ── Staff ─────────────────────────────────────────────────
export const staffApi = {
  list:   ()         => client.get('/staff/'),
  create: (data)     => client.post('/staff/', data),
  update: (id, data) => client.patch(`/staff/${id}/`, data),
  delete: (id)       => client.delete(`/staff/${id}/`),
}

// ── Scheduling ────────────────────────────────────────────
export const schedulingApi = {
  list:            ()         => client.get('/scheduling/'),
  create:          (data)     => client.post('/scheduling/', data),
  update:          (id, data) => client.patch(`/scheduling/${id}/`, data),
  delete:          (id)       => client.delete(`/scheduling/${id}/`),
  listBlocked:     ()         => client.get('/scheduling/blocked/'),
  createBlocked:   (data)     => client.post('/scheduling/blocked/', data),
  availableSlots:  (params)   => client.get('/scheduling/available-slots/', { params }),
  availableDays:   (params)   => client.get('/scheduling/available-days/', { params }),
}

// ── Bookings ──────────────────────────────────────────────
export const bookingsApi = {
  list:         (params) => client.get('/bookings/', { params }),
  detail:       (id)     => client.get(`/bookings/${id}/`),
  updateStatus: (id, data) => client.patch(`/bookings/${id}/status/`, data),
  today:        ()       => client.get('/bookings/today/'),
  stats:        ()       => client.get('/bookings/stats/'),
  // Pública (sin auth) — requiere tenant_slug en el body
  createPublic: (data)   => client.post('/bookings/', data),
}
