<template>
  <section class="w-full rounded-card bg-white px-5 py-7" aria-labelledby="timeline-title">
    <h2 id="timeline-title" class="sr-only">Timeline des pratiques</h2>

    <div class="flex items-center justify-center gap-5 text-xs">
      <span>Sentiments</span>
      <button
        type="button"
        class="relative h-4 w-9 rounded-full border border-black bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        role="switch"
        aria-checked="false"
        aria-label="Afficher les statistiques des sentiments ou des besoins"
      >
        <span class="absolute top-0.5 left-0.5 size-3 rounded-full bg-black" aria-hidden="true" />
      </button>
      <span>Besoins</span>
    </div>

    <ol class="relative mx-auto mt-8 w-40">
      <li v-for="(month, index) in months" :key="month.name" class="relative grid grid-cols-[4rem_1fr]">
        <span class="pt-0.5 text-right text-[0.625rem] uppercase leading-none text-black/80">
          {{ month.name }}
        </span>

        <span class="relative ml-4 flex min-h-11 items-start">
          <span
            class="absolute left-0 top-0 h-full w-px bg-brand-primary"
            :class="index === months.length - 1 ? 'h-5' : ''"
            aria-hidden="true"
          />
          <span
            class="relative -left-1 top-0 size-2 rounded-full bg-brand-primary"
            aria-hidden="true"
          />
          <span
            v-if="month.hasMarker"
            class="absolute left-8 top-1 flex size-5 items-center justify-center rounded-full border border-black bg-white p-1"
            aria-hidden="true"
          >
            <img :src="logoSrc" alt="" class="h-full w-auto" />
          </span>
        </span>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import logoSrc from '../assets/logo.png'

const months = [
  { name: 'Janvier', hasMarker: false },
  { name: 'Février', hasMarker: false },
  { name: 'Mars', hasMarker: false },
  { name: 'Avril', hasMarker: true },
  { name: 'Mai', hasMarker: false },
  { name: 'Juin', hasMarker: false },
  { name: 'Juillet', hasMarker: false },
  { name: 'Août', hasMarker: false },
  { name: 'Septembre', hasMarker: false },
  { name: 'Octobre', hasMarker: false },
  { name: 'Novembre', hasMarker: false },
]
</script>
