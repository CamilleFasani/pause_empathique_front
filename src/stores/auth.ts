import { defineStore } from 'pinia'

import { apiClient } from '../api/client'

export type Gender = 'F' | 'M'

interface User {
  id: number
  email: string
  firstname: string
  gender: Gender
}

export interface RegisterPayload {
  firstname: string
  email: string
  password: string
  gender: Gender
}

export interface LoginPayload {
  email: string
  password: string
}

interface TokenResponse {
  access: string
  refresh: string
}

interface RefreshTokenResponse {
  access: string
}

const REFRESH_TOKEN_STORAGE_KEY = 'pause-empathique.refresh-token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => state.accessToken !== null,
  },
  actions: {
    async register(payload: RegisterPayload) {
      await apiClient.post('/auth/register/', payload)
      await this.login({
        email: payload.email,
        password: payload.password,
      })
    },
    async login(payload: LoginPayload) {
      const response = await apiClient.post<TokenResponse>('/auth/token/', payload)

      this.setSession(response.data.access, response.data.refresh)
    },
    setSession(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken
      this.refreshToken = refreshToken
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken)
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    },
    clearSession() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
      delete apiClient.defaults.headers.common.Authorization
    },
    async initializeSession() {
      const storedRefreshToken = localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)

      if (!storedRefreshToken) {
        this.clearSession()
        return
      }

      try {
        const response = await apiClient.post<RefreshTokenResponse>('/auth/token/refresh/', {
          refresh: storedRefreshToken,
        })

        this.setSession(response.data.access, storedRefreshToken)
      } catch {
        this.clearSession()
      }
    },
    async logout() {
      const refreshToken = this.refreshToken

      try {
        if (refreshToken) {
          await apiClient.post('/auth/token/blacklist/', { refresh: refreshToken })
        }
      } catch (error) {
        console.error('Échec de la blacklist du refresh token :', error)
      } finally {
        this.clearSession()
      }
    },
  },
})
