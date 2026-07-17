import { defineStore } from 'pinia'

import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  type Gender,
  type LoginPayload,
  type RegisterPayload,
} from '../api/auth'
import { apiClient } from '../api/client'

export type { Gender, LoginPayload, RegisterPayload }

interface User {
  id: number
  email: string
  firstname: string
  gender: Gender
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
  }),
  getters: {
    isAuthenticated: (state) => state.accessToken !== null,
  },
  actions: {
    async register(payload: RegisterPayload) {
      await registerUser(payload)
      await this.login({
        email: payload.email,
        password: payload.password,
      })
    },
    async login(payload: LoginPayload) {
      const response = await loginUser(payload)

      this.setSession(response.access)
    },
    setSession(accessToken: string) {
      this.accessToken = accessToken
      apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    },
    clearSession() {
      this.user = null
      this.accessToken = null
      delete apiClient.defaults.headers.common.Authorization
    },
    async initializeSession() {
      try {
        const response = await refreshAccessToken()

        this.setSession(response.access)
      } catch {
        this.clearSession()
      }
    },
    async logout() {
      try {
        await logoutUser()
      } catch (error) {
        console.error('Échec de la blacklist du refresh token :', error)
      } finally {
        this.clearSession()
      }
    },
  },
})
