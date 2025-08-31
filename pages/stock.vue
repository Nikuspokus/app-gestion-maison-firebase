<template>
  <section class="mx-auto max-w-6xl">
    <!-- Titre + CTA -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight">Mon stock</h1>
        <p class="text-sm text-gray-500" v-if="user && items.length">
          {{ filtered.length }} article{{
            filtered.length > 1 ? "s" : ""
          }}
          affiché{{ filtered.length > 1 ? "s" : "" }} · {{ items.length }} au
          total
        </p>
      </div>

      <NuxtLink
        to="/add"
        v-if="user"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6Z"
          />
        </svg>
        Ajouter
      </NuxtLink>
    </div>

    <!-- État non connecté -->
    <div
      v-if="!user"
      class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <p class="mb-4">Tu dois être connecté pour voir tes articles.</p>
      <NuxtLink class="btn btn-primary" to="/login">Se connecter</NuxtLink>
    </div>

    <!-- Filtres + Liste -->
    <div v-else>
      <!-- Filtres -->
      <div class="mb-6 grid gap-3 sm:grid-cols-2">
        <div class="relative">
          <svg
            class="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11ZM13.964 14.671a7 7 0 1 1 1.414-1.414l3.182 3.182a1 1 0 0 1-1.414 1.414l-3.182-3.182Z"
            />
          </svg>
          <input
            v-model="q"
            placeholder="Rechercher un article…"
            class="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-3 py-2.5 outline-none shadow-sm focus:ring-2 focus:ring-indigo-400/60"
          />
        </div>

        <select
          v-model="filterUnit"
          class="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 outline-none shadow-sm focus:ring-2 focus:ring-indigo-400/60"
        >
          <option value="">Toutes unités</option>
          <option value="g">g</option>
          <option value="kg">kg</option>
          <option value="unit">unit</option>
        </select>
      </div>

      <!-- Liste -->
      <div
        v-if="filtered.length"
        class="grid gap-4 sm:grid-cols-2 lg:grid-cols-2"
      >
        <ItemCard
          v-for="it in filtered"
          :key="it.id"
          :item="it"
          @subtract="onSubtract"
          @delete="onDelete"
          @add="openAdd"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center"
      >
        <div
          class="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M11 11V5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6Z"
            />
          </svg>
        </div>
        <h3 class="font-semibold">Aucun article</h3>
        <p class="mt-1 text-sm text-gray-500">
          Ajoute un produit pour démarrer ton stock.
        </p>
        <NuxtLink
          to="/add"
          class="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
        >
          Ajouter un article
        </NuxtLink>
      </div>
    </div>

    <!-- ✅ Panneau “Ajouter quantité” -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="editingId"
        class="fixed bottom-6 right-6 w-[320px] rounded-2xl bg-white/95 backdrop-blur p-4 shadow-xl"
      >
        <h3 class="font-semibold mb-3">Ajouter de la quantité</h3>

        <div class="flex items-center gap-3 mb-4">
          <input
            v-model.number="delta"
            type="number"
            min="1"
            step="1"
            class="w-24 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span class="text-sm text-gray-500">unité(s)</span>
        </div>

        <div class="flex justify-end gap-2">
          <button
            class="px-3 py-1.5 rounded-lg hover:bg-gray-50"
            @click="cancelAdd"
          >
            Annuler
          </button>
          <button
            class="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-60"
            :disabled="saving || delta <= 0"
            @click="saveAdd"
          >
            {{ saving ? "..." : "Enregistrer" }}
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useItemsStore } from "@/stores/items";
import { useAuth } from "@/composables/useAuth";
import ItemCard from "@/components/ItemCard.vue";

definePageMeta({ layout: "default", middleware: "auth" });

const { user } = useAuth();
const store = useItemsStore();
const { items } = storeToRefs(store);

const q = ref("");
const filterUnit = ref("");

// 🔎 filtre
const filtered = computed(() =>
  items.value
    .filter(
      (i) => !q.value || i.name.toLowerCase().includes(q.value.toLowerCase())
    )
    .filter((i) => !filterUnit.value || i.unit === filterUnit.value)
);

// 🔧 bind live
onMounted(() => {
  if (user.value) store.bind();
});
watch(
  () => user.value,
  (u) => {
    if (u) store.bind();
  }
);

// ➖ quantité
const onSubtract = async (payload: { id: string; amount: number }) => {
  if (!payload.amount || payload.amount <= 0) return;
  await store.subtract(payload.id, payload.amount);
};

// 🗑️ supprimer
const onDelete = async (id: string) => {
  const ok = confirm("Supprimer cet article ?");
  if (!ok) return;
  try {
    await store.remove(id);
  } catch (e) {
    console.error("Suppression échouée", e);
    alert("Erreur lors de la suppression.");
  }
};

// ✅ Flux “+ quantité”
const editingId = ref<string | null>(null);
const delta = ref<number>(1);
const saving = ref(false);

function openAdd(id: string) {
  editingId.value = id;
  delta.value = 1;
}
function cancelAdd() {
  editingId.value = null;
  delta.value = 1;
}
async function saveAdd() {
  if (!editingId.value || delta.value <= 0) return;
  try {
    saving.value = true;
    await store.addAmount(editingId.value, delta.value);
    cancelAdd();
  } catch (e) {
    console.error(e);
    alert((e as Error).message);
  } finally {
    saving.value = false;
  }
}
</script>
