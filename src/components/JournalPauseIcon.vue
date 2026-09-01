<!--
  Affiche l'icône Iconoir associée au besoin prédominant d'une pause.
-->
<template>
  <component :is="iconComponent" class="size-6" color="currentColor" stroke-width="1.4" />
</template>

<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  iconComponent: Component
}>()
</script>
