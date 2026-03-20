/**
 * Axios client configurado con:
 *  - Base URL del backend
 *  - Interceptor de request: adjunta JWT en Authorization header
 *  - Interceptor de response: refresco automático al recibir 401
 *
 * El backend devuelve siempre:
 *   { success: true,  data: {...} }       → respuesta exitosa
 *   { success: false, error: "...", code: "..." } → error
 */
import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Request: adjuntar JWT ─────────────────────────────────
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response: refresh automático en 401 ───────────────────
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Solo intentar refresh una vez por request fallido
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      const refreshToken = useAuthStore.getState().refreshToken

      if (refreshToken) {
        try {
          // POST /api/auth/refresh/ → { success: true, data: { access, refresh } }
          const { data: responseBody } = await axios.post(
            `${API_URL}/auth/refresh/`,
            { refresh: refreshToken }
          )

          const { access, refresh: newRefresh } = responseBody.data

          // Guardar nuevos tokens (user y tenant no cambian)
          useAuthStore.getState().setTokens(access, newRefresh)

          // Reintentar el request original con el nuevo access token
          original.headers.Authorization = `Bearer ${access}`
          return client(original)
        } catch {
          // Si el refresh falla → cerrar sesión
          useAuthStore.getState().logout()
          window.location.href = '/login'
          return Promise.reject(error)
        }
      } else {
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default client
