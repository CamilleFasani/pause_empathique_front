import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/login', name: 'login', component: AuthView },
  { path: '/register', name: 'register', component: AuthView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
