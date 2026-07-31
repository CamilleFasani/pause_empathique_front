<template>
  <AppLayout background-class="bg-bg-feelings" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-2 pb-8">
      <PracticeStepHeader :current-step="3" />

      <div class="mt-3">
        <h1 class="font-semibold">Sentiments</h1>
        <p class="mt-5">Je me sens...</p>
      </div>

      <label for="bag-content" class="sr-only">Ce que tu observes</label>
      <textarea
        id="bag-content"
        name="bag-content"
        class="mt-6 h-[clamp(16rem,38dvh,22.5rem)] w-full resize-none rounded-card bg-bg-card p-4 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
      />

      <button
        type="button"
        aria-label="Dicter le contenu"
        class="mx-auto mt-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-white focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
      >
        <img :src="MicroIcon" alt="Enregistrer à la voix" class="h-8 w-auto" />
      </button>

      <nav class="mt-8 flex items-center justify-between" aria-label="Navigation de la pratique">
        <RouterLink
          :to="{ name: 'observation' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Précédent
        </RouterLink>
        <RouterLink
          :to="{ name: 'needs' }"
          type="button"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Étape suivante
        </RouterLink>
      </nav>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'
import PracticeStepHeader from '../components/PracticeStepHeader.vue'
import MicroIcon from '../assets/microphone.svg'
</script>
