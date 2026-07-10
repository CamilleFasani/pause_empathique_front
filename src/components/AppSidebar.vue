<template>
  <aside class="flex w-56 flex-col bg-bg-card p-6">
    <!-- Navigation desktop — à implémenter -->
    <nav>
      <ul class="space-y-4">
        <li>Qu'est-ce que c'est ?</li>
        <li>Mon compte</li>
        <li>Faire une pause ?</li>
        <li>Mon Journal</li>
        <li>Ressources</li>
        <li>Contact</li>
      </ul>
      <button
        v-if="authStore.isAuthenticated"
        type="button"
        class="block w-full text-left border-t border-black/10 px-5 py-3 active:bg-bg-page"
        @click="logout"
      >
        Se déconnecter
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import router from '../router'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
  await router.push({ name: 'welcome' })
}
</script>
