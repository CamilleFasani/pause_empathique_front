import { defineStore } from 'pinia'

import {
  countAnonymousPractice,
  createPause,
  type PauseCreatePayload,
  type PauseResponse,
} from '../api/practice'

export type PracticeMode = 'anonymous' | 'authenticated'

export interface PracticeDraft {
  title: string
  emptyYourBag: string
  observation: string
  feelingIds: number[]
  needIds: number[]
}

export interface PracticeState {
  mode: PracticeMode | null
  draft: PracticeDraft
  isSubmitting: boolean
  error: string | null
  resumeAfterAuthentication: boolean
}

const createEmptyDraft = (): PracticeDraft => ({
  title: '',
  emptyYourBag: '',
  observation: '',
  feelingIds: [],
  needIds: [],
})

export const usePracticeStore = defineStore('practice', {
  state: (): PracticeState => ({
    mode: null,
    draft: createEmptyDraft(),
    isSubmitting: false,
    error: null,
    resumeAfterAuthentication: false,
  }),

  getters: {
    hasStarted: (state) => state.mode !== null,
    canSubmit: (state) =>
      state.draft.feelingIds.length > 0 && state.draft.needIds.length > 0,
  },

  actions: {
    start(mode: PracticeMode) {
      this.mode = mode
      this.draft = createEmptyDraft()
      this.error = null
      this.resumeAfterAuthentication = false
    },

    reset() {
      this.mode = null
      this.draft = createEmptyDraft()
      this.isSubmitting = false
      this.error = null
      this.resumeAfterAuthentication = false
    },

    toggleFeeling(id: number) {
      this.draft.feelingIds = this.toggleId(this.draft.feelingIds, id)
    },

    toggleNeed(id: number) {
      this.draft.needIds = this.toggleId(this.draft.needIds, id)
    },

    prepareAuthentication() {
      this.resumeAfterAuthentication = true
    },

    continueAuthenticated() {
      this.mode = 'authenticated'
      this.error = null
      this.resumeAfterAuthentication = false
    },

    toPausePayload(): PauseCreatePayload {
      return {
        title: this.draft.title.trim() || undefined,
        empty_your_bag: this.draft.emptyYourBag.trim() || undefined,
        observation: this.draft.observation.trim() || undefined,
        feelings: this.draft.feelingIds,
        needs: this.draft.needIds,
      }
    },

    async submitAuthenticatedPause(): Promise<PauseResponse> {
      if (this.mode !== 'authenticated') {
        this.error = "Cette pause n'est pas dans un parcours authentifié."
        throw new Error(this.error)
      }

      if (!this.canSubmit) {
        this.error = 'Sélectionne au moins un sentiment et un besoin.'
        throw new Error(this.error)
      }

      this.isSubmitting = true
      this.error = null

      try {
        const pause = await createPause(this.toPausePayload())
        this.reset()
        return pause
      } catch (error) {
        this.error = "La pause n'a pas pu être enregistrée. Merci de réessayer."
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async submitAnonymousPractice(): Promise<void> {
      if (this.mode !== 'anonymous') {
        this.error = "Cette pause n'est pas dans un parcours anonyme."
        throw new Error(this.error)
      }

      this.isSubmitting = true
      this.error = null

      try {
        await countAnonymousPractice()
        this.reset()
      } catch (error) {
        this.error = "La pratique n'a pas pu être finalisée. Merci de réessayer."
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    toggleId(ids: number[], id: number): number[] {
      return ids.includes(id) ? ids.filter((currentId) => currentId !== id) : [...ids, id]
    },
  },
})
