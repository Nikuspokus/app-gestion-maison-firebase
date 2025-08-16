// plugins/firebase.client.ts
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin(() => {
    const cfg = useRuntimeConfig().public

    const firebaseConfig = {
        apiKey: cfg.firebaseApiKey,
        authDomain: cfg.firebaseAuthDomain,
        projectId: cfg.firebaseProjectId,
        storageBucket: cfg.firebaseStorageBucket, // ✅ IMPORTANT
        appId: cfg.firebaseAppId,
    }

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

    // (facultatif) petit log pour valider le bucket à l’exécution
    if (process.dev) console.log('Storage bucket =', firebaseConfig.storageBucket)

    return {
        provide: {
            firebase: {
                app,
                auth: getAuth(app),
                db: getFirestore(app),
                storage: getStorage(app), // utilisera le bucket fourni ci-dessus
                GoogleAuthProvider
            }
        }
    }
})
