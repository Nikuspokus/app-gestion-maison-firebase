<script setup lang="ts">
import type { Item } from "@/types";

defineProps<{ item: Item }>();
const emit = defineEmits<{
  (e: "subtract", payload: { id: string; amount: number }): void;
  (e: "delete", id: string): void;
  (e: "add", id: string): void; // ✅ nouveau
}>();
</script>

<template>
  <div
    class="rounded-xl bg-white p-4 m-2 shadow-sm flex items-stretch justify-between gap-3"
  >
    <!-- Colonne gauche : infos -->
    <div>
      <div class="font-semibold">{{ item.name }}</div>
      <div class="text-sm text-gray-500">
        {{ item.quantity }} {{ item.unit }}
      </div>
    </div>

    <!-- Colonne droite : boutons en colonne, space-between -->
    <div class="flex flex-col justify-between">
      <!-- Rangée du haut : + / - -->
      <div
        class="flex items-center gap-2"
        style="justify-content: space-between; margin-bottom: 0.6em"
      >
        <button
          class="rounded-lg px-3 py-1.5 bg-rose-600 text-white hover:bg-rose-500"
          @click="emit('subtract', { id: item.id, amount: 1 })"
          title="Soustraire une unité"
        >
          −
        </button>

        <button
          class="rounded-lg px-3 py-1.5 bg-indigo-600 text-white hover:bg-indigo-500"
          @click="emit('add', item.id)"
          title="Ajouter de la quantité"
        >
          +
        </button>
      </div>

      <!-- Bas de colonne : Supprimer -->
      <button
        class="rounded-lg px-3 py-1.5 border hover:bg-gray-50"
        @click="emit('delete', item.id)"
        title="Supprimer l'article"
      >
        Supprimer
      </button>
    </div>
  </div>
</template>
