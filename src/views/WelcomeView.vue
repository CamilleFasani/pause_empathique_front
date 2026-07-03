<script setup lang="ts">
import { useAppStore } from '../stores/app'
import AppLayout from '../layouts/AppLayout.vue'
import EmpathicPath from '../components/EmpathicPath.vue'
import logoNameSrc from '../assets/logo-name.svg'

const appStore = useAppStore()

function onAnimationComplete() {
  appStore.introComplete = true
}
</script>

<template>
  <AppLayout>
    <div class="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      <!-- Cercle blanc derrière le chemin -->
      <div class="absolute top-16 h-120 w-120 rounded-full bg-bg-circle-white" />

      <!-- Bloc serré : logo → chemin → bouton, zéro espace entre eux -->
      <div class="relative z-10 flex flex-col items-center">
        <img :src="logoNameSrc" alt="Pause Empathique" class="w-52" />
        <EmpathicPath @animation-complete="onAnimationComplete" />
        <Transition name="fade">
          <button
            v-if="appStore.introComplete"
            class="rounded-full bg-brand-primary w-40 h-40 font-bold text-black"
          >
            Commencer
          </button>
        </Transition>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from {
  opacity: 0;
}
</style>
