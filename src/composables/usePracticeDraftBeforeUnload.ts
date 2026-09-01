/**
 * Protège le brouillon de pratique contre une perte par fermeture ou rechargement.
 * Active l'alerte navigateur uniquement lorsqu'une donnée utilisateur existe.
 */
import { onMounted, onUnmounted, watch, type WatchStopHandle } from 'vue'
import { usePracticeStore } from '../stores/practice'

export const usePracticeDraftBeforeUnload = () => {
  const practiceStore = usePracticeStore()
  let isListening = false
  let stopWatchingDraft: WatchStopHandle | null = null

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!practiceStore.hasDraftData) {
      return
    }

    event.preventDefault()
  }

  const addBeforeUnloadListener = () => {
    if (isListening) {
      return
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    isListening = true
  }

  const removeBeforeUnloadListener = () => {
    if (!isListening) {
      return
    }

    window.removeEventListener('beforeunload', handleBeforeUnload)
    isListening = false
  }

  onMounted(() => {
    stopWatchingDraft = watch(
      () => practiceStore.hasDraftData,
      (hasDraftData) => {
        if (hasDraftData) {
          addBeforeUnloadListener()
          return
        }

        removeBeforeUnloadListener()
      },
      { immediate: true },
    )
  })

  onUnmounted(() => {
    stopWatchingDraft?.()
    removeBeforeUnloadListener()
  })
}
