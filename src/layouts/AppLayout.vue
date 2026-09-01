<!--
  Fournit la structure commune des pages applicatives.
  Gère fond, en-tête mobile, logo desktop, contenu principal et navigation large.
-->
<template>
  <div
    class="relative flex min-h-dvh w-full flex-col font-body"
    :class="backgroundClass ?? 'bg-bg-page'"
    :style="backgroundStyle"
  >
    <AppHeader
      v-if="route.name !== 'welcome'"
      class="z-10 w-full lg:hidden"
      :overlay="overlayHeader"
    />
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

    <AppFooter v-if="showFooter" />
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
const props = withDefaults(
  defineProps<{
    bgImage?: string
    backgroundClass?: string
    overlayHeader?: boolean
    showFooter?: boolean
  }>(),
  {
    bgImage: undefined,
    backgroundClass: undefined,
    overlayHeader: false,
    showFooter: true,
  },
)

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
