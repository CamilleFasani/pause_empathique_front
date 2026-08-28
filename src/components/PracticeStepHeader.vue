<template>
  <div class="flex flex-col items-center">
    <div class="flex size-65 items-center justify-center rounded-full bg-bg-circle-white">
      <p class="mt-6 text-3xl font-logo">Pratiquer</p>
    </div>

    <ol class="mt-4 flex gap-2" aria-label="Progression de la pratique">
      <li
        v-for="step in steps"
        :key="step"
        class="size-4 rounded-full border border-white"
        :class="step === currentStep ? 'bg-brand-primary' : 'bg-white'"
      >
        <span class="sr-only">
          Étape {{ step }} sur {{ steps.length }}
          <template v-if="step === currentStep"> — étape en cours</template>
        </span>
      </li>
    </ol>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  currentStep: number
}>()

const steps = [1, 2, 3, 4]
</script>
