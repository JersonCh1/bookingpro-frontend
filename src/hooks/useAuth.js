/**
 * useAuth — hooks para el flujo de autenticación.
 *
 * Todos los endpoints devuelven { success, data: {...} }.
 * Extraemos `response.data.data` para obtener el payload.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth'
import { useAuthStore } from '../store/authStore'

// ── Login ─────────────────────────────────────────────────
export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  return useMutation({
    mutationFn: (credentials) =>
      authApi.login(credentials).then((res) => res.data.data),
    onSuccess: (payload) => {
      // payload = { access, refresh, user, tenant }
      setAuth(payload)
      navigate(payload.user?.is_staff ? '/superadmin' : '/dashboard')
    },
  })
}

// ── Register ──────────────────────────────────────────────
export function useRegister() {
  const { setAuth } = useAuthStore()
  const navigate    = useNavigate()

  return useMutation({
    mutationFn: (formData) =>
      authApi.register(formData).then((res) => res.data.data),
    onSuccess: (payload) => {
      setAuth(payload)
      navigate('/dashboard')
    },
  })
}

// ── Logout ────────────────────────────────────────────────
export function useLogout() {
  const { logout }   = useAuthStore()
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()

  return () => {
    authApi.logout().catch(() => {})   // best-effort
    logout()
    queryClient.clear()                // limpia todo el caché de React Query
    navigate('/login')
  }
}

// ── Me (cargar datos frescos al montar) ───────────────────
export function useMe() {
  const { setAuth, isLoggedIn } = useAuthStore()

  return useQuery({
    queryKey: ['me'],
    queryFn: () => authApi.me().then((res) => res.data.data),
    enabled: isLoggedIn(),
    onSuccess: (data) => {
      // Actualiza user + tenant con datos frescos del servidor
      setAuth({
        access:  useAuthStore.getState().token,
        refresh: useAuthStore.getState().refreshToken,
        ...data,
      })
    },
    staleTime: 1000 * 60 * 10,  // 10 min
  })
}

// ── Change Password ───────────────────────────────────────
export function useChangePassword() {
  return useMutation({
    mutationFn: (data) =>
      authApi.changePassword(data).then((res) => res.data.data),
  })
}
