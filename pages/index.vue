<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Mon stock</h1>

    <div v-if="!user" class="card">
      <p class="mb-4">Tu dois être connecté pour voir tes articles.</p>
      <NuxtLink to="/login" class="btn btn-primary mt-2">Se connecter</NuxtLink>
    </div>

    <div v-else>
      <div class="flex gap-2 mb-4">
        <input v-model="q" placeholder="Rechercher un article..." />
        <select v-model="filterUnit">
          <option value="">Toutes unités</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="unit">unit</option>
        </select>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <ItemCard
          v-for="it in filtered"
          :key="it.id"
          :item="it"
          @subtract="onSubtract"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useItemsStore } from "@/stores/items";
import { useAuth } from "@/composables/useAuth";
import ItemCard from "@/components/ItemCard.vue";

const { user } = useAuth();
const store = useItemsStore();
const { items } = storeToRefs(store);

const q = ref("");
const filterUnit = ref("");

const filtered = computed(() =>
  items.value
    .filter(
      (i) => !q.value || i.name.toLowerCase().includes(q.value.toLowerCase())
    )
    .filter((i) => !filterUnit.value || i.unit === filterUnit.value)
);

onMounted(() => {
  if (user.value) store.bind();
});
watch(
  () => user.value,
  (u) => {
    if (u) store.bind();
  }
);

const onSubtract = async (payload: { id: string; amount: number }) => {
  await store.subtract(payload.id, payload.amount);
};

const onDelete = async (id: string) => {
  const ok = confirm("Supprimer cet article ?");
  if (!ok) return;
  try {
    await store.remove(id); // ← nécessite la méthode remove dans ton store (ajoutée précédemment)
  } catch (e) {
    console.error("Suppression échouée", e);
    alert("Erreur lors de la suppression.");
  }
};
</script>
