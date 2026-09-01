<template>
  <RouterView />
</template>

<script setup lang="ts">
import { usePracticeDraftBeforeUnload } from './composables/usePracticeDraftBeforeUnload'

usePracticeDraftBeforeUnload()
</script>
