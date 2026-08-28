<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-3 pb-8">
      <div
        class="mx-auto flex size-65 flex-col items-center justify-center rounded-full bg-white text-center"
        aria-labelledby="my-diary"
      >
        <h1 id="my-diary" class="px-8 text-2xl/10 font-logo">Mon journal</h1>
      </div>

      <nav class="-mt-3 flex items-center justify-between text-sm" aria-label="Navigation rapide">
        <RouterLink
          :to="{ name: 'home' }"
          class="focus-visible:outline-1 focus-visible:outline-black"
        >
          &lt; Accueil
        </RouterLink>
        <button
          type="button"
          class="focus-visible:outline-1 focus-visible:outline-black"
          @click="startPractice"
        >
          Pratiquer &gt;
        </button>
      </nav>

      <section class="mt-8 flex flex-1 flex-col" aria-labelledby="all-pauses-title">
        <h2 id="all-pauses-title" class="text-sm font-bold">Mes pauses</h2>
        <div class="mt-3 min-h-40 flex-1 rounded-card bg-white"></div>
      </section>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { usePracticeStore } from '../stores/practice'

const router = useRouter()
const practiceStore = usePracticeStore()

const startPractice = async () => {
  practiceStore.start('authenticated')
  await router.push({ name: 'empty-your-bag' })
}
</script>
