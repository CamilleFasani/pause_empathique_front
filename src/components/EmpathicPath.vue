<template>
  <!-- eslint-disable-next-line vue/no-v-html : SVG statique issu de nos assets, pas de données utilisateur -->
  <div ref="container" class="empathic-path" v-html="svgContent" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import svgContent from '../assets/empathic-path.svg?raw'

const emit = defineEmits<{ 'animation-complete': [] }>()

const container = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // Mesure la longueur exacte du chemin pour le stroke-dasharray
  const route = container.value!.querySelector<SVGGeometryElement>('#route')!
  const length = route.getTotalLength()
  container.value!.style.setProperty('--path-length', `${length}px`)

  // Quand le chemin a fini de se dessiner, on prévient le parent
  route.addEventListener('animationend', () => emit('animation-complete'), { once: true })
})
</script>

<style scoped>
/* Contraint le SVG pour qu'il ne dépasse pas l'espace disponible */
.empathic-path :deep(svg) {
  max-height: 70vh;
  width: auto;
}

/* --- Route : se dessine de haut en bas ------------------------------------ */
.empathic-path :deep(#route) {
  stroke-dasharray: var(--path-length, 2000px);
  stroke-dashoffset: var(--path-length, 2000px);
  animation: draw-path 5s ease-in-out forwards;
}

/* --- Cercles : invisibles au départ, apparaissent quand le chemin arrive -- */
.empathic-path :deep(circle) {
  opacity: 0;
}
/* c1 au tout début du chemin */
.empathic-path :deep(#c1) {
  animation: fade-in 0.3s ease forwards 0.2s;
}
/* c2 à ~27% du chemin */
.empathic-path :deep(#c2) {
  animation: fade-in 0.3s ease forwards 1.4s;
}
/* c3 à ~47% */
.empathic-path :deep(#c3) {
  animation: fade-in 0.3s ease forwards 2.4s;
}
/* c4 à ~62% */
.empathic-path :deep(#c4) {
  animation: fade-in 0.3s ease forwards 3.1s;
}
/* c5 à ~70% */
.empathic-path :deep(#c5) {
  animation: fade-in 0.3s ease forwards 3.5s;
}
/* c6 à la fin du chemin */
.empathic-path :deep(#c6) {
  animation: fade-in 0.3s ease forwards 5s;
}

/* --- Labels texte : apparaissent légèrement avant leur cercle ------------- */
.empathic-path :deep(#label-c2),
.empathic-path :deep(#label-c3),
.empathic-path :deep(#label-c4),
.empathic-path :deep(#label-c5),
.empathic-path :deep(#label-c6) {
  opacity: 0;
}
.empathic-path :deep(#label-c2) {
  animation: fade-in 0.4s ease forwards 1.3s;
}
.empathic-path :deep(#label-c3) {
  animation: fade-in 0.4s ease forwards 2.3s;
}
.empathic-path :deep(#label-c4) {
  animation: fade-in 0.4s ease forwards 3s;
}
.empathic-path :deep(#label-c5) {
  animation: fade-in 0.4s ease forwards 3.4s;
}
.empathic-path :deep(#label-c6) {
  animation: fade-in 0.4s ease forwards 4.5s;
}

/* --- Keyframes ------------------------------------------------------------ */
@keyframes draw-path {
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes fade-in {
  to {
    opacity: 1;
  }
}
</style>
