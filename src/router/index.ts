import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '../stores/auth'
import WelcomeView from '../views/WelcomeView.vue'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import EmptyYourBagView from '../views/EmptyYourBagView.vue'

const routes = [
  { path: '/', name: 'welcome', component: WelcomeView },
  { path: '/login', name: 'login', component: AuthView },
  { path: '/register', name: 'register', component: AuthView },
  { path: '/home', name: 'home', component: HomeView, meta: { requiresAuth: true } },
  { path: '/empty-your-bag', name: 'empty-your-bag', component: EmptyYourBagView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }
})

export default router
