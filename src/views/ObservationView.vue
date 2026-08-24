<template>
  <AppLayout background-class="bg-bg-observation" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-2 pb-8">
      <PracticeStepHeader :current-step="2" />

      <div class="mt-3">
        <h1 class="font-semibold">Observation</h1>
        <img
          :src="InfoIcon"
          alt="Informations"
          class="h-6 w-auto mt-2"
          @click="showIntroText = !showIntroText"
        />
        <div v-if="showIntroText">
          <p class="mt-5">Cette deuxième étape t'invite à décrire factuellement ce qui se passe.</p>
          <p class="mt-5">Prends le temps de trouver tes mots. Tu peux aussi faire un vocal.</p>
        </div>
      </div>

      <label for="observation-content" class="sr-only">Ce que tu observes</label>
      <textarea
        id="observation-content"
        v-model="draft.observation"
        name="observation-content"
        class="mt-6 h-[clamp(16rem,38dvh,22.5rem)] w-full resize-none rounded-card bg-bg-card p-4 focus-visible:outline-1 focus-visible:outline-black"
      />

      <button
        type="button"
        aria-label="Dicter le contenu"
        class="mx-auto mt-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-white focus-visible:outline-1 focus-visible:outline-black"
      >
        <img :src="MicroIcon" alt="Enregistrer à la voix" class="h-8 w-auto" />
      </button>

      <nav class="mt-8 flex items-center justify-between" aria-label="Navigation de la pratique">
        <RouterLink
          :to="{ name: 'empty-your-bag' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
        >
          Précédent
        </RouterLink>
        <RouterLink
          :to="{ name: 'feelings' }"
          type="button"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
        >
          Étape suivante
        </RouterLink>
      </nav>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppLayout from '../layouts/AppLayout.vue'
import PracticeStepHeader from '../components/PracticeStepHeader.vue'
import MicroIcon from '../assets/microphone.svg'
import InfoIcon from '../assets/info-circle.svg'
import { usePracticeStore } from '../stores/practice'

const practiceStore = usePracticeStore()
const { draft } = storeToRefs(practiceStore)
const showIntroText = ref(false)
</script>
