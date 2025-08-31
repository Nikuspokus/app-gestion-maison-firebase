// plugins/firebase.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { initializeFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
    const cfg = useRuntimeConfig().public

    const firebaseConfig = {
        apiKey: cfg.firebaseApiKey,
        authDomain: cfg.firebaseAuthDomain,
        projectId: cfg.firebaseProjectId,
        storageBucket: cfg.firebaseStorageBucket,
        appId: cfg.firebaseAppId,
    }

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

    // 👉 corrige les erreurs “WebChannel … transport errored / 400”
    const db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        // experimentalForceLongPolling: true, // seulement si nécessaire
    })

    const auth = getAuth(app)
    const storage = getStorage(app)

    if (process.dev) {
        console.log('[Firebase] projectId:', firebaseConfig.projectId)
        console.log('[Firebase] storageBucket:', firebaseConfig.storageBucket)
    }

    return {
        provide: {
            firebase: { app, auth, db, storage, GoogleAuthProvider }
        }
    }
})
