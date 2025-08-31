<template>
  <div v-if="ready && user">
    <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
    <div class="grid gap-4 md:grid-cols-3">
      <button class="card cursor-pointer" @click="go('/stock')">Stock</button>
      <button class="card cursor-pointer" @click="go('/menu')">
        Menu de la semaine
      </button>
      <button class="card cursor-pointer" @click="go('/profile')">
        Profil
      </button>
    </div>
  </div>
  <!-- petit vide (ou skeleton) pendant l'init auth -->
  <div v-else class="min-h-[30vh]" />
</template>

<script setup lang="ts">
definePageMeta({ layout: "default", middleware: "auth" });
import { useAuth } from "@/composables/useAuth";

const { user, ready } = useAuth();
const router = useRouter();
const go = (p: string) => router.push(p);
</script>
