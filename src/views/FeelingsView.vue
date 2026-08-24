<template>
  <AppLayout background-class="bg-bg-feelings" overlay-header :show-footer="false">
    <section class="relative flex min-h-dvh w-full max-w-md flex-col px-5 pt-2 pb-8">
      <PracticeStepHeader :current-step="3" />

      <div class="mt-3">
        <h1 class="font-semibold">Sentiments</h1>
        <p class="mt-5">Je me sens...</p>
      </div>

      <div v-if="selectedFeelings.length > 0" class="mt-5 space-y-3">
        <PracticeSelectionCard
          v-for="feeling in selectedFeelings"
          :key="feeling.id"
          :label="getFeelingLabel(feeling)"
          @remove="practiceStore.toggleFeeling(feeling.id)"
        />
      </div>

      <p v-if="isLoading" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        Chargement des sentiments...
      </p>
      <p v-else-if="loadingError" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        {{ loadingError }}
      </p>
      <p v-else-if="families.length === 0" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        Aucun sentiment disponible.
      </p>

      <div v-else class="mt-8 grid grid-cols-2 gap-4">
        <PracticeFamilyButton
          v-for="family in families"
          :key="family.name"
          :label="family.name"
          @select="openFamily(family.name)"
        />
      </div>

      <nav class="mt-8 flex items-center justify-between" aria-label="Navigation de la pratique">
        <RouterLink
          :to="{ name: 'observation' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Précédent
        </RouterLink>
        <button
          type="button"
          class="rounded-btn px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          :class="canContinue ? 'bg-brand-primary' : 'bg-white'"
          :disabled="!canContinue"
          @click="goToNeeds"
        >
          Étape suivante
        </button>
      </nav>

      <div
        v-if="activeFamily"
        class="absolute inset-0 z-20 flex justify-center bg-bg-feelings/45 px-6 pt-28 backdrop-blur-sm"
        @click.self="closeFamily"
      >
        <section
          role="dialog"
          aria-modal="true"
          :aria-labelledby="modalTitleId"
          class="relative max-h-[80dvh] w-full overflow-y-auto rounded-card bg-white px-7 pt-6 pb-7 shadow-xl"
        >
          <button
            type="button"
            class="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold leading-none text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
            :aria-label="`Fermer ${activeFamily}`"
            @click="closeFamily"
          >
            ×
          </button>

          <h2 :id="modalTitleId" class="text-center text-sm font-bold uppercase tracking-[0.2em]">
            {{ activeFamily }}
          </h2>

          <div class="mt-6 space-y-3">
            <button
              v-for="feeling in activeFamilyFeelings"
              :key="feeling.id"
              type="button"
              class="w-full rounded-btn px-4 py-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
              :class="
                isFeelingSelected(feeling.id)
                  ? 'bg-brand-primary text-black'
                  : 'bg-bg-page text-black'
              "
              :aria-pressed="isFeelingSelected(feeling.id)"
              @click="practiceStore.toggleFeeling(feeling.id)"
            >
              <span class="inline-flex min-w-5 justify-start" aria-hidden="true">
                <template v-if="isFeelingSelected(feeling.id)">✓</template>
              </span>
              {{ getFeelingLabel(feeling) }}
            </button>
          </div>

          <button
            type="button"
            class="mt-6 w-full rounded-btn bg-brand-primary px-4 py-3 text-sm font-semibold text-black focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
            @click="closeFamily"
          >
            Valider
          </button>
        </section>
      </div>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import PracticeStepHeader from '../components/PracticeStepHeader.vue'
import PracticeFamilyButton from '../components/PracticeFamilyButton.vue'
import PracticeSelectionCard from '../components/PracticeSelectionCard.vue'
import { getFeelings, type Feeling } from '../api/practice'
import { useGender } from '../composables/useGender'
import { usePracticeStore } from '../stores/practice'

interface FeelingFamily {
  name: string
  feelings: Feeling[]
}

const router = useRouter()
const practiceStore = usePracticeStore()
const { draft } = storeToRefs(practiceStore)
const { feelingNameGender } = useGender()
const feelings = ref<Feeling[]>([])
const isLoading = ref(false)
const loadingError = ref<string | null>(null)
const activeFamily = ref<string | null>(null)
const modalTitleId = 'feelings-family-title'

const families = computed<FeelingFamily[]>(() => {
  const groupedFeelings = new Map<string, Feeling[]>()

  feelings.value.forEach((feeling) => {
    const familyFeelings = groupedFeelings.get(feeling.family) ?? []
    familyFeelings.push(feeling)
    groupedFeelings.set(feeling.family, familyFeelings)
  })

  return Array.from(groupedFeelings, ([name, familyFeelings]) => ({
    name,
    feelings: familyFeelings,
  }))
})

const activeFamilyFeelings = computed(
  () => families.value.find((family) => family.name === activeFamily.value)?.feelings ?? [],
)

const selectedFeelings = computed(() =>
  draft.value.feelingIds
    .map((id) => feelings.value.find((feeling) => feeling.id === id))
    .filter((feeling): feeling is Feeling => feeling !== undefined),
)

const canContinue = computed(() => draft.value.feelingIds.length > 0)

const getFeelingLabel = (feeling: Feeling) => feeling.names[feelingNameGender.value]

const isFeelingSelected = (id: number) => draft.value.feelingIds.includes(id)

const openFamily = (familyName: string) => {
  activeFamily.value = familyName
}

const closeFamily = () => {
  activeFamily.value = null
}

const goToNeeds = async () => {
  if (!canContinue.value) {
    return
  }

  await router.push({ name: 'needs' })
}

onMounted(async () => {
  isLoading.value = true
  loadingError.value = null

  try {
    feelings.value = await getFeelings()
  } catch {
    loadingError.value = 'Les sentiments ne peuvent pas être chargés pour le moment.'
  } finally {
    isLoading.value = false
  }
})
</script>
