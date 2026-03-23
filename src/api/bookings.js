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
  list:             ()         => client.get('/scheduling/'),
  create:           (data)     => client.post('/scheduling/', data),
  update:           (id, data) => client.patch(`/scheduling/${id}/`, data),
  delete:           (id)       => client.delete(`/scheduling/${id}/`),
  listBlocked:      ()         => client.get('/scheduling/blocked/'),
  createBlocked:    (data)     => client.post('/scheduling/blocked/', data),
  // Días bloqueados (all_day)
  listBlockedDays:  ()         => client.get('/scheduling/blocked-days/'),
  toggleBlockedDay: (data)     => client.post('/scheduling/blocked-days/', data),
  deleteBlockedDay: (id)       => client.delete(`/scheduling/blocked-days/${id}/`),
  // Disponibilidad pública
  availableSlots:   (params)   => client.get('/scheduling/available-slots/', { params }),
  availableDays:    (params)   => client.get('/scheduling/available-days/', { params }),
}

// ── Bookings ──────────────────────────────────────────────
export const bookingsApi = {
  list:         (params) => client.get('/bookings/', { params }),
  detail:       (id)     => client.get(`/bookings/${id}/`),
  updateStatus: (id, data) => client.patch(`/bookings/${id}/status/`, data),
  today:        ()       => client.get('/bookings/today/'),
  stats:        ()       => client.get('/bookings/stats/'),
  analytics:    ()       => client.get('/bookings/analytics/'),
  customers:    (params) => client.get('/bookings/customers/', { params }),
  ratingsMine:  ()       => client.get('/bookings/ratings/mine/'),
  // Público
  createPublic: (data)   => client.post('/bookings/', data),
  byPhone:      (phone)  => client.get('/bookings/by-phone/', { params: { phone } }),
  cancelByPhone: (id, phone) => client.patch(`/bookings/${id}/cancel-by-phone/`, { phone }),
  byToken:      (token)  => client.get(`/bookings/cancel-token/${token}/`),
}

// ── Ratings (público) ─────────────────────────────────────
export const ratingsApi = {
  create:       (data)   => client.post('/ratings/', data),
  tenantRating: (slug)   => client.get(`/tenants/${slug}/rating/`),
}
