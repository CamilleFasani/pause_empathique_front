<template>
  <header class="flex items-center justify-between p-4 font-bold">
    <button type="button" aria-label="Ouvrir le menu">
      <img :src="MenuIcon" alt="Menu" class="h-8 w-auto" />
    </button>
    <img
      :src="logoSrc"
      alt="Logo Pause Empathique"
      class="h-12 w-auto"
      @click="router.push({ name: 'welcome' })"
    />
    <button>
      <img :src="UserIcon" alt="Mon compte" class="h-8 w-auto" />
    </button>
  </header>
</template>
<script setup lang="ts">
import logoSrc from '../assets/logo.png'
import UserIcon from '../assets/user.svg'
import MenuIcon from '../assets/menu.svg'
import router from '../router'
</script>
