<template>
  <div class="mx-auto max-w-2xl">
    <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 class="text-2xl font-bold mb-6">Ajouter un article</h1>

      <form @submit.prevent="save" class="grid gap-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Nom</label
          >
          <input
            v-model="name"
            required
            placeholder="Pâtes, Riz, Tomates…"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Quantité</label
            >
            <input
              v-model.number="quantity"
              type="number"
              min="0"
              step="1"
              required
              class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Unité</label
            >
            <select
              v-model="unit"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="unit">unit</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Photo (optionnel)</label
          >
          <ImageUploader v-model="file" />
        </div>

        <button
          class="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-70"
        >
          Enregistrer
        </button>
      </form>
    </div>

    <!-- ✅ Toast succès -->
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-300"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div
        v-if="showToast"
        class="fixed bottom-6 right-6 flex items-center gap-3 rounded-xl bg-white shadow-lg border-gray-200 px-4 py-3"
      >
        <svg
          class="size-6 text-green-500"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
        <span class="font-medium text-gray-800">Produit ajouté</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import ImageUploader from "../components/ImageUploader.vue";
import { useItemsStore } from "../stores/items";
import { useAuth } from "../composables/useAuth";
import { ref } from "vue";
import { navigateTo } from "nuxt/app";

definePageMeta({ middleware: "auth" });

const { user, familyId } = useAuth(); // ✅ ajouter familyId
const store = useItemsStore();

const name = ref("");
const quantity = ref<number>(0);
const unit = ref<"g" | "kg" | "unit">("g");
const file = ref<File | null>(null);

const showToast = ref(false);

function resetForm() {
  name.value = "";
  quantity.value = 0;
  unit.value = "g";
  file.value = null;
}

const save = async () => {
  try {
    console.log("user.uid =", user.value?.uid);
    console.log("familyId =", familyId.value); // ✅ debug

    if (!user.value) throw new Error("Non connecté");
    if (!familyId.value) throw new Error("familyId manquant");

    await store.add({
      name: name.value,
      quantity: quantity.value,
      unit: unit.value,
      file: file.value ?? undefined,
    });

    resetForm();
    showToast.value = true;
    await navigateTo("/stock");
  } catch (e) {
    console.error("Erreur à l’enregistrement", e);
    alert((e as Error).message); // optionnel pour voir l’erreur
  } finally {
    setTimeout(() => (showToast.value = false), 1000);
  }
};
</script>
