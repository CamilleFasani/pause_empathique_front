<template>
  <div class="flex min-h-dvh w-full bg-bg-page font-body text-black">
    <main class="flex min-h-dvh flex-1 justify-center overflow-y-auto">
      <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-4 pb-8">
        <header class="flex h-8 items-center justify-between">
          <button
            type="button"
            class="flex size-8 items-center justify-center focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            aria-label="Ouvrir le menu"
          >
            <img :src="MenuIcon" alt="" class="h-7 w-auto" />
          </button>

          <RouterLink
            :to="{ name: accountRouteName }"
            class="flex size-8 items-center justify-center focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
            aria-label="Accéder au compte"
          >
            <img :src="UserIcon" alt="" class="h-7 w-auto" />
          </RouterLink>
        </header>

        <div class="mt-1 flex justify-center">
          <div
            class="relative flex h-[clamp(8rem,55vw,13.5rem)] w-[clamp(8rem,55vw,13.5rem)] items-center justify-center rounded-full bg-white"
          >
            <div class="absolute top-6 flex gap-2" aria-hidden="true">
              <span class="h-5 w-2 rounded-sm bg-brand-primary"></span>
              <span class="h-5 w-2 rounded-sm bg-brand-primary"></span>
            </div>
            <p class="mt-7 text-lg">Pratiquer</p>
          </div>
        </div>

        <nav
          class="mt-1 flex items-center justify-between text-xs"
          aria-label="Navigation de la pratique"
        >
          <RouterLink :to="{ name: 'needs' }" class="py-2 focus-visible:outline-2">
            &lt; Besoins
          </RouterLink>
          <RouterLink :to="{ name: 'welcome' }" class="py-2 focus-visible:outline-2">
            Accueil
          </RouterLink>
        </nav>

        <div class="mt-3 text-center">
          <label for="pause-title" class="sr-only">Titre de la pause</label>
          <input
            v-if="isEditingTitle"
            id="pause-title"
            ref="titleInput"
            v-model="draft.title"
            type="text"
            :placeholder="defaultTitle"
            class="w-full bg-transparent text-center text-sm font-bold placeholder:text-black placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
            @blur="stopEditingTitle"
            @keydown.enter="stopEditingTitle"
          />
          <button
            v-else
            type="button"
            class="w-full py-1 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-black"
            aria-label="Modifier le titre de la pause"
            @click="startEditingTitle"
          >
            {{ displayedTitle }}
          </button>
        </div>

        <div class="mt-5 space-y-5">
          <section aria-labelledby="empty-your-bag-title">
            <h2 id="empty-your-bag-title" class="flex items-center gap-2 text-xs font-bold">
              <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
              Vide ton sac
            </h2>
            <p class="mt-3 min-h-12 rounded-btn bg-white px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
              {{ draft.emptyYourBag || 'Aucun texte saisi.' }}
            </p>
          </section>

          <section aria-labelledby="observation-title">
            <h2 id="observation-title" class="flex items-center gap-2 text-xs font-bold">
              <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
              Observation
            </h2>
            <p class="mt-3 min-h-36 rounded-btn bg-white px-4 py-3 text-sm leading-relaxed whitespace-pre-line">
              {{ draft.observation || 'Aucun texte saisi.' }}
            </p>
          </section>

          <section aria-labelledby="feelings-title">
            <h2 id="feelings-title" class="flex items-center gap-2 text-xs font-bold">
              <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
              Sentiments
            </h2>
            <div class="mt-3 space-y-3">
              <p v-if="isLoadingCatalogs" class="rounded-btn bg-white px-4 py-3 text-sm">
                Chargement...
              </p>
              <p v-else-if="catalogError" class="rounded-btn bg-white px-4 py-3 text-sm">
                {{ catalogError }}
              </p>
              <p
                v-else-if="selectedFeelings.length === 0"
                class="rounded-btn bg-white px-4 py-3 text-sm"
              >
                Aucun sentiment sélectionné.
              </p>
              <div
                v-for="feeling in selectedFeelings"
                v-else
                :key="feeling.id"
                class="grid min-h-12 grid-cols-[4.75rem_1fr] items-center rounded-btn bg-white px-4 py-3 text-xs"
              >
                <span>{{ getFeelingLabel(feeling) }}</span>
                <span class="h-1 bg-brand-primary" aria-hidden="true"></span>
              </div>
            </div>
          </section>

          <section aria-labelledby="needs-title">
            <h2 id="needs-title" class="flex items-center gap-2 text-xs font-bold">
              <span class="size-3 rounded-full bg-brand-primary" aria-hidden="true"></span>
              Besoins
            </h2>
            <div class="mt-3 space-y-3">
              <p v-if="isLoadingCatalogs" class="rounded-btn bg-white px-4 py-3 text-sm">
                Chargement...
              </p>
              <p v-else-if="catalogError" class="rounded-btn bg-white px-4 py-3 text-sm">
                {{ catalogError }}
              </p>
              <p
                v-else-if="selectedNeeds.length === 0"
                class="rounded-btn bg-white px-4 py-3 text-sm"
              >
                Aucun besoin sélectionné.
              </p>
              <div
                v-for="need in selectedNeeds"
                v-else
                :key="need.id"
                class="grid min-h-12 grid-cols-[4.75rem_1fr] items-center rounded-btn bg-white px-4 py-3 text-xs"
              >
                <span>{{ getNeedLabel(need) }}</span>
                <span class="h-1 bg-brand-primary" aria-hidden="true"></span>
              </div>
            </div>
          </section>
        </div>

        <button
          type="button"
          class="mt-6 min-h-14 w-full rounded-btn bg-brand-primary px-5 py-4 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Enregistrer
        </button>
      </section>
    </main>

    <AppSidebar class="hidden lg:flex" />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppSidebar from '../components/AppSidebar.vue'
import MenuIcon from '../assets/menu.svg'
import UserIcon from '../assets/user.svg'
import { getFeelings, getNeeds, type Feeling, type Need } from '../api/practice'
import { useGender } from '../composables/useGender'
import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

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

const accountRouteName = computed(() => (authStore.isAuthenticated ? 'home' : 'login'))

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
