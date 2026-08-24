<template>
  <h2 class="self-center py-4 text-lg font-semibold">M'inscrire</h2>
  <form class="flex flex-col gap-3 p-4" novalidate @submit.prevent="submitRegisterForm">
    <label for="firstname">Prénom</label>
    <input
      id="firstname"
      v-model="form.firstname"
      type="text"
      name="firstname"
      autocomplete="given-name"
      required
      :aria-invalid="Boolean(fieldErrors.firstname)"
      aria-describedby="firstname-error"
      class="mb-6 border-b border-black"
    />
    <p v-if="fieldErrors.firstname" id="firstname-error" class="-mt-5 mb-3 text-sm text-red-700">
      {{ fieldErrors.firstname }}
    </p>

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
      class="mb-6 border-b border-black"
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
        autocomplete="new-password"
        required
        minlength="8"
        :aria-invalid="Boolean(fieldErrors.password)"
        aria-describedby="password-error"
        class="w-full mb-6 border-b border-black"
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

    <label for="confirm-password">Confirmation mot de passe</label>
    <div class="relative">
      <input
        id="confirm-password"
        v-model="form.passwordConfirmation"
        :type="showPassword ? 'text' : 'password'"
        name="confirm-password"
        autocomplete="new-password"
        required
        minlength="8"
        :aria-invalid="Boolean(fieldErrors.passwordConfirmation)"
        aria-describedby="password-confirmation-error"
        class="w-full border-b border-black mb-6"
      />
    </div>
    <p
      v-if="fieldErrors.passwordConfirmation"
      id="password-confirmation-error"
      class="-mt-5 mb-3 text-sm text-red-700"
    >
      {{ fieldErrors.passwordConfirmation }}
    </p>

    <p class="mb-2">Je préfère lire les textes au :</p>
    <div class="flex self-center items-center gap-3 mt-4">
      <span id="gender-label" class="sr-only">Genre grammatical préféré</span>
      <span :class="isFeminine ? 'font-semibold' : ''">Féminin</span>

      <input
        id="gender-preference"
        v-model="form.gender"
        type="checkbox"
        true-value="F"
        false-value="M"
        name="gender-preference"
        role="switch"
        aria-labelledby="gender-label"
        class="sr-only peer"
      />
      <label
        for="gender-preference"
        class="relative w-12 h-6 bg-white border border-black rounded-full cursor-pointer after:content-[''] after:absolute after:top-0.75 after:left-1 after:bg-black after:rounded-full after:w-4 after:h-4 after:transition-transform after:translate-x-6 peer-checked:after:translate-x-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black"
      ></label>

      <span :class="isFeminine ? '' : 'font-semibold'">Masculin</span>
    </div>

    <p
      v-if="formMessage"
      class="mt-6 text-sm"
      :class="isSuccess ? 'text-green-700' : 'text-red-700'"
    >
      {{ formMessage }}
    </p>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-black text-lg h-15 w-full mt-8"
    >
      {{ isSubmitting ? 'Inscription...' : "M'inscrire" }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios'
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore, type Gender, type RegisterPayload } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

import eyeOpenIcon from '../assets/eye-solid.svg'
import eyeClosedIcon from '../assets/eye-closed.svg'

const router = useRouter()
const authStore = useAuthStore()
const practiceStore = usePracticeStore()

const form = reactive({
  firstname: '',
  email: '',
  password: '',
  passwordConfirmation: '',
  gender: 'F' as Gender,
})

const fieldErrors = reactive<Record<string, string>>({})
const formMessage = ref('')
const isSuccess = ref(false)
const isSubmitting = ref(false)
const showPassword = ref(false)

const isFeminine = computed(() => form.gender === 'F')

const clearErrors = () => {
  formMessage.value = ''
  isSuccess.value = false

  Object.keys(fieldErrors).forEach((fieldName) => {
    delete fieldErrors[fieldName]
  })
}

const validateForm = (): boolean => {
  clearErrors()

  const firstname = form.firstname.trim()
  const email = form.email.trim().toLowerCase()

  if (!firstname) {
    fieldErrors.firstname = 'Le prénom est obligatoire.'
  }
  if (!email) {
    fieldErrors.email = "L'email est obligatoire."
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = 'Merci de saisir un email valide.'
  }

  if (!form.password) {
    fieldErrors.password = 'Le mot de passe est obligatoire.'
  } else if (form.password.length < 8) {
    fieldErrors.password = 'Choisis au moins 8 caractères.'
  } else if (/^\d+$/.test(form.password)) {
    fieldErrors.password = 'Le mot de passe ne doit pas être entièrement numérique.'
  }

  if (!form.passwordConfirmation) {
    fieldErrors.passwordConfirmation = 'La confirmation est obligatoire.'
  } else if (form.passwordConfirmation !== form.password) {
    fieldErrors.passwordConfirmation = 'Les deux mots de passe ne correspondent pas.'
  }

  return Object.keys(fieldErrors).length === 0
}

const getFirstApiError = (errors: unknown, fieldName: string) => {
  if (!errors || typeof errors !== 'object') {
    return undefined
  }

  const fieldErrors = (errors as Record<string, unknown>)[fieldName]

  if (!Array.isArray(fieldErrors) || typeof fieldErrors[0] !== 'string') {
    return undefined
  }

  return fieldErrors[0]
}

const setFieldError = (fieldName: string, message?: string) => {
  if (message) {
    fieldErrors[fieldName] = message
  }
}

const applyApiErrors = (errors: unknown) => {
  setFieldError('email', getFirstApiError(errors, 'email'))
  setFieldError('password', getFirstApiError(errors, 'password'))
  setFieldError('firstname', getFirstApiError(errors, 'firstname'))
  setFieldError('gender', getFirstApiError(errors, 'gender'))

  formMessage.value =
    getFirstApiError(errors, 'non_field_errors') ||
    "L'inscription n'a pas pu être finalisée. Merci de vérifier les champs."
}

const submitRegisterForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  const payload: RegisterPayload = {
    firstname: form.firstname.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password,
    gender: form.gender,
  }

  try {
    await authStore.register(payload)
    isSuccess.value = true
    formMessage.value = 'Compte créé. Connexion en cours...'
    await router.push({ name: practiceStore.resumeAfterAuthentication ? 'pause' : 'home' })
  } catch (error) {
    isSuccess.value = false

    if (error instanceof AxiosError && error.response?.status === 400) {
      applyApiErrors(error.response.data)
      return
    }

    formMessage.value = 'Une erreur est survenue. Merci de réessayer dans un instant.'
  } finally {
    isSubmitting.value = false
  }
}
</script>
