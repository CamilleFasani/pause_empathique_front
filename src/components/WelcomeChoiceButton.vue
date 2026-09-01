<script setup lang="ts">
import { computed, useId } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

const props = defineProps<{
  label: string
  curvedLabel: string
  to?: RouteLocationRaw
}>()

defineEmits<{
  select: []
}>()

const arcId = `welcome-choice-arc-${useId()}`
const componentType = computed(() => (props.to ? RouterLink : 'button'))
const componentProps = computed(() => (props.to ? { to: props.to } : { type: 'button' }))
</script>

<template>
  <component
    :is="componentType"
    v-bind="componentProps"
    :aria-label="`${label} — ${curvedLabel}`"
    class="relative z-10 flex h-35 w-35 shrink-0 items-center justify-center rounded-full bg-brand-primary text-black transition-transform hover:scale-[1.02] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-black"
    @click="$emit('select')"
  >
    <span class="max-w-24 font-logo text-lg leading-tight">{{ label }}</span>

    <svg
      class="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 140 140"
      aria-hidden="true"
    >
      <defs>
        <path :id="arcId" d="M32 108 A54 54 0 0 0 121 51" />
      </defs>
      <text dy="4" class="fill-black font-body text-[9px] font-semibold tracking-wide">
        <textPath :href="`#${arcId}`" startOffset="54%" text-anchor="middle">
          {{ curvedLabel }}
        </textPath>
      </text>
    </svg>
  </component>
</template>
