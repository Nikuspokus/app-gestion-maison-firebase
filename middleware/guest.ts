// middleware/guest.ts
import { useAuth } from '@/composables/useAuth'

export default defineNuxtRouteMiddleware(() => {
    const { user } = useAuth()
    if (user.value) {
        return navigateTo('/dashboard')
    }
    // NE RIEN FAIRE si user est null (même si ready=false) → la page login s'affiche
})