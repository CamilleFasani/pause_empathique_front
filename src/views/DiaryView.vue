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

        <div v-else class="mt-6 space-y-4">
          <template v-for="group in groupedPauses" :key="group.dateKey">
            <div class="flex items-center gap-3" aria-hidden="true">
              <span class="h-px flex-1 bg-black/10"></span>
              <span
                class="rounded-full bg-brand-primary-hover px-4 py-2 text-center text-xs font-semibold shadow-[0_8px_18px_rgba(26,19,0,0.08)]"
              >
                {{ group.label }}
              </span>
              <span class="h-px flex-1 bg-black/10"></span>
            </div>

            <RouterLink
              v-for="pauseItem in group.pauses"
              :key="pauseItem.id"
              :to="{ name: 'pause-detail', params: { id: pauseItem.id } }"
              class="flex min-h-20 items-center gap-4 rounded-card bg-white px-4 py-3 text-black shadow-[0_10px_24px_rgba(26,19,0,0.08)] transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              <span
                class="flex size-12 shrink-0 items-center justify-center rounded-full"
                :class="getPauseVisual(pauseItem).badgeClass"
                aria-hidden="true"
              >
                <svg
                  class="size-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle v-if="getPauseVisual(pauseItem).icon === 'sun'" cx="12" cy="12" r="3" />
                  <path
                    v-if="getPauseVisual(pauseItem).icon === 'sun'"
                    d="M12 2v2 M12 20v2 M4 12H2 M22 12h-2 M5 5l1.5 1.5 M17.5 17.5 19 19 M19 5l-1.5 1.5 M6.5 17.5 5 19"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'heart'"
                    d="M20.5 8.8c0 5.1-8.5 9.7-8.5 9.7S3.5 13.9 3.5 8.8A4.5 4.5 0 0 1 12 6.7a4.5 4.5 0 0 1 8.5 2.1Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'leaf'"
                    d="M19.5 4.5C11 4.8 6 8.8 5 17c5.8 1.2 10.9-1.4 14.5-12.5Z M5 17c2.5-3.8 5.5-6.2 9-7.2"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'anchor'"
                    d="M12 4v13 M8 7h8 M5 14c1.2 3 3.5 5 7 5s5.8-2 7-5 M9 17l-4-3 M15 17l4-3"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'wave'"
                    d="M3 14c2.5-3 5.5-3 8 0s5.5 3 10 0 M3 18c2.5-3 5.5-3 8 0s5.5 3 10 0"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'shield'"
                    d="M12 3 19 6v5c0 4.2-2.8 7.8-7 10-4.2-2.2-7-5.8-7-10V6l7-3Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'spark'"
                    d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z M18 16l.8 2.2L21 19l-2.2.8L18 22l-.8-2.2L15 19l2.2-.8L18 16Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'drop'"
                    d="M12 3s6 6.3 6 11a6 6 0 0 1-12 0c0-4.7 6-11 6-11Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'spiral'"
                    d="M12 12c2.5-2.4 7-1 7 2.5S15.7 21 11 21s-8-3.2-8-7.4S6.8 5 12 5c3.4 0 6 1.8 6 4.2"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'moon'"
                    d="M19 15.5A7.5 7.5 0 0 1 8.5 5a7.5 7.5 0 1 0 10.5 10.5Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'balance'"
                    d="M12 4v16 M6 7h12 M7 7l-3 6h6L7 7Z M17 7l-3 6h6l-3-6Z"
                  />
                  <path
                    v-else-if="getPauseVisual(pauseItem).icon === 'bridge'"
                    d="M4 18V9 M20 18V9 M4 14c4-5 12-5 16 0 M7 18v-4 M12 18v-6 M17 18v-4"
                  />
                  <path v-else d="M12 5v14 M8 8v8 M16 8v8" />
                </svg>
              </span>

              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-semibold">{{ pauseItem.title }}</span>
                <span class="mt-1 block text-xs text-black/55">
                  {{ getPauseVisual(pauseItem).label }}
                </span>
              </span>
              <span class="text-sm font-semibold text-black/55">
                {{ formatPauseTime(pauseItem.created_at) }}
              </span>
            </RouterLink>
          </template>
        </div>
      </section>
    </section>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import { getAllPauses, getFeelings, getNeeds, type PauseResponse } from '../api/practice'
import { usePracticeStore } from '../stores/practice'

type FilterPanel = 'feelings' | 'needs' | 'date'
type DateFilter = 'all' | '7days' | '30days' | 'month' | 'custom'
type JournalIcon =
  | 'sun'
  | 'heart'
  | 'leaf'
  | 'anchor'
  | 'wave'
  | 'shield'
  | 'spark'
  | 'drop'
  | 'spiral'
  | 'moon'
  | 'balance'
  | 'bridge'
  | 'pause'

interface PauseGroup {
  dateKey: string
  label: string
  pauses: PauseResponse[]
}

interface PauseVisual {
  icon: JournalIcon
  label: string
  badgeClass: string
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

const feelingFamilyIcons: Record<string, JournalIcon> = {
  Affection: 'heart',
  Sérénité: 'wave',
  Joie: 'sun',
  Intérêt: 'spark',
  Energie: 'spark',
  Énergie: 'spark',
  Peur: 'shield',
  Colère: 'spark',
  Tristesse: 'drop',
  Confusion: 'spiral',
  Fatigue: 'moon',
  Sidération: 'pause',
  Tension: 'anchor',
}

const needFamilyIcons: Record<string, JournalIcon> = {
  Survie: 'shield',
  Intégrité: 'anchor',
  Réalisation: 'spark',
  Harmonie: 'balance',
  Relation: 'heart',
  Coopération: 'bridge',
  Célébration: 'sun',
}

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
  const firstFeelingFamily = pauseItem.feelings[0]?.family

  if (firstFeelingFamily) {
    return {
      icon: feelingFamilyIcons[firstFeelingFamily] ?? 'spark',
      label: firstFeelingFamily,
      badgeClass: 'bg-[#ffd8c7] text-warning',
    }
  }

  const firstNeedFamily = pauseItem.needs[0]?.family

  if (firstNeedFamily) {
    return {
      icon: needFamilyIcons[firstNeedFamily] ?? 'leaf',
      label: firstNeedFamily,
      badgeClass: 'bg-[#e7ebc9] text-[#5f6f23]',
    }
  }

  return {
    icon: 'pause',
    label: 'Pause',
    badgeClass: 'bg-brand-primary-hover text-black',
  }
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
