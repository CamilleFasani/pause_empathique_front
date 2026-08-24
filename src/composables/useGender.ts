import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import type { Gender } from '../api/auth'
import { useAuthStore } from '../stores/auth'

export type FeelingNameGender = 'f' | 'm'

export const ANONYMOUS_GENDER_STORAGE_KEY = 'pause-empathique:anonymous-gender'

const toFeelingNameGender = (gender: Gender): FeelingNameGender => (gender === 'M' ? 'm' : 'f')

const readAnonymousGender = (): Gender | null => {
  const storedGender = window.sessionStorage.getItem(ANONYMOUS_GENDER_STORAGE_KEY)

  return storedGender === 'F' || storedGender === 'M' ? storedGender : null
}

export const useGender = () => {
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const anonymousGender = ref<Gender | null>(readAnonymousGender())

  const setAnonymousGender = (gender: Gender) => {
    anonymousGender.value = gender
    window.sessionStorage.setItem(ANONYMOUS_GENDER_STORAGE_KEY, gender)
  }

  const feelingNameGender = computed<FeelingNameGender>(() =>
    toFeelingNameGender(user.value?.gender ?? anonymousGender.value ?? 'F'),
  )

  return {
    feelingNameGender,
    setAnonymousGender,
  }
}
