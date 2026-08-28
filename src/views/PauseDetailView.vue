<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-24 pb-8">
      <RouterLink
        :to="{ name: 'diary' }"
        class="self-start text-sm focus-visible:outline-1 focus-visible:outline-black"
      >
        &lt; Journal
      </RouterLink>

      <p v-if="isLoading" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
        Chargement de la pause...
      </p>
      <p v-else-if="loadingError" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
        {{ loadingError }}
      </p>

      <article v-else-if="pause" class="mt-6 space-y-6">
        <header class="rounded-card bg-white px-5 py-5">
          <p class="text-xs text-black/70">{{ formattedDate }}</p>
          <h1 class="mt-2 font-logo text-2xl leading-tight">{{ pause.title }}</h1>
        </header>

        <section aria-labelledby="empty-your-bag-title">
          <h2 id="empty-your-bag-title" class="text-sm font-bold">Vide ton sac</h2>
          <p class="mt-3 rounded-card bg-white px-5 py-4 text-sm leading-relaxed whitespace-pre-line">
            {{ pause.empty_your_bag || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="observation-title">
          <h2 id="observation-title" class="text-sm font-bold">Observation</h2>
          <p class="mt-3 rounded-card bg-white px-5 py-4 text-sm leading-relaxed whitespace-pre-line">
            {{ pause.observation || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="feelings-title">
          <h2 id="feelings-title" class="text-sm font-bold">Sentiments</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="feeling in pause.feelings"
              :key="feeling.id"
              class="rounded-btn bg-white px-3 py-2 text-xs font-semibold"
            >
              {{ getFeelingLabel(feeling) }}
            </span>
            <p v-if="pause.feelings.length === 0" class="rounded-card bg-white px-5 py-4 text-sm">
              Aucun sentiment enregistré.
            </p>
          </div>
        </section>

        <section aria-labelledby="needs-title">
          <h2 id="needs-title" class="text-sm font-bold">Besoins</h2>
          <div class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="need in pause.needs"
              :key="need.id"
              class="rounded-btn bg-white px-3 py-2 text-xs font-semibold"
            >
              {{ need.name }}
            </span>
            <p v-if="pause.needs.length === 0" class="rounded-card bg-white px-5 py-4 text-sm">
              Aucun besoin enregistré.
            </p>
          </div>
        </section>

        <p v-if="deleteError" class="rounded-card bg-white px-5 py-4 text-sm">
          {{ deleteError }}
        </p>

        <button
          type="button"
          class="w-full rounded-btn bg-white px-5 py-4 text-sm font-semibold text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isDeleting"
          @click="confirmDeletePause"
        >
          {{ isDeleting ? 'Suppression...' : 'Supprimer cette pause' }}
        </button>
      </article>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { deletePause, getPause, type Feeling, type PauseResponse } from '../api/practice'
import { useGender } from '../composables/useGender'

const route = useRoute()
const router = useRouter()
const { feelingNameGender } = useGender()
const pause = ref<PauseResponse | null>(null)
const isLoading = ref(false)
const isDeleting = ref(false)
const loadingError = ref<string | null>(null)
const deleteError = ref<string | null>(null)

const pauseId = computed(() => Number(route.params.id))

const formattedDate = computed(() => {
  if (!pause.value) {
    return ''
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(pause.value.created_at))
})

const getFeelingLabel = (feeling: Feeling) => feeling.names[feelingNameGender.value]

const confirmDeletePause = async () => {
  if (!pause.value || !window.confirm('Supprimer cette pause ?')) {
    return
  }

  isDeleting.value = true
  deleteError.value = null

  try {
    await deletePause(pause.value.id)
    await router.push({ name: 'diary' })
  } catch {
    deleteError.value = "La pause n'a pas pu être supprimée. Merci de réessayer."
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  if (!Number.isInteger(pauseId.value)) {
    loadingError.value = 'Cette pause est introuvable.'
    return
  }

  isLoading.value = true
  loadingError.value = null

  try {
    pause.value = await getPause(pauseId.value)
  } catch {
    loadingError.value = 'Cette pause est introuvable ou ne peut pas être chargée.'
  } finally {
    isLoading.value = false
  }
})
</script>
