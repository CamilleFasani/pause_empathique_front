/**
 * Vérifie les comportements durables du store de pratique.
 * Les appels réseau sont mockés pour tester uniquement l'état Pinia.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { countAnonymousPractice, createPause, type PauseResponse } from '../api/practice'
import { useAuthStore } from './auth'
import { usePracticeStore } from './practice'

vi.mock('../api/practice', () => ({
  countAnonymousPractice: vi.fn(),
  createPause: vi.fn(),
}))

const mockPause: PauseResponse = {
  id: 1,
  title: 'Pause test',
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-01T10:00:00Z',
  empty_your_bag: 'Texte déposé',
  observation: 'Observation',
  feelings: [],
  needs: [],
}

describe('practice store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('démarre une pratique vide sans dépendre de la connexion', () => {
    const store = usePracticeStore()

    expect(store.hasStarted).toBe(false)
    store.start()
    expect(store.hasStarted).toBe(true)
    expect(store.hasDraftData).toBe(false)

    store.draft.observation = 'Ancien brouillon'
    store.prepareAuthentication()
    useAuthStore().setAccessToken('access-token')
    store.start()

    expect(store.hasStarted).toBe(true)
    expect(store.hasDraftData).toBe(false)
    expect(store.resumeAfterAuthentication).toBe(false)
  })

  it.each(['submitAuthenticatedPause', 'submitAnonymousPractice'] as const)(
    'refuse %s sans pratique démarrée',
    async (action) => {
      const store = usePracticeStore()
      if (action === 'submitAuthenticatedPause') {
        useAuthStore().setAccessToken('access-token')
      }
      store.toggleFeeling(12)
      store.toggleNeed(34)

      await expect(store[action]()).rejects.toThrow("Aucune pratique n'est en cours.")

      expect(createPause).not.toHaveBeenCalled()
      expect(countAnonymousPractice).not.toHaveBeenCalled()
      expect(store.isSubmitting).toBe(false)
    },
  )

  it('refuse un enregistrement après expiration de la session sans perdre le brouillon', async () => {
    const authStore = useAuthStore()
    authStore.setAccessToken('access-token')
    const store = usePracticeStore()
    store.start()
    store.toggleFeeling(12)
    store.toggleNeed(34)

    authStore.clearSession()

    await expect(store.submitAuthenticatedPause()).rejects.toThrow(
      'Connecte-toi pour enregistrer ta pause.',
    )
    expect(createPause).not.toHaveBeenCalled()
    expect(store.hasStarted).toBe(true)
    expect(store.draft.feelingIds).toEqual([12])
    expect(store.draft.needIds).toEqual([34])
    expect(store.isSubmitting).toBe(false)
  })

  it('refuse le comptage anonyme après connexion sans perdre le brouillon', async () => {
    const store = usePracticeStore()
    store.start()
    store.draft.observation = 'Observation'
    useAuthStore().setAccessToken('access-token')

    await expect(store.submitAnonymousPractice()).rejects.toThrow(
      'Le comptage anonyme est réservé aux personnes non connectées.',
    )
    expect(countAnonymousPractice).not.toHaveBeenCalled()
    expect(store.hasStarted).toBe(true)
    expect(store.draft.observation).toBe('Observation')
    expect(store.isSubmitting).toBe(false)
  })

  it('refuse une pause incomplète même lorsque la session est authentifiée', async () => {
    useAuthStore().setAccessToken('access-token')
    const store = usePracticeStore()
    store.start()
    store.toggleFeeling(12)

    await expect(store.submitAuthenticatedPause()).rejects.toThrow(
      'Sélectionne au moins un sentiment et un besoin.',
    )
    expect(createPause).not.toHaveBeenCalled()
    expect(store.hasStarted).toBe(true)
    expect(store.isSubmitting).toBe(false)
  })

  it('ajoute puis retire les sentiments et besoins sélectionnés', () => {
    const store = usePracticeStore()

    store.toggleFeeling(12)
    store.toggleNeed(34)

    expect(store.draft.feelingIds).toEqual([12])
    expect(store.draft.needIds).toEqual([34])

    store.toggleFeeling(12)
    store.toggleNeed(34)

    expect(store.draft.feelingIds).toEqual([])
    expect(store.draft.needIds).toEqual([])
  })

  it('autorise la soumission uniquement avec au moins un sentiment et un besoin', () => {
    const store = usePracticeStore()

    expect(store.canSubmit).toBe(false)

    store.toggleFeeling(12)
    expect(store.canSubmit).toBe(false)

    store.toggleNeed(34)
    expect(store.canSubmit).toBe(true)
  })

  it('détecte un brouillon utile sans tenir compte du titre', () => {
    const store = usePracticeStore()

    expect(store.hasDraftData).toBe(false)

    store.draft.title = 'Titre seul'
    expect(store.hasDraftData).toBe(false)

    store.draft.emptyYourBag = '  Texte déposé  '
    expect(store.hasDraftData).toBe(true)

    store.reset()
    store.draft.observation = '  Observation  '
    expect(store.hasDraftData).toBe(true)

    store.reset()
    store.toggleFeeling(12)
    expect(store.hasDraftData).toBe(true)

    store.reset()
    store.toggleNeed(34)
    expect(store.hasDraftData).toBe(true)
  })

  it("réinitialise l'état de pratique", () => {
    const store = usePracticeStore()

    store.start()
    store.draft.emptyYourBag = 'Texte déposé'
    store.toggleFeeling(12)
    store.toggleNeed(34)
    store.error = 'Erreur'
    store.isSubmitting = true
    store.prepareAuthentication()

    store.reset()

    expect(store.hasStarted).toBe(false)
    expect(store.draft).toEqual({
      title: '',
      emptyYourBag: '',
      observation: '',
      feelingIds: [],
      needIds: [],
    })
    expect(store.error).toBeNull()
    expect(store.isSubmitting).toBe(false)
    expect(store.resumeAfterAuthentication).toBe(false)
  })

  it('conserve le brouillon au passage à une session authentifiée puis permet son enregistrement', async () => {
    vi.mocked(createPause).mockResolvedValue(mockPause)
    const store = usePracticeStore()

    store.start()
    store.draft.observation = 'Observation conservée'
    store.toggleFeeling(12)
    store.toggleNeed(34)
    store.prepareAuthentication()

    useAuthStore().setAccessToken('access-token')

    expect(store.hasStarted).toBe(true)
    expect(store.resumeAfterAuthentication).toBe(true)
    expect(store.draft.observation).toBe('Observation conservée')
    expect(createPause).not.toHaveBeenCalled()

    await store.submitAuthenticatedPause()

    expect(createPause).toHaveBeenCalledWith({
      title: undefined,
      empty_your_bag: undefined,
      observation: 'Observation conservée',
      feelings: [12],
      needs: [34],
    })
    expect(store.resumeAfterAuthentication).toBe(false)
    expect(store.hasStarted).toBe(false)
    expect(countAnonymousPractice).not.toHaveBeenCalled()
  })

  it('soumet une pause authentifiée puis réinitialise le brouillon', async () => {
    vi.mocked(createPause).mockResolvedValue(mockPause)
    const store = usePracticeStore()

    useAuthStore().setAccessToken('access-token')
    store.start()
    store.draft.emptyYourBag = '  Texte déposé  '
    store.draft.observation = '  Observation  '
    store.toggleFeeling(12)
    store.toggleNeed(34)

    await expect(store.submitAuthenticatedPause()).resolves.toEqual(mockPause)

    expect(createPause).toHaveBeenCalledWith({
      title: undefined,
      empty_your_bag: 'Texte déposé',
      observation: 'Observation',
      feelings: [12],
      needs: [34],
    })
    expect(store.hasStarted).toBe(false)
    expect(store.hasDraftData).toBe(false)
    expect(store.isSubmitting).toBe(false)
  })

  it('conserve le brouillon si la soumission authentifiée échoue', async () => {
    const apiError = new Error('API indisponible')

    vi.mocked(createPause).mockRejectedValue(apiError)
    const store = usePracticeStore()

    useAuthStore().setAccessToken('access-token')
    store.start()
    store.draft.emptyYourBag = 'Texte déposé'
    store.toggleFeeling(12)
    store.toggleNeed(34)

    store.prepareAuthentication()

    await expect(store.submitAuthenticatedPause()).rejects.toBe(apiError)

    expect(store.hasStarted).toBe(true)
    expect(store.resumeAfterAuthentication).toBe(false)
    expect(store.draft.emptyYourBag).toBe('Texte déposé')
    expect(store.draft.feelingIds).toEqual([12])
    expect(store.draft.needIds).toEqual([34])
    expect(store.error).toBe("La pause n'a pas pu être enregistrée. Merci de réessayer.")
    expect(store.isSubmitting).toBe(false)
  })

  it('soumet une pratique anonyme puis réinitialise le brouillon', async () => {
    vi.mocked(countAnonymousPractice).mockResolvedValue()
    const store = usePracticeStore()

    store.start()
    store.draft.observation = 'Observation'

    await expect(store.submitAnonymousPractice()).resolves.toBeUndefined()

    expect(countAnonymousPractice).toHaveBeenCalledOnce()
    expect(store.hasStarted).toBe(false)
    expect(store.hasDraftData).toBe(false)
    expect(store.isSubmitting).toBe(false)
  })

  it('conserve le brouillon si la soumission anonyme échoue', async () => {
    const apiError = new Error('API indisponible')

    vi.mocked(countAnonymousPractice).mockRejectedValue(apiError)
    const store = usePracticeStore()

    store.start()
    store.draft.observation = 'Observation'

    await expect(store.submitAnonymousPractice()).rejects.toBe(apiError)

    expect(store.hasStarted).toBe(true)
    expect(store.draft.observation).toBe('Observation')
    expect(store.error).toBe("La pratique n'a pas pu être finalisée. Merci de réessayer.")
    expect(store.isSubmitting).toBe(false)
  })
})
