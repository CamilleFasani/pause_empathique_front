import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
  first_name: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
  }),
  actions: {},
})
