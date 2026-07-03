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

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    refreshToken: null as string | null,
    isAuthenticated: false,
  }),
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

      this.accessToken = response.data.access
      this.refreshToken = response.data.refresh
      this.isAuthenticated = true
      apiClient.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`
    },
  },
})
