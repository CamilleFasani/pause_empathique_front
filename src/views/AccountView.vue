<template>
  <AppLayout background-class="bg-bg-page" overlay-header :show-footer="false">
    <section class="flex min-h-dvh w-full max-w-lg flex-col px-5 pt-20 pb-10 lg:pt-24">
      <header>
        <h1 class="mt-2 font-logo text-3xl">Mon compte</h1>
      </header>

      <p v-if="isLoading" role="status" class="mt-8 rounded-card bg-white px-5 py-4 text-sm">
        Chargement de tes informations...
      </p>

      <div v-else-if="loadingError" class="mt-8 rounded-card bg-white px-5 py-5 text-sm">
        <p role="alert">{{ loadingError }}</p>
        <button
          type="button"
          class="mt-4 rounded-btn bg-brand-primary px-5 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          @click="loadProfile"
        >
          Réessayer
        </button>
      </div>

      <template v-else-if="authStore.user">
        <form
          v-if="isEditing"
          class="mt-8 rounded-card bg-white px-5 py-6 shadow-[0_14px_35px_rgba(26,19,0,0.08)]"
          novalidate
          @submit.prevent="submitProfile"
        >
          <div class="grid gap-6">
            <div>
              <label for="account-firstname" class="block text-sm font-semibold">Prénom</label>
              <input
                id="account-firstname"
                v-model="form.firstname"
                type="text"
                name="firstname"
                autocomplete="given-name"
                required
                :aria-invalid="Boolean(fieldErrors.firstname)"
                :aria-describedby="fieldErrors.firstname ? 'account-firstname-error' : undefined"
                class="mt-2 w-full border-b border-black bg-transparent px-1 py-2 outline-none focus-visible:border-brand-primary focus-visible:border-b-2"
              />
              <p
                v-if="fieldErrors.firstname"
                id="account-firstname-error"
                class="mt-2 text-sm text-red-700"
              >
                {{ fieldErrors.firstname }}
              </p>
            </div>

            <div>
              <label for="account-email" class="block text-sm font-semibold">Email</label>
              <input
                id="account-email"
                v-model="form.email"
                type="email"
                name="email"
                autocomplete="email"
                required
                :aria-invalid="Boolean(fieldErrors.email)"
                :aria-describedby="fieldErrors.email ? 'account-email-error' : undefined"
                class="mt-2 w-full border-b border-black bg-transparent px-1 py-2 outline-none focus-visible:border-brand-primary focus-visible:border-b-2"
              />
              <p
                v-if="fieldErrors.email"
                id="account-email-error"
                class="mt-2 text-sm text-red-700"
              >
                {{ fieldErrors.email }}
              </p>
            </div>

            <fieldset>
              <legend class="text-sm font-semibold">Je préfère lire les textes au</legend>
              <div class="mt-4 flex items-center justify-center gap-3">
                <span :class="form.gender === 'F' ? 'font-semibold' : ''">Féminin</span>
                <input
                  id="account-gender"
                  v-model="form.gender"
                  type="checkbox"
                  true-value="F"
                  false-value="M"
                  name="gender"
                  role="switch"
                  aria-label="Préférence de genre grammatical"
                  class="peer sr-only"
                />
                <label
                  for="account-gender"
                  class="relative h-6 w-12 cursor-pointer rounded-full border border-black bg-bg-page after:absolute after:top-0.75 after:left-1 after:h-4 after:w-4 after:translate-x-6 after:rounded-full after:bg-black after:transition-transform after:content-[''] peer-checked:after:translate-x-0 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black"
                ></label>
                <span :class="form.gender === 'M' ? 'font-semibold' : ''">Masculin</span>
              </div>
            </fieldset>
          </div>

          <p v-if="formMessage" role="alert" class="mt-6 rounded-card bg-bg-page px-4 py-3 text-sm">
            {{ formMessage }}
          </p>

          <div class="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              class="rounded-btn bg-bg-page px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50"
              :disabled="isSaving"
              @click="cancelEditing"
            >
              Annuler
            </button>
            <button
              type="submit"
              class="rounded-btn bg-brand-primary px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="isSaving"
            >
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>

        <article
          v-else
          class="mt-8 rounded-card bg-white px-5 py-6 shadow-[0_14px_35px_rgba(26,19,0,0.08)]"
        >
          <dl class="divide-y divide-black/10">
            <div class="pb-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-black/55">Prénom</dt>
              <dd class="mt-1 text-base">{{ authStore.user.firstname }}</dd>
            </div>
            <div class="py-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-black/55">Email</dt>
              <dd class="mt-1 break-all text-base">{{ authStore.user.email }}</dd>
            </div>
            <div class="py-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-black/55">
                Préférence de lecture
              </dt>
              <dd class="mt-1 text-base">{{ genderLabel }}</dd>
            </div>
            <div class="py-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-black/55">
                Compte créé le
              </dt>
              <dd class="mt-1 text-base">{{ creationDate }}</dd>
            </div>
            <div class="pt-4">
              <dt class="text-xs font-semibold uppercase tracking-wide text-black/55">
                Dernière modification le
              </dt>
              <dd class="mt-1 text-base">{{ updatedDate }}</dd>
            </div>
          </dl>

          <p
            v-if="successMessage"
            role="status"
            class="mt-6 rounded-card bg-bg-page px-4 py-3 text-sm"
          >
            {{ successMessage }}
          </p>

          <button
            type="button"
            class="mt-7 flex w-full items-center justify-center gap-2 rounded-btn bg-brand-primary px-5 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            @click="startEditing"
          >
            <EditPencil class="size-5" aria-hidden="true" />
            Modifier mes informations
          </button>
        </article>

        <section class="mt-8 rounded-card bg-white px-5 py-6">
          <h2 class="font-logo text-xl">Supprimer mon compte</h2>
          <p class="mt-3 text-sm leading-relaxed text-black/70">
            Cette action supprimera définitivement ton compte et toutes les pauses de ton journal.
          </p>
          <button
            type="button"
            class="mt-5 flex w-full items-center justify-center gap-2 rounded-btn bg-warning px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            @click="openDeleteModal"
          >
            <Trash class="size-5" aria-hidden="true" />
            Supprimer mon compte
          </button>
        </section>
      </template>

      <RouterLink
        :to="{ name: 'home' }"
        class="mt-8 self-start rounded-btn bg-white px-5 py-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        Retour à l'accueil
      </RouterLink>
    </section>

    <div
      v-if="isDeleteModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-bg-page/65 px-5 backdrop-blur-sm"
      @click.self="closeDeleteModal"
    >
      <section
        role="dialog"
        aria-modal="true"
        :aria-labelledby="deleteModalTitleId"
        :aria-describedby="deleteModalDescriptionId"
        class="relative w-full max-w-sm rounded-card bg-white px-7 pt-7 pb-6 text-black shadow-xl"
        @keydown.esc="closeDeleteModal"
      >
        <button
          type="button"
          class="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-brand-primary text-xs font-bold leading-none text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Fermer la confirmation de suppression"
          :disabled="isDeleting"
          @click="closeDeleteModal"
        >
          ×
        </button>

        <h2 :id="deleteModalTitleId" class="pr-5 font-logo text-xl leading-tight">
          Supprimer ton compte ?
        </h2>
        <p :id="deleteModalDescriptionId" class="mt-4 text-sm leading-relaxed text-black/75">
          Cette action est définitive. Ton compte et toutes les pauses associées seront supprimés.
        </p>

        <p v-if="deleteError" role="alert" class="mt-5 rounded-card bg-bg-page px-4 py-3 text-sm">
          {{ deleteError }}
        </p>

        <div class="mt-6 grid gap-3">
          <button
            ref="cancelDeleteButton"
            type="button"
            class="rounded-btn bg-bg-page px-4 py-3 text-sm font-semibold focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isDeleting"
            @click="closeDeleteModal"
          >
            Garder mon compte
          </button>
          <button
            type="button"
            class="rounded-btn bg-warning px-4 py-3 text-sm font-semibold text-white focus-visible:outline-1 focus-visible:outline-black disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="isDeleting"
            @click="deleteAccount"
          >
            {{ isDeleting ? 'Suppression...' : 'Supprimer définitivement' }}
          </button>
        </div>
      </section>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { EditPencil, Trash } from '@iconoir/vue'
import { AxiosError } from 'axios'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import AppLayout from '../layouts/AppLayout.vue'
import { useAuthStore, type Gender, type UpdateProfilePayload } from '../stores/auth'
import { usePracticeStore } from '../stores/practice'

const authStore = useAuthStore()
const practiceStore = usePracticeStore()
const router = useRouter()

const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)
const loadingError = ref<string | null>(null)
const deleteError = ref<string | null>(null)
const formMessage = ref('')
const successMessage = ref('')
const fieldErrors = reactive<Record<string, string>>({})
const form = reactive<UpdateProfilePayload>({ email: '', firstname: '', gender: 'F' })
const cancelDeleteButton = ref<HTMLButtonElement | null>(null)
const deleteModalTitleId = 'delete-account-title'
const deleteModalDescriptionId = 'delete-account-description'

const genderLabel = computed(() => (authStore.user?.gender === 'F' ? 'Féminin' : 'Masculin'))
const formatProfileDate = (date: string) =>
  new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))

const creationDate = computed(() =>
  authStore.user ? formatProfileDate(authStore.user.created_at) : '',
)
const updatedDate = computed(() =>
  authStore.user ? formatProfileDate(authStore.user.updated_at) : '',
)

const clearFieldErrors = () => {
  formMessage.value = ''
  Object.keys(fieldErrors).forEach((fieldName) => delete fieldErrors[fieldName])
}

const fillFormFromProfile = () => {
  if (!authStore.user) {
    return
  }

  form.firstname = authStore.user.firstname
  form.email = authStore.user.email
  form.gender = authStore.user.gender
}

const redirectIfSessionExpired = async () => {
  if (authStore.isAuthenticated) {
    return false
  }

  await router.replace({ name: 'login', query: { reason: 'session-expired' } })
  return true
}

const loadProfile = async () => {
  isLoading.value = true
  loadingError.value = null

  try {
    await authStore.fetchProfile()
    fillFormFromProfile()
  } catch {
    if (await redirectIfSessionExpired()) {
      return
    }
    loadingError.value = 'Tes informations ne peuvent pas être chargées pour le moment.'
  } finally {
    isLoading.value = false
  }
}

const startEditing = () => {
  fillFormFromProfile()
  clearFieldErrors()
  successMessage.value = ''
  isEditing.value = true
}

const cancelEditing = () => {
  clearFieldErrors()
  fillFormFromProfile()
  isEditing.value = false
}

const validateForm = () => {
  clearFieldErrors()
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

  return Object.keys(fieldErrors).length === 0
}

const getFirstApiError = (errors: unknown, fieldName: string) => {
  if (!errors || typeof errors !== 'object') {
    return undefined
  }

  const errorsForField = (errors as Record<string, unknown>)[fieldName]
  return Array.isArray(errorsForField) && typeof errorsForField[0] === 'string'
    ? errorsForField[0]
    : undefined
}

const submitProfile = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true
  const payload: UpdateProfilePayload = {
    firstname: form.firstname.trim(),
    email: form.email.trim().toLowerCase(),
    gender: form.gender as Gender,
  }

  try {
    await authStore.updateProfile(payload)
    successMessage.value = 'Tes informations ont bien été mises à jour.'
    isEditing.value = false
  } catch (error) {
    if (await redirectIfSessionExpired()) {
      return
    }

    if (error instanceof AxiosError && error.response?.status === 400) {
      const emailError = getFirstApiError(error.response.data, 'email')
      const firstnameError = getFirstApiError(error.response.data, 'firstname')
      if (emailError) fieldErrors.email = emailError
      if (firstnameError) fieldErrors.firstname = firstnameError
      formMessage.value = 'La modification n’a pas pu être enregistrée. Vérifie les champs.'
      return
    }

    formMessage.value = 'Une erreur est survenue. Merci de réessayer dans un instant.'
  } finally {
    isSaving.value = false
  }
}

const openDeleteModal = () => {
  deleteError.value = null
  isDeleteModalOpen.value = true
  nextTick(() => cancelDeleteButton.value?.focus())
}

const closeDeleteModal = () => {
  if (!isDeleting.value) {
    isDeleteModalOpen.value = false
  }
}

const deleteAccount = async () => {
  isDeleting.value = true
  deleteError.value = null

  try {
    await authStore.deleteAccount()
    practiceStore.reset()
    await router.replace({ name: 'welcome', query: { status: 'account-deleted' } })
  } catch {
    if (await redirectIfSessionExpired()) {
      return
    }
    deleteError.value = "Le compte n'a pas pu être supprimé. Merci de réessayer."
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadProfile)
</script>
