<template>
  <button
    type="button"
    class="flex w-full h-18 items-center justify-center rounded-card bg-white p-3 text-center text-[0.9rem] font-semibold uppercase tracking-widest text-black shadow-sm transition-transform active:scale-[0.98] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
    @click="$emit('select')"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()

defineEmits<{
  select: []
}>()
</script>
