// composables/useAuth.ts
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { useFirebase } from '@/services/firebase'

const user = ref<User | null>(null)
const familyId = ref<string | null>(null)
const ready = ref(false)
const initialized = ref(false)

export function useAuth() {
  const { app } = useFirebase()
  const auth = getAuth(app)

  if (!initialized.value) {
    onAuthStateChanged(auth, (u) => {
      user.value = u
      familyId.value = u ? u.uid : null
      ready.value = true
    })
    initialized.value = true
  }

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }
  const signOutUser = async () => {
    await signOut(auth)
  }

  return { user, familyId, ready, signInWithGoogle, signOutUser }
}
