/**
 * authStore — estado de autenticación persistido en localStorage.
 *
 * El backend devuelve en login/register:
 *   { success: true, data: { access, refresh, user, tenant } }
 *
 * setAuth recibe directamente el objeto `data` desenvuelto.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token:        null,   // JWT access token
      refreshToken: null,   // JWT refresh token
      user:         null,   // { id, username, email, first_name, last_name, role, tenant_id, tenant_slug }
      tenant:       null,   // { id, name, slug, business_type, phone, email, address, city, plan, ... }

      /**
       * Guarda el payload completo después de login o register.
       * @param {object} payload  { access, refresh, user, tenant }
       */
      setAuth: ({ access, refresh, user, tenant }) => set({
        token:        access,
        refreshToken: refresh,
        user,
        tenant,
      }),

      /**
       * Actualiza solo los tokens (después de refresh).
       */
      setTokens: (access, refresh) => set({ token: access, refreshToken: refresh }),

      /**
       * Actualiza los datos del tenant (después de editar ajustes).
       */
      updateTenant: (tenant) => set({ tenant }),

      /**
       * Actualiza los datos del usuario.
       */
      updateUser: (user) => set({ user }),

      /**
       * Cierra sesión — limpia todo el estado.
       */
      logout: () => set({
        token: null, refreshToken: null, user: null, tenant: null,
      }),

      // ── Helpers de conveniencia ───────────────────────
      isOwner:       () => get().user?.role === 'owner',
      isLoggedIn:    () => !!get().token,
      isStaff:       () => get().user?.is_staff === true,
      getTenantSlug: () => get().tenant?.slug ?? null,
    }),
    {
      name: 'booking-saas-auth',  // clave en localStorage
      partialize: (s) => ({
        token:        s.token,
        refreshToken: s.refreshToken,
        user:         s.user,
        tenant:       s.tenant,
      }),
    }
  )
)
