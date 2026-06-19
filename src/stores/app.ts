import { defineStore } from 'pinia'
import { ref } from 'vue'

// Ce store mémorise si l'animation d'intro a déjà été jouée.
// Comme c'est un store Pinia (pas un ref local), la valeur survit
// à la navigation entre pages (mais est remise à false au rechargement).
export const useAppStore = defineStore('app', () => {
  const introComplete = ref(false)

  return { introComplete }
})
