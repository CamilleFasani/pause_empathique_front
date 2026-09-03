<template>
  <h2 class="font-semibold self-center py-12 text-lg">Me Connecter</h2>
  <form class="flex flex-col gap-4 p-4" novalidate @submit.prevent="submitLoginForm">
    <label for="email">Email</label>
    <input
      id="email"
      v-model="form.email"
      type="email"
      name="email"
      autocomplete="email"
      required
      :aria-invalid="Boolean(fieldErrors.email)"
      aria-describedby="email-error"
      class="mb-8 border-b border-black outline-none focus-visible:border-b-2 focus-visible:border-brand-primary"
    />
    <p v-if="fieldErrors.email" id="email-error" class="-mt-5 mb-3 text-sm text-red-700">
      {{ fieldErrors.email }}
    </p>
    <label for="password">Mot de passe</label>
    <div class="relative">
      <input
        id="password"
        v-model="form.password"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        autocomplete="current-password"
        required
        :aria-invalid="Boolean(fieldErrors.password)"
        aria-describedby="password-error"
        class="mb-8 w-full border-b border-black outline-none focus-visible:border-b-2 focus-visible:border-brand-primary"
      />
      <button
        type="button"
        class="absolute right-0 top-0 h-8 w-8 flex items-center justify-center"
        @click="showPassword = !showPassword"
      >
        <img
          :src="showPassword ? eyeOpenIcon : eyeClosedIcon"
          :alt="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
          class="h-6 w-6 mb-3"
        />
      </button>
    </div>

    <p v-if="fieldErrors.password" id="password-error" class="-mt-5 mb-3 text-sm text-red-700">
      {{ fieldErrors.password }}
    </p>
    <button
      type="submit"
      :disabled="isSubmitting"
      class="rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-black text-lg h-15 w-full mt-12"
    >
      {{ isSubmitting ? 'Connexion...' : 'Me connecter' }}
    </button>
    <p v-if="formMessage" class="text-sm text-red-700">
      {{ formMessage }}
    </p>
  </form>
  <a href="#" class="text-sm hover:italic self-center" @click.prevent>Mot de passe oublié ?</a>
</template>
<script lang="ts" setup>
import { AxiosError } from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore, type LoginPayload } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

import eyeOpenIcon from '../assets/eye-solid.svg'
import eyeClosedIcon from '../assets/eye-closed.svg'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()

const form = reactive({
  email: '',
  password: '',
})

const fieldErrors = reactive<Record<string, string>>({})
const formMessage = ref('')
const isSubmitting = ref(false)
const showPassword = ref(false)

const clearErrors = () => {
  formMessage.value = ''

  Object.keys(fieldErrors).forEach((fieldName) => {
    delete fieldErrors[fieldName]
  })
}

const validateForm = (): boolean => {
  clearErrors()

  const email = form.email.trim().toLowerCase()

  if (!email) {
    fieldErrors.email = "L'email est obligatoire."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Merci de saisir un email valide.'
  }

  if (!form.password) {
    fieldErrors.password = 'Le mot de passe est obligatoire.'
  }

  return Object.keys(fieldErrors).length === 0
}

const submitLoginForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  const payload: LoginPayload = {
    email: form.email.trim().toLowerCase(),
    password: form.password,
  }

  try {
    await authStore.login(payload)
    await router.push({ name: practiceStore.resumeAfterAuthentication ? 'pause' : 'home' })
  } catch (error) {
    if (error instanceof AxiosError && [400, 401].includes(error.response?.status ?? 0)) {
      formMessage.value = 'Email ou mot de passe incorrect.'
      return
    }

    formMessage.value = 'Une erreur est survenue. Merci de réessayer dans un instant.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
