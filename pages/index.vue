<template>
  <div class="grid place-items-center min-h-[80vh] text-center">
    <div class="card max-w-lg w-full">
      <h1 class="text-3xl font-bold mb-4">Bienvenue à la maison 🏡</h1>
      <p class="mb-6 text-gray-600">
        Merci de vous connecter pour accéder à votre application familiale.
      </p>
      <button class="btn btn-primary" @click="signInWithGoogle">
        Se connecter avec Google
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default", middleware: "guest" });

import { useAuth } from "@/composables/useAuth";
const { user, ready, signInWithGoogle } = useAuth();

// Si déjà connecté → rediriger directement vers le dashboard
watch([ready, user], ([r, u]) => {
  if (r && u) navigateTo("/dashboard");
});
</script>
