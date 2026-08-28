import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import type { Gender } from '../api/auth'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

export type FeelingNameGender = 'f' | 'm'

export const ANONYMOUS_GENDER_STORAGE_KEY = 'p-e:anonymous-gender'

const toFeelingNameGender = (gender: Gender): FeelingNameGender => (gender === 'M' ? 'm' : 'f')

const readAnonymousGender = (): Gender | null => {
  const storedGender = window.sessionStorage.getItem(ANONYMOUS_GENDER_STORAGE_KEY)

  return storedGender === 'F' || storedGender === 'M' ? storedGender : null
}

export const useGender = () => {
  const authStore = useAuthStore()
  const practiceStore = usePracticeStore()
  const { user } = storeToRefs(authStore)
  const { mode } = storeToRefs(practiceStore)
  const anonymousGender = ref<Gender | null>(readAnonymousGender())

  const setAnonymousGender = (gender: Gender) => {
    anonymousGender.value = gender
    window.sessionStorage.setItem(ANONYMOUS_GENDER_STORAGE_KEY, gender)
  }

  const gender = computed<Gender>(() => {
    if (mode.value === 'anonymous' && !user.value) {
      return anonymousGender.value ?? 'F'
    }

    return user.value?.gender ?? anonymousGender.value ?? 'F'
  })

  const feelingNameGender = computed<FeelingNameGender>(() => toFeelingNameGender(gender.value))

  return {
    anonymousGender,
    feelingNameGender,
    gender,
    setAnonymousGender,
  }
}
