import client from './client'

export const authApi = {
  // ── Auth ──────────────────────────────────────────────
  register:       (data) => client.post('/auth/register/', data),
  login:          (data) => client.post('/auth/login/', data),
  logout:         ()     => client.post('/auth/logout/'),
  me:             ()     => client.get('/auth/me/'),
  refresh:        (data) => client.post('/auth/refresh/', data),
  changePassword: (data) => client.post('/auth/change-password/', data),

  // ── Tenant ────────────────────────────────────────────
  getTenant:      ()         => client.get('/tenants/me/'),
  updateTenant:   (data)     => client.patch('/tenants/me/', data),
  getPublicTenant:(slug)     => client.get(`/tenants/${slug}/public/`),
}
