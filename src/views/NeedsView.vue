<template>
  <AppLayout background-class="bg-bg-needs" overlay-header :show-footer="false">
    <section class="relative flex min-h-dvh w-full max-w-md flex-col px-5 pt-2 pb-8">
      <PracticeStepHeader :current-step="4" />

      <div class="mt-3">
        <h1 class="font-semibold">Besoins</h1>
        <p class="mt-5">Je veux vivre...</p>
      </div>

      <div v-if="selectedNeeds.length > 0" class="mt-5 space-y-3">
        <PracticeSelectionCard
          v-for="need in selectedNeeds"
          :key="need.id"
          :label="getNeedLabel(need)"
          @remove="practiceStore.toggleNeed(need.id)"
        />
      </div>

      <p v-if="isLoading" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        Chargement des besoins...
      </p>
      <p v-else-if="loadingError" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        {{ loadingError }}
      </p>
      <p v-else-if="families.length === 0" class="mt-8 rounded-card bg-white/70 p-4 text-sm">
        Aucun besoin disponible.
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
          :to="{ name: 'feelings' }"
          class="rounded-btn bg-white px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black"
        >
          Précédent
        </RouterLink>
        <button
          type="button"
          class="rounded-btn px-6 py-3 text-sm focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          :class="canContinue ? 'bg-brand-primary' : 'bg-white'"
          :disabled="!canContinue"
          @click="goToPause"
        >
          Étape suivante
        </button>
      </nav>

      <div
        v-if="activeFamily"
        class="absolute inset-0 z-20 flex justify-center bg-bg-needs/45 px-6 pt-28 backdrop-blur-sm"
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
              v-for="need in activeFamilyNeeds"
              :key="need.id"
              type="button"
              class="w-full rounded-btn px-4 py-3 text-sm font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black"
              :class="
                isNeedSelected(need.id) ? 'bg-brand-primary text-black' : 'bg-bg-page text-black'
              "
              :aria-pressed="isNeedSelected(need.id)"
              @click="practiceStore.toggleNeed(need.id)"
            >
              <span class="inline-flex min-w-5 justify-start" aria-hidden="true">
                <template v-if="isNeedSelected(need.id)">✓</template>
              </span>
              {{ getNeedLabel(need) }}
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
import { getNeeds, type Need } from '../api/practice'
import { usePracticeStore } from '../stores/practice'

interface NeedFamily {
  name: string
  needs: Need[]
}

const router = useRouter()
const practiceStore = usePracticeStore()
const { draft } = storeToRefs(practiceStore)
const needs = ref<Need[]>([])
const isLoading = ref(false)
const loadingError = ref<string | null>(null)
const activeFamily = ref<string | null>(null)
const modalTitleId = 'needs-family-title'

const families = computed<NeedFamily[]>(() => {
  const groupedNeeds = new Map<string, Need[]>()

  needs.value.forEach((need) => {
    const familyNeeds = groupedNeeds.get(need.family) ?? []
    familyNeeds.push(need)
    groupedNeeds.set(need.family, familyNeeds)
  })

  return Array.from(groupedNeeds, ([name, familyNeeds]) => ({
    name,
    needs: familyNeeds,
  }))
})

const activeFamilyNeeds = computed(
  () => families.value.find((family) => family.name === activeFamily.value)?.needs ?? [],
)

const selectedNeeds = computed(() =>
  draft.value.needIds
    .map((id) => needs.value.find((need) => need.id === id))
    .filter((need): need is Need => need !== undefined),
)

const canContinue = computed(() => draft.value.needIds.length > 0)

const getNeedLabel = (need: Need) => need.name

const isNeedSelected = (id: number) => draft.value.needIds.includes(id)

const openFamily = (familyName: string) => {
  activeFamily.value = familyName
}

const closeFamily = () => {
  activeFamily.value = null
}

const goToPause = async () => {
  if (!canContinue.value) {
    return
  }

  await router.push({ name: 'pause' })
}

onMounted(async () => {
  isLoading.value = true
  loadingError.value = null

  try {
    needs.value = await getNeeds()
  } catch {
    loadingError.value = 'Les besoins ne peuvent pas être chargés pour le moment.'
  } finally {
    isLoading.value = false
  }
})
</script>
