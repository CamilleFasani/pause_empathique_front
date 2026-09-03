/**
 * Vérifie que les opérations de profil maintiennent un état local cohérent.
 * Les appels réseau sont mockés : le contrat HTTP reste centralisé dans api/auth.ts.
 */
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteCurrentUser, getCurrentUser, updateCurrentUser, type UserProfile } from '../api/auth'
import { useAuthStore } from './auth'

vi.mock('../api/auth', () => ({
  deleteCurrentUser: vi.fn(),
  getCurrentUser: vi.fn(),
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  refreshAccessToken: vi.fn(),
  registerUser: vi.fn(),
  updateCurrentUser: vi.fn(),
}))

vi.mock('../api/client', () => ({
  configureAuthInterceptors: vi.fn(),
}))

const initialProfile: UserProfile = {
  email: 'camille@example.com',
  firstname: 'Camille',
  gender: 'F',
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
}

describe('auth store profile operations', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('rafraîchit le profil depuis le serveur', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(initialProfile)
    const store = useAuthStore()

    await expect(store.fetchProfile()).resolves.toEqual(initialProfile)

    expect(store.user).toEqual(initialProfile)
  })

  it('remplace le profil local après une modification réussie', async () => {
    const updatedProfile: UserProfile = {
      ...initialProfile,
      firstname: 'Camillette',
      gender: 'M',
      updated_at: '2026-09-03T10:00:00Z',
    }
    vi.mocked(updateCurrentUser).mockResolvedValue(updatedProfile)
    const store = useAuthStore()
    store.user = initialProfile
    store.accessToken = 'access-token'

    await store.updateProfile({
      email: updatedProfile.email,
      firstname: updatedProfile.firstname,
      gender: updatedProfile.gender,
    })

    expect(store.user).toEqual(updatedProfile)
  })

  it('vide la session locale après la suppression du compte', async () => {
    vi.mocked(deleteCurrentUser).mockResolvedValue()
    const store = useAuthStore()
    store.user = initialProfile
    store.accessToken = 'access-token'

    await store.deleteAccount()

    expect(deleteCurrentUser).toHaveBeenCalledOnce()
    expect(store.user).toBeNull()
    expect(store.accessToken).toBeNull()
    expect(store.isAuthReady).toBe(true)
  })

  it("conserve la session si l'API refuse la suppression", async () => {
    vi.mocked(deleteCurrentUser).mockRejectedValue(new Error('Network error'))
    const store = useAuthStore()
    store.user = initialProfile
    store.accessToken = 'access-token'

    await expect(store.deleteAccount()).rejects.toThrow('Network error')

    expect(store.user).toEqual(initialProfile)
    expect(store.accessToken).toBe('access-token')
  })
})
