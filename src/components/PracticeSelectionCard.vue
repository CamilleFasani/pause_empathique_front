<template>
  <article class="flex items-center gap-3 rounded-card bg-white px-4 py-3 shadow-sm">
    <p class="min-w-16 text-sm font-semibold">{{ label }}</p>

    <div class="relative h-5 flex-1" aria-hidden="true">
      <div class="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-bg-page"></div>
      <div
        class="absolute top-1/2 h-5 w-1 -translate-y-1/2 rounded-full bg-brand-primary"
        :style="{ left: `${intensity}%` }"
      ></div>
    </div>

    <button
      type="button"
      class="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg font-bold leading-none text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
      :aria-label="`Retirer ${label}`"
      @click="$emit('remove')"
    >
      ×
    </button>
  </article>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    intensity?: number
  }>(),
  {
    intensity: 50,
  },
)

defineEmits<{
  remove: []
}>()
</script>
