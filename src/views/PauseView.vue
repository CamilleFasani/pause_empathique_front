<template>
  <AppLayout background-class="bg-bg-needs" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-2 pb-8">
      <PracticeStepHeader :current-step="4" />
      <div class="mt-5">
        <label for="pause-title" class="sr-only">Titre de la pause</label>
        <input
          v-if="isEditingTitle"
          id="pause-title"
          ref="titleInput"
          v-model="draft.title"
          type="text"
          :placeholder="defaultTitle"
          class="w-full rounded-card bg-white/80 px-4 py-3 text-sm font-semibold placeholder:text-black/70 focus-visible:outline-1 focus-visible:outline-black"
          @blur="stopEditingTitle"
          @keydown.enter="stopEditingTitle"
        />
        <button
          v-else
          type="button"
          class="w-full rounded-card bg-white/80 px-4 py-3 text-left text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black"
          aria-label="Modifier le titre de la pause"
          @click="startEditingTitle"
        >
          {{ displayedTitle }}
        </button>
      </div>

      <div class="mt-6 space-y-6">
        <section aria-labelledby="empty-your-bag-title">
          <h2 id="empty-your-bag-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
            Vide ton sac
          </h2>
          <p
            class="mt-3 min-h-16 rounded-card bg-white/80 px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
          >
            {{ draft.emptyYourBag || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="observation-title">
          <h2 id="observation-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
            Observation
          </h2>
          <p
            class="mt-3 min-h-28 rounded-card bg-white/80 px-4 py-3 text-sm leading-relaxed whitespace-pre-line"
          >
            {{ draft.observation || 'Aucun texte saisi.' }}
          </p>
        </section>

        <section aria-labelledby="feelings-title">
          <h2 id="feelings-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
            Sentiments
          </h2>
          <div class="mt-3 space-y-3">
            <p v-if="isLoadingCatalogs" class="rounded-card bg-white/80 px-4 py-3 text-sm">
              Chargement des sentiments...
            </p>
            <p v-else-if="catalogError" class="rounded-card bg-white/80 px-4 py-3 text-sm">
              {{ catalogError }}
            </p>
            <p
              v-else-if="selectedFeelings.length === 0"
              class="rounded-card bg-white/80 px-4 py-3 text-sm"
            >
              Aucun sentiment sélectionné.
            </p>
            <PracticeSelectionCard
              v-for="feeling in selectedFeelings"
              v-else
              :key="feeling.id"
              :label="getFeelingLabel(feeling)"
              @remove="practiceStore.toggleFeeling(feeling.id)"
            />
          </div>
        </section>

        <section aria-labelledby="needs-title">
          <h2 id="needs-title" class="flex items-center gap-2 text-sm font-bold">
            <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
            Besoins
          </h2>
          <div class="mt-3 space-y-3">
            <p v-if="isLoadingCatalogs" class="rounded-card bg-white/80 px-4 py-3 text-sm">
              Chargement des besoins...
            </p>
            <p v-else-if="catalogError" class="rounded-card bg-white/80 px-4 py-3 text-sm">
              {{ catalogError }}
            </p>
            <p
              v-else-if="selectedNeeds.length === 0"
              class="rounded-card bg-white/80 px-4 py-3 text-sm"
            >
              Aucun besoin sélectionné.
            </p>
            <PracticeSelectionCard
              v-for="need in selectedNeeds"
              v-else
              :key="need.id"
              :label="getNeedLabel(need)"
              @remove="practiceStore.toggleNeed(need.id)"
            />
          </div>
        </section>
      </div>

      <p v-if="practiceStore.error" class="mt-6 rounded-card bg-white/80 px-4 py-3 text-sm">
        {{ practiceStore.error }}
      </p>

      <div class="mt-8 space-y-3">
        <button
          v-if="authStore.isAuthenticated"
          type="button"
          class="min-h-14 w-full rounded-btn bg-brand-primary px-5 py-4 text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="practiceStore.isSubmitting || !practiceStore.canSubmit"
          @click="saveAuthenticatedPause"
        >
          {{ practiceStore.isSubmitting ? 'Enregistrement...' : 'Enregistrer ma pause' }}
        </button>

        <template v-else>
          <button
            type="button"
            class="min-h-14 w-full rounded-btn bg-brand-primary px-5 py-4 text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="practiceStore.isSubmitting || !practiceStore.canSubmit"
            @click="goToRegister"
          >
            Créer un compte pour enregistrer
          </button>

          <button
            type="button"
            class="min-h-12 w-full rounded-btn bg-white px-5 py-3 text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="practiceStore.isSubmitting"
            @click="finishAnonymousPractice"
          >
            {{ practiceStore.isSubmitting ? 'Finalisation...' : 'Terminer sans enregistrer' }}
          </button>

          <button
            type="button"
            class="w-full px-5 py-2 text-sm underline underline-offset-4 focus-visible:outline-1 focus-visible:outline-black"
            @click="goToLogin"
          >
            J'ai déjà un compte
          </button>
        </template>
      </div>

      <nav class="mt-8 flex items-center justify-between" aria-label="Navigation de la pratique">
        <RouterLink
          :to="{ name: 'needs' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
        >
          Précédent
        </RouterLink>
        <RouterLink
          :to="{ name: 'welcome' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-1 focus-visible:outline-black"
        >
          Accueil
        </RouterLink>
      </nav>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import PracticeSelectionCard from '../components/PracticeSelectionCard.vue'
import PracticeStepHeader from '../components/PracticeStepHeader.vue'
import { getFeelings, getNeeds, type Feeling, type Need } from '../api/practice'
import { useGender } from '../composables/useGender'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()
const { draft } = storeToRefs(practiceStore)
const { feelingNameGender } = useGender()

const feelings = ref<Feeling[]>([])
const needs = ref<Need[]>([])
const isLoadingCatalogs = ref(false)
const catalogError = ref<string | null>(null)
const isEditingTitle = ref(false)
const titleInput = ref<HTMLInputElement | null>(null)

const defaultTitle = `Pause du ${new Intl.DateTimeFormat('fr-FR').format(new Date())}`

const displayedTitle = computed(() => draft.value.title.trim() || defaultTitle)

const selectedFeelings = computed(() =>
  draft.value.feelingIds
    .map((id) => feelings.value.find((feeling) => feeling.id === id))
    .filter((feeling): feeling is Feeling => feeling !== undefined),
)

const selectedNeeds = computed(() =>
  draft.value.needIds
    .map((id) => needs.value.find((need) => need.id === id))
    .filter((need): need is Need => need !== undefined),
)

const getFeelingLabel = (feeling: Feeling) => feeling.names[feelingNameGender.value]

const getNeedLabel = (need: Need) => need.name

const startEditingTitle = async () => {
  isEditingTitle.value = true
  await nextTick()
  titleInput.value?.focus()
}

const stopEditingTitle = () => {
  isEditingTitle.value = false
}

const saveAuthenticatedPause = async () => {
  if (!authStore.isAuthenticated) {
    return
  }

  try {
    practiceStore.continueAuthenticated()
    await practiceStore.submitAuthenticatedPause()
    await router.push({ name: 'home' })
  } catch {
    // The store exposes a safe user-facing error message.
  }
}

const goToRegister = async () => {
  practiceStore.prepareAuthentication()
  await router.push({ name: 'register' })
}

const goToLogin = async () => {
  practiceStore.prepareAuthentication()
  await router.push({ name: 'login' })
}

const finishAnonymousPractice = async () => {
  try {
    await practiceStore.submitAnonymousPractice()
    await router.push({ name: 'welcome' })
  } catch {
    // The store exposes a safe user-facing error message.
  }
}

onMounted(async () => {
  isLoadingCatalogs.value = true
  catalogError.value = null

  try {
    const [loadedFeelings, loadedNeeds] = await Promise.all([getFeelings(), getNeeds()])
    feelings.value = loadedFeelings
    needs.value = loadedNeeds
  } catch {
    catalogError.value = 'Le résumé ne peut pas charger les libellés pour le moment.'
  } finally {
    isLoadingCatalogs.value = false
  }
})
</script>
