<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-16 pb-8">
      <p v-if="isLoading" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
        Chargement de la pause...
      </p>
      <p v-else-if="loadingError" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
        {{ loadingError }}
      </p>

      <article v-else-if="pause" class="mt-6 space-y-6">
        <header class="rounded-card bg-white px-5 py-4">
          <h1 class="mt-2 font-logo text-2xl leading-tight">{{ pause.title }}</h1>
        </header>

        <section aria-labelledby="empty-your-bag-title">
          <h2 id="empty-your-bag-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-2 rounded-full bg-brand-primary" aria-hidden="true"></span>Vide ton
            sac
          </h2>
          <p
            class="mt-3 rounded-card bg-white px-5 py-4 text-sm leading-relaxed whitespace-pre-line"
          >
            {{ pause.empty_your_bag || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="observation-title">
          <h2 id="observation-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-2 rounded-full bg-brand-primary" aria-hidden="true"></span>Observation
          </h2>
          <p
            class="mt-3 rounded-card bg-white px-5 py-4 text-sm leading-relaxed whitespace-pre-line"
          >
            {{ pause.observation || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="feelings-title">
          <h2 id="feelings-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-2 rounded-full bg-brand-primary" aria-hidden="true"></span>Sentiments
          </h2>
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
          <h2 id="needs-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-2 rounded-full bg-brand-primary" aria-hidden="true"></span>Besoins
          </h2>
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
        <section aria-labelledby="creation-date">
          <p class="text-xs text-black/70">{{ formattedDate }}</p>
        </section>
        <button
          type="button"
          class="w-full rounded-btn bg-warning px-5 py-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="isDeleting"
          @click="openDeleteModal"
        >
          Supprimer cette pause
        </button>
      </article>

      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-bg-page/65 px-5 backdrop-blur-sm"
        @click.self="closeDeleteModal"
      >
        <section
          role="dialog"
          aria-modal="true"
          :aria-labelledby="deleteModalTitleId"
          :aria-describedby="deleteModalDescriptionId"
          class="relative w-full max-w-sm rounded-card bg-white px-7 pt-7 pb-6 text-black shadow-xl"
          @keydown.esc="closeDeleteModal"
        >
          <button
            type="button"
            class="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold leading-none text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Fermer la confirmation de suppression"
            :disabled="isDeleting"
            @click="closeDeleteModal"
          >
            ×
          </button>

          <h2 :id="deleteModalTitleId" class="pr-5 font-logo text-xl leading-tight">
            Supprimer cette pause ?
          </h2>
          <p :id="deleteModalDescriptionId" class="mt-4 text-sm leading-relaxed text-black/75">
            Cette action est définitive. La pause ne sera plus visible dans ton journal.
          </p>

          <p v-if="deleteError" class="mt-5 rounded-card bg-bg-page px-4 py-3 text-sm">
            {{ deleteError }}
          </p>

          <div class="mt-6 grid gap-3">
            <button
              ref="cancelDeleteButton"
              type="button"
              class="rounded-btn bg-bg-page px-4 py-3 text-sm font-semibold text-black focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isDeleting"
              @click="closeDeleteModal"
            >
              Garder ma pause
            </button>
            <button
              type="button"
              class="rounded-btn bg-warning px-4 py-3 text-sm font-semibold text-white focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isDeleting"
              @click="deleteCurrentPause"
            >
              {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
            </button>
          </div>
        </section>
      </div>

      <nav class="mt-8 flex items-center justify-between" aria-label="Navigation de la pratique">
        <RouterLink
          :to="{ name: 'diary' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
        >
          Mon Journal
        </RouterLink>
        <button
          type="button"
          class="rounded-btn bg-brand-primary px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
          @click="startPractice"
        >
          Pratiquer
        </button>
      </nav>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { deletePause, getPause, type Feeling, type PauseResponse } from '../api/practice'
import { useGender } from '../composables/useGender'
import { usePracticeStore } from '../stores/practice'

const route = useRoute()
const router = useRouter()
const practiceStore = usePracticeStore()
const { feelingNameGender } = useGender()
const pause = ref<PauseResponse | null>(null)
const isLoading = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const loadingError = ref<string | null>(null)
const deleteError = ref<string | null>(null)
const cancelDeleteButton = ref<HTMLButtonElement | null>(null)
const deleteModalTitleId = 'delete-pause-title'
const deleteModalDescriptionId = 'delete-pause-description'

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

const openDeleteModal = () => {
  if (!pause.value) {
    return
  }

  deleteError.value = null
  isDeleteModalOpen.value = true
  nextTick(() => cancelDeleteButton.value?.focus())
}

const closeDeleteModal = () => {
  if (isDeleting.value) {
    return
  }

  isDeleteModalOpen.value = false
}

const deleteCurrentPause = async () => {
  if (!pause.value) {
    return
  }

  isDeleting.value = true
  deleteError.value = null

  try {
    await deletePause(pause.value.id)
    await router.push({ name: 'home' })
  } catch {
    deleteError.value = "La pause n'a pas pu être supprimée. Merci de réessayer."
  } finally {
    isDeleting.value = false
  }
}

const startPractice = async () => {
  practiceStore.start('authenticated')
  await router.push({ name: 'empty-your-bag' })
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
