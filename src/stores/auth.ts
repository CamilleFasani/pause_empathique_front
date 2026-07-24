/**
 * Conserve l'état d'authentification partagé par l'application.
 * Orchestre l'inscription, la connexion, la restauration de session
 * et la déconnexion, puis relie cet état au client HTTP.
 */
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
import { configureAuthInterceptors } from '../api/client'

export type { Gender, LoginPayload, RegisterPayload }

interface User {
  id: number
  email: string
  firstname: string
  gender: Gender
}

let areAuthInterceptorsConfigured = false
let initializeSessionPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    accessToken: null as string | null,
    isAuthReady: false,
  }),
  getters: {
    isAuthenticated: (state) => state.accessToken !== null,
  },
  actions: {
    configureClientAuth() {
      if (areAuthInterceptorsConfigured) {
        return
      }

      configureAuthInterceptors({
        getAccessToken: () => this.accessToken,
        onAccessTokenRefreshed: (accessToken) => {
          this.setSession(accessToken)
        },
        onAuthFailure: () => {
          this.clearSession()
        },
      })
      areAuthInterceptorsConfigured = true
    },
    async register(payload: RegisterPayload) {
      this.configureClientAuth()
      await registerUser(payload)
      await this.login({
        email: payload.email,
        password: payload.password,
      })
    },
    async login(payload: LoginPayload) {
      this.configureClientAuth()
      const response = await loginUser(payload)

      this.setSession(response.access)
    },
    setSession(accessToken: string) {
      this.accessToken = accessToken
      this.isAuthReady = true
    },
    clearSession() {
      this.user = null
      this.accessToken = null
      this.isAuthReady = true
    },
    async initializeSession() {
      this.configureClientAuth()

      if (this.isAuthReady) {
        return
      }

      if (initializeSessionPromise) {
        return initializeSessionPromise
      }

      initializeSessionPromise = (async () => {
        try {
          const response = await refreshAccessToken()

          this.setSession(response.access)
        } catch {
          this.clearSession()
        } finally {
          initializeSessionPromise = null
        }
      })()

      return initializeSessionPromise
    },
    async logout() {
      this.configureClientAuth()

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
