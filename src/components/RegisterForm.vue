<template>
  <h2 class="font-semibold self-center py-4 text-lg">M'inscrire</h2>
  <form class="flex flex-col gap-3 p-4">
    <label for="firstname">Prénom</label>
    <input id="firstname" type="text" name="firstname" class="border-b border-black mb-6" />

    <label for="email">Email</label>
    <input id="email" type="email" name="email" class="border-b border-black mb-6" />

    <label for="password">Mot de passe</label>
    <input id="password" type="password" name="password" class="border-b border-black mb-6" />

    <label for="confirm-password">Confirmation mot de passe</label>
    <input
      id="confirm-password"
      type="password"
      name="confirm-password"
      class="border-b border-black mb-6"
    />

    <p class="mb-2">Je préfère lire les textes au :</p>
    <div class="flex self-center items-center gap-3 mt-4">
      <span :class="isFeminine ? 'font-semibold' : ''">Féminin</span>

      <input
        id="gender-preference"
        v-model="isFeminine"
        type="checkbox"
        name="gender-preference"
        class="sr-only peer"
      />
      <label
        for="gender-preference"
        class="relative w-12 h-6 bg-white border border-black rounded-full cursor-pointer after:content-[''] after:absolute after:top-0.75 after:left-1 after:bg-black after:rounded-full after:w-4 after:h-4 after:transition-transform after:translate-x-6 peer-checked:after:translate-x-0"
      ></label>

      <span :class="isFeminine ? '' : 'font-semibold'">Masculin</span>
    </div>

    <button
      type="submit"
      class="rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-black text-lg h-15 w-full mt-8"
    >
      M'inscrire
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isFeminine = ref(true)
</script>
