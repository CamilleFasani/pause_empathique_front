<template>
  <AppLayout :bg-image="isLogin ? loginBg : registerBg">
    <div class="flex flex-col justify-between">
      <div class="flex py-10 text-sm">
        <button
          :class="isLogin ? 'bg-brand-primary font-bold' : 'bg-white'"
          class="rounded-tl-btn rounded-bl-btn py-4 px-6"
          @click="router.push({ name: 'login' })"
        >
          j'ai déjà un compte
        </button>
        <button
          :class="!isLogin ? 'bg-brand-primary font-bold' : 'bg-white'"
          class="rounded-tr-btn rounded-br-btn py-4 px-6"
          @click="router.push({ name: 'register' })"
        >
          je n'ai pas de compte
        </button>
      </div>
      <LoginForm v-if="isLogin" />
      <RegisterForm v-else />
    </div>
  </AppLayout>
</template>
<script lang="ts" setup>
// useRoute pour lire la route actuelle
// useRouter pour naviguer vers une autre route
import { useRoute, useRouter } from 'vue-router'

import { computed } from 'vue'
import AppLayout from '../layouts/AppLayout.vue'
import LoginForm from '../components/LoginForm.vue'
import RegisterForm from '../components/RegisterForm.vue'
import loginBg from '../assets/login-bg.svg'
import registerBg from '../assets/register-bg.svg'

const route = useRoute()
const router = useRouter()

const isLogin = computed(() => route.name === 'login')
</script>
