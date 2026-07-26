/**
 * Initialise l'application Vue avec le store Pinia et le routeur,
 * puis la monte dans la page.
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
