/**
 * Conserve l'état d'authentification partagé par l'application.
 * Orchestre l'inscription, la connexion, la restauration de session et la
 * déconnexion, ainsi que le chargement, la modification et la suppression du
 * compte, puis maintient le profil local en cohérence avec le client HTTP.
 */
import { defineStore } from 'pinia'

import {
  deleteCurrentUser,
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateCurrentUser,
  type Gender,
  type LoginPayload,
  type RegisterPayload,
  type UpdateProfilePayload,
  type UserProfile,
} from '../api/auth'
import { configureAuthInterceptors } from '../api/client'

export type { Gender, LoginPayload, RegisterPayload, UpdateProfilePayload }

let areAuthInterceptorsConfigured = false
let initializeSessionPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserProfile | null,
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
          this.setAccessToken(accessToken)
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

      await this.setSession(response.access)
    },
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken
      this.isAuthReady = true
    },
    async setSession(accessToken: string) {
      this.setAccessToken(accessToken)
      this.user = await getCurrentUser()
    },
    async fetchProfile() {
      this.user = await getCurrentUser()
      return this.user
    },
    async updateProfile(payload: UpdateProfilePayload) {
      this.user = await updateCurrentUser(payload)
      return this.user
    },
    async deleteAccount() {
      await deleteCurrentUser()
      this.clearSession()
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

          await this.setSession(response.access)
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
