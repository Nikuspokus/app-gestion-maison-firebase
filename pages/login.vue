<template>
  <div class="grid place-items-center min-h-[60vh]">
    <div class="card max-w-md w-full">
      <h1 class="text-xl mb-4 font-bold">Connexion</h1>
      <p class="mb-4">
        Connecte-toi avec Google pour accéder à ton stock familial.
      </p>
      <button class="btn btn-primary" @click="signInWithGoogle">
        Continuer avec Google
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
const { signInWithGoogle } = useAuth();
</script>
