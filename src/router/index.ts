/**
 * Déclare les routes de l'application et contrôle la navigation.
 * Restaure la session avant la navigation, protège les routes privées
 * et redirige selon l'état d'authentification.
 */

import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'
import WelcomeView from '../views/WelcomeView.vue'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import EmptyYourBagView from '../views/EmptyYourBagView.vue'
import ObservationView from '../views/ObservationView.vue'
import FeelingsView from '../views/FeelingsView.vue'
import NeedsView from '../views/NeedsView.vue'
import PauseView from '../views/PauseView.vue'

const routes = [
  { path: '/', name: 'welcome', component: WelcomeView },
  { path: '/login', name: 'login', component: AuthView },
  { path: '/register', name: 'register', component: AuthView },
  { path: '/home', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  {
    path: '/empty-your-bag',
    name: 'empty-your-bag',
    component: EmptyYourBagView,
    meta: { requiresPractice: true },
  },
  {
    path: '/observation',
    name: 'observation',
    component: ObservationView,
    meta: { requiresPractice: true },
  },
  {
    path: '/feelings',
    name: 'feelings',
    component: FeelingsView,
    meta: { requiresPractice: true },
  },
  { path: '/needs', name: 'needs', component: NeedsView, meta: { requiresPractice: true } },
  { path: '/pause', name: 'pause', component: PauseView, meta: { requiresPractice: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const practiceStore = usePracticeStore()

  if (!authStore.isAuthReady) {
    await authStore.initializeSession()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.requiresPractice && !practiceStore.hasStarted) {
    return { name: 'welcome' }
  }

  if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    return { name: 'home' }
  }
})

export default router
