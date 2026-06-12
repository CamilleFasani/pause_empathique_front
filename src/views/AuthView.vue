<template>
  <div>
    <button @click="router.push({ name: 'login' })">j'ai déjà un compte</button>
    <button @click="router.push({ name: 'register' })">je n'ai pas de compte</button>
  </div>
  <LoginForm v-if="isLogin" />
  <RegisterForm v-if="isRegister" />
</template>
<script lang="ts" setup>
// useRoute pour lire la route actuelle
import { useRoute } from 'vue-router'
// useRouter pour naviguer vers une autre route
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'

const route = useRoute()

const isLogin = computed(() => route.name === 'login')
const isRegister = computed(() => route.name === 'register')

const router = useRouter()
</script>
