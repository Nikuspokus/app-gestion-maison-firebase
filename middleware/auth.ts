import { useAuth } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware(async () => {
  const { user, ready } = useAuth()

  // Attendre que Firebase ait répondu (user: User|null)
  if (!ready.value) {
    await new Promise<void>((resolve) => {
      const stop = watch(ready, (r) => { if (r) { stop(); resolve() } })
    })
  }

  // Si pas de user → retour accueil (page Bienvenue)
  if (!user.value) {
    return navigateTo('/', { replace: true })
  }
})
