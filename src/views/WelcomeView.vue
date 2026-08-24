<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
import EmpathicPath from '../components/EmpathicPath.vue'
import WelcomeChoiceButton from '../components/WelcomeChoiceButton.vue'
import logoNameSrc from '../assets/logo-name.svg'
import welcomeBg from '../assets/welcome-bg.svg'
import { usePracticeStore } from '../stores/practice'

const practiceStore = usePracticeStore()

const startAnonymousPractice = () => {
  practiceStore.start('anonymous')
}
</script>

<template>
  <AppLayout :bg-image="welcomeBg">
    <div class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <div class="relative z-10 flex flex-col items-center gap-0">
        <img :src="logoNameSrc" alt="Pause Empathique" class="w-52" />
        <EmpathicPath />
        <WelcomeChoiceButton
          label="Libre comme l'air"
          curved-label="Pratiquer sans compte"
          :to="{ name: 'empty-your-bag' }"
          @select="startAnonymousPractice"
        />
        <WelcomeChoiceButton
          class="mt-4"
          label="Garder une trace"
          curved-label="J'ai ou je veux un compte"
          :to="{ name: 'login' }"
        />
      </div>
    </div>
  </AppLayout>
</template>
