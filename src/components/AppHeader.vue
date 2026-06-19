<template>
  <header class="flex items-center justify-between p-4 font-bold">
    <img :src="logoSrc" alt="Logo Pause Empathique" class="h-12 w-auto" />
    <!-- Menu hamburger — à implémenter -->
    <button type="button" aria-label="Ouvrir le menu">☰</button>
  </header>
</template>
<script setup lang="ts">
import logoSrc from '../assets/logo.png'
</script>
