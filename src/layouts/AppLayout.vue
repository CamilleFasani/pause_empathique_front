<template>
  <div class="flex w-full min-h-dvh flex-col font-body bg-bg-page" :style="backgroundStyle">
    <AppHeader v-if="route.name !== 'welcome'" class="lg:hidden" />
    <img
      v-if="route.name !== 'welcome'"
      :src="LogoDesktop"
      alt="Pause Empathique"
      class="absolute top-6 left-6 hidden w-40 lg:block"
      @click="router.push({ name: 'welcome' })"
    />

    <div class="flex flex-1">
      <main class="flex-1 flex flex-col items-center overflow-hidden">
        <slot />
      </main>

      <AppSidebar class="hidden lg:flex" />
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import router from '../router'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'
import AppFooter from '../components/AppFooter.vue'
import LogoDesktop from '../assets/logo-name.svg'

const route = useRoute()
const props = defineProps<{
  bgImage?: string
}>()

const backgroundStyle = computed(() =>
  props.bgImage
    ? {
        backgroundImage: `url("${props.bgImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined,
)
</script>
