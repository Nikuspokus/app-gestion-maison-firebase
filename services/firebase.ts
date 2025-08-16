
import { initializeApp, getApps } from 'firebase/app'

export function useFirebase() {
  const config = useRuntimeConfig().public
  const app = getApps()[0] ?? initializeApp({
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    appId: config.firebaseAppId,
  })
  return { app }
}
