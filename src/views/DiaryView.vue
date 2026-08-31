<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-3 pb-8">
      <div
        class="mx-auto flex size-65 flex-col items-center justify-center rounded-full bg-white text-center"
        aria-labelledby="my-diary"
      >
        <h1 id="my-diary" class="px-8 text-2xl/10 font-logo">Mon journal</h1>
      </div>
      <div class="-mt-10 flex items-center justify-center gap-3">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex size-28 -translate-y-6 items-center justify-center rounded-full bg-brand-primary-hover px-4 text-center text-sm text-black transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          aria-label="Accueil"
        >
          Accueil
        </RouterLink>

        <button
          type="button"
          class="flex size-32 items-center justify-center rounded-full bg-brand-primary px-4 text-center text-sm text-black transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          @click="startPractice"
        >
          Pratiquer
        </button>
      </div>

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
