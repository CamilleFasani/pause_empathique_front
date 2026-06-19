<template>
  <div class="flex min-h-screen flex-col bg-bg-page font-body">
    <!-- Header/sidebar/footer cachés pendant l'animation d'intro de la home -->
    <AppHeader v-if="appStore.introComplete" class="lg:hidden" />

    <div class="flex flex-1">
      <main class="flex-1 flex flex-col items-center justify-center overflow-hidden">
        <slot />
      </main>

      <AppSidebar v-if="appStore.introComplete" class="hidden lg:flex" />
    </div>

    <AppFooter v-if="appStore.introComplete" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppFooter from '../components/AppFooter.vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()
</script>
