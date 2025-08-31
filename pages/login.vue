<template>
  <ClientOnly>
    <!-- Fond dégradé pleine largeur & hauteur -->
    <div
      class="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-orange-400"
    >
      <!-- Container principal pleine largeur -->
      <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <!-- Colonne gauche : hero + accroche -->
        <div class="relative hidden lg:flex items-center justify-center p-12">
          <!-- Panel semi-transparent -->
          <div class="absolute inset-0 bg-white/5"></div>

          <div class="relative z-10 text-white max-w-lg">
            <!-- Illustration -->
            <div class="-right-16 opacity-90 mb-6">
              <img
                src="/assets/images/app-maison.png"
                alt="Aperçu application"
                class="w-[130px] max-w-none drop-shadow-2xl rotate-[-2deg] rounded-2xl"
              />
            </div>
            <h1 class="text-4xl font-extrabold leading-tight drop-shadow-sm">
              Bienvenue sur ton gestionnaire de stock
            </h1>
            <p class="mt-4 text-white/90">
              Suis tes produits, anticipe les ruptures et planifie tes repas en
              un clin d’œil. Partage l’accès avec toute la famille.
            </p>
          </div>
        </div>

        <!-- Colonne droite : carte de connexion -->
        <div class="flex items-center justify-center bg-white p-8 lg:p-12">
          <div class="w-full max-w-sm">
            <h2 class="text-2xl font-bold text-gray-900">Connexion</h2>
            <p class="mt-2 text-gray-500">
              Connecte-toi avec Google pour accéder à ton stock familial.
            </p>

            <button
              class="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl px-5 py-3 font-medium text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-400 bg-gradient-to-r from-indigo-600 to-fuchsia-500 hover:from-indigo-500 hover:to-fuchsia-500 active:scale-[.99] transition"
              @click="login"
            >
              <!-- Icône Google -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                class="h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.932 31.91 29.35 35 24 35c-7.18 0-13-5.82-13-13s5.82-13 13-13c3.31 0 6.32 1.23 8.59 3.23l5.66-5.66C34.533 3.053 29.533 1 24 1 11.85 1 2 10.85 2 23s9.85 22 22 22c12.15 0 22-9.85 22-22 0-1.467-.153-2.9-.389-4.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.817C14.172 16.25 18.72 13 24 13c3.31 0 6.32 1.23 8.59 3.23l5.66-5.66C34.533 3.053 29.533 1 24 1 15.317 1 7.93 6.063 6.306 14.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 45c5.27 0 10.09-2.02 13.73-5.31l-6.34-5.37C29.1 35.43 26.7 36 24 36c-5.32 0-9.91-3.09-12.02-7.56l-6.55 5.05C7.99 40.98 15.37 45 24 45z"
                />
                <path
                  fill="#1976D2"
                  d="M43.611 20.083H42V20H24v8h11.303c-1.086 3.26-3.83 5.86-7.613 6.94l6.34 5.37C36.82 37.98 42 32.52 42 23c0-1.467-.153-2.9-.389-4.917z"
                />
              </svg>
              Continuer avec Google
            </button>

            <p class="mt-4 text-center text-sm text-gray-500">
              En continuant, tu acceptes notre politique de confidentialité.
            </p>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
definePageMeta({ layout: "default", middleware: "guest" });
import { useAuth } from "../composables/useAuth";
import { ensureUserProfile } from "../services/ensureUserProfile";

import { doc, setDoc, getDoc } from "firebase/firestore";
const { user, ready, signInWithGoogle } = useAuth();

// Déjà connecté ? → vers /stock
watch([ready, user], ([r, u]) => {
  if (r && u) navigateTo("/dashboard");
});

const login = async () => {
  try {
    const { $firebase } = useNuxtApp();

    // connexion Google
    await signInWithGoogle();

    const familyId = await ensureUserProfile();
    console.log("familyId =", familyId);

    const user = $firebase.auth.currentUser;
    if (!user) return;

    const userRef = doc($firebase.db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // si nouveau user → créer doc avec un familyId
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        familyId: "fam1", // ⚠️ pour l’instant tu fixes à "fam1" (ou génères un ID unique)
        createdAt: new Date(),
      });
    }

    // Redirection
    await navigateTo("/dashboard");
  } catch (e) {
    console.error("Erreur connexion Google :", e);
  }
};
</script>
