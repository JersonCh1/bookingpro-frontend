import client from './client'

export const adminApi = {
  // Stats
  stats:            ()           => client.get('/admin/stats/'),

  // Tenants
  tenants:          (params={})  => client.get('/admin/tenants/', { params }),
  tenantDetail:     (id)         => client.get(`/admin/tenants/${id}/detail/`),
  toggleTenant:     (id)         => client.patch(`/admin/tenants/${id}/toggle/`),
  extendTenant:     (id, days)   => client.patch(`/admin/tenants/${id}/extend/`, { days }),
  deleteTenant:     (id)         => client.delete(`/admin/tenants/${id}/`),
  addNote:          (id, content)=> client.post(`/admin/tenants/${id}/notes/`, { content }),
  deleteNote:       (id)         => client.delete(`/admin/notes/${id}/`),

  // Payments
  payments:         (params={})  => client.get('/admin/payments/', { params }),
  paymentsSummary:  ()           => client.get('/admin/payments/summary/'),
  createPayment:    (data)       => client.post('/admin/payments/', data),
  deletePayment:    (id)         => client.delete(`/admin/payments/${id}/`),

  // Bookings
  bookings:         (params={})  => client.get('/admin/bookings/', { params }),

  // Config
  getConfig:        ()           => client.get('/admin/config/'),
  saveConfig:       (data)       => client.patch('/admin/config/', data),
}
