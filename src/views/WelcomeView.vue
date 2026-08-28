<template>
  <AppLayout :bg-image="welcomeBg">
    <div class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div class="relative z-10 flex flex-col items-center gap-0">
        <img :src="logoNameSrc" alt="Pause Empathique" class="w-52" />
        <EmpathicPath />
        <WelcomeChoiceButton
          label="Libre comme l'air"
          curved-label="Pratiquer sans compte"
          @select="startAnonymousPractice"
        />
        <WelcomeChoiceButton
          class="mt-4"
          label="Garder une trace"
          curved-label="J'ai ou je veux un compte"
          :to="{ name: 'login' }"
        />
      </div>

      <div
        v-if="isGenderModalOpen"
        class="absolute inset-0 z-30 flex items-center justify-center bg-bg-page/55 px-6 backdrop-blur-sm"
        @click.self="closeGenderModal"
      >
        <section
          role="dialog"
          aria-modal="true"
          :aria-labelledby="genderModalTitleId"
          class="relative w-full max-w-sm rounded-card bg-white px-7 pt-7 pb-6 text-black shadow-xl"
          @keydown.esc="closeGenderModal"
        >
          <button
            type="button"
            class="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold leading-none text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
            aria-label="Fermer le choix du genre"
            @click="closeGenderModal"
          >
            ×
          </button>

          <h2 :id="genderModalTitleId" class="pr-4 font-logo text-xl leading-tight">
            Comment veux-tu lire les sentiments ?
          </h2>

          <div class="mt-6 grid gap-3">
            <button
              ref="firstGenderButton"
              type="button"
              class="rounded-btn bg-bg-page px-4 py-3 text-left text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black"
              @click="chooseAnonymousGender('F')"
            >
              Au féminin
            </button>
            <button
              type="button"
              class="rounded-btn bg-bg-page px-4 py-3 text-left text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black"
              @click="chooseAnonymousGender('M')"
            >
              Au masculin
            </button>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import EmpathicPath from '../components/EmpathicPath.vue'
import WelcomeChoiceButton from '../components/WelcomeChoiceButton.vue'
import logoNameSrc from '../assets/logo-name.svg'
import welcomeBg from '../assets/welcome-bg.svg'
import type { Gender } from '../api/auth'
import { useGender } from '../composables/useGender'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()
const { isAuthenticated } = storeToRefs(authStore)
const { anonymousGender, setAnonymousGender } = useGender()
const isGenderModalOpen = ref(false)
const firstGenderButton = ref<HTMLButtonElement | null>(null)
const genderModalTitleId = 'anonymous-gender-title'

const startAnonymousPractice = () => {
  if (!isAuthenticated.value && !anonymousGender.value) {
    isGenderModalOpen.value = true
    nextTick(() => firstGenderButton.value?.focus())
    return
  }

  practiceStore.start('anonymous')
  router.push({ name: 'empty-your-bag' })
}

const chooseAnonymousGender = (gender: Gender) => {
  setAnonymousGender(gender)
  isGenderModalOpen.value = false
  practiceStore.start('anonymous')
  router.push({ name: 'empty-your-bag' })
}

const closeGenderModal = () => {
  isGenderModalOpen.value = false
}
</script>
