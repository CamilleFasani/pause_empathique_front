<template>
  <header class="relative flex items-center justify-between p-4 font-bold">
    <button type="button" aria-label="Ouvrir le menu">
      <img :src="MenuIcon" alt="Menu" class="h-8 w-auto" />
    </button>
    <img
      :src="logoSrc"
      alt="Logo Pause Empathique"
      class="h-12 w-auto"
      @click="router.push({ name: 'welcome' })"
    />
    <button
      type="button"
      aria-label="Ouvrir le menu du compte"
      aria-controls="account-menu"
      :aria-expanded="isAccountMenuOpen"
      @click="isAccountMenuOpen = !isAccountMenuOpen"
    >
      <img v-if="authStore.isAuthenticated" :src="UserIcon" alt="Mon compte" class="h-8 w-auto" />
    </button>
    <nav
      v-if="authStore.isAuthenticated && isAccountMenuOpen"
      id="account-menu"
      aria-label="Menu du compte"
      class="absolute top-full right-4 z-20 w-48 overflow-hidden rounded-btn bg-white shadow-lg"
    >
      <a href="#" class="block px-5 py-3 active:bg-bg-page" @click.prevent> Mon compte </a>
      <button
        type="button"
        class="block w-full text-left border-t border-black/10 px-5 py-3 active:bg-bg-page"
        @click="logout"
      >
        Se déconnecter
      </button>
    </nav>
  </header>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import logoSrc from '../assets/logo.png'
import UserIcon from '../assets/user.svg'
import MenuIcon from '../assets/menu.svg'
import router from '../router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAccountMenuOpen = ref(false)

const logout = async () => {
  await authStore.logout()
  isAccountMenuOpen.value = false
  await router.push({ name: 'welcome' })
}
</script>
