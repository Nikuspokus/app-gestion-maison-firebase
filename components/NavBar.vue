<template>
  <!-- Header sombre, sticky -->
  <header class="bg-gray-900 sticky top-0 z-50">
    <nav
      aria-label="Global"
      class="mx-auto flex max-w-7xl items-center justify-between p-4 sm:p-6 lg:px-8"
    >
      <!-- Logo / Home -->
      <div class="flex lg:flex-1">
        <NuxtLink
          to="/"
          class="-m-1.5 p-1.5 flex items-center gap-2 text-white"
        >
          <span class="text-xl">🏠</span>
          <span class="sr-only sm:not-sr-only sm:font-semibold"
            >App Maison</span
          >
        </NuxtLink>
      </div>

      <!-- Bouton burger (mobile) -->
      <div class="flex lg:hidden">
        <button
          type="button"
          @click="mobileOpen = true"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <span class="sr-only">Ouvrir le menu</span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            aria-hidden="true"
            class="size-6"
          >
            <path
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <!-- Actions desktop -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-3">
        <template v-if="user">
          <span class="text-sm text-gray-200">
            Bonjour, {{ user.displayName || "Utilisateur" }}
          </span>
          <button
            @click="go('/add')"
            class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            + Ajouter
          </button>
          <button
            @click="logout"
            class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            Se déconnecter
          </button>
        </template>
        <template v-else>
          <button
            @click="signInWithGoogle"
            class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50"
          >
            Se connecter
          </button>
        </template>
      </div>
    </nav>

    <!-- Menu mobile (Headless UI Dialog) -->
    <TransitionRoot :show="mobileOpen" as="template">
      <Dialog as="div" class="lg:hidden" @close="mobileOpen = false">
        <div class="fixed inset-0 z-50"></div>
        <DialogPanel
          class="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto bg-gray-900 px-6 py-6 ring-1 ring-white/10"
        >
          <div class="flex items-center justify-between">
            <NuxtLink
              to="/"
              class="-m-1.5 p-1.5 flex items-center gap-2 text-white"
              @click="mobileOpen = false"
            >
              <span class="text-xl">🏠</span>
              <span class="sr-only">App Maison</span>
            </NuxtLink>
            <button
              type="button"
              class="-m-2.5 rounded-md p-2.5 text-gray-300 hover:text-white hover:bg-white/10"
              @click="mobileOpen = false"
            >
              <span class="sr-only">Fermer le menu</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                aria-hidden="true"
                class="size-6"
              >
                <path
                  d="M6 18 18 6M6 6l12 12"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          <div class="mt-6 flow-root">
            <div class="-my-6 divide-y divide-white/10">
              <div class="space-y-2 py-6">
                <NuxtLink
                  to="/"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                  @click="mobileOpen = false"
                >
                  Accueil
                </NuxtLink>
                <NuxtLink
                  v-if="user"
                  to="/add"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                  @click="mobileOpen = false"
                >
                  + Ajouter
                </NuxtLink>
                <NuxtLink
                  v-if="user"
                  to="/profile"
                  class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                  @click="mobileOpen = false"
                >
                  Profil
                </NuxtLink>
              </div>

              <div class="py-6">
                <template v-if="user">
                  <button
                    @click="
                      () => {
                        mobileOpen = false;
                        go('/add');
                      }
                    "
                    class="w-full mb-3 rounded-lg px-3 py-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    + Ajouter
                  </button>
                  <button
                    @click="
                      () => {
                        mobileOpen = false;
                        logout();
                      }
                    "
                    class="w-full rounded-lg px-3 py-2 text-base font-semibold text-gray-900 bg-white hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </template>
                <template v-else>
                  <button
                    @click="
                      () => {
                        mobileOpen = false;
                        signInWithGoogle();
                      }
                    "
                    class="w-full rounded-lg px-3 py-2 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500"
                  >
                    Se connecter
                  </button>
                </template>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </TransitionRoot>
  </header>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, TransitionRoot } from "@headlessui/vue";
import { useAuth } from "@/composables/useAuth";

const { user, signInWithGoogle, signOutUser } = useAuth();

const router = useRouter();
const go = (p: string) => router.push(p);
const mobileOpen = ref(false);

const logout = async () => {
  try {
    await signOutUser();
    // Redirection fiable après déconnexion
    await navigateTo("/login", { replace: true });
  } catch (e) {
    console.error("Erreur déconnexion:", e);
  }
};
</script>
