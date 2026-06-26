<template>
  <h2 class="font-semibold self-center py-12 text-lg">Me Connecter</h2>
  <form class="flex flex-col gap-4 p-4">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" class="border-b border-black mb-8" />
    <label for="password">Mot de passe</label>
    <input id="password" type="password" name="password" class="border-b border-black mb-8" />
    <button
      type="submit"
      class="rounded-btn bg-brand-primary hover:bg-brand-primary-hover text-black text-lg h-15 w-full mt-12"
    >
      Me connecter
    </button>
  </form>
  <a href="#" class="text-sm hover:italic self-center">Mot de passe oublié ?</a>
</template>
