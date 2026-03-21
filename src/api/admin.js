import client from './client'

export const adminApi = {
  stats:         ()                  => client.get('/admin/stats/'),
  tenants:       (params = {})       => client.get('/admin/tenants/', { params }),
  toggleTenant:  (id)                => client.patch(`/admin/tenants/${id}/toggle/`),
  deleteTenant:  (id)                => client.delete(`/admin/tenants/${id}/`),
  bookings:      (params = {})       => client.get('/admin/bookings/', { params }),
}
