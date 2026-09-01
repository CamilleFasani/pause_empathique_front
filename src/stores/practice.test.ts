/**
 * Vérifie les comportements durables du store de pratique.
 * Les appels réseau sont mockés pour tester uniquement l'état Pinia.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { countAnonymousPractice, createPause, type PauseResponse } from '../api/practice'
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

  it("détecte un brouillon utile sans tenir compte du titre", () => {
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

    store.start('anonymous')
    store.draft.emptyYourBag = 'Texte déposé'
    store.toggleFeeling(12)
    store.toggleNeed(34)
    store.error = 'Erreur'
    store.isSubmitting = true
    store.prepareAuthentication()

    store.reset()

    expect(store.mode).toBeNull()
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

  it("gère la reprise d'un brouillon après authentification", () => {
    const store = usePracticeStore()

    store.start('anonymous')
    store.error = 'Erreur précédente'
    store.prepareAuthentication()

    expect(store.resumeAfterAuthentication).toBe(true)

    store.continueAuthenticated()

    expect(store.mode).toBe('authenticated')
    expect(store.error).toBeNull()
    expect(store.resumeAfterAuthentication).toBe(false)
  })

  it('soumet une pause authentifiée puis réinitialise le brouillon', async () => {
    vi.mocked(createPause).mockResolvedValue(mockPause)
    const store = usePracticeStore()

    store.start('authenticated')
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
    expect(store.mode).toBeNull()
    expect(store.hasDraftData).toBe(false)
    expect(store.isSubmitting).toBe(false)
  })

  it("conserve le brouillon si la soumission authentifiée échoue", async () => {
    const apiError = new Error('API indisponible')

    vi.mocked(createPause).mockRejectedValue(apiError)
    const store = usePracticeStore()

    store.start('authenticated')
    store.draft.emptyYourBag = 'Texte déposé'
    store.toggleFeeling(12)
    store.toggleNeed(34)

    await expect(store.submitAuthenticatedPause()).rejects.toBe(apiError)

    expect(store.mode).toBe('authenticated')
    expect(store.draft.emptyYourBag).toBe('Texte déposé')
    expect(store.draft.feelingIds).toEqual([12])
    expect(store.draft.needIds).toEqual([34])
    expect(store.error).toBe("La pause n'a pas pu être enregistrée. Merci de réessayer.")
    expect(store.isSubmitting).toBe(false)
  })

  it('soumet une pratique anonyme puis réinitialise le brouillon', async () => {
    vi.mocked(countAnonymousPractice).mockResolvedValue()
    const store = usePracticeStore()

    store.start('anonymous')
    store.draft.observation = 'Observation'

    await expect(store.submitAnonymousPractice()).resolves.toBeUndefined()

    expect(countAnonymousPractice).toHaveBeenCalledOnce()
    expect(store.mode).toBeNull()
    expect(store.hasDraftData).toBe(false)
    expect(store.isSubmitting).toBe(false)
  })

  it("conserve le brouillon si la soumission anonyme échoue", async () => {
    const apiError = new Error('API indisponible')

    vi.mocked(countAnonymousPractice).mockRejectedValue(apiError)
    const store = usePracticeStore()

    store.start('anonymous')
    store.draft.observation = 'Observation'

    await expect(store.submitAnonymousPractice()).rejects.toBe(apiError)

    expect(store.mode).toBe('anonymous')
    expect(store.draft.observation).toBe('Observation')
    expect(store.error).toBe("La pratique n'a pas pu être finalisée. Merci de réessayer.")
    expect(store.isSubmitting).toBe(false)
  })
})
