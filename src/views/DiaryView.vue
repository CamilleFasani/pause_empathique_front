<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-md flex-col px-5 pt-3 pb-8">
      <div
        class="mx-auto flex size-65 flex-col items-center justify-center rounded-full bg-white text-center shadow-[0_18px_45px_rgba(26,19,0,0.12)]"
        aria-labelledby="my-diary"
      >
        <h1 id="my-diary" class="px-8 text-2xl/10 font-logo">Mon journal</h1>
      </div>
      <div class="-mt-10 flex items-center justify-center gap-3">
        <RouterLink
          :to="{ name: 'home' }"
          class="flex size-28 -translate-y-6 items-center justify-center rounded-full bg-brand-primary-hover px-4 text-center text-sm text-black shadow-[0_12px_28px_rgba(26,19,0,0.14)] transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          aria-label="Accueil"
        >
          Accueil
        </RouterLink>

        <button
          type="button"
          class="flex size-32 items-center justify-center rounded-full bg-brand-primary px-4 text-center text-sm text-black shadow-[0_16px_34px_rgba(26,19,0,0.18)] transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
          @click="startPractice"
        >
          Pratiquer
        </button>
      </div>

      <section class="mt-8 flex flex-1 flex-col" aria-labelledby="all-pauses-title">
        <div class="flex items-center justify-between gap-4">
          <h2 id="all-pauses-title" class="font-logo text-2xl leading-tight">Mes pauses</h2>
        </div>

        <div class="mt-5 flex flex-wrap gap-2" aria-label="Filtres du journal">
          <button
            type="button"
            class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :class="
              hasActiveFilters
                ? 'border-black/20 bg-white'
                : 'border-brand-primary bg-brand-primary'
            "
            @click="clearFilters"
          >
            Tout
          </button>
          <button
            type="button"
            class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :class="
              activeFilterPanel === 'feelings'
                ? 'border-brand-primary bg-brand-primary'
                : 'border-black/20 bg-white'
            "
            aria-controls="journal-filter-panel"
            :aria-expanded="activeFilterPanel === 'feelings'"
            @click="toggleFilterPanel('feelings')"
          >
            Sentiments
          </button>
          <button
            type="button"
            class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :class="
              activeFilterPanel === 'needs'
                ? 'border-brand-primary bg-brand-primary'
                : 'border-black/20 bg-white'
            "
            aria-controls="journal-filter-panel"
            :aria-expanded="activeFilterPanel === 'needs'"
            @click="toggleFilterPanel('needs')"
          >
            Besoins
          </button>
          <button
            type="button"
            class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :class="
              activeFilterPanel === 'date'
                ? 'border-brand-primary bg-brand-primary'
                : 'border-black/20 bg-white'
            "
            aria-controls="journal-filter-panel"
            :aria-expanded="activeFilterPanel === 'date'"
            @click="toggleFilterPanel('date')"
          >
            Date
          </button>
        </div>

        <section
          v-if="activeFilterPanel"
          id="journal-filter-panel"
          class="mt-3 rounded-card bg-white px-4 py-4 shadow-[0_10px_24px_rgba(26,19,0,0.08)]"
          :aria-label="filterPanelLabel"
        >
          <div v-if="activeFilterPanel === 'feelings'" class="flex flex-wrap gap-2">
            <button
              v-for="family in feelingFamilyOptions"
              :key="family"
              type="button"
              class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              :class="
                selectedFeelingFamilies.includes(family)
                  ? 'border-warning bg-[#ffd8c7]'
                  : 'border-black/10 bg-bg-page'
              "
              :aria-pressed="selectedFeelingFamilies.includes(family)"
              @click="toggleFeelingFamily(family)"
            >
              {{ family }}
            </button>
          </div>

          <div v-else-if="activeFilterPanel === 'needs'" class="flex flex-wrap gap-2">
            <button
              v-for="family in needFamilyOptions"
              :key="family"
              type="button"
              class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              :class="
                selectedNeedFamilies.includes(family)
                  ? 'border-[#6f7f28] bg-[#e7ebc9]'
                  : 'border-black/10 bg-bg-page'
              "
              :aria-pressed="selectedNeedFamilies.includes(family)"
              @click="toggleNeedFamily(family)"
            >
              {{ family }}
            </button>
          </div>

          <div v-else class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in dateFilterOptions"
                :key="option.value"
                type="button"
                class="rounded-btn border px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                :class="
                  selectedDateFilter === option.value
                    ? 'border-brand-primary bg-brand-primary'
                    : 'border-black/10 bg-bg-page'
                "
                :aria-pressed="selectedDateFilter === option.value"
                @click="selectedDateFilter = option.value"
              >
                {{ option.label }}
              </button>
            </div>

            <div v-if="selectedDateFilter === 'custom'" class="grid grid-cols-2 gap-3">
              <label class="text-xs font-semibold text-black/70">
                Depuis
                <input
                  v-model="customStartDate"
                  type="date"
                  class="mt-1 w-full rounded-btn bg-bg-page px-3 py-2 text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
              </label>
              <label class="text-xs font-semibold text-black/70">
                Jusqu'à
                <input
                  v-model="customEndDate"
                  type="date"
                  class="mt-1 w-full rounded-btn bg-bg-page px-3 py-2 text-sm text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                />
              </label>
            </div>
          </div>
        </section>

        <div v-if="hasActiveFilters" class="mt-3 flex flex-wrap gap-2" aria-label="Filtres actifs">
          <button
            v-for="family in selectedFeelingFamilies"
            :key="`feeling-${family}`"
            type="button"
            class="rounded-btn border border-warning bg-[#ffd8c7] px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :aria-label="`Retirer le filtre sentiment ${family}`"
            @click="toggleFeelingFamily(family)"
          >
            {{ family }} x
          </button>
          <button
            v-for="family in selectedNeedFamilies"
            :key="`need-${family}`"
            type="button"
            class="rounded-btn border border-[#6f7f28] bg-[#e7ebc9] px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            :aria-label="`Retirer le filtre besoin ${family}`"
            @click="toggleNeedFamily(family)"
          >
            {{ family }} x
          </button>
          <button
            v-if="dateFilterLabel"
            type="button"
            class="rounded-btn border border-brand-primary bg-brand-primary-hover px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            aria-label="Retirer le filtre de date"
            @click="clearDateFilter"
          >
            {{ dateFilterLabel }} x
          </button>
        </div>

        <p v-if="isLoading" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
          Chargement des pauses...
        </p>
        <p v-else-if="loadingError" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
          {{ loadingError }}
        </p>
        <p v-else-if="pauses.length === 0" class="mt-6 rounded-card bg-white px-5 py-4 text-sm">
          Aucune pause enregistrée pour le moment.
        </p>
        <p
          v-else-if="filteredPauses.length === 0"
          class="mt-6 rounded-card bg-white px-5 py-4 text-sm"
        >
          Aucune pause ne correspond à ces filtres.
        </p>

        <div v-else class="relative mt-6 pl-6">
          <span
            class="absolute top-2 bottom-6 left-1.5 w-px bg-brand-primary"
            aria-hidden="true"
          ></span>

          <div class="space-y-5">
            <section v-for="group in groupedPauses" :key="group.dateKey" class="relative">
              <span
                class="absolute top-1.5 -left-6 size-3 rounded-full border-2 border-brand-primary bg-bg-page shadow-[0_0_0_4px_rgba(255,244,213,0.95)]"
                aria-hidden="true"
              ></span>

              <h3 class="text-xs font-bold leading-6 text-black/80">{{ group.label }}</h3>

              <div class="mt-3 space-y-3">
                <RouterLink
                  v-for="pauseItem in group.pauses"
                  :key="pauseItem.id"
                  :to="{ name: 'pause-detail', params: { id: pauseItem.id } }"
                  class="grid min-h-20 grid-cols-[3rem_1fr_auto] items-center gap-3 rounded-card bg-white px-4 py-3 text-black shadow-[0_10px_24px_rgba(26,19,0,0.08)] transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  <span
                    class="flex size-12 shrink-0 items-center justify-center rounded-full text-black"
                    :style="getPauseVisual(pauseItem).badgeStyle"
                    aria-hidden="true"
                  >
                    <JournalPauseIcon :icon-component="getPauseVisual(pauseItem).iconComponent" />
                  </span>

                  <span class="min-w-0">
                    <span class="block truncate text-sm font-semibold">{{ pauseItem.title }}</span>
                    <span class="mt-1 block text-xs text-black/65">
                      {{ formatPauseTime(pauseItem.created_at) }}
                    </span>
                    <span class="sr-only">{{ getPauseVisual(pauseItem).label }}</span>
                  </span>

                  <svg
                    class="size-5 text-black/35"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </RouterLink>
              </div>
            </section>
          </div>
        </div>
      </section>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type Component, type StyleValue } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import JournalPauseIcon from '../components/JournalPauseIcon.vue'
import { getAllPauses, getFeelings, getNeeds, type PauseResponse } from '../api/practice'
import { usePracticeStore } from '../stores/practice'
import {
  defaultJournalFeelingColor,
  defaultJournalNeedIconComponent,
  journalFeelingColors,
  journalNeedIconComponents,
} from '../config/journalVisuals'

type FilterPanel = 'feelings' | 'needs' | 'date'
type DateFilter = 'all' | '7days' | '30days' | 'month' | 'custom'

interface PauseGroup {
  dateKey: string
  label: string
  pauses: PauseResponse[]
}

interface PauseVisual {
  iconComponent: Component
  label: string
  badgeStyle: StyleValue
}

interface FamilyRank {
  family: string
  count: number
  firstIndex: number
}

const router = useRouter()
const practiceStore = usePracticeStore()
const pauses = ref<PauseResponse[]>([])
const feelingFamilyOptions = ref<string[]>([])
const needFamilyOptions = ref<string[]>([])
const selectedFeelingFamilies = ref<string[]>([])
const selectedNeedFamilies = ref<string[]>([])
const selectedDateFilter = ref<DateFilter>('all')
const customStartDate = ref('')
const customEndDate = ref('')
const activeFilterPanel = ref<FilterPanel | null>(null)
const isLoading = ref(false)
const loadingError = ref<string | null>(null)

const dateFilterOptions: { label: string; value: DateFilter }[] = [
  { label: '7 jours', value: '7days' },
  { label: '30 jours', value: '30days' },
  { label: 'Ce mois-ci', value: 'month' },
  { label: 'Dates', value: 'custom' },
]

const sortAlphabetically = (values: string[]) =>
  [...values].sort((first, second) => first.localeCompare(second, 'fr'))

const uniqueFamilies = (families: string[]) => sortAlphabetically([...new Set(families)])

const hasActiveFilters = computed(
  () =>
    selectedFeelingFamilies.value.length > 0 ||
    selectedNeedFamilies.value.length > 0 ||
    Boolean(dateFilterLabel.value),
)

const filterPanelLabel = computed(() => {
  if (activeFilterPanel.value === 'feelings') {
    return 'Filtrer par familles de sentiments'
  }

  if (activeFilterPanel.value === 'needs') {
    return 'Filtrer par familles de besoins'
  }

  return 'Filtrer par période'
})

const dateFilterLabel = computed(() => {
  if (selectedDateFilter.value === '7days') {
    return '7 jours'
  }

  if (selectedDateFilter.value === '30days') {
    return '30 jours'
  }

  if (selectedDateFilter.value === 'month') {
    return 'Ce mois-ci'
  }

  if (selectedDateFilter.value === 'custom' && (customStartDate.value || customEndDate.value)) {
    if (customStartDate.value && customEndDate.value) {
      return `${formatShortDate(customStartDate.value)} - ${formatShortDate(customEndDate.value)}`
    }

    return customStartDate.value
      ? `Depuis ${formatShortDate(customStartDate.value)}`
      : `Jusqu'au ${formatShortDate(customEndDate.value)}`
  }

  return null
})

const sortedPauses = computed(() =>
  [...pauses.value].sort(
    (first, second) => new Date(second.created_at).getTime() - new Date(first.created_at).getTime(),
  ),
)

const filteredPauses = computed(() =>
  sortedPauses.value.filter(
    (pauseItem) =>
      matchesFeelingFamilies(pauseItem) &&
      matchesNeedFamilies(pauseItem) &&
      matchesDateFilter(pauseItem),
  ),
)

const groupedPauses = computed<PauseGroup[]>(() => {
  const groups = new Map<string, PauseResponse[]>()

  filteredPauses.value.forEach((pauseItem) => {
    const dateKey = getDateKey(new Date(pauseItem.created_at))
    const group = groups.get(dateKey) ?? []

    group.push(pauseItem)
    groups.set(dateKey, group)
  })

  return [...groups.entries()].map(([dateKey, groupPauses]) => ({
    dateKey,
    label: formatGroupDate(dateKey),
    pauses: groupPauses,
  }))
})

const startPractice = async () => {
  practiceStore.start('authenticated')
  await router.push({ name: 'empty-your-bag' })
}

const toggleFilterPanel = (panel: FilterPanel) => {
  activeFilterPanel.value = activeFilterPanel.value === panel ? null : panel
}

const toggleString = (values: string[], value: string) =>
  values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value]

const toggleFeelingFamily = (family: string) => {
  selectedFeelingFamilies.value = toggleString(selectedFeelingFamilies.value, family)
}

const toggleNeedFamily = (family: string) => {
  selectedNeedFamilies.value = toggleString(selectedNeedFamilies.value, family)
}

const clearDateFilter = () => {
  selectedDateFilter.value = 'all'
  customStartDate.value = ''
  customEndDate.value = ''
}

const clearFilters = () => {
  selectedFeelingFamilies.value = []
  selectedNeedFamilies.value = []
  clearDateFilter()
  activeFilterPanel.value = null
}

const matchesFeelingFamilies = (pauseItem: PauseResponse) =>
  selectedFeelingFamilies.value.every((family) =>
    pauseItem.feelings.some((feeling) => feeling.family === family),
  )

const matchesNeedFamilies = (pauseItem: PauseResponse) =>
  selectedNeedFamilies.value.every((family) =>
    pauseItem.needs.some((need) => need.family === family),
  )

const matchesDateFilter = (pauseItem: PauseResponse) => {
  if (selectedDateFilter.value === 'all') {
    return true
  }

  const pauseDate = startOfDay(new Date(pauseItem.created_at))
  const today = startOfDay(new Date())

  if (selectedDateFilter.value === '7days') {
    return pauseDate >= addDays(today, -6)
  }

  if (selectedDateFilter.value === '30days') {
    return pauseDate >= addDays(today, -29)
  }

  if (selectedDateFilter.value === 'month') {
    return (
      pauseDate.getFullYear() === today.getFullYear() && pauseDate.getMonth() === today.getMonth()
    )
  }

  const startDate = customStartDate.value ? parseDateInput(customStartDate.value) : null
  const endDate = customEndDate.value ? parseDateInput(customEndDate.value) : null

  return (!startDate || pauseDate >= startDate) && (!endDate || pauseDate <= endDate)
}

const getPauseVisual = (pauseItem: PauseResponse): PauseVisual => {
  const predominantNeedFamily = getFirstPredominantFamily(
    pauseItem.needs.map((need) => need.family),
  )

  const iconComponent = predominantNeedFamily
    ? (journalNeedIconComponents[predominantNeedFamily] ?? defaultJournalNeedIconComponent)
    : defaultJournalNeedIconComponent

  return {
    iconComponent,
    label: predominantNeedFamily ? `Besoin prédominant : ${predominantNeedFamily}` : 'Pause',
    badgeStyle: getFeelingBackgroundStyle(pauseItem.feelings.map((feeling) => feeling.family)),
  }
}

const getFeelingBackgroundStyle = (families: string[]): StyleValue => {
  const predominantFamilies = getPredominantFamilies(families)
  const firstFamily = predominantFamilies[0]?.family

  if (!firstFamily) {
    return { backgroundColor: defaultJournalFeelingColor }
  }

  const firstColor = journalFeelingColors[firstFamily] ?? defaultJournalFeelingColor
  const secondFamily = predominantFamilies[1]?.family

  if (!secondFamily || predominantFamilies[1]?.count !== predominantFamilies[0].count) {
    return { backgroundColor: firstColor }
  }

  const secondColor = journalFeelingColors[secondFamily] ?? defaultJournalFeelingColor

  return {
    background: `linear-gradient(135deg, ${firstColor} 0%, ${secondColor} 100%)`,
  }
}

const getFirstPredominantFamily = (families: string[]) =>
  getPredominantFamilies(families)[0]?.family

const getPredominantFamilies = (families: string[]): FamilyRank[] => {
  const familyRanks = new Map<string, FamilyRank>()

  families.forEach((family, index) => {
    const rank = familyRanks.get(family)

    if (rank) {
      rank.count += 1
      return
    }

    familyRanks.set(family, {
      family,
      count: 1,
      firstIndex: index,
    })
  })

  return [...familyRanks.values()].sort(
    (first, second) => second.count - first.count || first.firstIndex - second.firstIndex,
  )
}

const formatPauseTime = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))

const formatGroupDate = (dateKey: string) => {
  const date = parseDateInput(dateKey)
  const today = startOfDay(new Date())

  if (date.getTime() === today.getTime()) {
    return "Aujourd'hui"
  }

  if (date.getTime() === addDays(today, -1).getTime()) {
    return 'Hier'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  }).format(date)
}

const formatShortDate = (dateKey: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(parseDateInput(dateKey))

const getDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const addDays = (date: Date, days: number) => {
  const result = new Date(date)

  result.setDate(result.getDate() + days)

  return result
}

const parseDateInput = (dateValue: string) => {
  const [year, month, day] = dateValue.split('-').map(Number)

  return new Date(year, month - 1, day)
}

onMounted(async () => {
  isLoading.value = true
  loadingError.value = null

  try {
    const [loadedPauses, loadedFeelings, loadedNeeds] = await Promise.all([
      getAllPauses(),
      getFeelings(),
      getNeeds(),
    ])

    pauses.value = loadedPauses
    feelingFamilyOptions.value = uniqueFamilies(loadedFeelings.map((feeling) => feeling.family))
    needFamilyOptions.value = uniqueFamilies(loadedNeeds.map((need) => need.family))
  } catch {
    loadingError.value = 'Le journal ne peut pas être chargé pour le moment.'
  } finally {
    isLoading.value = false
  }
})
</script>
