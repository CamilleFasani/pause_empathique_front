<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col items-center px-5 pt-3 pb-8">
      <div
        class="flex size-65 flex-col items-center justify-center rounded-full bg-white text-center"
        aria-labelledby="home-greeting"
      >
        <h1 id="home-greeting" class="px-8 text-2xl/10 font-logo">Bonjour</h1>
        <p class="ml-6 px-8 font-logo text-2xl/8">{{ firstName }} !</p>
      </div>

      <div class="-mt-10 flex items-center justify-center gap-3">
        <RouterLink
          :to="{ name: 'diary' }"
          class="flex size-28 -translate-y-6 items-center justify-center rounded-full bg-[#d9a100] px-4 text-center text-sm text-black transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          aria-label="Ouvrir mon journal"
        >
          Mon journal
        </RouterLink>

        <button
          type="button"
          class="flex size-32 items-center justify-center rounded-full bg-brand-primary px-4 text-center text-sm text-black transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          @click="startPractice"
        >
          Pratiquer
        </button>
      </div>

      <section class="mt-8 w-full" aria-labelledby="latest-pauses-title">
        <h2 id="latest-pauses-title" class="text-sm font-bold">Mes dernières pauses</h2>

        <p v-if="isLoadingPauses" class="mt-3 rounded-card bg-white px-5 py-4 text-sm">
          Chargement des pauses...
        </p>
        <p v-else-if="pausesError" class="mt-3 rounded-card bg-white px-5 py-4 text-sm">
          {{ pausesError }}
        </p>
        <p
          v-else-if="latestPauses.length === 0"
          class="mt-3 rounded-card bg-white px-5 py-4 text-sm"
        >
          Aucune pause enregistrée pour le moment.
        </p>

        <div v-else class="mt-3 space-y-3">
          <RouterLink
            v-for="pause in latestPauses"
            :key="pause.id"
            :to="{ name: 'pause-detail', params: { id: pause.id } }"
            class="block rounded-card bg-white px-5 py-4 text-xs leading-snug text-black transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            <span class="block font-semibold">{{ pause.title }}</span>
            <span class="mt-1 block text-[0.625rem] text-black/65">
              {{ formatPauseDate(pause.created_at) }}
            </span>
          </RouterLink>
        </div>
      </section>

      <PracticeTimeline class="mt-9" />
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import PracticeTimeline from '../components/PracticeTimeline.vue'
import { getPauses, type PauseResponse } from '../api/practice'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()
const pauses = ref<PauseResponse[]>([])
const isLoadingPauses = ref(false)
const pausesError = ref<string | null>(null)

const firstName = computed(() => authStore.user?.firstname || 'à toi')
const latestPauses = computed(() => pauses.value.slice(0, 3))

const formatPauseDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

const startPractice = async () => {
  practiceStore.start('authenticated')
  await router.push({ name: 'empty-your-bag' })
}

onMounted(async () => {
  isLoadingPauses.value = true
  pausesError.value = null

  try {
    pauses.value = await getPauses()
  } catch {
    pausesError.value = 'Les pauses ne peuvent pas être chargées pour le moment.'
  } finally {
    isLoadingPauses.value = false
  }
})
</script>
