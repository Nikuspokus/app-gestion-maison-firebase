<template>
  <div class="card flex gap-3 items-start">
    <img
      v-if="item.imageUrl"
      :src="item.imageUrl"
      alt=""
      class="w-16 h-16 object-cover rounded"
      @error="(e) => console.warn('Image introuvable:', item.imageUrl)"
    />
    <div class="flex-1">
      <div class="flex items-center justify-between">
        <h3 class="font-semibold">{{ item.name }}</h3>
        <span class="text-sm opacity-70"
          >{{ item.quantity }} {{ item.unit }}</span
        >
      </div>

      <div class="mt-2 flex gap-2">
        <input v-model.number="amount" type="number" min="1" class="w-24" />
        <button class="btn" @click="emit('subtract', { id: item.id, amount })">
          - Soustraire
        </button>

        <!-- 🗑 Bouton supprimer -->
        <button
          class="btn"
          style="background: #ef4444; color: #fff; border: none"
          @click="emit('delete', item.id)"
          title="Supprimer l'article"
        >
          🗑 Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ item: any }>();
const emit = defineEmits<{
  (e: "subtract", payload: { id: string; amount: number }): void;
  (e: "delete", id: string): void;
}>();
const amount = ref(1);
</script>
