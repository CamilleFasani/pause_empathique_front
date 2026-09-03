<template>
  <header
    class="grid grid-cols-[1fr_auto_1fr] items-center p-4 font-bold"
    :class="overlay ? 'absolute top-0 left-0 w-full' : 'relative'"
  >
    <button class="justify-self-start" type="button" aria-label="Ouvrir le menu">
      <img :src="MenuIcon" alt="Menu" class="h-8 w-auto" />
    </button>
    <img
      :src="logoSrc"
      alt="Logo Pause Empathique"
      class="h-12 w-auto justify-self-center"
      @click="router.push({ name: 'welcome' })"
    />
    <button
      v-if="authStore.isAuthenticated"
      ref="accountMenuButton"
      type="button"
      aria-label="Ouvrir le menu du compte"
      aria-controls="account-menu"
      :aria-expanded="isAccountMenuOpen"
      class="justify-self-end"
      @click="isAccountMenuOpen = !isAccountMenuOpen"
    >
      <img :src="UserIcon" alt="Mon compte" class="h-8 w-auto" />
    </button>
    <nav
      v-if="authStore.isAuthenticated && isAccountMenuOpen"
      id="account-menu"
      ref="accountMenu"
      aria-label="Menu du compte"
      class="absolute top-full right-4 z-20 w-48 overflow-hidden rounded-btn bg-white shadow-lg"
    >
      <RouterLink
        :to="{ name: 'account' }"
        class="block px-5 py-3 active:bg-bg-page"
        @click="isAccountMenuOpen = false"
      >
        Mon compte
      </RouterLink>
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
import { onBeforeUnmount, onMounted, ref } from 'vue'
import logoSrc from '../assets/logo.png'
import UserIcon from '../assets/user.svg'
import MenuIcon from '../assets/menu.svg'
import router from '../router'
import { useAuthStore } from '../stores/auth'

withDefaults(
  defineProps<{
    overlay?: boolean
  }>(),
  {
    overlay: false,
  },
)

const authStore = useAuthStore()
const isAccountMenuOpen = ref(false)
const accountMenuButton = ref<HTMLButtonElement | null>(null)
const accountMenu = ref<HTMLElement | null>(null)

const closeAccountMenuOnOutsideClick = (event: PointerEvent) => {
  const target = event.target

  if (
    !isAccountMenuOpen.value ||
    !(target instanceof Node) ||
    accountMenuButton.value?.contains(target) ||
    accountMenu.value?.contains(target)
  ) {
    return
  }

  isAccountMenuOpen.value = false
}

const logout = async () => {
  await authStore.logout()
  isAccountMenuOpen.value = false
  await router.push({ name: 'welcome' })
}

onMounted(() => document.addEventListener('pointerdown', closeAccountMenuOnOutsideClick))
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeAccountMenuOnOutsideClick))
</script>
